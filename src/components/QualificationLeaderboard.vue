<script lang="ts" setup>
import { ref, computed } from 'vue'

// Simulierte API-Daten mit eindeutigen IDs für das Tracking
const leaderboardData = ref([
  {
    id: 1,
    position: 1,
    team: 'Drei Blonde und nen Riese',
    sets: '55 : 01',
    difference: 54,
    points: '10 : 20',
    average: 'XX.X',
    perArrow: 'X.XXX',
  },
  {
    id: 2,
    position: 2,
    team: 'Die Bogenschützen',
    sets: '45 : 15',
    difference: 30,
    points: '18 : 12',
    average: '8.5',
    perArrow: '2.125',
  },
  {
    id: 3,
    position: 3,
    team: 'Pfeil & Bogen',
    sets: '40 : 20',
    difference: 20,
    points: '15 : 15',
    average: '7.8',
    perArrow: '1.950',
  },
  {
    id: 4,
    position: 4,
    team: 'Pfeil & Bogen',
    sets: '40 : 20',
    difference: 20,
    points: '15 : 15',
    average: '7.8',
    perArrow: '1.950',
  },
  {
    id: 5,
    position: 5,
    team: 'Pfeil & Bogen',
    sets: '40 : 20',
    difference: 20,
    points: '15 : 15',
    average: '7.8',
    perArrow: '1.950',
  },
  {
    id: 6,
    position: 6,
    team: 'Pfeil & Bogen',
    sets: '40 : 20',
    difference: 20,
    points: '15 : 15',
    average: '7.8',
    perArrow: '1.950',
  },
  {
    id: 7,
    position: 7,
    team: 'Pfeil & Bogen',
    sets: '40 : 20',
    difference: 20,
    points: '15 : 15',
    average: '7.8',
    perArrow: '1.950',
  },
  {
    id: 8,
    position: 8,
    team: 'Pfeil & Bogen',
    sets: '40 : 20',
    difference: 20,
    points: '15 : 15',
    average: '7.8',
    perArrow: '1.950',
  },
])

// Sortierte Daten basierend auf Position
const sortedData = computed(() => {
  return [...leaderboardData.value].sort((a, b) => a.position - b.position)
})

// Funktion zum Simulieren von Platzierungsänderungen (für Testzwecke)
const shufflePositions = () => {
  const data = [...leaderboardData.value]

  // Zufällige neue Positionen zuweisen
  const positions = [1, 2, 3, 4, 5, 6, 7, 8]
  data.forEach((entry) => {
    const randomIndex = Math.floor(Math.random() * positions.length)
    entry.position = positions.splice(randomIndex, 1)[0]
  })

  leaderboardData.value = data
}
</script>

<template>
  <!-- Test Button (später entfernen) -->
  <div class="mb-4 text-center">
    <button
      @click="shufflePositions"
      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
    >
      Positionen ändern (Test)
    </button>
  </div>

  <!-- Table Container -->
  <div class="bg-white rounded-md shadow-md overflow-hidden max-w-6xl mx-auto">
    <div class="overflow-x-auto">
      <table class="w-full border-separate border-spacing-y-0">
        <!-- Table Head -->
        <thead class="bg-gray-200">
          <tr>
            <th class="px-2 py-1 text-left text-xs font-bold text-gray-500 w-[10%]">Platz</th>
            <th class="px-2 py-1 text-left text-xs font-bold text-gray-500">Team</th>
            <th class="px-2 py-1 text-center text-xs font-bold text-gray-500 w-[8%]">Sätze</th>
            <th class="px-2 py-1 text-center text-xs font-bold text-gray-500 w-[8%]">Differenz</th>
            <th class="px-2 py-1 text-center text-xs font-bold text-gray-500 w-[8%]">Punkte</th>
            <th class="px-2 py-1 w-[5%]" />
            <th class="px-2 py-1 text-center text-xs font-bold text-gray-500 w-[8%]">
              Durchschnitt
            </th>
            <th class="px-2 py-1 text-center text-xs font-bold text-gray-500 w-[8%]">pro Pfeil</th>
          </tr>
        </thead>

        <!-- Table Body -->
        <TransitionGroup
          name="leaderboard"
          tag="tbody"
          class="bg-white [&>tr>td]:py-1 [&>tr:not(:first-child)>td]:pt-0"
        >
          <tr
            v-for="(entry, index) in sortedData"
            :key="entry.id"
            class="h-10 transition-all duration-1000 ease-in-out"
          >
            <!-- Position -->
            <td
              class="px-1 py-1 whitespace-nowrap text-center"
              :class="{ 'pb-1': index === sortedData.length - 1 }"
            >
              <div
                class="bg-[#424242] rounded-xs text-lg font-bold text-white h-9 flex items-center justify-center"
              >
                {{ entry.position }}
              </div>
            </td>

            <!-- Team -->
            <td
              class="pr-1 py-1 whitespace-nowrap"
              :class="{ 'pb-1': index === sortedData.length - 1 }"
            >
              <div class="text-lg font-bold text-gray-900 h-9 flex items-center pl-3">
                {{ entry.team }}
              </div>
            </td>

            <!-- Sets -->
            <td
              class="px-1 py-1 whitespace-nowrap text-center"
              :class="{ 'pb-1': index === sortedData.length - 1 }"
            >
              <span class="text-lg font-bold">{{ entry.sets }}</span>
            </td>

            <!-- Difference -->
            <td
              class="px-1 py-1 whitespace-nowrap text-center"
              :class="{ 'pb-1': index === sortedData.length - 1 }"
            >
              <span class="text-lg font-bold">{{ entry.difference }}</span>
            </td>

            <!-- Points -->
            <td
              class="px-1 py-1 whitespace-nowrap text-center"
              :class="{ 'pb-1': index === sortedData.length - 1 }"
            >
              <span class="text-lg font-extrabold">{{ entry.points }}</span>
            </td>

            <!-- Spacer -->
            <td :class="{ 'pb-1': index === sortedData.length - 1 }" />

            <!-- Average -->
            <td
              class="px-1 py-1 whitespace-nowrap text-center"
              :class="{ 'pb-1': index === sortedData.length - 1 }"
            >
              <span class="text-lg font-bold">{{ entry.average }}</span>
            </td>

            <!-- Per Arrow -->
            <td
              class="px-1 py-1 whitespace-nowrap text-center"
              :class="{ 'pb-1': index === sortedData.length - 1 }"
            >
              <span class="text-lg font-bold">{{ entry.perArrow }}</span>
            </td>
          </tr>
        </TransitionGroup>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Highlight-Effekt für Position Changes */
.leaderboard-move {
  background-color: rgba(255, 0, 0, 0.25);
  border-radius: 4px;
}
</style>
