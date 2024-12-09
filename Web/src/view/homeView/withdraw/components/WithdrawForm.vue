<script setup>
import Toast from './Toast.vue'
import SuccessModal from './SuccessModal.vue'
import TypeWriter from './TypeWriter.vue'
import {useMyBalanceRef} from "@/composition/mint/useMyBalance.js";
import {useWithdraw} from "@/composition/mint/useWithdraw.js";

const myBalance = useMyBalanceRef()
const withdrawalAddress = computed(() => {
  return myBalance.value?.address || ''
});
const amount = ref('')
const availableAmount = computed(() => {
  return Math.floor(myBalance.value?.unlockBalance || 0)
}); // Mock available amount
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const showSuccessModal = ref(false)
const isHovered = ref(false)
const isLoading = ref(false)
const bnbBalance = computed(() => {
  return Number(myBalance.value?.ethBalance) || 0
})

const fee = 0.0002 // BNB fee
const minAmount = 100 // Minimum withdrawal amount

const receiveAmount = computed(() => {
  if (!amount.value) return 0
  return Number(amount.value)
})

const setMaxAmount = () => {
  amount.value = Math.floor(availableAmount.value).toString();
}

const isValidAmount = computed(() => {
  const amountNum = Number(amount.value || 0)
  return amountNum >= minAmount && amountNum <= availableAmount.value
})

const isValidBnbBalance = computed(() => {
  return bnbBalance.value >= fee
})

const handleAmountInput = (e) => {
  const input = e.target
  const value = input.value.replace(/\D/g, '')
  amount.value = value
}

const showMessage = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

const handleSubmit = async () => {
  if (!withdrawalAddress.value) {
    showMessage('Please enter withdrawal address', 'error')
    return
  }

  if (!amount.value || Number(amount.value) <= 0) {
    showMessage('Please enter a valid withdrawal amount', 'error')
    return
  }

  if (Number(amount.value) < minAmount) {
    showMessage(`Minimum withdrawal amount is ${minAmount} MERC`, 'error')
    return
  }

  if (Number(amount.value) > Number(availableAmount.value)) {
    showMessage('Withdrawal amount cannot exceed available balance', 'error')
    return
  }

  if (!isValidBnbBalance.value) {
    showMessage('Insufficient BNB balance. Please add BNB to your wallet.', 'error')
    return
  }

  try {
    isLoading.value = true
    let result = await useWithdraw(amount.value);
    if(!result) {
      return;
    }
    showSuccessModal.value = true
  } catch (error) {
    showMessage('Withdrawal request failed. Please try again.', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // todo: 获取用户地址和可用余额
})
</script>

<template>
  <div
      class="bg-dark-card rounded-xl shadow-lg p-6 md:p-8 border border-gray-800 transition-all duration-300 hover:border-primary/30"
  >
    <div class="flex items-center justify-center mb-6">
      <img
          src="https://wufeng98.cn/imgweb/uploads/1732163951311-MLogo.png"
          alt="MERC Logo"
          class="h-12 w-12 transition-transform duration-300 hover:scale-110"
      />
    </div>
    <h2 class="text-2xl font-bold text-primary text-center mb-6">
      <TypeWriter text="MERC Withdrawal" />
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="space-y-2">
        <label for="address" class="block text-sm font-medium text-gray-400">
          Withdrawal Address
        </label>
        <input
            id="address"
            v-model="withdrawalAddress"
            type="text"
            :disabled="true"
            placeholder="Enter your MERC withdrawal address"
            class="w-full px-4 py-2 bg-dark border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <label for="amount" class="text-sm font-medium text-gray-400">
            Amount
          </label>
          <div class="text-sm text-gray-400">
            Available: <span class="text-primary">{{ availableAmount }}</span> MERC
            <button
                type="button"
                @click="setMaxAmount"
                class="ml-2 text-primary hover:text-primary-hover underline"
            >
              Max
            </button>
          </div>
        </div>
        <div class="flex">
          <input
              id="amount"
              :value="amount"
              @input="handleAmountInput"
              inputmode="numeric"
              pattern="[0-9]*"
              :placeholder="`Minimum withdrawal: ${minAmount}`"
              class="flex-1 px-4 py-2 bg-dark border border-gray-800 rounded-l-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <span class="px-4 py-2 bg-dark border border-l-0 border-gray-800 rounded-r-lg text-gray-300">
            MERC
          </span>
        </div>
      </div>

      <div
          class="bg-dark rounded-lg p-4 space-y-2 border border-gray-800"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
      >
        <div class="flex justify-between items-center text-gray-400">
          <span>Network Fee:</span>
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-300">{{ fee }} BNB</span>
            <svg
                v-if="isValidBnbBalance"
                class="w-5 h-5 text-primary transition-all duration-300"
                :class="{ 'scale-110': isHovered }"
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
            <svg
                v-else
                class="w-5 h-5 text-red-500 transition-all duration-300"
                :class="{ 'scale-110': isHovered }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">You will receive:</span>
          <div class="flex items-center gap-2">
            <span
                class="font-bold text-lg text-primary"
                :class="{ 'scale-110': isHovered }"
            >
              {{ receiveAmount }} MERC
            </span>
            <svg
                v-if="isValidAmount"
                class="w-5 h-5 text-primary transition-all duration-300"
                :class="{ 'scale-110': isHovered }"
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
            <svg
                v-else
                class="w-5 h-5 text-red-500 transition-all duration-300"
                :class="{ 'scale-110': isHovered }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </div>

      <button
          type="submit"
          :disabled="isLoading || !isValidAmount || !isValidBnbBalance"
          class="w-full h-12 text-lg font-medium mt-8 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg
            v-if="isLoading"
            class="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
          <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
          />
          <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {{ isLoading ? 'Processing...' : 'Withdraw' }}
      </button>
    </form>

    <Toast
        v-if="showToast"
        :message="toastMessage"
        :type="toastType"
        @close="showToast = false"
    />

    <SuccessModal
        :show="showSuccessModal"
        @close="showSuccessModal = false"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "../index";
</style>