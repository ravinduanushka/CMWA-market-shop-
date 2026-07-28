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
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border',
        selectedCategory === ''
          ? 'bg-primary text-white border-primary shadow-md shadow-primary/25'
          : 'bg-surface-card dark:bg-surface-card-dark border-primary/30 dark:border-border-dark text-text dark:text-text-dark hover:border-primary hover:shadow-sm'
      ]"
    >
       All
    </button>
    <button
      v-for="cat in categories"
      :key="cat.slug"
      @click="emit('select', cat.slug)"
      :class="[
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize cursor-pointer border',
        selectedCategory === cat.slug
          ? 'bg-primary text-white border-primary shadow-md shadow-primary/25'
          : 'bg-surface-card dark:bg-surface-card-dark border-primary/30 dark:border-border-dark text-text dark:text-text-dark hover:border-primary hover:shadow-sm'
      ]"
    >
      {{ cat.name }}
    </button>
  </div>
</template>
