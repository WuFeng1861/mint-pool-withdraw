<template>
  <div
      class="swap min-h-screen min-h-[100dvh] bg-gradient-to-b from-neon-green/5 to-black flex items-center justify-center p-4 sm:p-6">
    <div class="glass-card w-full max-w-[95%] sm:max-w-md p-4 sm:p-6 space-y-4 sm:space-y-6 swap-container">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 sm:mb-8">
        <div class="flex space-x-4 items-center">
          <button
              class="bg-neon-green text-black px-3 sm:px-4 py-1 rounded-full text-sm sm:text-base font-bold hover:bg-neon-green/90 transition-colors">
            兑换
          </button>
        </div>
        <!--<button class="text-neon-green hover:text-neon-green/80 transition-colors">-->
        <!--  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24"-->
        <!--       stroke="currentColor">-->
        <!--    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"-->
        <!--          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>-->
        <!--    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>-->
        <!--  </svg>-->
        <!--</button>-->
      </div>

      <!-- Exchange Form -->
      <div class="space-y-3 sm:space-y-4">
        <div class="space-y-2">
          <label class="text-neon-green/80 text-sm sm:text-base">支付</label>
          <div class="flex justify-between items-center bg-dark-gray p-3 sm:p-4 rounded-xl border border-neon-green/10">
            <div class="flex items-center space-x-2">
              <img :src="getImagePath('MLogo.png')" alt="MERC" class="w-6 h-6 sm:w-8 sm:h-8">
              <span class="font-bold text-sm sm:text-base">MERC</span>
            </div>
            <input
                v-model="mercAmount"
                @input="handleMercInput"
                type="number"
                max="200"
                class="bg-transparent text-right text-lg sm:text-xl font-bold focus:outline-none focus:ring-1 focus:ring-neon-green/30 rounded w-[120px] sm:w-auto"
                placeholder="0.0"
            >
          </div>
        </div>

        <!-- Swap Icon -->
        <div class="flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-neon-green" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
          </svg>
        </div>

        <div class="space-y-2">
          <label class="text-neon-green/80 text-sm sm:text-base">收取</label>
          <div class="flex justify-between items-center bg-dark-gray p-3 sm:p-4 rounded-xl border border-neon-green/10">
            <button class="flex items-center space-x-2">
              <img src="https://cryptologos.cc/logos/tether-usdt-logo.svg" alt="USDT" class="w-6 h-6 sm:w-8 sm:h-8">
              <span class="font-bold text-sm sm:text-base">USDT</span>
            </button>
            <span class="text-lg sm:text-xl font-bold">{{ usdtAmount }}</span>
          </div>
        </div>
      </div>

      <!-- Connect Wallet Button -->
      <button
          @click="handleSwap"
          class="w-full bg-neon-green/20 hover:bg-neon-green/30 text-neon-green py-3 sm:py-4 rounded-xl font-bold transition-colors text-sm sm:text-base mt-4 border border-neon-green/20">
        Swap
      </button>
    </div>
  </div>
</template>
<script setup>
import bus from "@/bus/mitt.js";
import {elTip, getImagePath, handleAddress, routerBack, routerTo} from "@/utils/index.js";
import {useWalletCoinListRef} from "@/composition/mint/wallet/useWalletCoinList.js";
import SafeCalc from "@/utils/bignumberjs.js";
import {useWalletSwapActive} from "@/composition/mint/wallet/useWalletSwap.js";
import EthWallet from "@/utils/ethersHelper.js";
import {useMyBalanceRef} from "@/composition/mint/useMyBalance.js";

onMounted(() => {
  bus.$emit('updateWalletTitle', 'Swap')
})

const rate = 20;
const mercAmount = ref('0.0')
const usdtAmount = computed(() => {
  const amount = parseFloat(mercAmount.value) || 0
  return (amount / rate).toFixed(1)
})

// 币种余额
const coinList = useWalletCoinListRef();
const getUSDTValue = computed(() => {
  let value = 0;
  if(coinList.value.find(item => item.name === 'USDT')){
    value = Number(coinList.value.find(item => item.name === 'USDT').balance);
  }
  console.log(`value: ${value}`);
  return value;
})

const mybalanceRef = useMyBalanceRef();
const etherWallet = new EthWallet();
const connectWallet = async () => {
  const chainId = await window.ethereum.request({method: 'eth_chainId'});
  if (chainId !== `0x${EthWallet.BINANCE.chainId.toString(16)}`) {
    return etherWallet.toSwitch(EthWallet.BINANCE.chainId, EthWallet.BINANCE);
  }
  await etherWallet.initAnyChain();
  EthWallet.walletList = [etherWallet];
  if (etherWallet.userAddress.toLowerCase() !== mybalanceRef.value.address.toLowerCase()) {
    elTip('钱包地址错误，请切换 ' + handleAddress(mybalanceRef.value.address) + ' 钱包', 'error');
  }
  window.ethereum.once('accountsChanged', async () => {
    console.log('accountsChanged');
    await connectWallet();
  })
}
const handleMercInput = (event) => {
  const input = event.target
  const value = parseFloat(input.value)
  console.log(getUSDTValue.value, 'getUSDTValue');
  let maxValue = SafeCalc.sub(200,SafeCalc.mul(getUSDTValue.value, rate));
  // 减一法 保留一位小数
  maxValue = Math.floor(Number(maxValue) * 10) / 10;

  if (isNaN(value)) {
    mercAmount.value = '0.0'
  } else if (value > maxValue) {
    mercAmount.value = maxValue;
  } else {
    mercAmount.value = value.toString()
  }
}
const handleSwap = async () => {
  if(SafeCalc.compare(0,mercAmount.value) === '0') {
    return;
  }
  await useWalletSwapActive('MERC', 'USDT', mercAmount.value);
  elTip('Success');
  // routerBack();
}
</script>

<style scoped>
/* 引入src/styles/tailwind/swap.scss */
@import '../../styles/tailwind/swap.scss';

.glass-card {
  box-shadow: 0 0 100px rgba(144, 238, 144, 0.1);
}

/* Remove number input arrows */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

/* Prevent iOS zoom on input focus */
@supports (-webkit-touch-callout: none) {
  input {
    font-size: 16px;
  }
}
</style>
