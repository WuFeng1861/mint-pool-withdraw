<template>
  <div class="mint">
    <div class="mint-height bg-pattern bg-fixed text-white p-2 sm:p-4">
      <div class="w-full max-w-md mx-auto">
        <div class="bg-card-gradient backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-2xl border border-green-900/30">
          <h1 class="text-xl sm:text-2xl text-center mb-4 sm:mb-6 font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">MERC Mining</h1>

          <MiningStats />
          <MiningProgress />
          <MiningConsole />
          <MintAmountInput />

          <button
              class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:from-green-700 active:to-emerald-800 text-white font-bold py-2.5 px-4 rounded transition-all duration-200 text-sm sm:text-base shadow-lg shadow-green-500/20"
              @click="store.toggleMining"
              :disabled="store.isMining"
          >
            {{ store.isMining ? 'Mining...' : 'Start Mining' }}
          </button>

          <TransactionModal
              v-if="store.showTransactionModal"
              @close="store.closeTransactionModal"
              @confirm="store.confirmTransactionModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import bus from "@/bus/mitt.js";
import { useMiningStore } from '@/stores/mining'
import MiningStats from '@/components/mintComponents/MiningStats.vue'
import MiningProgress from '@/components/mintComponents/MiningProgress.vue'
import MiningConsole from '@/components/mintComponents/MiningConsole.vue'
import MintAmountInput from '@/components/mintComponents/MintAmountInput.vue'
import TransactionModal from '@/components/mintComponents/TransactionModal.vue'

const store = useMiningStore();

let t = 0;
let step = ref(5*1000);
const update = async () => {
  try {
    let now = new Date().getTime();
    if (now - t > step.value) {
      await store.updateProgress();
      t = now;
    }
  }catch (e) {
    console.log(e.message);
  }
  requestAnimationFrame(update);
}
onMounted(() => {
  update();
})

onBeforeUnmount(() => {
  step.value = 9999999999;
})

onMounted(() => {
  bus.$emit('updateWalletTitle', 'Mint');
})
</script>

<style lang="scss" scoped>
@import "@/styles/tailwind/mint";
</style>