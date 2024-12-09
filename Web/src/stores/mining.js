import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {useMyBalanceRef} from "@/composition/mint/useMyBalance.js";
import SafeCalc from "@/utils/bignumberjs.js";
import {useMintTotal, useWalletMint} from "@/composition/mint/wallet/useWalletMint.js";
import {elTip} from "@/utils/index.js";
import EthWallet from "@/utils/ethersHelper.js";
import {connectWalletBeforeAuth} from "@/composition/ethWallet/useEthWallet.js";
import config from "@/config/api.js";

export const useMiningStore = defineStore('mining', () => {
  const isMining = ref(false)
  const difficulty = ref('0x9999')
  const challengeNumber = ref('0x7241524242')
  const hashResult = ref('0x800f87467187501257193492f1f9bf0dd425c')
  const mintAmount = ref(1)
  const showTransactionModal = ref(false)
  const currentTxHash = ref('')
  
  const totalSupply = 60000000
  const mintedAmount = ref(0)
  
  const totalMintAmount = computed(() => mintAmount.value * 6000)
  const totalCost = computed(() => mintAmount.value * 0.01)
  
  const progress = computed(() => {
    return (mintedAmount.value / totalSupply) * 100
  })

  const remainingSupply = computed(() => {
    return totalSupply - mintedAmount.value
  })

  function generateTxHash() {
    return '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
  }

  function setMintAmount(amount) {
    mintAmount.value = Math.max(1, Math.min(99, amount))
  }

  function resetState() {
    isMining.value = false
    showTransactionModal.value = false
    currentTxHash.value = ''
  }

  async function updateProgress() {
    // todo:请求收币总数 并更新
    let newTotal = await useMintTotal();
    let newMintedMerc = Number(SafeCalc.mul(newTotal, 6000*100));
    console.log(mintedAmount.value, newMintedMerc, 'updateProgress')
    if (SafeCalc.compare(mintedAmount.value, newMintedMerc) === '-1') {
      mintedAmount.value = newMintedMerc;
    }
  }

  function initiateTransaction() {
    currentTxHash.value = generateTxHash()
    showTransactionModal.value = true
  }

  function closeTransactionModal() {
    showTransactionModal.value = false
    resetState()
  }

  async function confirmTransactionModal() {
    // todo: 判断用户bnb是否足够，足够直接告诉后端这个交易 type=1
    // 1. 获取用户bnb余额
    const mybalanceRef = useMyBalanceRef();
    // 2. 判断用户bnb余额是否足够
    if (SafeCalc.compare(mybalanceRef.value.ethBalance, totalCost.value) !== '-1') {
      // 3. 若用户bnb余额足够，则发起交易 type=1
      await useWalletMint(1, totalCost.value, null);
      elTip('Mint Success');
      await updateProgress();
      resetState();
      return true;
    }
    // todo： 连接钱包，发起交易 type=2
    await connectWalletBeforeAuth();
    // todo: 如果连接的钱包和绑定的不一样，则返回
    if(!EthWallet.walletList[0] || EthWallet.walletList[0].userAddress.toLowerCase() !== mybalanceRef.value.address.toLowerCase()) {
      return false;
    }
    // todo: 拉起钱包交易
    let tranHash = ';'
    if(EthWallet.walletList[0].provider) {
      let res = await EthWallet.walletList[0].sendTran(config.MINT_CONTRACT_ADDRESS, totalCost.value);
      if(res.status) {
        tranHash = res.data.hash;
      } else {
        elTip(res.message, 'warning');
        return false;
      }
    }
    // todo: 告诉后端这个交易 type=2
    await useWalletMint(2, totalCost.value, tranHash);
    elTip('Mint Success');
    await updateProgress();
    resetState();
  }

  async function toggleMining() {
    if (!isMining.value) {
      initiateTransaction()
      isMining.value = true
    }
  }



  return {
    isMining,
    difficulty,
    challengeNumber,
    hashResult,
    progress,
    mintAmount,
    totalMintAmount,
    totalCost,
    showTransactionModal,
    currentTxHash,
    mintedAmount,
    remainingSupply,
    totalSupply,
    setMintAmount,
    toggleMining,
    closeTransactionModal,
    updateProgress,
    confirmTransactionModal,
  }
})