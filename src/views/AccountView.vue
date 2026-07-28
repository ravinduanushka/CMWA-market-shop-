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
const isPageLoaded = ref(false)

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
  // Trigger staggered slide-in entrance animation after mount
  setTimeout(() => {
    isPageLoaded.value = true
  }, 50)
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function removeFavorite(productId: number) {
  accountStore.toggleFavorite(productId)
  favoriteProducts.value = favoriteProducts.value.filter(p => p.id !== productId)
}

function clearAllFavorites() {
  const ids = [...accountStore.favorites]
  ids.forEach(id => accountStore.toggleFavorite(id))
  favoriteProducts.value = []
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 overflow-hidden">
    
    <!-- Back to Home Navigation Link -->
    <div
      class="transition-all duration-700 ease-out transform-gpu"
      :class="isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'"
    >
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors font-semibold text-sm hover:-translate-x-1 duration-200"
      >
        <span>←</span> Back to Home
      </RouterLink>
    </div>

    <!-- Page Title Header -->
    <div
      class="border-b-2 border-primary/40 pb-4 transition-all duration-700 ease-out transform-gpu"
      :class="isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'"
    >
      <h1 class="text-2xl sm:text-3xl font-extrabold text-text dark:text-text-dark">
        My Account
      </h1>
    </div>

    <!-- Section 1: Account Profile Boxes (Staggered Left & Right Entrance) -->
    <div class="space-y-4">
      <p
        class="text-xs font-bold text-primary uppercase tracking-wider mb-2 transition-all duration-700 ease-out transform-gpu"
        :class="isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'"
        :style="{ transitionDelay: isPageLoaded ? '80ms' : '0ms' }"
      >
        Account Profile
      </p>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- First Name Box (Slides in from LEFT) -->
        <div
          class="p-6 rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm transition-all duration-700 ease-out hover:scale-[1.03] hover:border-primary hover:shadow-lg cursor-pointer transform-gpu"
          :class="isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'"
          :style="{ transitionDelay: isPageLoaded ? '140ms' : '0ms' }"
        >
          <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">First Name</p>
          <p class="font-extrabold text-text dark:text-text-dark text-base sm:text-lg">
            {{ authStore.user?.firstName || 'Ravindu' }}
          </p>
        </div>

        <!-- Last Name Box (Slides in from RIGHT) -->
        <div
          class="p-6 rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm transition-all duration-700 ease-out hover:scale-[1.03] hover:border-primary hover:shadow-lg cursor-pointer transform-gpu"
          :class="isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'"
          :style="{ transitionDelay: isPageLoaded ? '260ms' : '0ms' }"
        >
          <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Last Name</p>
          <p class="font-extrabold text-text dark:text-text-dark text-base sm:text-lg">
            {{ authStore.user?.lastName || 'Anushka' }}
          </p>
        </div>
      </div>

      <!-- Email Address Box (Slides in from LEFT) -->
      <div
        class="p-6 rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm transition-all duration-700 ease-out hover:scale-[1.03] hover:border-primary hover:shadow-lg cursor-pointer transform-gpu"
        :class="isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'"
        :style="{ transitionDelay: isPageLoaded ? '380ms' : '0ms' }"
      >
        <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Email Address</p>
        <p class="font-extrabold text-text dark:text-text-dark text-base sm:text-lg break-all">
          {{ authStore.user?.email || 'ravindu@example.com' }}
        </p>
      </div>
    </div>

    <!-- Section 2: Settings Cards (Notifications, Currency, Language - Staggered Entrance) -->
    <div class="space-y-4">
      <p
        class="text-xs font-bold text-primary uppercase tracking-wider mb-2 transition-all duration-700 ease-out transform-gpu"
        :class="isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'"
        :style="{ transitionDelay: isPageLoaded ? '460ms' : '0ms' }"
      >
        Preferences & Settings
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Notifications Card (Slides in from LEFT) -->
        <div
          class="p-6 rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm flex flex-col justify-between space-y-4 transition-all duration-700 ease-out hover:scale-[1.03] hover:border-primary hover:shadow-lg cursor-pointer transform-gpu"
          :class="isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'"
          :style="{ transitionDelay: isPageLoaded ? '520ms' : '0ms' }"
        >
          <div>
            <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Notifications</p>
            <p class="font-extrabold text-text dark:text-text-dark text-base">
              {{ accountStore.notificationsEnabled ? 'Enabled (ON)' : 'Disabled (OFF)' }}
            </p>
          </div>

          <button
            @click="accountStore.toggleNotifications()"
            class="px-4 py-2 rounded-full bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-colors shadow-sm cursor-pointer self-start"
          >
            Toggle {{ accountStore.notificationsEnabled ? 'OFF ' : 'ON ' }}
          </button>
        </div>

        <!-- Currency Card (Slides up from CENTER) -->
        <div
          class="p-6 rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm flex flex-col justify-between space-y-4 transition-all duration-700 ease-out hover:scale-[1.03] hover:border-primary hover:shadow-lg cursor-pointer transform-gpu"
          :class="isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'"
          :style="{ transitionDelay: isPageLoaded ? '660ms' : '0ms' }"
        >
          <div>
            <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Currency</p>
            <p class="font-extrabold text-text dark:text-text-dark text-base">
              {{ accountStore.currency === 'LKR' ? 'Rs. LKR' : '$ USD' }}
            </p>
          </div>

          <select
            :value="accountStore.currency"
            @change="accountStore.setCurrency(($event.target as HTMLSelectElement).value as any)"
            class="w-full px-3 py-2 rounded-xl bg-transparent border-2 border-primary/40 dark:border-border-dark text-xs font-bold text-text dark:text-text-dark focus:outline-none cursor-pointer"
          >
            <option value="USD">$ USD (US Dollar)</option>
            <option value="LKR">Rs. LKR (Sri Lankan Rupee)</option>
          </select>
        </div>

        <!-- Language Card (Slides in from RIGHT) -->
        <div
          class="p-6 rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm flex flex-col justify-between space-y-4 transition-all duration-700 ease-out hover:scale-[1.03] hover:border-primary hover:shadow-lg cursor-pointer transform-gpu"
          :class="isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'"
          :style="{ transitionDelay: isPageLoaded ? '800ms' : '0ms' }"
        >
          <div>
            <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Language</p>
            <p class="font-extrabold text-text dark:text-text-dark text-base">
              {{ accountStore.language === 'si' ? 'සිංහල' : accountStore.language === 'ta' ? 'தமிழ்' : 'English' }}
            </p>
          </div>

          <select
            :value="accountStore.language"
            @change="accountStore.setLanguage(($event.target as HTMLSelectElement).value as any)"
            class="w-full px-3 py-2 rounded-xl bg-transparent border-2 border-primary/40 dark:border-border-dark text-xs font-bold text-text dark:text-text-dark focus:outline-none cursor-pointer"
          >
            <option value="en">English 🇬🇧</option>
            <option value="si">සිංහල (Sinhala) 🇱🇰</option>
            <option value="ta">தமிழ் (Tamil) 🇱🇰</option>
          </select>
        </div>

      </div>
    </div>

    <!-- Section 3: My Favourites Section (Slides up from BOTTOM) -->
    <div
      class="space-y-4 transition-all duration-700 ease-out transform-gpu"
      :class="isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'"
      :style="{ transitionDelay: isPageLoaded ? '920ms' : '0ms' }"
    >
      <div class="border-b-2 border-primary/40 pb-2 flex items-center justify-between">
        <h2 class="text-xl font-extrabold text-text dark:text-text-dark">
          My Favourites ( {{ accountStore.favorites.length }})
        </h2>
        <button
          v-if="accountStore.favorites.length > 0"
          @click="clearAllFavorites"
          class="px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 text-xs font-bold hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer shadow-sm"
        >
          Clear All Favourites
        </button>
      </div>

      <div v-if="accountStore.favorites.length === 0" class="p-8 rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm text-center transition-all duration-300 ease-out hover:scale-[1.02] hover:border-primary hover:shadow-lg">
        <p class="text-4xl mb-2"></p>
        <p class="font-semibold text-text dark:text-text-dark">No favourite items added yet.</p>
        
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="product in favoriteProducts"
          :key="product.id"
          class="relative group"
        >
          <!-- Individual Remove Favorite Button -->
          <button
            @click.stop.prevent="removeFavorite(product.id)"
            class="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/95 dark:bg-surface-card-dark/95 shadow-md border border-red-300 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
            title="Remove from Favourites"
          >
            ✕
          </button>
          <ProductCard :product="product" />
        </div>
      </div>
    </div>

    <!-- Section 4: Logout Button Box (Slides in from LEFT) -->
    <div
      class="p-6 rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm flex items-center justify-between transition-all duration-700 ease-out hover:scale-[1.03] hover:border-primary hover:shadow-lg cursor-pointer transform-gpu"
      :class="isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'"
      :style="{ transitionDelay: isPageLoaded ? '1040ms' : '0ms' }"
    >
      <div>
        <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1">Account Session</p>
        <p class="font-extrabold text-text dark:text-text-dark text-base">Sign out of your store account</p>
      </div>

      <button
        @click="handleLogout"
        class="px-6 py-2 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
      >
        Logout
      </button>
    </div>

  </div>
</template>
