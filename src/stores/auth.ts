import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser, LoginCredentials } from '../types'
import { loginUser } from '../api/dummyjson'

export const useAuthStore = defineStore('auth', () => {
    // Load user from localStorage
    const stored = localStorage.getItem('food-city-user')
    const user = ref<AuthUser | null>(stored ? JSON.parse(stored) as AuthUser : null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const isLoggedIn = computed(() => user.value !== null)
    const displayName = computed(() =>
        user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
    )

    async function login(credentials: LoginCredentials): Promise<boolean> {
        loading.value = true
        error.value = null
        try {
            const data = await loginUser(credentials)
            user.value = {
                id: data.id,
                username: data.username,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                image: data.image,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            }
            localStorage.setItem('food-city-user', JSON.stringify(user.value))
            return true
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Login failed'
            return false
        } finally {
            loading.value = false
        }
    }

    function logout() {
        user.value = null
        localStorage.removeItem('food-city-user')
    }

    return {
        user,
        loading,
        error,
        isLoggedIn,
        displayName,
        login,
        logout,
    }
})
