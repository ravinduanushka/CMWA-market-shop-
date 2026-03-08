<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import { useThemeStore } from './stores/theme'

// Initialize theme store so dark class is applied on load
useThemeStore()
</script>

<template>
  <div class="min-h-screen bg-surface text-text dark:bg-surface-dark dark:text-text-dark transition-colors duration-300">
    <NavBar />
    <main class="pt-20">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <!-- Footer -->
    <footer class="border-t border-border dark:border-border-dark py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-lg font-bold text-primary mb-2"> CMWA MARKETING STORE</p>
        <p class="text-text-muted dark:text-text-muted-dark text-sm">
          &copy; 2026 CMWA MARKETING STORE. All rights reserved.
        </p>
        <p class="text-text-muted dark:text-text-muted-dark text-sm mt-1">
          📧 info@CMWAmarketingstore.com &nbsp;|&nbsp; 📞 +94 77 123 4567
        </p>
      </div>
    </footer>
  </div>
</template>
