<template>
  <div class="overlay-container">
    <div class="team-box" v-if="teamName">
      <span class="team-name">{{ teamName }}</span>
    </div>
    <div class="team-box loading" v-else-if="isLoading">
      <span class="team-name">Lädt...</span>
    </div>
    <div class="team-box error" v-else-if="error">
      <span class="team-name">Fehler beim Laden</span>
    </div>
  </div>
</template>

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
const refreshInterval = ref<number | null>(null)

const fetchTeamName = async (): Promise<void> => {
  isLoading.value = true
  error.value = false

  try {
    const response = await axios.get<{ teamname: string }>(
      `/api/overlays/target/${props.targetCode}/teamname`,
    )
    teamName.value = response.data.teamname
  } catch (err) {
    console.error('Error loading Teamname:', err)
    error.value = true
    teamName.value = ''
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchTeamName()
  //Aktualisiere den Teamnamen alle 5 Sekunden
  refreshInterval.value = window.setInterval(fetchTeamName, 5000)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<style scoped>
.overlay-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
}

/* Verschiedene Positionierungsoptionen */
.team-box {
  position: absolute;
  /* Responsive Positionierung basierend auf Viewport */
  top: 3vh;
  left: 3vw;

  /* Alternative Positionen (auskommentiert): */
  /* Oben rechts: top: 3vh; right: 3vw; */
  /* Unten links: bottom: 3vh; left: 3vw; */
  /* Unten rechts: bottom: 3vh; right: 3vw; */
  /* Zentriert oben: top: 3vh; left: 50%; transform: translateX(-50%); */

  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 1vw;
  padding: 1.5vh 2.5vw;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0.4vh 1.5vh rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  min-width: 15vw;
  min-height: 6vh;
  max-width: 40vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-box.loading {
  background-color: rgba(0, 0, 0, 0.5);
}

.team-box.error {
  background-color: rgba(139, 0, 0, 0.7);
  border-color: rgba(255, 0, 0, 0.3);
}

.team-name {
  color: white;
  font-family: 'Arial', sans-serif;
  font-size: 2.5vh;
  font-weight: bold;
  text-shadow: 0.2vh 0.2vh 0.4vh rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  display: block;
}

/* Responsive Design basierend auf Viewport */
@media (min-width: 1920px) {
  .team-box {
    min-width: 18vw;
    min-height: 7vh;
    padding: 2vh 3vw;
    border-radius: 1.2vw;
  }

  .team-name {
    font-size: 3vh;
  }
}

@media (max-width: 1280px) {
  .team-box {
    top: 2vh;
    left: 2vw;
    padding: 1vh 2vw;
    min-width: 12vw;
    min-height: 5vh;
    border-radius: 0.8vw;
  }

  .team-name {
    font-size: 2vh;
  }
}

@media (max-width: 768px) {
  .team-box {
    top: 1.5vh;
    left: 1.5vw;
    padding: 1vh 1.5vw;
    min-width: 20vw;
    min-height: 4vh;
    border-radius: 0.6vw;
  }

  .team-name {
    font-size: 1.8vh;
  }
}

/* Animation für smooth appearance */
.team-box {
  opacity: 0;
  transform: translateY(-10px);
  animation: slideIn 0.5s ease forwards;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
