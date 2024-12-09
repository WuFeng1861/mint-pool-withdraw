<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success'
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])
const isVisible = ref(false)

onMounted(() => {
  isVisible.value = true
  setTimeout(() => {
    isVisible.value = false
    setTimeout(() => emit('close'), 300)
  }, props.duration)
})
</script>

<template>
  <div
    class="fixed top-4 right-4 z-50 transition-all duration-300 max-w-md"
    :class="[
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
    ]"
  >
    <div
      class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border"
      :class="[
        type === 'error' 
          ? 'bg-red-900/80 border-red-700 text-red-100' 
          : 'bg-dark-card/95 border-primary text-gray-100'
      ]"
    >
      <div class="flex-shrink-0">
        <svg
          v-if="type === 'error'"
          class="w-5 h-5 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <p class="text-sm font-medium">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../index.scss";
</style>