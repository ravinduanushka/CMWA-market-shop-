<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import SearchBar from './SearchBar.vue'
import CartIcon from './CartIcon.vue'
import ThemeToggle from './ThemeToggle.vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-surface/80 dark:bg-surface-dark/80 border-b border-border dark:border-border-dark shadow-sm transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 group">
          <span class="text-3xl">🛒</span>
          <span class="text-xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CMWA MARKETING STORE
          </span>
        </RouterLink>

        <!-- Desktop search -->
        <div class="hidden md:block flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        <!-- Desktop right side -->
        <div class="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <CartIcon />
          <!-- Login / User -->
          <template v-if="authStore.isLoggedIn">
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20">
              <img
                :src="authStore.user?.image"
                :alt="authStore.displayName"
                class="w-7 h-7 rounded-full object-cover ring-2 ring-primary"
              />
              <span class="text-sm font-medium text-text dark:text-text-dark">{{ authStore.user?.firstName }}</span>
            </div>
            <button
              @click="authStore.logout()"
              class="text-sm font-medium text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors cursor-pointer"
            >
              Logout
            </button>
          </template>
          <div v-else class="flex items-center gap-3">
            <RouterLink
              to="/login"
              class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Login
            </RouterLink>
          </div>

          <!-- About Us Button (Same pill button style as Login, placed on the right of Login) -->
          <RouterLink
            to="/about"
            class="px-4 py-2 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors duration-200 shadow-sm"
          >
            About Us
          </RouterLink>
        </div>

        <!-- Mobile hamburger -->
        <div class="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <CartIcon />
          <button @click="toggleMobileMenu" class="p-2 rounded-lg hover:bg-border/50 dark:hover:bg-border-dark/50 transition-colors cursor-pointer">
            <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition name="fade">
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-border dark:border-border-dark px-4 py-4 space-y-3 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-xl">
        <SearchBar @searched="mobileMenuOpen = false" />
        <RouterLink
          to="/about"
          @click="mobileMenuOpen = false"
          class="block text-center px-4 py-2 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors"
        >
          About Us
        </RouterLink>
        <template v-if="authStore.isLoggedIn">
          <div class="flex items-center gap-2">
            <img
              :src="authStore.user?.image"
              :alt="authStore.displayName"
              class="w-8 h-8 rounded-full object-cover"
            />
            <span class="font-medium text-text dark:text-text-dark">{{ authStore.displayName }}</span>
          </div>
          <button
            @click="authStore.logout(); mobileMenuOpen = false"
            class="block w-full text-left text-sm text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors cursor-pointer"
          >
            Logout
          </button>
        </template>
        <RouterLink
          v-else
          to="/login"
          @click="mobileMenuOpen = false"
          class="block text-center px-4 py-2 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors"
        >
          Login
        </RouterLink>
      </div>
    </transition>
  </nav>
</template>
