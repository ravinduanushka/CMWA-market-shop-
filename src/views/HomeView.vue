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
    <section class="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-transparent dark:from-primary/5 dark:via-accent/5 dark:to-transparent">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            <span class="bg-gradient-to-r from-primary via-accent to-primary-dark bg-clip-text text-transparent">
              WELCOME TO RA MARKETING STORE
            </span>
          </h1>
          <p class="text-lg sm:text-xl text-text-muted dark:text-text-muted-dark max-w-2xl mx-auto">
            Discover amazing products, grab delicious deals, and enjoy the best shopping experience in town!
          </p>
        </div>
      </div>
      <!-- Decorative blob -->
      <div class="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-16 -left-16 w-64 h-64 bg-accent/10 dark:bg-accent/5 rounded-full blur-3xl"></div>
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
