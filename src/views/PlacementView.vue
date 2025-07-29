<script lang="ts" setup>
import backgroundImage from '@/assets/img/banner.jpg'
import QualificationLeaderboard from '@/components/QualificationLeaderboard.vue'
</script>

<template>
  <div
    class="fixed inset-0 bg-cover bg-center bg-no-repeat brightness-30 blur-sm scale-110 -z-10"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  ></div>

  <QualificationLeaderboard />
</template>
