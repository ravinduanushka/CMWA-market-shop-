import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { CartItem, Product } from '../types'

export const useCartStore = defineStore('cart', () => {
    // Load initial cart from localStorage
    const stored = localStorage.getItem('food-city-cart')
    const items = ref<CartItem[]>(stored ? JSON.parse(stored) as CartItem[] : [])

    // Persist to localStorage whenever items change
    watch(items, (newItems) => {
        localStorage.setItem('food-city-cart', JSON.stringify(newItems))
    }, { deep: true })

    /** Total number of items in the cart */
    const totalItems = computed(() =>
        items.value.reduce((sum, item) => sum + item.quantity, 0)
    )

    /** Total price of all items */
    const totalPrice = computed(() =>
        items.value.reduce((sum, item) => {
            const discounted = item.product.price * (1 - item.product.discountPercentage / 100)
            return sum + discounted * item.quantity
        }, 0)
    )

    /** Add a product to the cart, or increment quantity if already there */
    function addToCart(product: Product) {
        const existing = items.value.find((item) => item.product.id === product.id)
        if (existing) {
            existing.quantity++
        } else {
            items.value.push({ product, quantity: 1 })
        }
    }

    /** Remove an item from the cart entirely */
    function removeFromCart(productId: number) {
        items.value = items.value.filter((item) => item.product.id !== productId)
    }

    /** Update the quantity of a specific item */
    function updateQuantity(productId: number, quantity: number) {
        const item = items.value.find((i) => i.product.id === productId)
        if (item) {
            if (quantity <= 0) {
                removeFromCart(productId)
            } else {
                item.quantity = quantity
            }
        }
    }

    /** Clear entire cart */
    function clearCart() {
        items.value = []
    }

    return {
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    }
})
