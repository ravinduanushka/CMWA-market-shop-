<script setup lang="ts">
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <button
    @click="themeStore.toggleTheme()"
    class="p-2 rounded-xl hover:bg-border/50 dark:hover:bg-border-dark/50 transition-all duration-200 cursor-pointer"
    :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    
    <svg
      v-if="themeStore.isDark"
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform duration-300"
      fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
    >
      <circle cx="12" cy="12" r="5"/>
      <path stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
    <!-- Moon icon for light mode (click to switch to dark) -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5 text-text-muted hover:-rotate-12 transition-transform duration-300"
      fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </button>
</template>
