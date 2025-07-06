<template>
  <TournamentHeader />
  <div class="pt-16 bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Angemeldete Mannschaften</h1>
        <p class="text-lg text-gray-600">2. Wedemark Team Open - 17. August 2025</p>
        <div
          class="mt-4 mb-8 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full"
        >
          <i class="pi pi-users"></i>
          <span class="font-semibold">X von Y Plätzen belegt</span>
        </div>
      </div>

      <!-- Attendees -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-gradient-to-r from-red-600 to-red-600 text-white px-6 py-4">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <i class="pi pi-list align-middle translate-y-[2px]"></i>
            Startplätze
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Startplatz
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Verein / Teamname
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  vrl. Anzahl
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                ></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="participant in confirmedParticipants"
                :key="participant.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold"
                    >
                      {{ participant.startNumber }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ participant.player1 }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ participant.player2 }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ participant.club }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    <i class="pi pi-check mr-1"></i>
                    Bestätigt
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="participant.lookingForTeammate"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    <i class="pi pi-users mr-1"></i>
                    Ja
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <i class="pi pi-times mr-1"></i>
                    Nein
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-500">-</span>
                </td>
              </tr>

              <!-- Reservierte Teilnehmer -->
              <tr
                v-for="participant in reservedParticipants"
                :key="participant.id"
                class="hover:bg-orange-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold"
                    >
                      {{ participant.startNumber }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ participant.player1 }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ participant.player2 }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ participant.club }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                  >
                    <i class="pi pi-clock mr-1"></i>
                    Reserviert
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="participant.lookingForTeammate"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    <i class="pi pi-users mr-1"></i>
                    Ja
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <i class="pi pi-times mr-1"></i>
                    Nein
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-500">-</span>
                </td>
              </tr>

              <!-- Freie Plätze -->
              <tr v-for="slot in freeSlotNumbers" :key="slot" class="hover:bg-blue-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold"
                    >
                      {{ slot }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <i class="pi pi-circle mr-1"></i>
                    Frei
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <RouterLink
                    to="/enter"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <i class="pi pi-plus mr-2"></i>
                    Startplatz sichern!
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Vollständig ausgebucht -->
      <div
        v-if="freeSlots === 0"
        class="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
      >
        <i class="pi pi-exclamation-triangle text-red-500 text-3xl mb-4"></i>
        <h3 class="text-lg font-semibold text-red-800 mb-2">Turnier ist vollständig ausgebucht!</h3>
        <p class="text-red-600">
          Alle 8 Startplätze sind vergeben. Schauen Sie gerne bei unserem nächsten Turnier vorbei.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TournamentHeader from '@/components/TournamentHeader.vue'
import { ref, computed } from 'vue'

// Beispiel-Daten für bestätigte Teilnehmer
const confirmedParticipants = ref([
  {
    id: 1,
    startNumber: 1,
    player1: 'Max Mustermann',
    player2: 'Anna Schmidt',
    club: 'BC Wedemark',
    status: 'confirmed',
    lookingForTeammate: false,
  },
  {
    id: 2,
    startNumber: 2,
    player1: 'Tom Weber',
    player2: 'Lisa Müller',
    club: 'TSV Hannover',
    status: 'confirmed',
    lookingForTeammate: true,
  },
  {
    id: 3,
    startNumber: 3,
    player1: 'Jan Hoffmann',
    player2: 'Sarah Klein',
    club: 'SV Langenhagen',
    status: 'confirmed',
    lookingForTeammate: false,
  },
])

// Beispiel-Daten für reservierte Teilnehmer
const reservedParticipants = ref([
  {
    id: 4,
    startNumber: 4,
    player1: 'Mike Johnson',
    player2: 'Emma Brown',
    club: 'BC Garbsen',
    status: 'reserved',
    lookingForTeammate: false,
  },
  {
    id: 5,
    startNumber: 5,
    player1: 'David Wilson',
    player2: 'Sophie Davis',
    club: 'TV Isernhagen',
    status: 'reserved',
    lookingForTeammate: true,
  },
])

// Berechnete Eigenschaften
const totalSlots = 8
const freeSlots = computed(
  () => totalSlots - confirmedParticipants.value.length - reservedParticipants.value.length,
)
const occupiedSlots = computed(() => [
  ...confirmedParticipants.value.map((p) => p.startNumber),
  ...reservedParticipants.value.map((p) => p.startNumber),
])

const freeSlotNumbers = computed(() => {
  const allSlots = Array.from({ length: totalSlots }, (_, i) => i + 1)
  return allSlots.filter((slot) => !occupiedSlots.value.includes(slot))
})
</script>
