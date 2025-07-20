<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { reactive, computed } from 'vue'
import RoundInfo from '@/components/RoundInfo.vue'
import PageButton from '@/components/PageButton.vue'

const route = useRoute()

const idParam = route.params.id
const id = Number(Array.isArray(idParam) ? idParam[0] : idParam)

const hideButtons = computed(() => 'hide-buttons' in route.query)

const state = reactive({
  roundId: id,
  prevRoundId: id - 1,
  nextRoundId: id + 1,
})
</script>

<template>
  <PageButton v-if="!hideButtons" :url="state.prevRoundId.toString()" position="left">
    <i class="pi pi-arrow-left" aria-hidden="true"></i
  ></PageButton>

  <RoundInfo :round-id="state.roundId.toString()" />

  <PageButton v-if="!hideButtons" :url="state.nextRoundId.toString()" position="right">
    <i class="pi pi-arrow-right" aria-hidden="true"></i
  ></PageButton>
</template>
