<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router'
// import logo from '@/assets/img/indi.png'

const isActiveLink = (routePath: string) => {
  const route = useRoute()
  return route.path === routePath
}
</script>

<template>
  <nav class="bg-red-700 border-b border-red-500">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-15 items-center justify-between">
        <div class="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
          <!-- Logo -->
          <RouterLink class="flex flex-shrink-0 items-center mr-4" to="/">
            <span class="hidden md:block text-white text-2xl font-bold ml-2">
              Schützenverein Scherenbostel
            </span>
            <!-- <img class="h-10 ml-1 w-auto" :src="logo" alt="Vue Jobs" /> -->
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
