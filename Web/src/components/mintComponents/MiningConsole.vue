<template>
  <div class="bg-black/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 font-mono text-green-400 text-xs sm:text-sm mb-4 border border-green-900/30 shadow-inner">
    <div>> Connected to MERC</div>
    <div>> Current mining difficulty: {{ store.difficulty }}</div>
    <div class="break-all">> Current mining challenge number: {{ store.challengeNumber }}</div>
    <div class="break-all">> {{ store.hashResult }}</div>
  </div>
</template>

<script setup>
import { useMiningStore } from '@/stores/mining.js'

const store = useMiningStore()
</script>
<style lang="scss" scoped>
@import "@/styles/tailwind/mint";
</style>