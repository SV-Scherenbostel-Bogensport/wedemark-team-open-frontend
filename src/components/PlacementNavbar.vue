<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router'

const isActiveLink = (routePath: string) => {
  const route = useRoute()
  return route.path === routePath
}

const navItems = [
  { label: 'Qualifikationsrunde', to: '/placement/qualification', hidden: false},
  { label: 'Finalrunde', to: '/placement/final', hidden: false },
]
</script>

<template>
  <nav class="bg-zinc-100 py-4 border-b border-zinc-200">
    <ul class="flex h-3 justify-center items-center">
      <template v-for="(item, index) in navItems.filter((i) => !i.hidden)" :key="index">
        <li>
          <RouterLink
            :to="item.to"
            :class="[
              isActiveLink(item.to) ? 'underline' : 'hover:underline',
              'text-red-600 font-extrabold px-4 py-2 rounded-md uppercase text-lg',
            ]"
          >
            {{ item.label }}
          </RouterLink>
        </li>

        <!-- Trennpunkt zwischen den Einträgen -->
        <li v-if="index !== navItems.filter((i) => !i.hidden).length - 1" aria-hidden="true">
          <span class="text-red-600 select-none">•</span>
        </li>
      </template>
    </ul>
  </nav>
</template>
