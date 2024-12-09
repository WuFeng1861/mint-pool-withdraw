<template>
  <div class="mb-4">
    <div class="flex justify-between text-xs sm:text-sm mb-1">
      <span class="text-gray-400">Total Minted Progress</span>
      <span class="text-green-400">{{ Math.min(Math.floor(progress), 100) }}%</span>
    </div>
    <div class="w-full bg-gray-700 rounded-full h-2">
      <div 
        class="bg-green-400 h-2 rounded-full transition-all duration-300"
        :style="{ width: `${Math.min(progress, 100)}%` }"
      ></div>
    </div>
    <div class="text-gray-400 text-xs sm:text-sm mt-1">
      Minted: {{ store.mintedAmount.toLocaleString() }} / {{ store.totalSupply.toLocaleString() }} MERC
    </div>
    <div class="text-gray-400 text-xs sm:text-sm mt-1">
      Mining {{ store.totalMintAmount.toLocaleString() }} MERC × {{ store.totalCost.toFixed(2) }} BNB
    </div>
  </div>
</template>

<script setup>
import { useMiningStore } from '@/stores/mining.js'
import { storeToRefs } from 'pinia'

const store = useMiningStore()
const { progress } = storeToRefs(store)
</script>

<style lang="scss" scoped>
@import "@/styles/tailwind/mint";
</style>