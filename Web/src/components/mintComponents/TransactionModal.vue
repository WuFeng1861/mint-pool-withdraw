<template>
  <div 
    class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-gradient-to-b from-gray-900 to-black p-4 sm:p-6 rounded-lg max-w-md w-full border border-green-900/30 shadow-2xl">
      <h2 class="text-lg sm:text-xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Confirm Transaction</h2>
      <div class="mb-4 space-y-2">
        <p class="text-gray-400 text-sm">Amount: <span class="text-green-400">{{ store.mintAmount }} mint(s)</span></p>
        <p class="text-gray-400 text-sm">Total MERC: <span class="text-green-400">{{ store.totalMintAmount.toLocaleString() }}</span></p>
        <p class="text-gray-400 text-sm">Cost: <span class="text-green-400">{{ store.totalCost.toFixed(2) }} BNB</span></p>
      </div>
      <div class="bg-black/70 rounded p-3 text-xs sm:text-sm text-gray-500 mb-4 border border-green-900/20">
        Transaction Hash: <br/>
        <span class="break-all text-green-400/80">{{ store.currentTxHash }}</span>
      </div>
      <button
        @click="$emit('confirm')"
        class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2.5 px-4 rounded text-sm sm:text-base shadow-lg shadow-green-500/20 transition-all duration-200"
      >
        Confirm
      </button>
    </div>
  </div>
</template>

<script setup>
import { useMiningStore } from '@/stores/mining.js'

const store = useMiningStore()

defineEmits(['close', 'confirm'])
</script>

<style lang="scss" scoped>
@import "@/styles/tailwind/mint";
</style>