<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  text: String,
  delay: {
    type: Number,
    default: 0
  }
})

const displayText = ref('')
const isTyping = ref(true)

onMounted(() => {
  setTimeout(() => {
    typeText()
  }, props.delay)
})

const typeText = async () => {
  for (let i = 0; i <= props.text.length; i++) {
    displayText.value = props.text.slice(0, i)
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  isTyping.value = false
}
</script>

<template>
  <span 
    class="inline-block"
    :class="{ 'typing-animation': isTyping }"
  >
    {{ displayText }}
  </span>
</template>

<style scoped lang="scss">
@import "../index.scss";
</style>