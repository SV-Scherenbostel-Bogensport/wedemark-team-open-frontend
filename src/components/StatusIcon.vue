<script lang="ts" setup>
interface Props {
  primaryColor?: string
  secondaryColor?: string
  pulsing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pulsing: false,
})

const getCircleStyle = (color?: string) => {
  return color ? { backgroundColor: color } : {}
}

const getRingingStyle = (color?: string) => {
  return color
    ? {
        backgroundColor: color,
        border: `3px solid ${color}`,
      }
    : {}
}
</script>

<template>
  <div class="ring-container">
    <div class="circle" :style="getCircleStyle(props.primaryColor)" />
    <div
      v-if="props.pulsing && props.secondaryColor"
      class="ringring"
      :style="getRingingStyle(props.secondaryColor)"
    />
  </div>
</template>

<style lang="css">
.ring-container {
  position: relative;
}

.circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.ringring {
  position: absolute;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  animation: pulsate 2s infinite;
  opacity: 0;
}

@keyframes pulsate {
  0% {
    transform: scale(0.1, 0.1);
    opacity: 0;
  }
  40% {
    opacity: 0.85;
  }
  100% {
    transform: scale(1.75, 1.75);
    opacity: 0;
  }
}
</style>
