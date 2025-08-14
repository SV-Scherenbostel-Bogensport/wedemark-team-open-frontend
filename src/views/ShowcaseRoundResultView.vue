<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import RoundInfo from '@/components/RoundInfo.vue'
import backgroundImage from '@/assets/img/banner.jpg'

const route = useRoute()
const roundId = ref<number | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Intervall-Konfiguration (in Millisekunden)
const RELOAD_INTERVAL = 5000 // 5 Sekunden
let intervalId: number | null = null

//* Funktion zum Laden der aktuellen Runde von der API*
const loadCurrentRound = async (): Promise<number> => {
  try {
    let url = '/api/rounds/active'

    // Prüfen, ob in der URL direction gesetzt ist
    const directionParam = route.query.direction
    if (directionParam) {
      // Normalisieren auf Uppercase, falls API das erwartet
      url += `?direction=${String(directionParam).toUpperCase()}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data.roundId
  } catch (err) {
    throw new Error(`Fehler beim Laden der aktuellen Runde: ${err}`)
  }
}

//* Funktion zum Setzen der Round ID*
const setRoundId = async (showLoader = true) => {
  if (showLoader) {
    loading.value = true
  }
  error.value = null

  try {
    //* Prüfe Query Parameter*
    const queryRound = route.query.round
    if (queryRound) {
      //* Query Parameter vorhanden - verwende diesen (nur beim initialen Laden)*
      const parsedRound = Number(queryRound)
      if (isNaN(parsedRound) || parsedRound <= 0) {
        throw new Error('Ungültiger round Parameter')
      }
      roundId.value = parsedRound
    } else {
      //* Kein Query Parameter - lade von API*
      const newRoundId = await loadCurrentRound()

      // Prüfe ob sich die Round ID geändert hat
      if (roundId.value !== newRoundId) {
        console.log(`Round ID geändert: ${roundId.value} → ${newRoundId}`)
        roundId.value = newRoundId
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('Fehler beim Setzen der Round ID:', err)
  } finally {
    if (showLoader) {
      loading.value = false
    }
  }
}

//* Funktion für Auto-Reload (immer von API laden)*
const autoReloadRound = async () => {
  try {
    const newRoundId = await loadCurrentRound()

    // Prüfe ob sich die Round ID geändert hat
    if (roundId.value !== newRoundId) {
      console.log(`Round ID geändert: ${roundId.value} → ${newRoundId}`)
      roundId.value = newRoundId
    }
  } catch (err) {
    console.error('Fehler beim Auto-Reload der Round ID:', err)
  }
}

//* Funktion zum Starten des Auto-Reload*
const startAutoReload = () => {
  // Stoppe vorhandenes Intervall falls vorhanden
  if (intervalId) {
    clearInterval(intervalId)
  }

  // Auto-reload nur wenn kein Query Parameter gesetzt ist
  if (!route.query.round) {
    intervalId = setInterval(() => {
      autoReloadRound()
    }, RELOAD_INTERVAL)
  }
}

//* Funktion zum Stoppen des Auto-Reload*
const stopAutoReload = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

//* Initial laden*
onMounted(() => {
  setRoundId()
  startAutoReload()
})

//* Cleanup beim Unmount*
onUnmounted(() => {
  stopAutoReload()
})

//* Reaktion auf Route-Änderungen*
watch(
  () => route.query.round,
  () => {
    setRoundId()
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
        :toast-message="`Runde konnte nicht ermittelt werden`"
        :show-details="true"
        :show-retry="true"
      />
    </template>

    <!--** RoundInfo Component **-->
    <RoundInfo v-else-if="roundId" :round-id="roundId.toString()" :key="roundId" />
  </div>
</template>
