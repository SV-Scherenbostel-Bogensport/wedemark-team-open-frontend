<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, computed, ref } from 'vue'
import axios from 'axios'
import ErrorComponent from '@/components/ErrorComponent.vue'
import KnockOutTreeTable from './KnockOutTreeTable.vue'

interface TreePlacementResponse {
  rounds: Round[]
  matches: TreeMatch[]
}

interface Round {
  roundId: number
  status: Status
  description: string
  isKnockOut: boolean
}

interface Status {
  label: string
  description?: string
  primaryColor?: string
  secondaryColor?: string
  pulsing: boolean
}

interface TreeMatch {
  matchId: number
  status: Status
  description: string
  team1targetCode: string
  team2targetCode: string
  team1Name: string
  team2Name: string
  team1MatchPoints: 6
  team2MatchPoints: 0
}

// Props für Konfiguration
interface Props {
  refreshInterval?: number // in Millisekunden, default: 30 Sekunden
  autoRefresh?: boolean // default: true
}

const props = withDefaults(defineProps<Props>(), {
  refreshInterval: 10000,
  autoRefresh: true,
})

const state = reactive({
  placementResponse: null as TreePlacementResponse | null,
  isLoading: true,
  error: null as unknown,
  lastUpdated: null as Date | null,
})

// Ref für den Polling-Timer
const pollingTimer = ref<number | null>(null)
const isPollingActive = ref(false)

// Computed properties für bessere Performance
const placements = computed(() => state.placementResponse || { rounds: [], matches: [] })

const fetchPlacement = async (isBackgroundRefresh = false): Promise<void> => {
  // Bei Background-Refresh den Loading-State nicht ändern
  if (!isBackgroundRefresh) {
    state.isLoading = true
  }
  state.error = null

  try {
    const response = await axios.get<TreePlacementResponse>('/api/placement/tree')
    if (response.data && response.data.rounds && response.data.matches) {
      // Nur updaten wenn sich die Daten tatsächlich geändert haben
      const hasChanged =
        !state.placementResponse ||
        JSON.stringify(state.placementResponse) !== JSON.stringify(response.data)

      if (hasChanged) {
        state.placementResponse = response.data
        state.lastUpdated = new Date()
        console.log('Placement data updated at:', state.lastUpdated.toLocaleTimeString())
      }
    } else {
      throw new Error('Ungültige Datenstruktur erhalten')
    }
  } catch (error) {
    console.error('Error fetching placement:', error)
    state.error = error
    // Bei Fehlern stoppen wir das Polling
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
    fetchPlacement(true) // Background refresh
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

// Neue Toggle-Funktion
const toggleAutoUpdate = () => {
  if (isPollingActive.value) {
    stopPolling()
  } else {
    startPolling()
  }
}

const handleRetry = () => {
  fetchPlacement()
  // Polling nach erfolgreicher Wiederherstellung wieder starten
  if (props.autoRefresh && !isPollingActive.value) {
    startPolling()
  }
}

const handleManualRefresh = () => {
  fetchPlacement(false)
}

// Lifecycle hooks
onMounted(async () => {
  await fetchPlacement()
  if (props.autoRefresh) {
    startPolling()
  }
})

onUnmounted(() => {
  stopPolling()
})

// Expose functions für Parent-Komponenten
defineExpose({
  refresh: handleManualRefresh,
  startPolling,
  stopPolling,
  toggleAutoUpdate,
  isPollingActive: computed(() => isPollingActive.value),
})
</script>

<template>
  <div class="pt-2 py-8">
    <div class="px-12">
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
          toast-message="Rangliste konnten nicht geladen werden"
          :show-details="true"
          :show-retry="true"
          @retry="handleRetry"
        />
      </template>

      <!--* Success State *-->
      <template v-else>
        <!-- Tree -->
        <KnockOutTreeTable :placements="placements" />

        <!-- Status Bar -->
        <div class="flex justify-center items-center space-x-4 text-sm text-gray-300 mt-18">
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

          <!-- <div v-if="state.placementResponse?.round?.updatedAt" class="flex items-center space-x-2">
            <i class="pi pi-pen-to-square" />
            <span>
              Letzte Änderung:
              {{ new Date(state.placementResponse.round.updatedAt).toLocaleString('de-DE') }}
            </span>
          </div> -->
        </div>
      </template>
    </div>
  </div>
</template>
