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
    <section class="relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <!-- Pattern overlay -->
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 30px 30px;"></div>
      <!-- Glow effects -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/20 dark:bg-primary/20 rounded-full blur-[100px]"></div>
      <div class="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-300/30 dark:bg-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute -top-10 -right-10 w-60 h-60 bg-orange-300/30 dark:bg-accent/10 rounded-full blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            <span class="text-white dark:bg-gradient-to-r dark:from-primary dark:via-accent dark:to-primary-dark dark:bg-clip-text dark:text-transparent drop-shadow-lg">
              WELCOME TO RA MARKETING STORE
            </span>
          </h1>
          <p class="text-lg sm:text-xl text-white/80 dark:text-text-muted-dark max-w-2xl mx-auto">
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
        <p class="text-5xl mb-4">😞</p>
        <p class="text-xl font-semibold text-text dark:text-text-dark mb-2">Oops! Something went wrong</p>
        <p class="text-text-muted dark:text-text-muted-dark mb-4">{{ error }}</p>
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
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>
  </div>
</template>
