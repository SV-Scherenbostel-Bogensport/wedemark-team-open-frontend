<script lang="ts" setup>
import backgroundImage from '@/assets/img/banner.jpg'
import KnockOutTree from '@/components/KnockOutTree.vue'
</script>

<template>
  <div
    class="fixed inset-0 bg-cover bg-center bg-no-repeat brightness-50 blur-sm scale-110 -z-10"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  ></div>

  <div class="min-h-screen flex items-center justify-center">
    <KnockOutTree />
  </div>
</template>
