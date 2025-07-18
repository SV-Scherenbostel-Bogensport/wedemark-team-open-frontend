<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

interface Props {
  targetCode: string
}

const props = defineProps<Props>()
const teamName = ref<string>('')
const isLoading = ref<boolean>(false)
const error = ref<boolean>(false)
const errorMessage = ref<string>('')
const refreshInterval = ref<number | null>(null)

const fetchTeamName = async (): Promise<void> => {
  isLoading.value = true
  error.value = false

  try {
    const response = await axios.get<{ teamname: string }>(
      `/api/overlays/target/${props.targetCode}/teamname`,
    )
    teamName.value = response.data.teamname
    errorMessage.value = ''
  } catch (err) {
    console.error('Error loading Teamname:', err)
    error.value = true
    teamName.value = ''

    // Fehlerbehandlung für verschiedene Fehlertypen
    if (axios.isAxiosError(err)) {
      if (err.response) {
        // Server hat mit einem Fehlercode geantwortet
        const statusCode = err.response.status
        const responseData = err.response.data

        if (responseData && responseData.message) {
          errorMessage.value = responseData.message
        } else if (responseData && responseData.error) {
          errorMessage.value = responseData.error
        } else {
          errorMessage.value = `HTTP ${statusCode}: ${err.response.statusText}`
        }
      } else if (err.request) {
        // Anfrage wurde gesendet, aber keine Antwort erhalten
        errorMessage.value = 'Keine Antwort vom Server erhalten'
      } else {
        // Fehler beim Einrichten der Anfrage
        errorMessage.value = err.message || 'Unbekannter Netzwerkfehler'
      }
    } else {
      // Nicht-Axios Fehler
      errorMessage.value = err instanceof Error ? err.message : 'Unbekannter Fehler'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchTeamName()
  //***Aktualisiere den Teamnamen alle 10 Sekunden***
  refreshInterval.value = window.setInterval(fetchTeamName, 10000)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<template>
  <div class="overlay-container">
    <div class="team-box" v-if="teamName && !error">
      <span class="team-name">{{ teamName }}</span>
    </div>
    <div class="team-box error" v-else-if="error || isLoading">
      <span class="team-name">{{ errorMessage || 'Fehler beim Laden der Daten' }}</span>
    </div>
  </div>
</template>

<style scoped>
.overlay-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 1000px;
  height: 150px;
  pointer-events: none;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: left;
}

.team-box {
  /* min-width: 500px; */
  max-width: 980px;
  height: 130px;
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 6px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0.4vh 1.5vh rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 10px;
  padding: 2em;
  box-sizing: border-box;
  transition:
    width 0.5s ease,
    padding 0.5s ease;
  overflow: hidden;
}

.team-box.error {
  background-color: rgba(200, 0, 0, 0.75);
  border-color: rgba(255, 0, 0, 0.3);
}

.team-box.loading {
  background-color: rgba(0, 0, 200, 0.75);
  border-color: rgba(0, 0, 255, 0.3);
}

.team-name {
  color: white;
  font-weight: bold;
  display: block;
  font-size: 3em;
  line-height: 1;
  transition: font-size 0.4s ease;
}

.team-box.error .team-name {
  font-size: x-large;
}

/*** Animation für smooth appearance ***/
.team-box {
  opacity: 0;
  animation: slideIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
