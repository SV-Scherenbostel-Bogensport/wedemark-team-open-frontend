<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'

interface Props {
  targetCode: string
}

interface Status {
  statusId: number
  label: string
  description: string
  primaryColor: string
  secondaryColor: string
  pulsing: boolean
}

const props = defineProps<Props>()
const status = ref<Status>()
const isLoading = ref<boolean>(false)
const error = ref<boolean>(false)
const refreshInterval = ref<number | null>(null)

const fetchTargetCode = async (): Promise<void> => {
  isLoading.value = true
  error.value = false
  try {
    const response = await axios.get<Status>(`/api/overlays/target/${props.targetCode}/status`)
    status.value = response.data
  } catch (err) {
    console.error('Error loading Teamname:', err)
    error.value = true
  } finally {
    isLoading.value = false
  }
}

// Computed properties for dynamic colors
const primaryColor = computed(() => {
  return status.value?.primaryColor || '#222222'
})

const secondaryColor = computed(() => {
  return status.value?.secondaryColor || '#888888'
})

const isPulsing = computed(() => {
  return status.value?.pulsing || false
})

onMounted(async () => {
  await fetchTargetCode()
  //******Aktualisiere den TargetCode alle 10 Sekunden******
  refreshInterval.value = window.setInterval(fetchTargetCode, 10000)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<template>
  <div class="overlay-container">
    <div
      class="code-box"
      :class="{ pulsing: isPulsing }"
      :style="{
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor,
      }"
    >
      <div class="gradient-border"></div>
      <div class="content" :class="{ pulsing: isPulsing }">
        <span class="code-name translate-y-[-3%]">{{ targetCode }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 500px;
  height: 500px;
  pointer-events: none;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: left;
}

.code-box {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 40px;
  border-radius: 25px;
  overflow: hidden;
  transition:
    --primary-color 0.5s ease,
    --secondary-color 0.5s ease;
}

.gradient-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 25px;
  background: var(--primary-color, #ffffff);
  transition: background 0.5s ease;
}

.gradient-border::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  animation: shimmer 3s linear infinite;
}

.content {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 25px;
  backdrop-filter: blur(10%);
  box-shadow:
    0 0.8% 3% rgba(0, 0, 0, 0.3),
    inset 0 0 4% rgba(255, 255, 255, 0.05);
  border: 10px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.content.pulsing {
  animation: backgroundGlow 2s ease-in-out infinite alternate;
}

.code-name {
  color: white;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  font-size: clamp(250px, 100vw, 250px);
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow:
    0 0 10px var(--primary-color, #ffffff),
    0 0 20px var(--primary-color, #ffffff),
    0 0 30px var(--primary-color, #ffffff),
    0 0 40px var(--primary-color, #ffffff),
    0 0 50px var(--primary-color, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: text-shadow 0.5s ease;
}

.code-box.pulsing .code-name {
  animation: textGlow 2s ease-in-out infinite alternate;
}

/* Animations */
@keyframes shimmer {
  0% {
    transform: translateX(-150%) rotate(45deg);
  }
  100% {
    transform: translateX(150%) rotate(45deg);
  }
}

@keyframes textGlow {
  0% {
    text-shadow:
      0 0 5px var(--primary-color, #ffffff),
      0 0 10px var(--primary-color, #ffffff),
      0 0 15px var(--primary-color, #ffffff),
      0 0 20px var(--primary-color, #ffffff),
      0 0 25px var(--primary-color, #ffffff);
  }
  100% {
    text-shadow:
      0 0 10px var(--primary-color, #ffffff),
      0 0 20px var(--primary-color, #ffffff),
      0 0 30px var(--primary-color, #ffffff),
      0 0 40px var(--primary-color, #ffffff),
      0 0 50px var(--primary-color, #ffffff);
  }
}

@keyframes backgroundGlow {
  0% {
    box-shadow:
      0 0.4% 1.5% rgba(0, 0, 0, 0.3),
      inset 0 0 1% rgba(255, 255, 255, 0.05);
  }
  100% {
    box-shadow:
      0 0.4% 1.5% rgba(0, 0, 0, 0.3),
      inset 0 0 3% rgba(255, 255, 255, 0.1);
  }
}
</style>
