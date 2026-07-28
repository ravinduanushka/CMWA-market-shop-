<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import type { Product } from '../types'
import { useCartStore } from '../stores/cart'
import { useAccountStore } from '../stores/account'

const props = withDefaults(defineProps<{
  product: Product
  index?: number
}>(), {
  index: 0
})

const cartStore = useCartStore()
const accountStore = useAccountStore()

const cardRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!cardRef.value) return

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            if (cardRef.value && observer) {
              observer.unobserve(cardRef.value)
            }
          }
        })
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
      }
    )
    observer.observe(cardRef.value)
  } else {
    isVisible.value = true
  }
})

onUnmounted(() => {
  if (observer && cardRef.value) {
    observer.unobserve(cardRef.value)
    observer.disconnect()
  }
})

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
  <div
    ref="cardRef"
    class="product-card-scroll-wrapper transform-gpu transition-all duration-700 ease-out will-change-[transform,opacity]"
    :class="[
      isVisible
        ? 'opacity-100 translate-y-0 scale-100'
        : 'opacity-0 translate-y-12 scale-95 pointer-events-none'
    ]"
    :style="{
      transitionDelay: isVisible ? `${(index % 4) * 90}ms` : '0ms'
    }"
  >
    <RouterLink
      :to="`/product/${product.id}`"
      class="group block h-full rounded-2xl overflow-hidden bg-surface-card dark:bg-surface-card-dark border-2 border-primary/20 dark:border-border-dark shadow-md hover:border-primary/60 dark:hover:border-primary/60 hover:shadow-xl hover:shadow-primary/15 hover:-translate-y-1.5 transition-all duration-300"
    >
      <!-- Image -->
      <div class="relative aspect-square overflow-hidden bg-slate-50/90 dark:bg-border-dark/30 border-b border-border/60 dark:border-border-dark/60">
        <img
          :src="product.thumbnail"
          :alt="product.title"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
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
        <div class="absolute top-3 right-3 px-2 py-1 rounded-full bg-surface-card/90 dark:bg-surface-dark/90 backdrop-blur-sm text-xs font-semibold flex items-center gap-1 border border-border/50 dark:border-border-dark/50 shadow-sm">
          <span class="text-amber-500">★</span>
          <span class="text-text dark:text-text-dark">{{ product.rating.toFixed(1) }}</span>
        </div>
        <!-- Favorite Heart Button -->
        <button
          @click.prevent.stop="accountStore.toggleFavorite(product.id)"
          class="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-surface-card-dark/90 backdrop-blur-md border border-primary/30 shadow-md flex items-center justify-center text-base transition-transform hover:scale-110 active:scale-90 cursor-pointer"
          :title="accountStore.isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'"
        >
          <span v-if="accountStore.isFavorite(product.id)" class="text-red-500">❤️</span>
          <span v-else class="text-gray-400 hover:text-red-400">🤍</span>
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 flex flex-col justify-between h-[calc(100%-aspect-square)]">
        <div>
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
        </div>
        <!-- Price and Add to cart -->
        <div class="flex items-end justify-between pt-2">
          <div>
            <p class="text-lg font-bold text-primary">{{ accountStore.formatPrice(discountedPrice) }}</p>
            <p v-if="product.discountPercentage > 5" class="text-xs text-text-muted dark:text-text-muted-dark line-through">
              {{ accountStore.formatPrice(product.price) }}
            </p>
          </div>
          <button
            @click="handleAddToCart"
            class="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 cursor-pointer active:scale-95"
            title="Add to cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
          </button>
        </div>
      </div>
    </RouterLink>
  </div>
</template>
