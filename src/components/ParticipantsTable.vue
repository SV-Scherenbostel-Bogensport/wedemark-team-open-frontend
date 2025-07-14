<script lang="ts" setup>
import { RouterLink } from 'vue-router'

// Typen definieren
interface Team {
  teamId: number
  name: string
  contactEmail: string
  playerCount: string
  hasPayed: boolean
  lookingForTeammates: boolean
  createdAt: string
}

// Props definieren
interface Props {
  teams: Team[]
  totalSlots: number
  freeSlots: number
  registrationDeadline: string
}

const props = defineProps<Props>()

// Hilfsfunktionen
const getSlotNumberClass = (hasPayed: boolean) => (hasPayed ? 'bg-green-500' : 'bg-yellow-500')

const getStatusBadge = (hasPayed: boolean) => ({
  class: hasPayed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
  icon: hasPayed ? 'pi-check' : 'pi-clock',
  text: hasPayed ? 'Bestätigt' : 'Reserviert',
})

const getFreeSlotNumber = (index: number) => props.totalSlots - props.freeSlots + index
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden max-w-6xl mx-auto">
    <!-- Table Header -->
    <div class="bg-gradient-to-r from-red-600 to-red-600 text-white px-6 py-4">
      <h2 class="text-xl font-bold flex items-center gap-2">
        <i class="pi pi-list align-middle translate-y-[2px]" aria-hidden="true"></i>
        Startplätze
      </h2>
    </div>

    <!-- Table Content -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Startplatz
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Verein / Teamname
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              vrl. Anzahl
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Info
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Teams -->
          <tr
            v-for="(team, index) in teams"
            :key="team.teamId"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  :class="[
                    'w-8 h-8 text-white rounded-full flex items-center justify-center font-bold',
                    getSlotNumberClass(team.hasPayed),
                  ]"
                >
                  <span class="align-middle translate-y-[-1px]">
                    {{ index + 1 }}
                  </span>
                </div>
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-semibold text-gray-900">
                {{ team.name }}
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="team.playerCount !== null" class="text-sm font-medium text-gray-900">
                {{ team.playerCount }} Schützen
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <span
                v-if="team.lookingForTeammates"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                <i class="pi pi-users mr-1" aria-hidden="true"></i>
                Team sucht noch weitere Mitglieder
              </span>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusBadge(team.hasPayed).class,
                ]"
              >
                <i :class="['pi mr-1', getStatusBadge(team.hasPayed).icon]" aria-hidden="true"></i>
                {{ getStatusBadge(team.hasPayed).text }}
              </span>
            </td>
          </tr>

          <!-- Free Slots -->
          <tr
            v-for="index in freeSlots"
            :key="`free-${index}`"
            class="hover:bg-blue-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold"
                >
                  <span class="align-middle translate-y-[-1px]">
                    {{ getFreeSlotNumber(index) }}
                  </span>
                </div>
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <RouterLink
                to="/enter"
                class="inline-flex items-center px-4 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <i class="pi pi-plus mr-2" aria-hidden="true"></i>
                Jetzt anmelden und Startplatz sichern
              </RouterLink>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-gray-400"> Meldeschluss: {{ registrationDeadline }} </span>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <RouterLink
                to="/"
                class="text-sm text-gray-400 underline hover:text-gray-600 transition-colors"
              >
                Weitere Informationen zum Turnier
              </RouterLink>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <RouterLink to="/enter">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  <i class="pi pi-circle mr-1" aria-hidden="true"></i>
                  Verfügbar
                </span>
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
