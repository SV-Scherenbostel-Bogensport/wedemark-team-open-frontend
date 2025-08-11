<script lang="ts" setup>
import { onMounted, reactive, computed } from 'vue'
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

const state = reactive({
  placementResponse: null as PlacementResponse | null,
  isLoading: true,
  error: null as unknown,
})

// Computed properties für bessere Performance
const roundDescription = computed(() => state.placementResponse?.round?.description)

const placements = computed(() => state.placementResponse?.finalPlacements || [])

const fetchPlacement = async (): Promise<void> => {
  state.isLoading = true
  state.error = null
  try {
    const response = await axios.get<PlacementResponse>('/api/placement/final')
    if (response.data && response.data.finalPlacements) {
      state.placementResponse = response.data
    } else {
      throw new Error('Ungültige Datenstruktur erhalten')
    }
  } catch (error) {
    console.error('Error fetching placement:', error)
    state.error = error
  } finally {
    state.isLoading = false
  }
}

const handleRetry = () => {
  fetchPlacement()
}

onMounted(() => {
  fetchPlacement()
})
</script>

<template>
  <div class="pt-16 bg-gray-50 py-8">
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
        <header class="text-center mb-16">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Platzierung der Finalrunde</h1>
          <p v-if="roundDescription" class="text-lg text-gray-600 -mb-4">
            Stand nach der {{ roundDescription }}
          </p>
        </header>

        <!-- Platzierung -->
        <FinalPlacementTable :placements="placements" />

        <!-- Zusätzliche Informationen -->
        <div class="mt-8 text-center text-sm text-gray-500">
          <p v-if="state.placementResponse?.round?.updatedAt" class="mb-2">
            Letztes Änderung:
            {{ new Date(state.placementResponse.round.updatedAt).toLocaleString('de-DE') }}
          </p>
          <p>Stand: {{ new Date().toLocaleString('de-DE') }}</p>
        </div>
      </template>

      <!-- Spacer -->
      <div class="mb-48" />
    </div>
  </div>
</template>
