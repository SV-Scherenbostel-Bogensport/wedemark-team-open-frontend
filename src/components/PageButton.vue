<template>
  <a
    :href="url"
    target="_self"
    class="z-9999 fixed top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-gray-600 text-white flex items-center justify-center text-xl hover:bg-gray-500 transition duration-200 shadow-lg"
    :class="position === 'left' ? 'left-48' : 'right-48'"
  >
    <slot />
  </a>
</template>

<script lang="ts" setup>
defineProps({
  url: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    validator: (value) => ['left', 'right'].includes(value as string),
    required: true,
  },
})
</script>
