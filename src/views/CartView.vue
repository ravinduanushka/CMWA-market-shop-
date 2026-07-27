<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const router = useRouter()

const isEmpty = computed(() => cartStore.items.length === 0)

// Payment Modal state
const showPaymentModal = ref(false)
const paymentMethod = ref<'cod' | 'online'>('cod')
const cardNumber = ref('')
const cardHolder = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')
const isProcessing = ref(false)
const paymentSuccess = ref(false)

function getDiscountedPrice(price: number, discount: number): number {
  return price * (1 - discount / 100)
}

function openPaymentModal() {
  paymentSuccess.value = false
  isProcessing.value = false
  showPaymentModal.value = true
}

function closePaymentModal() {
  if (!isProcessing.value) {
    showPaymentModal.value = false
  }
}

function handleProcessPayment() {
  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    paymentSuccess.value = true
    cartStore.clearCart()
  }, 1200)
}

function finishOrder() {
  showPaymentModal.value = false
  router.push('/')
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-extrabold text-text dark:text-text-dark mb-8">
      🛒 Shopping Cart
    </h1>

    <!-- Empty cart -->
    <div v-if="isEmpty" class="text-center py-20">
      <p class="text-6xl mb-4">🛒</p>
      <h2 class="text-2xl font-bold text-text dark:text-text-dark mb-2">Your cart is empty</h2>
      <p class="text-text-muted dark:text-text-muted-dark mb-6">Looks like you haven't added anything yet!</p>
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        Continue Shopping
      </RouterLink>
    </div>

    <!-- Cart items -->
    <div v-else>
      <div class="space-y-4 mb-8">
        <div
          v-for="item in cartStore.items"
          :key="item.product.id"
          class="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/20 dark:border-border-dark transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <!-- Image -->
          <RouterLink :to="`/product/${item.product.id}`" class="flex-shrink-0">
            <img
              :src="item.product.thumbnail"
              :alt="item.product.title"
              class="w-full sm:w-28 h-28 object-cover rounded-xl border border-border/60 dark:border-border-dark/60 bg-slate-50 dark:bg-border-dark/20"
            />
          </RouterLink>

          <!-- Details -->
          <div class="flex-1 min-w-0">
            <RouterLink :to="`/product/${item.product.id}`" class="group">
              <h3 class="font-semibold text-text dark:text-text-dark group-hover:text-primary transition-colors">
                {{ item.product.title }}
              </h3>
            </RouterLink>
            <p class="text-sm text-text-muted dark:text-text-muted-dark capitalize mt-1">{{ item.product.category }}</p>
            <p class="text-lg font-bold text-primary mt-2">
              ${{ getDiscountedPrice(item.product.price, item.product.discountPercentage).toFixed(2) }}
              <span v-if="item.product.discountPercentage > 5" class="text-sm text-text-muted dark:text-text-muted-dark line-through font-normal ml-1">
                ${{ item.product.price.toFixed(2) }}
              </span>
            </p>
          </div>

          <!-- Quantity controls -->
          <div class="flex items-center gap-3 sm:flex-col sm:items-end sm:justify-between">
            <div class="flex items-center gap-2">
              <button
                @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                class="w-8 h-8 rounded-lg bg-border/50 dark:bg-border-dark/50 flex items-center justify-center hover:bg-border dark:hover:bg-border-dark text-text dark:text-text-dark transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" d="M20 12H4"/>
                </svg>
              </button>
              <span class="w-8 text-center font-semibold text-text dark:text-text-dark">{{ item.quantity }}</span>
              <button
                @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                class="w-8 h-8 rounded-lg bg-border/50 dark:bg-border-dark/50 flex items-center justify-center hover:bg-border dark:hover:bg-border-dark text-text dark:text-text-dark transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" d="M12 4v16m8-8H4"/>
                </svg>
              </button>
            </div>
            <button
              @click="cartStore.removeFromCart(item.product.id)"
              class="text-sm text-red-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="rounded-2xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/20 dark:border-border-dark p-6 shadow-md">
        <h2 class="text-lg font-bold text-text dark:text-text-dark mb-4">Order Summary</h2>
        <div class="space-y-3 mb-4">
          <div class="flex justify-between text-text-muted dark:text-text-muted-dark">
            <span>Items ({{ cartStore.totalItems }})</span>
            <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-text-muted dark:text-text-muted-dark">
            <span>Shipping</span>
            <span class="text-green-500 font-medium">Free</span>
          </div>
          <div class="border-t border-border dark:border-border-dark pt-3 flex justify-between">
            <span class="text-lg font-bold text-text dark:text-text-dark">Total</span>
            <span class="text-lg font-bold text-primary">${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
        </div>
        
        <!-- Proceed to Checkout Button -->
        <button
          @click="openPaymentModal"
          class="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary-dark shadow-lg shadow-primary/25 hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-98"
        >
          Proceed to Checkout 
        </button>

        <div class="flex justify-between mt-4">
          <RouterLink
            to="/"
            class="text-sm text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors"
          >
            ← Continue Shopping
          </RouterLink>
          <button
            @click="cartStore.clearCart()"
            class="text-sm text-red-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>

    <!-- 💳 Payment Options Modal Window -->
    <div
      v-if="showPaymentModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/85 dark:bg-surface-dark/85 backdrop-blur-md animate-fade-in"
      @click.self="closePaymentModal"
    >
      <div
        class="relative w-full max-w-lg rounded-3xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/40 dark:border-border-dark shadow-2xl shadow-primary/20 p-6 sm:p-8 transform transition-all duration-300 scale-100"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-border dark:border-border-dark pb-4 mb-6">
          <div>
            <h3 class="text-xl font-bold text-text dark:text-text-dark">💳 Select Payment Method</h3>
            <p class="text-xs text-text-muted dark:text-text-muted-dark mt-0.5">Total Amount: <span class="font-bold text-primary">${{ cartStore.totalPrice.toFixed(2) }}</span></p>
          </div>
          <button
            @click="closePaymentModal"
            class="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface/80 dark:hover:bg-border-dark/40 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Success Screen -->
        <div v-if="paymentSuccess" class="text-center py-8 space-y-4">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto text-3xl shadow-md">
            ✓
          </div>
          <h4 class="text-2xl font-extrabold text-text dark:text-text-dark">Order Confirmed! 🎉</h4>
          <p class="text-sm text-text-muted dark:text-text-muted-dark max-w-sm mx-auto">
            Thank you for your purchase! Your order has been placed successfully using
            <span class="font-bold text-primary">{{ paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment' }}</span>.
          </p>
          <div class="pt-4">
            <button
              @click="finishOrder"
              class="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary-dark transition-colors shadow-lg cursor-pointer"
            >
              Back to Home Store 🛍️
            </button>
          </div>
        </div>

        <!-- Payment Selection Form -->
        <div v-else class="space-y-6">
          <!-- Option Selection Tabs -->
          <div class="grid grid-cols-2 gap-3">
            <!-- Cash On Delivery Button -->
            <button
              type="button"
              @click="paymentMethod = 'cod'"
              :class="[
                'p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-full',
                paymentMethod === 'cod'
                  ? 'border-primary bg-primary/10 dark:bg-primary/20 shadow-sm'
                  : 'border-border dark:border-border-dark hover:border-primary/40 bg-surface/40 dark:bg-surface-dark/40'
              ]"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-2xl">💵</span>
                <span v-if="paymentMethod === 'cod'" class="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">✓</span>
              </div>
              <div>
                <p class="font-bold text-sm text-text dark:text-text-dark">Cash on Delivery</p>
                <p class="text-xs text-text-muted dark:text-text-muted-dark mt-0.5">Pay upon delivery</p>
              </div>
            </button>

            <!-- Online Payment Button -->
            <button
              type="button"
              @click="paymentMethod = 'online'"
              :class="[
                'p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-full',
                paymentMethod === 'online'
                  ? 'border-primary bg-primary/10 dark:bg-primary/20 shadow-sm'
                  : 'border-border dark:border-border-dark hover:border-primary/40 bg-surface/40 dark:bg-surface-dark/40'
              ]"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-2xl">💳</span>
                <span v-if="paymentMethod === 'online'" class="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">✓</span>
              </div>
              <div>
                <p class="font-bold text-sm text-text dark:text-text-dark">Online Payment</p>
                <p class="text-xs text-text-muted dark:text-text-muted-dark mt-0.5">Credit / Debit Card</p>
              </div>
            </button>
          </div>

          <!-- Cash on Delivery Details -->
          <div v-if="paymentMethod === 'cod'" class="p-4 rounded-2xl bg-surface/70 dark:bg-surface-dark/50 border border-primary/20 dark:border-border-dark space-y-2">
            <div class="flex items-center gap-2 text-sm font-semibold text-text dark:text-text-dark">
              <span>📦</span> Pay with Cash upon Delivery
            </div>
            <p class="text-xs text-text-muted dark:text-text-muted-dark leading-relaxed">
              Please keep exact cash ready of <span class="font-bold text-primary">${{ cartStore.totalPrice.toFixed(2) }}</span> when our courier partner delivers your order to your address.
            </p>
          </div>

          <!-- Online Payment Card Form Demo -->
          <div v-if="paymentMethod === 'online'" class="space-y-3 p-4 rounded-2xl bg-surface/70 dark:bg-surface-dark/50 border border-primary/20 dark:border-border-dark">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-semibold text-text dark:text-text-dark">Card Details (Demo Mode)</span>
              <span class="text-[10px] text-text-muted dark:text-text-muted-dark">🔒 256-bit SSL Encrypted</span>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark mb-1">Cardholder Name</label>
              <input
                v-model="cardHolder"
                type="text"
                placeholder="John Doe"
                class="w-full px-3 py-2 rounded-xl bg-surface-card dark:bg-surface-card-dark border border-primary/30 dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark mb-1">Card Number</label>
              <input
                v-model="cardNumber"
                type="text"
                placeholder="4532 •••• •••• 8892"
                class="w-full px-3 py-2 rounded-xl bg-surface-card dark:bg-surface-card-dark border border-primary/30 dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:border-primary"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark mb-1">Expiry Date</label>
                <input
                  v-model="cardExpiry"
                  type="text"
                  placeholder="MM/YY"
                  class="w-full px-3 py-2 rounded-xl bg-surface-card dark:bg-surface-card-dark border border-primary/30 dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark mb-1">CVV</label>
                <input
                  v-model="cardCvv"
                  type="password"
                  placeholder="123"
                  maxLength="4"
                  class="w-full px-3 py-2 rounded-xl bg-surface-card dark:bg-surface-card-dark border border-primary/30 dark:border-border-dark text-sm text-text dark:text-text-dark focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <!-- Process Order / Pay Button -->
          <button
            @click="handleProcessPayment"
            :disabled="isProcessing"
            class="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base hover:bg-primary-dark shadow-lg shadow-primary/25 transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            <span v-if="isProcessing" class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            <span v-else>
              {{ paymentMethod === 'cod' ? 'Confirm Order (Cash on Delivery)' : `Pay $${cartStore.totalPrice.toFixed(2)} Now` }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
