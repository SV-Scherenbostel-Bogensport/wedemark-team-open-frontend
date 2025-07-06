<script lang="ts" setup>
import { RouterLink } from 'vue-router'

interface Props {
  errorCode?: string | number
  errorMessage?: string
  showRetry?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  errorCode: 'Error',
  errorMessage: 'Ein Fehler ist aufgetreten',
  showRetry: true,
})

const emit = defineEmits<{
  retry: []
}>()

const goBack = () => {
  window.history.back()
}

const handleRetry = () => {
  emit('retry')
}
</script>

<template>
  <section class="flex justify-center items-center h-96">
    <div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl w-full mx-4 text-center">
      <i class="pi pi-exclamation-triangle text-red-500 text-7xl mb-5"></i>
      <h1 class="text-4xl font-bold mb-4 text-red-800">{{ props.errorCode }}</h1>
      <p class="text-lg mb-6 text-red-700">{{ props.errorMessage }}</p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          v-if="props.showRetry"
          @click="handleRetry"
          class="text-white bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2 transition-colors flex items-center justify-center"
        >
          <i class="pi pi-refresh mr-2"></i>
          Erneut versuchen
        </button>
        <button
          @click="goBack"
          class="text-white bg-red-600 hover:bg-red-700 rounded-md px-4 py-2 transition-colors flex items-center justify-center"
        >
          <i class="pi pi-arrow-left mr-2"></i>
          Zurück
        </button>
        <RouterLink
          to="/"
          class="text-white bg-gray-600 hover:bg-gray-700 rounded-md px-4 py-2 transition-colors flex items-center justify-center"
        >
          <i class="pi pi-home mr-2"></i>
          Startseite
        </RouterLink>
      </div>
    </div>
  </section>
</template>
