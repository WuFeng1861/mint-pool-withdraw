<template>
  <div class="faucet">
    <main class="flex-1 py-8 px-4">
    <div class="max-w-xl mx-auto">
      <div class="bg-trading-dark rounded-lg p-6">
        <h1 class="text-2xl font-bold text-white mb-6">测试代币水龙头</h1>

        <!-- Token Selection -->
        <div class="mb-6">
          <label class="block text-sm text-gray-400 mb-2">获取代币</label>
          <div class="grid grid-cols-2 gap-4">
            <button
                v-for="token in tokens"
                :key="token.symbol"
                class="flex items-center justify-center space-x-2 p-4 rounded border-2 transition-colors border-trading-green bg-trading-green bg-opacity-10"
            >
<!--              <span class="text-2xl">{{ token.icon }}</span>-->
              <img :src="getImagePath('MLogo.png')" alt="MERC" class="w-6 h-6 sm:w-8 sm:h-8" v-if="token.symbol === 'MERC'">
              <img src="https://cryptologos.cc/logos/tether-usdt-logo.svg" alt="USDT" class="w-6 h-6 sm:w-8 sm:h-8" v-if="token.symbol === 'USDT'">
              <span class="font-medium text-white">{{ token.symbol }}</span>
            </button>
          </div>
        </div>

        <!-- Address Input -->
        <div class="mb-6">
          <label class="block text-sm text-gray-400 mb-2">接收地址</label>
          <input
              v-model="address"
              type="text"
              class="w-full bg-gray-800 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-trading-green"
              placeholder="输入您的钱包地址"
          >
        </div>

        <!-- Amount Display -->
        <div class="mb-6">
          <label class="block text-sm text-gray-400 mb-2">领取数量</label>
          <div class="bg-gray-800 rounded px-4 py-3 flex justify-between items-center" v-for="token in tokens" :key="token.symbol">
            <span class="text-white font-medium">{{ token.max }}</span>
            <span class="text-gray-400">{{ token.symbol }}</span>
          </div>
        </div>

        <!-- Cooldown Info -->
        <div class="mb-6 bg-gray-800/50 rounded p-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-400">冷却时间</span>
            <span class="text-white">{{ cooldownTime }}小时</span>
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-gray-400">距离下次领取</span>
            <span :class="canClaim ? 'text-trading-green' : 'text-trading-red'">
              {{ remainingTimeText }}
            </span>
          </div>
        </div>

        <!-- Claim Button -->
        <button
            @click="handleClaim"
            :disabled="!address || isLoading || !canClaim"
            class="w-full py-4 rounded font-medium text-white transition-all"
            :class="[
            !address || !canClaim
              ? 'bg-gray-600 cursor-not-allowed'
              : isLoading
                ? 'bg-trading-green cursor-wait opacity-80'
                : 'bg-trading-green hover:opacity-90'
          ]"
        >
          <template v-if="isLoading">
            处理中...
          </template>
          <template v-else-if="!canClaim">
            冷却中
          </template>
          <template v-else-if="!address">
            请输入接收地址
          </template>
          <template v-else>
            领取代币
          </template>
        </button>
      </div>
    </div>
  </main>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue';
import {elTip, getImagePath, getNowTimeStamp} from "@/utils/index.js";
import {claimWaterDrop, getNextOpenTime} from "@/composition/exchange/Faucet.js";
import bus from "@/bus/mitt.js";

const address = ref('');
const isLoading = ref(false);
const cooldownTime = ref(24); // 24小时冷却时间
const nextClaimTimestamp = ref(null); // 13位时间戳，表示下次可领取的时间
const now = ref(getNowTimeStamp());
const showNow = ref(true);

const updateNow = () => {
  if(!showNow.value) {
    return;
  }
  now.value = getNowTimeStamp();
  requestAnimationFrame(updateNow);
}
const tokens = [
  {symbol: 'MERC', max: '10000'},
  {symbol: 'USDT', max: '100'},
];

const canClaim = computed(() => {
  if (!nextClaimTimestamp.value) return true;
  return Date.now() >= nextClaimTimestamp.value;
});

const remainingTimeText = computed(() => {
  if (!nextClaimTimestamp.value || canClaim.value) return '可以领取';

  const remainingMs = nextClaimTimestamp.value - now.value;
  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));

  if (remainingHours >= 24) {
    const days = Math.floor(remainingHours / 24);
    const hours = remainingHours % 24;
    return `${days}天${hours}小时`;
  }
  // 剩余的分钟
  const remainingMinutes = Math.floor(remainingMs / (1000 * 60)) % 60;
  // 剩余的秒钟
  const remainingSeconds = Math.floor(remainingMs / 1000) % 60;
  return `${remainingHours}小时${remainingMinutes}分${remainingSeconds}秒`;
});

const handleClaim = async () => {
  if (!address.value || isLoading.value || !canClaim.value) return;

  isLoading.value = true;
  try {
    // 模拟API调用
    let result = await claimWaterDrop(address.value);
    if(!result) {
      return;
    }
    // 设置下次可领取时间为当前时间 + cooldownTime小时
    nextClaimTimestamp.value = Date.now() + (cooldownTime.value * 60 * 60 * 1000);
    // 存储本地
    localStorage.setItem('FaucetNextClaimTimestamp', nextClaimTimestamp.value);
    elTip(`成功领取 可前往交易所测试网生态查看`);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  bus.$emit('updateWalletTitle', 'Faucet');
  // 从本地获取下次可领取时间
  const timestamp = localStorage.getItem('FaucetNextClaimTimestamp');
  if (timestamp) {
    nextClaimTimestamp.value = parseInt(timestamp);
  } else {
    // api获取下次可领取时间
    let result = await getNextOpenTime();
    console.log(result, 'getNextOpenTime');
    nextClaimTimestamp.value = result;
    localStorage.setItem('FaucetNextClaimTimestamp', nextClaimTimestamp.value);
  }
  updateNow();
});
onUnmounted(() => {
  showNow.value = false;
})
</script>

<style lang="scss" scoped>
@import '@/styles/tailwind/tailwind';
.faucet {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 50px;
}
</style>