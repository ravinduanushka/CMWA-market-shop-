<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
</script>

<template>
  <RouterLink
    to="/cart"
    class="relative p-2 rounded-xl hover:bg-border/50 dark:hover:bg-border-dark/50 transition-colors"
    title="Shopping Cart"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-text dark:text-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
    </svg>
    <!-- Badge -->
    <span
      v-if="cartStore.totalItems > 0"
      class="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full bg-primary text-white text-xs font-bold animate-bounce"
    >
      {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
    </span>
  </RouterLink>
</template>
