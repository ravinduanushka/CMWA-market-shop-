<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const router = useRouter()

const cardHolder = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')
const billingAddress = ref('')

const isProcessing = ref(false)
const orderSuccess = ref(false)

const isEmpty = computed(() => cartStore.items.length === 0)

function handlePayNow() {
  if (isEmpty.value && !orderSuccess.value) {
    router.push('/')
    return
  }
  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    orderSuccess.value = true
    cartStore.clearCart()
  }, 1200)
}

function returnToHome() {
  router.push('/')
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Breadcrumb -->
    <div class="mb-6">
      <RouterLink to="/cart" class="text-sm font-medium text-text-muted hover:text-primary transition-colors flex items-center gap-1">
        ← Back to Cart
      </RouterLink>
    </div>

    <!-- Success Screen -->
    <div v-if="orderSuccess" class="rounded-3xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/40 dark:border-border-dark shadow-2xl p-8 sm:p-12 text-center space-y-6">
      <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto text-4xl shadow-md">
        ✓
      </div>
      <h2 class="text-3xl font-extrabold text-text dark:text-text-dark">Payment Successful! 🎉</h2>
      <p class="text-base text-text-muted dark:text-text-muted-dark max-w-md mx-auto leading-relaxed">
        Thank you for shopping with <span class="font-bold text-primary">CMWA MARKETING STORE</span>! Your Online Card Payment has been authorized and confirmed.
      </p>
      <div class="p-4 rounded-2xl bg-surface/80 dark:bg-surface-dark/50 border border-primary/20 max-w-sm mx-auto text-left text-xs space-y-1.5 text-text-muted dark:text-text-muted-dark">
        <p><span class="font-semibold text-text dark:text-text-dark">Payment Method:</span> Online Credit/Debit Card</p>
        <p><span class="font-semibold text-text dark:text-text-dark">Transaction ID:</span> #TXN-{{ Math.floor(100000 + Math.random() * 900000) }}</p>
        <p><span class="font-semibold text-text dark:text-text-dark">Security:</span> Verified Payment</p>
      </div>
      <div class="pt-4">
        <button
          @click="returnToHome"
          class="px-8 py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary-dark shadow-lg shadow-primary/25 transition-all duration-200 cursor-pointer"
        >
          Return to Home Store 🛍️
        </button>
      </div>
    </div>

    <!-- Main Payment Form Card -->
    <div v-else class="rounded-3xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/40 dark:border-border-dark shadow-xl p-6 sm:p-8 space-y-8">
      <!-- Title Bar -->
      <div>
        <div class="border-b border-border dark:border-border-dark pb-6 mb-6">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-text dark:text-text-dark flex items-center gap-2">
            💳 Online Card Payment
          </h1>
          <p class="text-xs sm:text-sm text-text-muted dark:text-text-muted-dark mt-1">
            Pay securely using Visa, Mastercard, or American Express.
          </p>
        </div>

        <!-- Order Items Summary Banner -->
        <div class="p-4 rounded-2xl bg-surface/70 dark:bg-surface-dark/40 border border-primary/20 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p class="text-xs text-text-muted dark:text-text-muted-dark">Total Amount Due</p>
            <p class="text-xl font-bold text-primary">${{ cartStore.totalPrice.toFixed(2) }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-text-muted dark:text-text-muted-dark">Total Items</p>
            <p class="text-sm font-semibold text-text dark:text-text-dark">{{ cartStore.totalItems }} Items (Free Shipping)</p>
          </div>
        </div>

        <!-- Card Payment Form -->
        <form @submit.prevent="handlePayNow" class="space-y-4">
          <h3 class="text-base font-bold text-text dark:text-text-dark flex items-center gap-2">
            💳 Credit / Debit Card Information
          </h3>

          <div>
            <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark mb-1">Cardholder Name *</label>
            <input
              v-model="cardHolder"
              type="text"
              required
              placeholder="John Doe"
              class="w-full px-4 py-3 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:border-primary shadow-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark mb-1">Card Number *</label>
            <div class="relative">
              <input
                v-model="cardNumber"
                type="text"
                required
                placeholder="4532 •••• •••• 8892"
                class="w-full px-4 py-3 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:border-primary pr-12 shadow-sm"
              />
              <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg">💳</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark mb-1">Expiry Date *</label>
              <input
                v-model="cardExpiry"
                type="text"
                required
                placeholder="MM/YY"
                class="w-full px-4 py-3 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:border-primary shadow-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark mb-1">CVV / CVC *</label>
              <input
                v-model="cardCvv"
                type="password"
                required
                placeholder="123"
                maxLength="4"
                class="w-full px-4 py-3 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:border-primary shadow-sm"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark mb-1">Billing Address *</label>
            <input
              v-model="billingAddress"
              type="text"
              required
              placeholder="123 Street Address, City, Country"
              class="w-full px-4 py-3 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:border-primary shadow-sm"
            />
          </div>

          <!-- Submit Order Button -->
          <button
            type="submit"
            :disabled="isProcessing || isEmpty"
            class="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary-dark shadow-lg shadow-primary/25 transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
          >
            <span v-if="isProcessing" class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            <span v-else>
              Pay ${{ cartStore.totalPrice.toFixed(2) }} Now 🔒
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
