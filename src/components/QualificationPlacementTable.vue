<script lang="ts" setup>
interface QualificationPlacement {
  place: number | null
  team: Team
  totalMatchPoints: Points
  totalSetPoints: Points
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
  placements: QualificationPlacement[]
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
    default:
      return 'bg-zinc-600'
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
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[10%]">
              Platz
            </th>
            <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Verein / Teamname
            </th>
            <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase w-[8%]">
              Satzpunkte
            </th>
            <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase w-[8%]">
              Satzdifferenz
            </th>
            <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase w-[8%]">
              Matchpunkte
            </th>
            <th class="w-[5%]" />
            <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase w-[8%]">
              Schnitt
            </th>
            <th
              class="pl-3 pr-6 py-3 text-center text-xs font-medium text-gray-500 uppercase w-[10%]"
            >
              pro Pfeil
            </th>
          </tr>
        </thead>

        <!-- Transition Group ersetzt tbody -->
        <transition-group
          tag="tbody"
          name="placement-move"
          class="bg-white divide-y divide-gray-200 text-[17px]"
        >
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
                    {{ placement.place }}
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
              <div
                :class="[
                  'font-medium',
                  placement.totalSetPoints.won - placement.totalSetPoints.lost > 0
                    ? 'text-green-700'
                    : placement.totalSetPoints.won - placement.totalSetPoints.lost < 0
                      ? 'text-red-700'
                      : 'text-gray-900',
                ]"
              >
                {{ placement.totalSetPoints.won - placement.totalSetPoints.lost > 0 ? '+' : '' }}
                {{ placement.totalSetPoints.won - placement.totalSetPoints.lost }}
              </div>
            </td>

            <!-- Matchpoints -->
            <td class="px-3 py-4 whitespace-nowrap text-center">
              <div class="font-bold text-gray-900">
                {{ placement.totalMatchPoints.won }} : {{ placement.totalMatchPoints.lost }}
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
        </transition-group>
      </table>
    </div>
  </div>
</template>

<style scoped>
.placement-move-move {
  transition: transform 0.6s ease;
}
</style>
