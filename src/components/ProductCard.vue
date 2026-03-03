<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Product } from '../types'
import { useCartStore } from '../stores/cart'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()

const discountedPrice = computed(() =>
  props.product.price * (1 - props.product.discountPercentage / 100)
)

const ratingStars = computed(() => Math.round(props.product.rating))

function handleAddToCart(event: Event) {
  event.preventDefault()
  event.stopPropagation()
  cartStore.addToCart(props.product)
}
</script>

<template>
  <RouterLink
    :to="`/product/${product.id}`"
    class="group block rounded-2xl overflow-hidden bg-surface-card dark:bg-surface-card-dark border border-border dark:border-border-dark hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
  >
    <!-- Image -->
    <div class="relative aspect-square overflow-hidden bg-border/20 dark:bg-border-dark/20">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
      <!-- Discount badge -->
      <div
        v-if="product.discountPercentage > 5"
        class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg"
      >
        -{{ Math.round(product.discountPercentage) }}%
      </div>
      <!-- Rating badge -->
      <div class="absolute top-3 right-3 px-2 py-1 rounded-full bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-sm text-xs font-semibold flex items-center gap-1">
        <span class="text-amber-500">★</span>
        <span class="text-text dark:text-text-dark">{{ product.rating.toFixed(1) }}</span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Category -->
      <p class="text-xs font-medium text-primary uppercase tracking-wide mb-1">
        {{ product.category }}
      </p>
      <!-- Title -->
      <h3 class="font-semibold text-text dark:text-text-dark text-sm leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
        {{ product.title }}
      </h3>
      <!-- Stars -->
      <div class="flex items-center gap-0.5 mb-3">
        <span
          v-for="i in 5"
          :key="i"
          class="text-sm"
          :class="i <= ratingStars ? 'text-amber-500' : 'text-border dark:text-border-dark'"
        >★</span>
        <span class="text-xs text-text-muted dark:text-text-muted-dark ml-1">({{ product.rating.toFixed(1) }})</span>
      </div>
      <!-- Price and Add to cart -->
      <div class="flex items-end justify-between">
        <div>
          <p class="text-lg font-bold text-primary">${{ discountedPrice.toFixed(2) }}</p>
          <p v-if="product.discountPercentage > 5" class="text-xs text-text-muted dark:text-text-muted-dark line-through">
            ${{ product.price.toFixed(2) }}
          </p>
        </div>
        <button
          @click="handleAddToCart"
          class="p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 cursor-pointer"
          title="Add to cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
        </button>
      </div>
    </div>
  </RouterLink>
</template>
