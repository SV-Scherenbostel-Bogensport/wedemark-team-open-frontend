<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  // Prüfen ob es eine vorherige Seite gibt
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    // Fallback zur Startseite wenn keine History vorhanden
    router.push('/')
  }
}
</script>

<template>
  <section class="text-center flex flex-col justify-center items-center h-96">
    <i class="pi pi-exclamation-triangle text-red-500 text-7xl mb-5"></i>
    <h1 class="text-6xl font-bold mb-4">404 Not Found</h1>
    <p class="text-xl mb-5">This page does not exist</p>

    <div class="flex gap-4 mt-4">
      <button
        @click="goBack"
        class="text-white bg-red-600 hover:bg-red-700 rounded-md px-3 py-2 transition-colors"
      >
        <i class="pi pi-arrow-left mr-2"></i>
        Go Back
      </button>

      <RouterLink
        to="/"
        class="text-white bg-gray-600 hover:bg-gray-700 rounded-md px-3 py-2 transition-colors"
      >
        <i class="pi pi-home mr-2"></i>
        Home
      </RouterLink>
    </div>
  </section>
</template>
