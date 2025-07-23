<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router'
// import logo from '@/assets/img/indi.png'

const isActiveLink = (routePath: string) => {
  const route = useRoute()
  return route.path === routePath
}

const navItems = [
  { label: 'Info', to: '/' },
  { label: 'Zeitplan', to: '/schedule' },
  { label: 'Teams', to: '/attendees' },
  { label: 'Platzierung', to: '/placement' },
  { label: 'Ergebnisse', to: '/results/rounds/1' },
  { label: 'Live', to: '/live', hidden: true },
  { label: 'Fotos', to: '/pictures', hidden: true },
]
</script>

<template>
  <nav class="bg-red-600 py-4 border-t border-b border-red-500">
    <ul class="flex h-5 justify-center items-center">
      <template v-for="(item, index) in navItems.filter((i) => !i.hidden)" :key="index">
        <li>
          <RouterLink
            :to="item.to"
            :class="[
              isActiveLink(item.to) ? 'underline' : 'hover:underline',
              'text-white font-extrabold px-4 py-2 rounded-md uppercase text-lg',
            ]"
          >
            {{ item.label }}
          </RouterLink>
        </li>

        <!-- Trennpunkt zwischen den Einträgen -->
        <li v-if="index !== navItems.filter((i) => !i.hidden).length - 1" aria-hidden="true">
          <span class="text-white select-none">•</span>
        </li>
      </template>
    </ul>
  </nav>
</template>
