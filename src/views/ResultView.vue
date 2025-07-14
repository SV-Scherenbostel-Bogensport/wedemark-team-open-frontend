<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import MatchInfo from '@/components/MatchInfo.vue'
import axios from 'axios'
import ErrorComponent from '@/components/ErrorComponent.vue'

const route = useRoute()

interface RoundInfo {
  roundId: number
  statusId: number
  description: string
  isKnockOut: boolean
  matchIds: number[]
}

interface ApiRoundResponse {
  roundId: number
  statusId: number
  description: string
  isKnockOut: boolean
}

interface ApiMatchesResponse {
  matchIds: number[]
}

const state = reactive({
  roundInfo: null as RoundInfo | null,
  isLoading: true,
  error: null as unknown,
})

const fetchData = async () => {
  state.isLoading = true
  state.error = null

  try {
    const roundId = route.params.id

    const [roundResponse, matchesResponse] = await Promise.all([
      axios.get<ApiRoundResponse>(`/api/rounds/${roundId}`),
      axios.get<ApiMatchesResponse>(`/api/rounds/${roundId}/matches`),
    ])

    state.roundInfo = {
      ...roundResponse.data,
      matchIds: matchesResponse.data.matchIds,
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    state.error = error
  } finally {
    state.isLoading = false
  }
}

const handleRetry = () => {
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <!-- Header -->
  <header class="text-center mt-12 mb-8">
    <h1 v-if="!state.isLoading && !state.error" class="text-4xl font-bold text-gray-900 mb-2">
      {{ state.roundInfo?.description }}
    </h1>
  </header>

  <!--* Loading State *-->
  <template v-if="state.isLoading">
    <div class="flex justify-center items-center py-12">
      <VueSpinner size="60" color="red" />
    </div>
  </template>

  <!--* Error State *-->
  <template v-else-if="state.error">
    <ErrorComponent
      :error="state.error"
      toast-message="Matchergebnisse konnten nicht geladen werden"
      :show-details="true"
      :show-retry="true"
      @retry="handleRetry"
    />
  </template>

  <!--* Success State - Match Infos *-->
  <template v-else>
    <div v-for="matchId in state.roundInfo?.matchIds" :key="matchId">
      <div class="mt-5" />
      <MatchInfo :matchId="matchId" />
    </div>
  </template>
</template>
