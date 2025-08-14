<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref, computed } from 'vue'
import MatchInfo from '@/components/MatchInfo.vue'
import axios from 'axios'
import ErrorComponent from '@/components/ErrorComponent.vue'

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

interface Props {
  roundId: string
  refreshInterval?: number // in ms
  autoRefresh?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  refreshInterval: 10000,
  autoRefresh: true,
})

const state = reactive({
  roundInfo: null as RoundInfo | null,
  isLoading: true,
  error: null as unknown,
  lastUpdated: null as Date | null,
})

const pollingTimer = ref<number | null>(null)
const isPollingActive = ref(false)

const fetchData = async (isBackgroundRefresh = false) => {
  if (!isBackgroundRefresh) {
    state.isLoading = true
  }
  state.error = null

  try {
    const roundId = props.roundId

    const [roundResponse, matchesResponse] = await Promise.all([
      axios.get<ApiRoundResponse>(`/api/rounds/${roundId}`),
      axios.get<ApiMatchesResponse>(`/api/rounds/${roundId}/matches`),
    ])

    const newData: RoundInfo = {
      ...roundResponse.data,
      matchIds: matchesResponse.data.matchIds,
    }

    const hasChanged =
      !state.roundInfo || JSON.stringify(state.roundInfo) !== JSON.stringify(newData)

    if (hasChanged) {
      state.roundInfo = newData
      state.lastUpdated = new Date()
      console.log('Match data updated at:', state.lastUpdated.toLocaleTimeString())
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    state.error = error
    stopPolling()
  } finally {
    if (!isBackgroundRefresh) {
      state.isLoading = false
    }
  }
}

const startPolling = () => {
  if (isPollingActive.value) return
  isPollingActive.value = true
  pollingTimer.value = window.setInterval(() => {
    fetchData(true)
  }, props.refreshInterval)
  console.log(`Polling started with ${props.refreshInterval}ms interval`)
}

const stopPolling = () => {
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value)
    pollingTimer.value = null
  }
  isPollingActive.value = false
  console.log('Polling stopped')
}

const toggleAutoUpdate = () => {
  if (isPollingActive.value) {
    stopPolling()
  } else {
    startPolling()
  }
}

const handleRetry = () => {
  fetchData()
  if (props.autoRefresh && !isPollingActive.value) {
    startPolling()
  }
}

onMounted(async () => {
  await fetchData()
  if (props.autoRefresh) {
    startPolling()
  }
})

onUnmounted(() => {
  stopPolling()
})

defineExpose({
  refresh: fetchData,
  startPolling,
  stopPolling,
  toggleAutoUpdate,
  isPollingActive: computed(() => isPollingActive.value),
})
</script>

<template>
  <!-- Header -->
  <header class="text-center mt-12 mb-8">
    <h1 v-if="!state.isLoading && !state.error" class="text-4xl font-bold text-white mb-2">
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
      <!-- Wenn Auto-Update inaktiv => 0 -->
      <MatchInfo :matchId="matchId" :auto-refresh="isPollingActive ? 5 : 0" />
    </div>
  </template>

  <!-- Status Bar -->
  <div
    v-if="!state.isLoading && !state.error"
    class="flex justify-center items-center space-x-4 text-sm text-gray-300 mt-8"
  >
    <div
      class="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors"
      @click="toggleAutoUpdate"
    >
      <div
        :class="[
          'w-2 h-2 rounded-full',
          isPollingActive ? 'bg-green-400 animate-pulse' : 'bg-red-600',
        ]"
      />
      <span>
        {{ isPollingActive ? 'Auto-Update aktiv' : 'Auto-Update inaktiv' }}
      </span>
    </div>

    <div v-if="state.lastUpdated" class="flex items-center space-x-2">
      <i class="pi pi-clock" />
      <span> Zuletzt aktualisiert: {{ state.lastUpdated.toLocaleTimeString('de-DE') }} </span>
    </div>
  </div>
</template>
