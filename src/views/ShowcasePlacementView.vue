<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import backgroundImage from '@/assets/img/banner.jpg'
import QualificationLeaderboard from '@/components/QualificationLeaderboard.vue'
import FinalLeaderboard from '@/components/FinalLeaderboard.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'

interface CurrentRoundResponse {
  roundId: number
  description: string
  isKnockOut: boolean
  statusId: number
  updatedAt: string
}

const route = useRoute()
const currentRound = ref<CurrentRoundResponse | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Intervall-Konfiguration (in Millisekunden)
const RELOAD_INTERVAL = 5000 // 5 Sekunden
let intervalId: number | null = null

//* Funktion zum Laden der aktuellen Runde von der API*
const loadCurrentRound = async (): Promise<CurrentRoundResponse> => {
  try {
    let response = await fetch('/api/rounds/active?direction=CURRENT')
    if (response.status === 404) {
      response = await fetch('/api/rounds/active?direction=LAST')
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (err) {
    throw new Error(`Fehler beim Laden der aktuellen Runde: ${err}`)
  }
}

//* Computed property für Leaderboard-Typ*
const leaderboardType = computed(() => {
  // Query Parameter haben Priorität
  if (route.query.qualification !== undefined) {
    return 'qualification'
  }
  if (route.query.final !== undefined) {
    return 'final'
  }

  // Fallback auf API-Response
  if (currentRound.value) {
    return currentRound.value.isKnockOut ? 'final' : 'qualification'
  }

  return null
})

//* Funktion zum Setzen der Round Data*
const setRoundData = async (showLoader = true) => {
  if (showLoader) {
    loading.value = true
  }
  error.value = null

  try {
    // Wenn Query Parameter gesetzt sind, brauchen wir die API nicht
    if (route.query.qualification !== undefined || route.query.final !== undefined) {
      // Query Parameter vorhanden - verwende diese
      console.log(`Using query parameter: ${leaderboardType.value}`)
    } else {
      // Kein Query Parameter - lade von API
      const newRoundData = await loadCurrentRound()

      // Prüfe ob sich die Round Data geändert hat
      if (
        !currentRound.value ||
        currentRound.value.roundId !== newRoundData.roundId ||
        currentRound.value.isKnockOut !== newRoundData.isKnockOut
      ) {
        console.log(`Round data changed:`, newRoundData)
        currentRound.value = newRoundData
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('Fehler beim Setzen der Round Data:', err)
  } finally {
    if (showLoader) {
      loading.value = false
    }
  }
}

//* Funktion für Auto-Reload (nur wenn keine Query Parameter)*
const autoReloadRound = async () => {
  // Auto-reload nur wenn keine Query Parameter gesetzt sind
  if (route.query.qualification !== undefined || route.query.final !== undefined) {
    return
  }

  try {
    const newRoundData = await loadCurrentRound()

    // Prüfe ob sich die Round Data geändert hat
    if (
      !currentRound.value ||
      currentRound.value.roundId !== newRoundData.roundId ||
      currentRound.value.isKnockOut !== newRoundData.isKnockOut
    ) {
      console.log(`Auto-reload: Round data changed:`, newRoundData)
      currentRound.value = newRoundData
    }
  } catch (err) {
    console.error('Fehler beim Auto-Reload der Round Data:', err)
  }
}

//* Funktion zum Starten des Auto-Reload*
const startAutoReload = () => {
  // Stoppe vorhandenes Intervall falls vorhanden
  if (intervalId) {
    clearInterval(intervalId)
  }

  // Auto-reload nur wenn keine Query Parameter gesetzt sind
  if (route.query.qualification === undefined && route.query.final === undefined) {
    intervalId = setInterval(() => {
      autoReloadRound()
    }, RELOAD_INTERVAL)
    console.log('Auto-reload started')
  } else {
    console.log('Auto-reload skipped due to query parameters')
  }
}

//* Funktion zum Stoppen des Auto-Reload*
const stopAutoReload = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
    console.log('Auto-reload stopped')
  }
}

//* Retry-Handler für Error Component*
const handleRetry = () => {
  setRoundData()
  startAutoReload()
}

//* Initial laden*
onMounted(() => {
  setRoundData()
  startAutoReload()
})

//* Cleanup beim Unmount*
onUnmounted(() => {
  stopAutoReload()
})

//* Reaktion auf Route-Änderungen*
watch(
  () => [route.query.qualification, route.query.final],
  () => {
    console.log('Query parameters changed')
    setRoundData()
    startAutoReload()
  },
)
</script>

<template>
  <div
    class="fixed inset-0 bg-cover bg-center bg-no-repeat brightness-30 blur-sm scale-110 -z-10"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  ></div>

  <div class="min-h-screen place-content-center -mt-12">
    <!--* Loading State *-->
    <template v-if="loading">
      <div class="flex justify-center items-center py-12">
        <VueSpinnerBall size="60" color="red" />
      </div>
    </template>

    <!--* Error State *-->
    <template v-else-if="error">
      <ErrorComponent
        :error="error"
        :toast-message="`Leaderboard konnte nicht geladen werden`"
        :show-details="true"
        :show-retry="true"
        @retry="handleRetry"
      />
    </template>

    <!--* Leaderboard Components *-->
    <template v-else-if="leaderboardType">
      <!-- Qualification Leaderboard -->
      <QualificationLeaderboard v-if="leaderboardType === 'qualification'" />

      <!-- Final Leaderboard -->
      <FinalLeaderboard v-else-if="leaderboardType === 'final'" />
    </template>
  </div>
</template>
