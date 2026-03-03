<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const emit = defineEmits<{
  searched: []
}>()

const router = useRouter()
const route = useRoute()
const query = ref((route.query.q as string) || '')

function handleSearch() {
  const trimmed = query.value.trim()
  router.push({ path: '/', query: trimmed ? { q: trimmed } : {} })
  emit('searched')
}

function clearSearch() {
  query.value = ''
  router.push({ path: '/' })
  emit('searched')
}
</script>

<template>
  <form @submit.prevent="handleSearch" class="relative w-full">
    <div class="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-text-muted-dark"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
      >
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        v-model="query"
        type="text"
        placeholder="Search food, groceries, snacks..."
        class="w-full pl-10 pr-10 py-2.5 rounded-full bg-border/40 dark:bg-border-dark/60 text-text dark:text-text-dark placeholder-text-muted dark:placeholder-text-muted-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
      />
      <button
        v-if="query"
        type="button"
        @click="clearSearch"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-text-dark transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </form>
</template>
