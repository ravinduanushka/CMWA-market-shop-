<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

const isEmpty = computed(() => cartStore.items.length === 0)

function getDiscountedPrice(price: number, discount: number): number {
  return price * (1 - discount / 100)
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
        
        <!-- Payment Method Page Buttons -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <RouterLink
            to="/checkout/cod"
            class="py-3.5 px-4 rounded-2xl bg-surface dark:bg-surface-dark hover:bg-primary/10 border-2 border-primary/40 text-primary font-bold text-sm text-center transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
             Cash on Delivery
          </RouterLink>
          <RouterLink
            to="/checkout/online"
            class="py-3.5 px-4 rounded-2xl bg-primary text-white font-bold text-sm text-center hover:bg-primary-dark shadow-md shadow-primary/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
             Online Card Payment
          </RouterLink>
        </div>

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
  </div>
</template>
