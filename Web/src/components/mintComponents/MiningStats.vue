<template>
  <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 text-sm sm:text-base">
    <div class="bg-black/70 rounded-lg p-3 backdrop-blur-sm border border-green-900/30 shadow-lg shadow-black/50">
      <div class="text-green-400 font-mono">MERC</div>
      <div class="text-gray-400 text-xs sm:text-sm">Token</div>
    </div>
    <div class="bg-black/70 rounded-lg p-3 backdrop-blur-sm border border-green-900/30 shadow-lg shadow-black/50 text-right">
      <div class="text-green-400 font-mono">6000</div>
      <div class="text-gray-400 text-xs sm:text-sm">Limit Per Mint</div>
    </div>
    <div class="bg-black/70 rounded-lg p-3 backdrop-blur-sm border border-green-900/30 shadow-lg shadow-black/50">
      <div class="text-green-400 font-mono">0x9999</div>
      <div class="text-gray-400 text-xs sm:text-sm">Difficulty</div>
    </div>
    <div class="bg-black/70 rounded-lg p-3 backdrop-blur-sm border border-green-900/30 shadow-lg shadow-black/50 text-right">
      <div class="text-green-400 font-mono break-words">{{ store.remainingSupply.toLocaleString() }}</div>
      <div class="text-gray-400 text-xs sm:text-sm">Remaining Supply</div>
    </div>
  </div>
</template>

<script setup>
import { useMiningStore } from '@/stores/mining.js'

const store = useMiningStore()
</script>

<style lang="scss" scoped>
@import "@/styles/tailwind/mint";
</style>