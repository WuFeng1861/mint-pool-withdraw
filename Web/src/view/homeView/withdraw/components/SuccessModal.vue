<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])
const checkmarkClass = ref('hidden')

onMounted(() => {
  setTimeout(() => {
    checkmarkClass.value = 'animate'
  }, 100)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      @click.self="emit('close')"
    >
      <div class="bg-dark-card rounded-xl shadow-xl p-8 max-w-sm w-full border border-gray-800">
        <div class="flex flex-col items-center">
          <img 
            src="https://wufeng98.cn/imgweb/uploads/1732163951311-MLogo.png" 
            alt="MERC Logo" 
            class="h-16 w-16 mb-6"
          />
          
          <div class="checkmark-container mb-6">
            <svg 
              class="checkmark" 
              :class="checkmarkClass"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 52 52"
            >
              <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>

          <h3 class="text-xl font-semibold text-primary mb-2">Success!</h3>
          <p class="text-gray-400 text-center mb-6">
            Your withdrawal request has been submitted successfully.
          </p>

          <button
            @click="emit('close')"
            class="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@import "../index.scss";
</style>
<style scoped>
.checkmark-container {
  width: 50px;
  height: 50px;
  position: relative;
}

.checkmark {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  stroke-width: 2;
  stroke: #10b981;
  stroke-miterlimit: 10;
}

.checkmark.hidden .checkmark-circle,
.checkmark.hidden .checkmark-check {
  stroke-dasharray: 0;
  stroke-dashoffset: 0;
}

.checkmark.animate .checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark.animate .checkmark-check {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}
</style>