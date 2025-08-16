<script lang="ts" setup>
import { watch, nextTick, onMounted, onUpdated } from 'vue'

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

interface BgStyle {
  backgroundColor: string
  borderColor: string
  [key: `--${string}`]: string
}

interface Props {
  placements: TreePlacementResponse
}

const props = defineProps<Props>()

// Hilfsfunktion um ein Match anhand der ID zu finden
function getMatchById(matchId: number): TreeMatch | null {
  const match = props.placements.matches.find((m) => m.matchId === matchId)
  return match || null
}

function getRoundById(roundId: number): Round | null {
  const round = props.placements.rounds.find((m) => m.roundId === roundId)
  return round || null
}

// Hauptfunktion für Hintergrund-Styles
function getBgClass(roundId: number): BgStyle {
  const round = getRoundById(roundId)
  if (!round?.status?.primaryColor) {
    return {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderColor: 'rgba(0, 0, 0, 1)',
    } // Fallback
  }

  return {
    backgroundColor: hexToRgba(round.status.primaryColor, 0.6),
    borderColor: round.status.primaryColor,
  }
}

// Konvertiert Hex-Farbe zu rgba mit Alpha-Wert
function hexToRgba(hex: string, alpha: number = 1): string {
  if (!hex) return `rgba(0, 0, 0, ${alpha})`

  // Entferne # falls vorhanden
  const cleanHex: string = hex.replace('#', '')

  // Unterstütze sowohl 3-stellige als auch 6-stellige Hex-Werte
  let r: number, g: number, b: number

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16)
    g = parseInt(cleanHex[1] + cleanHex[1], 16)
    b = parseInt(cleanHex[2] + cleanHex[2], 16)
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.slice(0, 2), 16)
    g = parseInt(cleanHex.slice(2, 4), 16)
    b = parseInt(cleanHex.slice(4, 6), 16)
  } else {
    return `rgba(0, 0, 0, ${alpha})` // Fallback
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function initScrollingText(): void {
  // Warte bis CSS geladen ist
  setTimeout(() => {
    const containers: NodeListOf<HTMLElement> = document.querySelectorAll('.scrollable')

    containers.forEach((container: HTMLElement) => {
      const textElement: HTMLElement | null = container.querySelector('.scrollable-text')

      if (!textElement) return // Null-Check

      //* Reset vorheriger Zustand*
      container.classList.remove('long-text')
      textElement.style.animation = 'none'

      const containerWidth: number = container.offsetWidth - 6 // Abzüglich padding
      const textWidth: number = textElement.scrollWidth

      // Nur wenn Text breiter als Container ist
      if (textWidth > containerWidth) {
        container.classList.add('long-text')

        // Berechne wie viel der Text scrollen muss
        container.style.setProperty('--container-width', `${containerWidth}px`)

        // Animation wieder aktivieren
        textElement.style.animation = ''
      } else {
        // Kurze Texte: keine Animation
        container.classList.remove('long-text')
      }
    })
  }, 100)
}

//* Watcher für placements - wird aufgerufen wenn sich placements ändert*
watch(
  () => props.placements,
  async () => {
    //* Warte bis DOM aktualisiert ist*
    await nextTick()
    initScrollingText()
  },
  { deep: true }, //* Deep watch für verschachtelte Objekte*
)

//* Vue Lifecycle Hooks*
onMounted(() => {
  initScrollingText()
})

onUpdated(() => {
  initScrollingText()
})

// Beim Laden der Seite ausführen
// document.addEventListener('DOMContentLoaded', initScrollingText)

// Auch bei Größenänderungen
window.addEventListener('resize', initScrollingText)
</script>

<style scoped>
table {
  table-layout: fixed; /* verhindert automatische Breite */
  border-collapse: collapse;
}

td,
th {
  /* border: 1px solid red; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 25px;
  max-height: 25px;
  position: relative;
}

.cell-xs {
  width: 25px;
  max-width: 25px;
}

.cell-lg {
  width: 150px;
  max-width: 150px;
}

.hr,
.hl,
.v,
.h {
  overflow: visible;
  position: relative;
}

.hr::before,
.hl::before,
.h::before {
  content: '';
  position: absolute;
  top: -1px;
  height: 2px;
  background-color: white;
}

.hr::before {
  width: 75%;
  right: -1px;
}

.hl::before {
  width: 75%;
  left: -1px;
}

.h::before {
  width: 100%; /* Ganze Breite */
  left: 0;
}

.v::after {
  content: '';
  position: absolute;
  top: 0;
  left: -1px;
  width: 2px;
  height: 100%;
  background-color: white;
}

.rn {
  /* background-color: rgba(0, 0, 0, 0.6); */
  border-radius: 2px;
  border: 1px solid;
  transition: all 0.3s ease-in-out;
}

.mt {
  font-weight: bold;
  color: silver;
  text-shadow: black 0 0 1px;
  transition: all 0.3s ease-in-out;
}

.tc {
  background-color: rgba(0, 50, 255, 0.5);
  border-radius: 2px;
  text-align: center;
  color: white;
  font-weight: bold;
  height: 90%;
  width: 90%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid darkblue;
}

.tn {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 2px;
  text-align: center;
  color: white;
  font-weight: bold;
  height: 90%;
  width: 98%;
  margin: auto;
  align-items: center;
  border: 1px solid black;
}

.scrollable {
  margin: auto;
  display: flex;
}

.scrollable-text {
  white-space: nowrap;
  padding-left: 3px;
  position: relative;
}

.scrollable.long-text .scrollable-text {
  animation: scrollText 5s linear infinite;
  top: -1px;
}

@keyframes scrollText {
  0%,
  10% {
    transform: translateX(0); /* Start Position, kurz warten */
  }
  50%,
  85% {
    transform: translateX(calc(-100% + var(--container-width))); /* Dynamische Berechnung */
  }
  85.01% {
    transform: translateX(0); /* Instant zurückspringen */
  }
  100% {
    transform: translateX(0); /* Kurze Pause */
  }
}

.mp {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 2px;
  text-align: center;
  color: white;
  font-weight: bold;
  height: 90%;
  width: 90%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
}
</style>

<template>
  <div class="text-white">
    <table class="border-collapse table-fixed" style="width: 100%">
      <colgroup>
        <col class="w-1/68" />
        <col class="w-6/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-6/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-6/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-6/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-6/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-6/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-6/68" />
        <col class="w-1/68" />
      </colgroup>

      <tbody>
        <tr>
          <th colspan="33">
            <h1 class="text-4xl">Turnierbaum der Finalrunde</h1>
          </th>
        </tr>
        <tr>
          <th></th>
        </tr>
        <tr>
          <th colspan="3">
            <div class="rn" :style="getBgClass(8)">{{ getRoundById(8)?.description }}</div>
          </th>
          <th colspan="2"></th>
          <th colspan="3">
            <div class="rn" :style="getBgClass(9)">{{ getRoundById(9)?.description }}</div>
          </th>
          <th colspan="2"></th>
          <th colspan="3">
            <div class="rn" :style="getBgClass(10)">{{ getRoundById(10)?.description }}</div>
          </th>
          <th colspan="2"></th>
          <th colspan="3">
            <div class="rn" :style="getBgClass(11)">{{ getRoundById(11)?.description }}</div>
          </th>
          <th colspan="2"></th>
          <th colspan="3">
            <div class="rn" :style="getBgClass(12)">{{ getRoundById(12)?.description }}</div>
          </th>
          <th colspan="2"></th>
          <th colspan="3">
            <div class="rn" :style="getBgClass(13)">{{ getRoundById(13)?.description }}</div>
          </th>
          <th colspan="2"></th>
          <th colspan="3">
            <div class="rn" :style="getBgClass(14)">{{ getRoundById(14)?.description }}</div>
          </th>
        </tr>

        <tr>
          <th colspan="33"></th>
        </tr>

        <tr>
          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(29)?.description }}</span>
            </div>
          </td>
        </tr>

        <tr>
          <td class="cell-xs">
            <div class="tc">{{ getMatchById(29)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(29)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(29)?.team1MatchPoints }}</div>
          </td>
        </tr>

        <tr>
          <td class="cell-xs">
            <div class="tc">{{ getMatchById(29)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(29)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(29)?.team2MatchPoints }}</div>
          </td>

          <td class="cell-xs hr" />
          <td class="cell-xs v" />

          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(33)?.description }}</span>
            </div>
          </td>
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs">
            <div class="tc">{{ getMatchById(33)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(33)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(33)?.team1MatchPoints }}</div>
          </td>
        </tr>

        <tr>
          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(30)?.description }}</span>
            </div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs v hl" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(33)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(33)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(33)?.team2MatchPoints }}</div>
          </td>

          <td class="cell-xs hr" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs">
            <div class="tc">{{ getMatchById(30)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(30)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(30)?.team1MatchPoints }}</div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs">
            <div class="tc">{{ getMatchById(30)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(30)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(30)?.team2MatchPoints }}</div>
          </td>

          <td class="cell-xs hr" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(40)?.description }}</span>
            </div>
          </td>
        </tr>

        <tr>
          <td class="cell-xs" />

          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(40)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(40)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(40)?.team1MatchPoints }}</div>
          </td>
        </tr>

        <tr>
          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(31)?.description }}</span>
            </div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs h v" />
          <td class="cell-xs h" />
          <td class="cell-xs h" />
          <td class="cell-xs h" />
          <td class="cell-xs h" />
          <td class="cell-xs hl" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(40)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(40)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(40)?.team2MatchPoints }}</div>
          </td>

          <td class="cell-xs hr" />
          <td class="cell-xs h" />
          <td class="cell-xs h" />
          <td class="cell-xs h" />
          <td class="cell-xs h" />
          <td class="cell-xs h" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs">
            <div class="tc">{{ getMatchById(31)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(31)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(31)?.team1MatchPoints }}</div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs">
            <div class="tc">{{ getMatchById(31)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(31)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(31)?.team2MatchPoints }}</div>
          </td>

          <td class="cell-xs hr" />
          <td class="cell-xs v" />

          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(34)?.description }}</span>
            </div>
          </td>
          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(34)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(34)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(34)?.team1MatchPoints }}</div>
          </td>
          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(32)?.description }}</span>
            </div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs hl v" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(34)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(34)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(34)?.team2MatchPoints }}</div>
          </td>
          <td class="cell-xs hr" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs">
            <div class="tc">{{ getMatchById(32)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(32)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(32)?.team1MatchPoints }}</div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />

          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(44)?.description }}</span>
            </div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(45)?.description }}</span>
            </div>
          </td>
        </tr>

        <tr>
          <td class="cell-xs">
            <div class="tc">{{ getMatchById(32)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(32)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(32)?.team2MatchPoints }}</div>
          </td>

          <td class="cell-xs hr" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(44)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(44)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(44)?.team1MatchPoints }}</div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(45)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(45)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(45)?.team1MatchPoints }}</div>
          </td>
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs hl v" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(44)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(44)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(44)?.team2MatchPoints }}</div>
          </td>

          <td class="cell-xs hr" />
          <td class="cell-xs hl" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(45)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(45)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(45)?.team2MatchPoints }}</div>
          </td>
        </tr>
        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>
        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(35)?.description }}</span>
            </div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(37)?.description }}</span>
            </div>
          </td>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(35)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(35)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(35)?.team1MatchPoints }}</div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(37)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(37)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(37)?.team1MatchPoints }}</div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(35)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(35)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(35)?.team2MatchPoints }}</div>
          </td>

          <td class="cell-xs hr" />
          <td class="cell-xs hl" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(37)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(37)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(37)?.team2MatchPoints }}</div>
          </td>

          <td class="cell-xs hr" />
          <td class="cell-xs v" />

          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(41)?.description }}</span>
            </div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(43)?.description }}</span>
            </div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(41)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(41)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(41)?.team1MatchPoints }}</div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(43)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(43)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(43)?.team1MatchPoints }}</div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(36)?.description }}</span>
            </div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(38)?.description }}</span>
            </div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs hl v" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(41)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(41)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(41)?.team2MatchPoints }}</div>
          </td>

          <td class="cell-xs hr" />
          <td class="cell-xs hl" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(43)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(43)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(43)?.team2MatchPoints }}</div>
          </td>

          <td class="cell-xs hr" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(36)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(36)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(36)?.team1MatchPoints }}</div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(38)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(38)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(38)?.team1MatchPoints }}</div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>
        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(36)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(36)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(36)?.team2MatchPoints }}</div>
          </td>

          <td class="cell-xs hr" />
          <td class="cell-xs hl" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(38)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(38)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(38)?.team2MatchPoints }}</div>
          </td>

          <td class="cell-xs hr" />
        </tr>

        <tr>
          <td class="cell-xs" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(39)?.description }}</span>
            </div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3">
            <div class="mt scrollable">
              <span class="scrollable-text">{{ getMatchById(42)?.description }}</span>
            </div>
          </td>
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(39)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(39)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(39)?.team1MatchPoints }}</div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(42)?.team1targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(42)?.team1Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(42)?.team1MatchPoints }}</div>
          </td>
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(39)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(39)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(39)?.team2MatchPoints }}</div>
          </td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs">
            <div class="tc">{{ getMatchById(42)?.team2targetCode }}</div>
          </td>
          <td class="cell-lg">
            <div class="tn scrollable">
              <span class="scrollable-text">{{ getMatchById(42)?.team2Name }}</span>
            </div>
          </td>
          <td class="cell-xs">
            <div class="mp">{{ getMatchById(42)?.team2MatchPoints }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
