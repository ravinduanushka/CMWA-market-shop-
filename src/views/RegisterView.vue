<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { RegistrationData } from '../types'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/')
  }
})

const formData = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const validationError = ref<string | null>(null)


const passwordsMatch = computed(() => {
  if (!formData.value.confirmPassword) return true
  return formData.value.password === formData.value.confirmPassword
})

async function handleRegister() {
  validationError.value = null
  
  if (formData.value.password !== formData.value.confirmPassword) {
    validationError.value = 'Passwords do not match'
    return
  }

  const registrationData: RegistrationData = {
    firstName: formData.value.firstName,
    lastName: formData.value.lastName,
    username: formData.value.username,
    email: formData.value.email,
    password: formData.value.password,
  }

  const success = await authStore.register(registrationData)
  if (success) {
    router.push('/')
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-lg">
      <!-- Card -->
      <div class="rounded-3xl bg-surface-card dark:bg-surface-card-dark border border-border dark:border-border-dark shadow-md p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="flex justify-center mb-3 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 class="text-2xl font-extrabold text-text dark:text-text-dark">Create Account</h1>
          <p class="text-text-muted dark:text-text-muted-dark mt-1">Join CMWA MARKETING STORE Today</p>
        </div>

        <!-- Error message -->
        <div
          v-if="authStore.error || validationError"
          class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
        >
          {{ authStore.error || validationError }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- First Name -->
            <div>
              <label for="firstName" class="block text-sm font-semibold text-text dark:text-text-dark mb-1.5">
                First Name
              </label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                placeholder="Ravindu"
                required
                class="w-full px-4 py-3 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 dark:border-border-dark text-text dark:text-text-dark placeholder-text-muted dark:placeholder-text-muted-dark focus:outline-none focus:border-primary shadow-sm"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label for="lastName" class="block text-sm font-semibold text-text dark:text-text-dark mb-1.5">
                Last Name
              </label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                placeholder="Anushka"
                required
                class="w-full px-4 py-3 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 dark:border-border-dark text-text dark:text-text-dark placeholder-text-muted dark:placeholder-text-muted-dark focus:outline-none focus:border-primary shadow-sm"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-semibold text-text dark:text-text-dark mb-1.5">
              Email Address
            </label>
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted dark:text-text-muted-dark"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="ravindu@example.com"
                required
                class="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 dark:border-border-dark text-text dark:text-text-dark placeholder-text-muted dark:placeholder-text-muted-dark focus:outline-none focus:border-primary shadow-sm"
              />
            </div>
          </div>

          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-semibold text-text dark:text-text-dark mb-1.5">
              Username
            </label>
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted dark:text-text-muted-dark"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                placeholder="ravindu02"
                required
                class="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 dark:border-border-dark text-text dark:text-text-dark placeholder-text-muted dark:placeholder-text-muted-dark focus:outline-none focus:border-primary shadow-sm"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-semibold text-text dark:text-text-dark mb-1.5">
              Password
            </label>
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted dark:text-text-muted-dark"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full pl-11 pr-11 py-3 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 dark:border-border-dark text-text dark:text-text-dark placeholder-text-muted dark:placeholder-text-muted-dark focus:outline-none focus:border-primary shadow-sm"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-text-dark transition-colors cursor-pointer"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-semibold text-text dark:text-text-dark mb-1.5">
              Confirm Password
            </label>
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted dark:text-text-muted-dark"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full pl-11 pr-11 py-3 rounded-xl bg-surface-card dark:bg-surface-card-dark border-2 border-primary/30 dark:border-border-dark text-text dark:text-text-dark placeholder-text-muted dark:placeholder-text-muted-dark focus:outline-none focus:border-primary shadow-sm"
                :class="{ 'ring-2 ring-red-500/50': !passwordsMatch }"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-text-dark transition-colors cursor-pointer"
              >
                <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
            <p v-if="!passwordsMatch" class="mt-1 text-xs text-red-500 font-medium">
              Passwords do not match
            </p>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="authStore.loading || !passwordsMatch"
            class="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            <span v-if="authStore.loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
            <span v-else>Register</span>
          </button>
        </form>


        <!-- Login link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-text-muted dark:text-text-muted-dark">
            Already have an account?
            <router-link
              to="/login"
              class="font-semibold text-primary hover:text-primary-dark transition-colors ml-1"
            >
              Sign In
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
