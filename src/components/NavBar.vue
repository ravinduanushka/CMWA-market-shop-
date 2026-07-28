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
    <div class="w-full px-4 sm:px-6 lg:px-10">
      <div class="flex items-center justify-between h-16 gap-4">
        <!-- Logo (Left Corner) -->
        <RouterLink to="/" class="flex items-center gap-2 group flex-shrink-0">
          <span class="text-2xl sm:text-3xl">🛒</span>
          <span class="text-base sm:text-xl font-extrabold text-primary tracking-tight group-hover:text-primary-dark transition-colors whitespace-nowrap">
            <span class="hidden xs:inline sm:inline">CMWA MARKETING STORE</span>
            <span class="inline xs:hidden sm:hidden">CMWA STORE</span>
          </span>
        </RouterLink>

        <!-- Desktop search (Middle) -->
        <div class="hidden md:block flex-1 max-w-md mx-auto">
          <SearchBar />
        </div>

        <!-- Desktop right side (Right Corner - 5 Features) -->
        <div class="hidden md:flex items-center gap-3.5 flex-shrink-0">
          <ThemeToggle />
          <CartIcon />
          
          <!-- Login Button -->
          <template v-if="authStore.isLoggedIn">
            <button
              @click="authStore.logout()"
              class="px-4 py-2 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors duration-200 shadow-sm cursor-pointer"
            >
              Logout
            </button>
          </template>
          <RouterLink
            v-else
            to="/login"
            class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors duration-200 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Login
          </RouterLink>

          <!-- My Account Button (Styled same as Login & About Us) -->
          <RouterLink
            to="/account"
            class="px-4 py-2 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors duration-200 shadow-sm"
          >
            My Account
          </RouterLink>

          <!-- About Us Button -->
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
          <button @click="toggleMobileMenu" class="p-2 rounded-lg hover:bg-border/50 dark:hover:bg-border-dark/50 transition-colors cursor-pointer" aria-label="Toggle Navigation Menu">
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
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-border dark:border-border-dark px-4 py-5 space-y-3 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-xl shadow-xl">
        <SearchBar @searched="mobileMenuOpen = false" />
        
        <div class="grid grid-cols-1 gap-2.5 pt-2">
          <RouterLink
            v-if="!authStore.isLoggedIn"
            to="/login"
            @click="mobileMenuOpen = false"
            class="block text-center px-4 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm"
          >
            Login
          </RouterLink>
          
          <RouterLink
            to="/account"
            @click="mobileMenuOpen = false"
            class="block text-center px-4 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm"
          >
            My Account
          </RouterLink>

          <RouterLink
            to="/about"
            @click="mobileMenuOpen = false"
            class="block text-center px-4 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm"
          >
            About Us
          </RouterLink>

          <button
            v-if="authStore.isLoggedIn"
            @click="authStore.logout(); mobileMenuOpen = false"
            class="w-full text-center px-4 py-2.5 rounded-full bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>
