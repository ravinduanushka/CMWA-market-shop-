<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { LoginCredentials } from '../types'

const router = useRouter()
const authStore = useAuthStore()

const credentials = ref<LoginCredentials>({
  username: '',
  password: '',
})
const showPassword = ref(false)

async function handleLogin() {
  const success = await authStore.login(credentials.value)
  if (success) {
    router.push('/')
  }
}

function fillTestCredentials() {
  credentials.value.username = 'emilys'
  credentials.value.password = 'emilyspass'
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="rounded-3xl bg-surface-card dark:bg-surface-card-dark border border-border dark:border-border-dark shadow-xl shadow-primary/5 dark:shadow-primary/5 p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <span class="text-5xl block mb-3">🍔</span>
          <h1 class="text-2xl font-extrabold text-text dark:text-text-dark">Welcome Back!</h1>
          <p class="text-text-muted dark:text-text-muted-dark mt-1">Sign in to Food City</p>
        </div>

        <!-- Error message -->
        <div
          v-if="authStore.error"
          class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
        >
          {{ authStore.error }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-semibold text-text dark:text-text-dark mb-2">
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
                v-model="credentials.username"
                type="text"
                placeholder="Enter your username"
                required
                class="w-full pl-11 pr-4 py-3 rounded-xl bg-border/30 dark:bg-border-dark/40 text-text dark:text-text-dark placeholder-text-muted dark:placeholder-text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-semibold text-text dark:text-text-dark mb-2">
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
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                required
                class="w-full pl-11 pr-11 py-3 rounded-xl bg-border/30 dark:bg-border-dark/40 text-text dark:text-text-dark placeholder-text-muted dark:placeholder-text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
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

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="authStore.loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Test credentials helper -->
        <div class="mt-6 p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
          <p class="text-xs text-text-muted dark:text-text-muted-dark mb-2">
            💡 <strong>Demo mode:</strong> Use DummyJSON test credentials
          </p>
          <button
            @click="fillTestCredentials"
            class="text-xs font-medium text-primary hover:text-primary-dark transition-colors cursor-pointer"
          >
            Click here to auto-fill test credentials →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
