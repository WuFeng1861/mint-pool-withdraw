<script setup>
import WithdrawForm from './WithdrawForm.vue'
import ContractInfo from './ContractInfo.vue'
import StarryBackground from './StarryBackground.vue'
</script>

<template>
  <div class="withdrawal-page">
    <StarryBackground />
    <div class="max-w-3xl mx-auto p-5 relative">
      <ContractInfo />
      <WithdrawForm />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../index";
.withdrawal-page {
  width: 100%;
  height: calc(100% - $header-height);
  overflow: auto;
  position: relative;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  color-scheme: dark;
  color: #e2e8f0;
}

/* Fade in animation for page load */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Shimmer effect */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Typing animation */
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}

:deep(.typing-animation) {
  display: inline-block;
  overflow: hidden;
  border-right: 2px solid #10b981;
  white-space: nowrap;
  animation:
      typing 1s steps(30, end),
      blink 0.75s step-end infinite;
}

:deep(.animate-shimmer) {
  background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}

@media (max-width: 768px) {
  .reward {
    height: calc(100% - $mobile-nav-height);
  }
}
</style>