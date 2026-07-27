<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Product } from '../types'
import { fetchProduct } from '../api/dummyjson'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedImage = ref(0)
const addedToCart = ref(false)

const discountedPrice = computed(() => {
  if (!product.value) return 0
  return product.value.price * (1 - product.value.discountPercentage / 100)
})

const ratingStars = computed(() => {
  if (!product.value) return 0
  return Math.round(product.value.rating)
})

function addToCart() {
  if (product.value) {
    cartStore.addToCart(product.value)
    addedToCart.value = true
    setTimeout(() => { addedToCart.value = false }, 2000)
  }
}

function goBack() {
  router.back()
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (isNaN(id)) {
    error.value = 'Invalid product ID'
    loading.value = false
    return
  }
  try {
    product.value = await fetchProduct(id)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load product'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back button -->
    <button
      @click="goBack"
      class="flex items-center gap-2 text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-text-dark mb-6 transition-colors cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
      </svg>
      <span class="font-medium">Back</span>
    </button>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col lg:flex-row gap-8 animate-pulse">
      <div class="lg:w-1/2 aspect-square bg-border/30 dark:bg-border-dark/30 rounded-2xl"></div>
      <div class="lg:w-1/2 space-y-4">
        <div class="h-8 w-2/3 bg-border/30 dark:bg-border-dark/30 rounded-lg"></div>
        <div class="h-4 w-1/3 bg-border/30 dark:bg-border-dark/30 rounded-lg"></div>
        <div class="h-24 bg-border/30 dark:bg-border-dark/30 rounded-lg"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-16">
      <p class="text-5xl mb-4">😞</p>
      <p class="text-xl font-semibold text-text dark:text-text-dark mb-2">Product not found</p>
      <p class="text-text-muted dark:text-text-muted-dark">{{ error }}</p>
    </div>

    <!-- Product Detail Card -->
    <div v-else-if="product" class="rounded-3xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/40 dark:border-border-dark shadow-xl p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
      <!-- Image Gallery -->
      <div class="lg:w-1/2">
        <div class="relative rounded-2xl overflow-hidden bg-slate-50/90 dark:bg-border-dark/20 border-2 border-primary/20 dark:border-border-dark aspect-square mb-4 shadow-sm">
          <img
            :src="product.images[selectedImage] || product.thumbnail"
            :alt="product.title"
            class="w-full h-full object-cover"
          />
          <!-- Discount badge -->
          <div
            v-if="product.discountPercentage > 5"
            class="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-bold shadow-lg"
          >
            -{{ Math.round(product.discountPercentage) }}% OFF
          </div>
        </div>
        <!-- Thumbnails -->
        <div v-if="product.images.length > 1" class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="(img, idx) in product.images"
            :key="idx"
            @click="selectedImage = idx"
            :class="[
              'w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 cursor-pointer',
              idx === selectedImage
                ? 'border-primary shadow-md shadow-primary/25'
                : 'border-border dark:border-border-dark hover:border-primary/50'
            ]"
          >
            <img :src="img" :alt="`${product.title} image ${idx + 1}`" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="lg:w-1/2">
        <!-- Category -->
        <p class="text-sm font-medium text-primary uppercase tracking-wider mb-2">{{ product.category }}</p>
        <!-- Title -->
        <h1 class="text-3xl sm:text-4xl font-extrabold text-text dark:text-text-dark mb-3">{{ product.title }}</h1>
        <!-- Brand -->
        <p v-if="product.brand" class="text-text-muted dark:text-text-muted-dark mb-4">
          by <span class="font-semibold text-text dark:text-text-dark">{{ product.brand }}</span>
        </p>
        <!-- Rating -->
        <div class="flex items-center gap-2 mb-6">
          <div class="flex">
            <span
              v-for="i in 5" :key="i"
              class="text-lg"
              :class="i <= ratingStars ? 'text-amber-500' : 'text-border dark:text-border-dark'"
            >★</span>
          </div>
          <span class="text-text-muted dark:text-text-muted-dark font-medium">{{ product.rating.toFixed(1) }}</span>
        </div>
        <!-- Description -->
        <p class="text-text-muted dark:text-text-muted-dark leading-relaxed mb-6">{{ product.description }}</p>
        <!-- Price -->
        <div class="flex items-end gap-3 mb-6">
          <span class="text-4xl font-extrabold text-primary">${{ discountedPrice.toFixed(2) }}</span>
          <span v-if="product.discountPercentage > 5" class="text-xl text-text-muted dark:text-text-muted-dark line-through">
            ${{ product.price.toFixed(2) }}
          </span>
        </div>
        <!-- Stock -->
        <div class="flex items-center gap-2 mb-6">
          <span
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
              product.stock > 10
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : product.stock > 0
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            ]"
          >
            <span class="w-2 h-2 rounded-full" :class="product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'"></span>
            {{ product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock' }}
          </span>
        </div>

        <!-- Add to cart button -->
        <button
          @click="addToCart"
          :disabled="product.stock === 0"
          :class="[
            'w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 cursor-pointer',
            addedToCart
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
              : product.stock === 0
                ? 'bg-border dark:bg-border-dark text-text-muted dark:text-text-muted-dark cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-dark'
          ]"
        >
          <span v-if="addedToCart" class="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            Added to Cart!
          </span>
          <span v-else-if="product.stock === 0">Out of Stock</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
            Add to Cart — ${{ discountedPrice.toFixed(2) }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
