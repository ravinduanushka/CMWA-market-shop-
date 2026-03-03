<script setup lang="ts">
import type { CategoryInfo } from '../types'

defineProps<{
  categories: CategoryInfo[]
  selectedCategory: string
}>()

const emit = defineEmits<{
  select: [category: string]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      @click="emit('select', '')"
      :class="[
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer',
        selectedCategory === ''
          ? 'bg-primary text-white shadow-md shadow-primary/25'
          : 'bg-border/40 dark:bg-border-dark/60 text-text-muted dark:text-text-muted-dark hover:bg-border dark:hover:bg-border-dark hover:text-text dark:hover:text-text-dark'
      ]"
    >
      🍽️ All
    </button>
    <button
      v-for="cat in categories"
      :key="cat.slug"
      @click="emit('select', cat.slug)"
      :class="[
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize cursor-pointer',
        selectedCategory === cat.slug
          ? 'bg-primary text-white shadow-md shadow-primary/25'
          : 'bg-border/40 dark:bg-border-dark/60 text-text-muted dark:text-text-muted-dark hover:bg-border dark:hover:bg-border-dark hover:text-text dark:hover:text-text-dark'
      ]"
    >
      {{ cat.name }}
    </button>
  </div>
</template>
