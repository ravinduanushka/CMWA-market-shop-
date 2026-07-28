<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useAccountStore } from '../stores/account'
import { fetchProduct } from '../api/dummyjson'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard.vue'

const authStore = useAuthStore()
const accountStore = useAccountStore()
const router = useRouter()

const favoriteProducts = ref<Product[]>([])
const loadingFavorites = ref(false)

// Load favorited products list
async function loadFavorites() {
  if (accountStore.favorites.length === 0) {
    favoriteProducts.value = []
    return
  }
  loadingFavorites.value = true
  try {
    const promises = accountStore.favorites.map((id) => fetchProduct(id).catch(() => null))
    const results = await Promise.all(promises)
    favoriteProducts.value = results.filter((p): p is Product => p !== null)
  } catch {
    // Fail gracefully
  } finally {
    loadingFavorites.value = false
  }
}

onMounted(() => {
  loadFavorites()
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Back Link -->
    <div>
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors font-semibold text-sm hover:-translate-x-1 duration-200"
      >
        <span>←</span> Back to Home
      </RouterLink>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between border-b-2 border-primary/40 pb-4">
      <h1 class="text-3xl font-extrabold text-text dark:text-text-dark flex items-center gap-2">
        👤 My Account
      </h1>
      <span class="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary uppercase">
        Profile & Settings
      </span>
    </div>

    <!-- 1. Profile Information Rectangle Card -->
    <div class="rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm bg-surface-card dark:bg-surface-card-dark p-6 sm:p-8">
      <p class="text-xs font-bold text-primary uppercase tracking-wider mb-4">Account Profile</p>
      
      <div v-if="authStore.isLoggedIn" class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          :src="authStore.user?.image || 'https://robohash.org/user?set=set4'"
          :alt="authStore.displayName"
          class="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-md ring-4 ring-primary/10"
        />
        <div class="space-y-2 text-center sm:text-left flex-1">
          <div>
            <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark">Display Name</label>
            <p class="text-xl font-extrabold text-text dark:text-text-dark">{{ authStore.displayName }}</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-text-muted dark:text-text-muted-dark">Registered Email</label>
            <p class="text-base font-bold text-text-muted dark:text-text-muted-dark">{{ authStore.user?.email || 'user@example.com' }}</p>
          </div>
        </div>
      </div>

      <!-- Logged out guest state -->
      <div v-else class="text-center py-4 space-y-3">
        <p class="text-text-muted dark:text-text-muted-dark font-medium">You are currently visiting as a Guest.</p>
        <RouterLink
          to="/login"
          class="inline-block px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark shadow-md transition-all"
        >
          Login to your Account
        </RouterLink>
      </div>
    </div>

    <!-- 2. Settings Grid (Notifications, Currency, Language) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Notifications Toggle Card -->
      <div class="rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm bg-surface-card dark:bg-surface-card-dark p-6 flex flex-col justify-between">
        <div>
          <p class="text-xs font-bold text-primary uppercase tracking-wider mb-2">Notifications</p>
          <p class="text-sm font-semibold text-text dark:text-text-dark mb-4">Promotions & Order Status</p>
        </div>

        <div class="flex items-center justify-between pt-2">
          <span class="text-sm font-bold text-text dark:text-text-dark">
            {{ accountStore.notificationsEnabled ? 'ON 🔔' : 'OFF 🔕' }}
          </span>
          <button
            @click="accountStore.toggleNotifications()"
            :class="[
              'w-14 h-8 rounded-full transition-colors p-1 cursor-pointer flex items-center',
              accountStore.notificationsEnabled ? 'bg-primary justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'
            ]"
          >
            <span class="w-6 h-6 rounded-full bg-white shadow-md block"></span>
          </button>
        </div>
      </div>

      <!-- Currency Preferences Card -->
      <div class="rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm bg-surface-card dark:bg-surface-card-dark p-6 flex flex-col justify-between">
        <div>
          <p class="text-xs font-bold text-primary uppercase tracking-wider mb-2">Currency</p>
          <p class="text-sm font-semibold text-text dark:text-text-dark mb-4">Choose Display Currency</p>
        </div>

        <select
          :value="accountStore.currency"
          @change="accountStore.setCurrency(($event.target as HTMLSelectElement).value as any)"
          class="w-full px-4 py-2.5 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 text-sm font-bold text-text dark:text-text-dark focus:outline-none cursor-pointer"
        >
          <option value="USD">$ USD (US Dollar)</option>
          <option value="LKR">Rs. LKR (Sri Lankan Rupee)</option>
        </select>
      </div>

      <!-- Language Preferences Card -->
      <div class="rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm bg-surface-card dark:bg-surface-card-dark p-6 flex flex-col justify-between">
        <div>
          <p class="text-xs font-bold text-primary uppercase tracking-wider mb-2">Language</p>
          <p class="text-sm font-semibold text-text dark:text-text-dark mb-4">Select Store Language</p>
        </div>

        <select
          :value="accountStore.language"
          @change="accountStore.setLanguage(($event.target as HTMLSelectElement).value as any)"
          class="w-full px-4 py-2.5 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 text-sm font-bold text-text dark:text-text-dark focus:outline-none cursor-pointer"
        >
          <option value="en">English 🇬🇧</option>
          <option value="si">සිංහල (Sinhala) 🇱🇰</option>
          <option value="ta">தமிழ் (Tamil) 🇱🇰</option>
        </select>
      </div>

    </div>

    <!-- 3. My Favourites Section -->
    <div class="rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm bg-surface-card dark:bg-surface-card-dark p-6 sm:p-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1">Saved Items</p>
          <h2 class="text-xl font-extrabold text-text dark:text-text-dark">My Favourites (❤️ {{ accountStore.favorites.length }})</h2>
        </div>
      </div>

      <div v-if="accountStore.favorites.length === 0" class="text-center py-10">
        <p class="text-4xl mb-2">🤍</p>
        <p class="text-text-muted dark:text-text-muted-dark font-medium">No favourite items added yet.</p>
        <p class="text-xs text-text-muted dark:text-text-muted-dark mt-1">Click the heart ❤️ on any product to save it here!</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <ProductCard
          v-for="product in favoriteProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>

    <!-- 4. Logout Action Card -->
    <div v-if="authStore.isLoggedIn" class="rounded-2xl border-2 border-red-400/40 shadow-sm bg-surface-card dark:bg-surface-card-dark p-6 flex items-center justify-between">
      <div>
        <p class="text-sm font-bold text-text dark:text-text-dark">Sign Out</p>
        <p class="text-xs text-text-muted dark:text-text-muted-dark">Log out of your CMWA Marketing Store account</p>
      </div>

      <button
        @click="handleLogout"
        class="px-6 py-2.5 rounded-full bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
      >
        Logout
      </button>
    </div>
  </div>
</template>
