<script setup>
import { ref } from 'vue'

const contractAddress = '0xE2CF16eDd5b705DD89DAde70CdF42189fb8A353C'
const isCopied = ref(false)

const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText(contractAddress)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    alert('Failed to copy. Please copy manually')
  }
}
</script>

<template>
  <div class="bg-dark-card rounded-xl shadow-lg p-6 border border-gray-800 mb-6">
    <h3 class="text-lg font-medium text-gray-300 mb-3">
      Contract Address
    </h3>
    <div class="flex items-center gap-3">
      <code class="flex-1 text-sm bg-dark p-3 rounded-lg text-gray-400 font-mono overflow-x-auto">
        {{ contractAddress }}
      </code>
      <button 
        @click="copyAddress"
        class="px-4 py-2 bg-dark hover:bg-primary hover:text-white text-gray-400 rounded-lg transition-colors duration-200 border border-gray-800 hover:border-primary"
      >
        {{ isCopied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../index.scss";
</style>