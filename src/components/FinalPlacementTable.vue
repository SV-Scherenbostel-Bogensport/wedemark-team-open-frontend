<script lang="ts" setup>
interface FinalPlacement {
  place: number | null
  qualificationPlace: number | null
  team: Team
  totalMatchPoints: Points
  totalSetPoints: Points
  lives: number
  averageSetScore: number
}
interface Team {
  teamId: number
  name: string
}

interface Points {
  won: number
  lost: number
}

interface Props {
  placements: FinalPlacement[]
}

const props = defineProps<Props>()

const getPlaceNumberClass = (place: number | null) => {
  switch (place) {
    case 1:
      return 'bg-[#FFD700]'
    case 2:
      return 'bg-[#C0C0C0]'
    case 3:
      return 'bg-[#BF8970]'
    case null:
      return 'bg-zinc-400'
    default:
      return 'bg-zinc-600'
  }
}

const getLiveCountClass = (lives: number, place: number | null) => {
  switch (lives) {
    case 0:
      if (place) {
        return 'text-gray-600'
      }
      return 'text-red-600'
    case 1:
      return 'text-orange-600'
    case 2:
      return 'text-green-600'
    default:
      return 'text-gray-900'
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden max-w-6xl mx-auto">
    <!-- Table Header -->
    <div class="bg-gradient-to-r from-red-600 to-red-600 text-white px-3 py-4">
      <h2 class="text-xl font-bold flex items-center gap-2">
        <i class="pi pi-trophy align-middle translate-y-[2px]" aria-hidden="true"></i>
        Rangliste
      </h2>
    </div>

    <!-- Table Content -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-100 bg-">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"
            >
              Platz
            </th>
            <th
              scope="col"
              class="px-1 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[1%]"
            >
              Quali
            </th>
            <th
              scope="col"
              class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Verein / Teamname
            </th>
            <th
              scope="col"
              class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]"
            >
              Satzpunkte
            </th>
            <th
              scope="col"
              class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]"
            >
              Satzdifferenz
            </th>
            <th class="w-[2%]" />
            <th
              scope="col"
              class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]"
            >
              Leben
            </th>
            <th class="w-[2%]" />
            <th
              scope="col"
              class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]"
            >
              Durchschnitt
            </th>
            <th
              scope="col"
              class="pl-3 pr-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"
            >
              pro Pfeil
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="placement in props.placements"
            :key="placement.team.teamId"
            class="hover:bg-gray-50 transition-colors"
          >
            <!-- Place -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  :class="[
                    'w-8 h-8 text-white rounded-full flex items-center justify-center font-bold',
                    getPlaceNumberClass(placement.place),
                  ]"
                >
                  <span class="align-middle translate-y-[-1px]">
                    {{ placement.place ?? '?' }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Quali -->
            <td class="px-3 py-4 whitespace-nowrap">
              <div class="flex justify-center items-center">
                <div
                  class="w-6 h-6 text-gray-900 flex rounded-md items-center justify-center font-bold bg-red-200"
                >
                  <span class="align-middle translate-y-[-1px]">
                    {{ placement.qualificationPlace ?? '?!' }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Team -->
            <td class="px-3 py-4 whitespace-nowrap">
              <div class="font-semibold text-gray-900">
                {{ placement.team.name }}
              </div>
            </td>

            <!-- Sets -->
            <td class="px-3 py-4 whitespace-nowrap text-center">
              <div class="font-medium text-gray-900">
                {{ placement.totalSetPoints.won }} : {{ placement.totalSetPoints.lost }}
              </div>
            </td>

            <!-- Difference -->
            <td class="px-3 py-4 whitespace-nowrap text-center">
              <div class="font-medium text-gray-900">
                {{ placement.totalSetPoints.won - placement.totalSetPoints.lost }}
              </div>
            </td>

            <!-- Spacer -->
            <td />

            <td class="px-3 py-4 whitespace-nowrap text-center">
              <div :class="['font-bold', getLiveCountClass(placement.lives, placement.place)]">
                {{ placement.lives }}
                <p class="pi pi-heart-fill ml-1 translate-y-[1px]" />
              </div>
            </td>

            <!-- Spacer -->
            <td />

            <!-- Average -->
            <td class="px-3 py-4 whitespace-nowrap text-center">
              <div class="font-medium text-gray-900">
                {{ placement.averageSetScore.toFixed(2) }}
              </div>
            </td>

            <!-- Per Arrow -->
            <td class="pl-3 pr-6 py-4 whitespace-nowrap text-center">
              <div class="font-medium text-gray-900">
                {{ (placement.averageSetScore / 6).toFixed(3) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
