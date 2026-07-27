<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const router = useRouter()

const fullName = ref('')
const phone = ref('')
const address = ref('')
const city = ref('')

const isProcessing = ref(false)
const orderSuccess = ref(false)

const isEmpty = computed(() => cartStore.items.length === 0)

function handleConfirmOrder() {
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
      <h2 class="text-3xl font-extrabold text-text dark:text-text-dark">Order Confirmed! </h2>
      <p class="text-base text-text-muted dark:text-text-muted-dark max-w-md mx-auto leading-relaxed">
        Thank you for shopping with <span class="font-bold text-primary">CMWA MARKETING STORE</span>! Your Cash on Delivery order has been placed successfully.
      </p>
      <div class="p-4 rounded-2xl bg-surface/80 dark:bg-surface-dark/50 border border-primary/20 max-w-sm mx-auto text-left text-xs space-y-1.5 text-text-muted dark:text-text-muted-dark">
        <p><span class="font-semibold text-text dark:text-text-dark">Payment Method:</span> Cash on Delivery (COD)</p>
        <p><span class="font-semibold text-text dark:text-text-dark">Delivery Status:</span> Processing for dispatch</p>
        <p><span class="font-semibold text-text dark:text-text-dark">Support:</span> info@CMWAmarketingstore.com</p>
      </div>
      <div class="pt-4">
        <button
          @click="returnToHome"
          class="px-8 py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary-dark shadow-lg shadow-primary/25 transition-all duration-200 cursor-pointer"
        >
          Return to Home Store 
        </button>
      </div>
    </div>

    <!-- Main Payment Form Card -->
    <div v-else class="rounded-3xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/40 dark:border-border-dark shadow-xl p-6 sm:p-8 space-y-8">
      <!-- Title Bar -->
      <div>
        <div class="border-b border-border dark:border-border-dark pb-6 mb-6">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-text dark:text-text-dark flex items-center gap-2">
             Cash on Delivery
          </h1>
          <p class="text-xs sm:text-sm text-text-muted dark:text-text-muted-dark mt-1">
            Pay with cash when your package is delivered to your doorstep.
          </p>
        </div>

        <!-- Order Items Summary Banner -->
        <div class="p-4 rounded-2xl bg-surface/70 dark:bg-surface-dark/40 border border-primary/20 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p class="text-xs text-text-muted dark:text-text-muted-dark">Order Total</p>
            <p class="text-xl font-bold text-primary">${{ cartStore.totalPrice.toFixed(2) }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-text-muted dark:text-text-muted-dark">Total Items</p>
            <p class="text-sm font-semibold text-text dark:text-text-dark">{{ cartStore.totalItems }} Items (Free Shipping)</p>
          </div>
        </div>

        <!-- Shipping Address Form -->
        <form @submit.prevent="handleConfirmOrder" class="space-y-4">
          <h3 class="text-base font-bold text-text dark:text-text-dark flex items-center gap-2">
             Delivery Details
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark mb-1">Full Name *</label>
              <input
                v-model="fullName"
                type="text"
                required
                placeholder="Ravindu Anushka"
                class="w-full px-4 py-3 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:border-primary shadow-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark mb-1">Phone Number *</label>
              <input
                v-model="phone"
                type="tel"
                required
                placeholder="+94 77 123 4567"
                class="w-full px-4 py-3 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:border-primary shadow-sm"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark mb-1">Delivery Address *</label>
            <input
              v-model="address"
              type="text"
              required
              placeholder="123 Market Street, Apartment 4B"
              class="w-full px-4 py-3 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:border-primary shadow-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark mb-1">City / Region *</label>
            <input
              v-model="city"
              type="text"
              required
              placeholder="Colombo / Kandy / Galle"
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
              Confirm Order (Cash on Delivery) 
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
