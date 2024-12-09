<template>
  <div class="mb-4">
    <label class="block text-xs sm:text-sm font-medium text-gray-400 mb-2">
      Mint Amount (1-99)
    </label>
    <input
      type="number"
      inputmode="numeric"
      pattern="[0-9]*"
      min="1"
      max="99"
      :value="store.mintAmount"
      @input="handleInput"
      class="w-full bg-black/70 backdrop-blur-sm text-green-400 border border-green-900/30 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200 shadow-inner"
      placeholder="Enter amount (max 99)"
    />
  </div>
</template>

<script setup>
import { useMiningStore } from '@/stores/mining.js'

const store = useMiningStore()

const handleInput = (e) => {
  const input = e.target
  let value = parseInt(input.value)
  
  if (isNaN(value)) {
    value = 1
  }
  
  if (value > 99) {
    value = 99
    input.value = '99'
  } else if (value < 1) {
    value = 1
    input.value = '1'
  }
  
  store.setMintAmount(value)
}
</script>

<style lang="scss" scoped>
@import "@/styles/tailwind/mint";
</style>