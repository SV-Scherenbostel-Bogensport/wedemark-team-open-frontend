<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, computed, ref } from 'vue'
import axios from 'axios'
import ErrorComponent from '@/components/ErrorComponent.vue'
import FinalPlacementTable from './FinalPlacementTable.vue'

interface PlacementRound {
  roundId: number
  description: string
  isKnockOut: boolean
  updatedAt: string
}

interface FinalPlacement {
  place: number | null
  qualificationPlace: number | null
  team: Team
  totalMatchPoints: Points
  totalSetPoints: Points
  lives: number
  averageSetScore: number
}

interface Team {
  teamId: number
  name: string
}

interface Points {
  won: number
  lost: number
}

interface PlacementResponse {
  round: PlacementRound
  finalPlacements: FinalPlacement[]
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
  placementResponse: null as PlacementResponse | null,
  isLoading: true,
  error: null as unknown,
  lastUpdated: null as Date | null,
})

// Ref für den Polling-Timer
const pollingTimer = ref<number | null>(null)
const isPollingActive = ref(false)

// Computed properties für bessere Performance
const roundDescription = computed(() => state.placementResponse?.round?.description)
const placements = computed(() => state.placementResponse?.finalPlacements || [])

const fetchPlacement = async (isBackgroundRefresh = false): Promise<void> => {
  // Bei Background-Refresh den Loading-State nicht ändern
  if (!isBackgroundRefresh) {
    state.isLoading = true
  }
  state.error = null

  try {
    const response = await axios.get<PlacementResponse>('/api/placement/final')
    if (response.data && response.data.finalPlacements) {
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
  <!-- bg-gray-50 -->
  <div class="pt-16 py-8">
    <div class="container mx-auto px-4">
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
        <!-- Rundeninformation -->
        <header class="text-center mb-8">
          <!-- text-gray-900 -->
          <h1 class="text-4xl font-bold text-white mb-2">Platzierung der Finalrunde</h1>
          <p class="text-lg text-gray-200">
            Stand nach der {{ roundDescription ? roundDescription : 'Qualifikationsrunde' }}
          </p>
        </header>

        <!-- Platzierung -->
        <FinalPlacementTable :placements="placements" />

        <!-- Status Bar -->
        <!-- Todo: Als eigenes View -->
        <div class="flex justify-center items-center space-x-4 text-sm text-gray-300 mt-8">
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
