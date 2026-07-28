import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Currency = 'USD' | 'LKR'
export type Language = 'en' | 'si' | 'ta'

const LKR_RATE = 300 // 1 USD = 300 LKR

export const useAccountStore = defineStore('account', () => {
  // Favorites (Array of Product IDs)
  const favorites = ref<number[]>(
    JSON.parse(localStorage.getItem('food-city-favorites') || '[]')
  )

  // Currency selection ('USD' | 'LKR')
  const currency = ref<Currency>(
    (localStorage.getItem('food-city-currency') as Currency) || 'USD'
  )

  // Language selection ('en' | 'si' | 'ta')
  const language = ref<Language>(
    (localStorage.getItem('food-city-language') as Language) || 'en'
  )

  // Notifications enabled toggle
  const notificationsEnabled = ref<boolean>(
    JSON.parse(localStorage.getItem('food-city-notifications') ?? 'true')
  )

  // Save favorites to localStorage
  function toggleFavorite(productId: number) {
    const index = favorites.value.indexOf(productId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(productId)
    }
    localStorage.setItem('food-city-favorites', JSON.stringify(favorites.value))
  }

  function isFavorite(productId: number): boolean {
    return favorites.value.includes(productId)
  }

  // Set currency and persist
  function setCurrency(val: Currency) {
    currency.value = val
    localStorage.setItem('food-city-currency', val)
  }

  // Set language and persist
  function setLanguage(val: Language) {
    language.value = val
    localStorage.setItem('food-city-language', val)
  }

  // Toggle notifications and persist
  function toggleNotifications() {
    notificationsEnabled.value = !notificationsEnabled.value
    localStorage.setItem('food-city-notifications', JSON.stringify(notificationsEnabled.value))
  }

  /**
   * Formats price according to current currency selection (USD or LKR)
   */
  function formatPrice(usdAmount: number): string {
    if (currency.value === 'LKR') {
      const lkrValue = Math.round(usdAmount * LKR_RATE)
      return `Rs. ${lkrValue.toLocaleString('en-US')}`
    }
    return `$${usdAmount.toFixed(2)}`
  }

  const currencySymbol = computed(() => (currency.value === 'LKR' ? 'Rs.' : '$'))

  return {
    favorites,
    currency,
    language,
    notificationsEnabled,
    toggleFavorite,
    isFavorite,
    setCurrency,
    setLanguage,
    toggleNotifications,
    formatPrice,
    currencySymbol,
  }
})
