<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Product, CategoryInfo } from '../types'
import { fetchProducts, fetchCategories, searchProducts, fetchProductsByCategory } from '../api/dummyjson'
import ProductCard from '../components/ProductCard.vue'
import FilterBar from '../components/FilterBar.vue'

const route = useRoute()

const products = ref<Product[]>([])
const categories = ref<CategoryInfo[]>([])
const selectedCategory = ref('')
const loading = ref(true)
const error = ref<string | null>(null)

const searchQuery = computed(() => (route.query.q as string) || '')
const heroTitleLetters = 'WELCOME TO CMWA MARKETING STORE'.split('')

/** Load products based on current search/filter state */
async function loadProducts() {
  loading.value = true
  error.value = null
  try {
    if (searchQuery.value) {
      const res = await searchProducts(searchQuery.value)
      products.value = res.products
    } else if (selectedCategory.value) {
      const res = await fetchProductsByCategory(selectedCategory.value)
      products.value = res.products
    } else {
      const res = await fetchProducts()
      products.value = res.products
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load products'
  } finally {
    loading.value = false
  }
}

/** Load categories for filter bar */
async function loadCategories() {
  try {
    categories.value = await fetchCategories()
  } catch {
    // Categories are optional, fail silently
  }
}

function handleCategorySelect(slug: string) {
  selectedCategory.value = slug
  loadProducts()
}

// Watch for search query changes from NavBar
watch(searchQuery, () => {
  selectedCategory.value = ''
  loadProducts()
})

onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gray-900 overflow-hidden">
      <video
        src="/hero-bg.mp4"
        autoplay
        loop
        muted
        playsinline
        preload="auto"
        class="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none"
      ></video>
      <div class="absolute inset-0 bg-black/25"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36">
        <div class="text-center max-w-5xl mx-auto">
          <h1 class="text-base xs:text-xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md select-none leading-snug sm:whitespace-nowrap flex flex-wrap justify-center">
            <span
              v-for="(char, index) in heroTitleLetters"
              :key="index"
              class="wave-letter"
              :class="{ 'inline-block w-[0.25em]': char === ' ' }"
              :style="{ animationDelay: `${index * 70}ms` }"
            >
              {{ char === ' ' ? '\u00A0' : char }}
            </span>
          </h1>
          <p class="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
            Discover amazing products, grab delicious deals, and enjoy the best shopping experience in town!
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search query indicator -->
      <div v-if="searchQuery" class="mb-6">
        <p class="text-text-muted dark:text-text-muted-dark">
          Showing results for: <span class="font-semibold text-text dark:text-text-dark">"{{ searchQuery }}"</span>
          <span class="text-sm ml-2">({{ products.length }} found)</span>
        </p>
      </div>

      <!-- Filter bar -->
      <div v-if="!searchQuery" class="mb-8">
        <h2 class="text-sm font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wider mb-3">
          Categories
        </h2>
        <FilterBar
          :categories="categories"
          :selected-category="selectedCategory"
          @select="handleCategorySelect"
        />
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="i in 8"
          :key="i"
          class="rounded-2xl bg-border/30 dark:bg-border-dark/30 animate-pulse aspect-[3/4]"
        ></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-16">
        <p class="text-5xl mb-4"></p>
        <p class="text-xl font-semibold text-text dark:text-text-dark mb-2">Oops! Something went wrong</p>
        <p class="text-text-muted dark:text-text-muted-dark mb-2">{{ error }}</p>
        <p class="text-sm text-text-muted dark:text-text-muted-dark mb-6">Please check your internet connection and try again.</p>
        <button
          @click="loadProducts()"
          class="px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>

      <!-- Empty state -->
      <div v-else-if="products.length === 0" class="text-center py-16">
        <p class="text-5xl mb-4">🔍</p>
        <p class="text-xl font-semibold text-text dark:text-text-dark mb-2">No products found</p>
        <p class="text-text-muted dark:text-text-muted-dark">Try a different search or category.</p>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard
          v-for="(product, idx) in products"
          :key="product.id"
          :product="product"
          :index="idx"
        />
      </div>
    </section>
  </div>
</template>
