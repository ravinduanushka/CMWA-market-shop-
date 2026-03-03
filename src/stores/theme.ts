import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    // Load preference from localStorage, default to system preference
    const storedTheme = localStorage.getItem('food-city-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = ref(storedTheme ? storedTheme === 'dark' : prefersDark)

    // Apply/remove the 'dark' class on <html>
    function applyTheme() {
        if (isDark.value) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    // Apply on init
    applyTheme()

    // Watch and persist changes
    watch(isDark, () => {
        applyTheme()
        localStorage.setItem('food-city-theme', isDark.value ? 'dark' : 'light')
    })

    function toggleTheme() {
        isDark.value = !isDark.value
    }

    return {
        isDark,
        toggleTheme,
    }
})
