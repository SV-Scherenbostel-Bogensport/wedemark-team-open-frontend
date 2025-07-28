<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, watch } from 'vue'
import axios from 'axios'
import ErrorComponent from '@/components/ErrorComponent.vue'
import StatusIcon from './StatusIcon.vue'

interface ApiMatchInfoResponse {
  matchId: string
  description: string
  team1: Team
  team2: Team
  target1Code: string
  target2Code: string
  isKnockOut: boolean
  status: Status
  sets: Set[]
}

interface Team {
  teamId: number
  name: string
}

interface Status {
  statusId: number
  label: string
  description: string
  primaryColor: string
  secondaryColor: string
  pulsing: boolean
}

interface Set {
  setId: number
  setIndex: number
  totalTeam1: number
  totalTeam2: number
  pointsTeam1: number
  pointsTeam2: number
}

// Props definieren
interface Props {
  matchId: number
  autoRefresh?: number
}

const state = reactive({
  matchInfo: null as ApiMatchInfoResponse | null,
  isLoading: true,
  error: null as unknown,
})

const props = withDefaults(defineProps<Props>(), {
  autoRefresh: 0,
})

// Timer Referenz für das Auto-Refresh
let refreshTimer: number | null = null

const getSetColorClass = (setIndex: number, team: 'team1' | 'team2') => {
  if (!state.matchInfo?.sets) return 'text-gray-500'

  const currentSet = state.matchInfo.sets.find((set) => set.setIndex === setIndex)
  if (!currentSet) return 'text-gray-700'

  const pointsTeam1 = currentSet.pointsTeam1
  const pointsTeam2 = currentSet.pointsTeam2

  // Bei Gleichstand
  if (pointsTeam1 === pointsTeam2) {
    return 'text-gray-700'
  }

  // Team 1 besser
  if (pointsTeam1 > pointsTeam2) {
    return team === 'team1' ? 'text-green-600' : 'text-red-600'
  }

  // Team 2 besser
  return team === 'team1' ? 'text-red-600' : 'text-green-600'
}

const getSetPointsColorClass = (team: 'team1' | 'team2') => {
  if (!isMatchFinished()) return 'bg-[#626262]'

  const team1Points = getTotalPoints('team1')
  const team2Points = getTotalPoints('team2')

  if (team1Points === team2Points) return 'bg-[#424242]'

  const isTeam1Winner = team1Points > team2Points
  const isCurrentTeamWinner = (team === 'team1') === isTeam1Winner

  return isCurrentTeamWinner ? 'bg-[rgb(0,200,0)]' : 'bg-[rgb(200,0,0)]'
}

const isMatchFinished = () => {
  const FINISHED_STATES = ['ENDED', 'CANCELED']
  return FINISHED_STATES.includes(state.matchInfo?.status?.label ?? '')
}

const getSetFiller = (shootOf = false) => {
  if (isMatchFinished() && !shootOf) {
    return '-'
  }
  return ''
}

const getTotalPoints = (team: 'team1' | 'team2') => {
  return (
    state.matchInfo?.sets.reduce((sum, set) => {
      return sum + (team === 'team1' ? (set.pointsTeam1 ?? 0) : (set.pointsTeam2 ?? 0))
    }, 0) ?? 0
  )
}

const fetchData = async () => {
  state.error = null

  try {
    const matchId = props.matchId
    const response = await axios.get<ApiMatchInfoResponse>(`/api/matches/${matchId}/info`)

    if (response.data) {
      state.matchInfo = response.data
    } else {
      throw new Error('Keine Daten erhalten')
    }
  } catch (error) {
    console.error('Error fetching data', error)
    state.error = error
  } finally {
    state.isLoading = false
  }
}

const startAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }

  if (props.autoRefresh > 0) {
    refreshTimer = setInterval(() => {
      fetchData()
    }, props.autoRefresh * 1000) // Sekunden zu Millisekunden
  }
}

const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

const handleRetry = () => {
  fetchData()
}

// Watch für Änderungen am autoRefresh Prop
watch(
  () => props.autoRefresh,
  () => {
    startAutoRefresh() // Timer neu starten mit neuen Intervall
  },
  { immediate: true },
)

onMounted(() => {
  fetchData()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<template>
  <!--* Loading State *-->
  <template v-if="state.isLoading">
    <div class="flex justify-center items-center py-12">
      <VueSpinnerDots size="60" color="red" />
    </div>
  </template>

  <!--* Error State *-->
  <template v-else-if="state.error">
    <ErrorComponent
      :error="state.error"
      :toast-message="`Ergebnis für Match ${props.matchId} konnten nicht geladen werden`"
      :show-details="true"
      :show-retry="true"
      @retry="handleRetry"
    />
  </template>

  <!--* Success State - Match Info *-->
  <template v-else>
    <div class="text-white px-1 py-1 max-w-6xl mx-auto">
      <div class="flex items-center justify-between translate-y-[-1px]">
        <h2 class="text-xl font-bold flex items-center">
          {{ state.matchInfo?.description }}
        </h2>
        <div class="flex items-center">
          <StatusIcon
            class="left mr-2 h-[12px] w-[12px] translate-y-[2px]"
            :primary-color="state.matchInfo?.status.primaryColor"
            :secondary-color="state.matchInfo?.status.secondaryColor"
            :pulsing="state.matchInfo?.status.pulsing"
          />
          <span class="font-bold"> {{ state.matchInfo?.status.description }} </span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-md shadow-md overflow-hidden max-w-6xl mx-auto">
      <!-- Table Header -->
      <!-- <div class="bg-[#424242] text-white px-4 py-1.5">
      <div class="flex items-center justify-between translate-y-[-1px]">
        <h2 class="text-xl font-bold flex items-center gap-2">{{ state.matchInfo?.description }}</h2>
        <div>
          <span class="font-bold"> {{ state.matchInfo?.status.description }} </span>
        </div>
      </div>
    </div> -->

      <!-- Table Content -->
      <div class="overflow-x-auto">
        <table class="w-full border-separate border-spacing-y-0">
          <thead class="bg-gray-200">
            <tr>
              <th scope="col" class="px-2 py-1 text-left text-xs font-bold text-gray-500 w-1/10">
                Scheibe
              </th>
              <th scope="col" class="px-2 py-1 text-left text-xs font-bold text-gray-500">Team</th>
              <th scope="col" class="px-2 py-1 text-center text-xs font-bold text-gray-500 w-1/17">
                Satz 1
              </th>
              <th scope="col" class="px-2 py-1 text-center text-xs font-bold text-gray-500 w-1/17">
                Satz 2
              </th>
              <th scope="col" class="px-2 py-1 text-center text-xs font-bold text-gray-500 w-1/17">
                Satz 3
              </th>
              <th scope="col" class="px-2 py-1 text-center text-xs font-bold text-gray-500 w-1/17">
                Satz 4
              </th>
              <th scope="col" class="px-2 py-1 text-center text-xs font-bold text-gray-500 w-1/17">
                Satz 5
              </th>
              <th scope="col" class="px-2 py-1 text-center text-xs font-bold text-gray-500 w-1/17">
                {{ state.matchInfo?.isKnockOut === true ? 'Stechen' : '' }}
              </th>
              <th scope="col" class="px-2 py-1 text-left text-xs font-bold text-gray-500 w-1/10">
                Satzpunkte
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr class="h-10">
              <!-- Scheibe -->
              <td class="px-1 py-1 whitespace-nowrap text-center">
                <div
                  class="bg-[#424242] rounded-xs text-lg font-bold text-white h-9 flex items-center justify-center"
                >
                  {{ state.matchInfo?.target1Code ?? '?' }}
                </div>
              </td>

              <!-- Team -->
              <td class="pr-1 py-1 whitespace-nowrap">
                <div class="text-lg font-bold text-gray-900 h-9 flex items-center pl-3">
                  {{ state.matchInfo?.team1?.name ?? '???' }}
                </div>
              </td>

              <!-- Satz 1 -->
              <td class="px-1 py-1 whitespace-nowrap text-center">
                <span class="text-lg font-bold" :class="getSetColorClass(1, 'team1')">
                  {{
                    state.matchInfo?.sets?.find((set) => set.setIndex == 1)?.totalTeam1 ??
                    getSetFiller()
                  }}
                </span>
              </td>

              <!-- Satz 2 -->
              <td class="px-1 py-1 whitespace-nowrap text-center">
                <span class="text-lg font-bold" :class="getSetColorClass(2, 'team1')">
                  {{
                    state.matchInfo?.sets?.find((set) => set.setIndex == 2)?.totalTeam1 ??
                    getSetFiller()
                  }}
                </span>
              </td>

              <!-- Satz 3 -->
              <td class="px-1 py-1 whitespace-nowrap text-center">
                <span class="text-lg font-bold" :class="getSetColorClass(3, 'team1')">
                  {{
                    state.matchInfo?.sets?.find((set) => set.setIndex == 3)?.totalTeam1 ??
                    getSetFiller()
                  }}
                </span>
              </td>

              <!-- Satz 4 -->
              <td class="px-1 py-1 whitespace-nowrap text-center">
                <span class="text-lg font-bold" :class="getSetColorClass(4, 'team1')">
                  {{
                    state.matchInfo?.sets?.find((set) => set.setIndex == 4)?.totalTeam1 ??
                    getSetFiller()
                  }}
                </span>
              </td>

              <!-- Satz 5 -->
              <td class="px-1 py-1 whitespace-nowrap text-center">
                <span class="text-lg font-bold" :class="getSetColorClass(5, 'team1')">
                  {{
                    state.matchInfo?.sets?.find((set) => set.setIndex == 5)?.totalTeam1 ??
                    getSetFiller()
                  }}
                </span>
              </td>

              <!-- Stechpfeile -->
              <td class="px-1 py-1 whitespace-nowrap text-center">
                <span class="text-lg font-bold" :class="getSetColorClass(6, 'team1')">
                  {{
                    state.matchInfo?.sets?.find((set) => set.setIndex == 6)?.totalTeam1 ??
                    getSetFiller(true)
                  }}
                </span>
              </td>

              <!-- Satzpunkte -->
              <td class="px-1 py-1 whitespace-nowrap text-center">
                <div
                  class="rounded-xs text-lg font-bold text-white h-9 flex items-center justify-center"
                  :class="getSetPointsColorClass('team1')"
                >
                  {{ getTotalPoints('team1') }}
                </div>
              </td>
            </tr>

            <tr class="h-10">
              <!-- Scheibe -->
              <td class="px-1 pb-1 whitespace-nowrap text-center">
                <div
                  class="bg-[#424242] rounded-xs text-lg font-bold text-white flex items-center justify-center h-9"
                >
                  {{ state.matchInfo?.target2Code ?? '?' }}
                </div>
              </td>

              <!-- Team -->
              <td class="pr-1 pb-1 whitespace-nowrap">
                <div class="rounded-xs text-lg font-bold text-gray-900 h-9 flex items-center pl-3">
                  {{ state.matchInfo?.team2?.name ?? '???' }}
                </div>
              </td>

              <!-- Satz 1 -->
              <td class="px-1 pb-1 whitespace-nowrap text-center">
                <span class="text-lg font-bold" :class="getSetColorClass(1, 'team2')">
                  {{
                    state.matchInfo?.sets?.find((set) => set.setIndex == 1)?.totalTeam2 ??
                    getSetFiller()
                  }}
                </span>
              </td>

              <!-- Satz 2 -->
              <td class="px-1 pb-1 whitespace-nowrap text-center">
                <span class="text-lg font-bold" :class="getSetColorClass(2, 'team2')">
                  {{
                    state.matchInfo?.sets?.find((set) => set.setIndex == 2)?.totalTeam2 ??
                    getSetFiller()
                  }}
                </span>
              </td>

              <!-- Satz 3 -->
              <td class="px-1 pb-1 whitespace-nowrap text-center">
                <span class="text-lg font-bold" :class="getSetColorClass(3, 'team2')">
                  {{
                    state.matchInfo?.sets?.find((set) => set.setIndex == 3)?.totalTeam2 ??
                    getSetFiller()
                  }}
                </span>
              </td>

              <!-- Satz 4 -->
              <td class="px-1 pb-1 whitespace-nowrap text-center">
                <span class="text-lg font-bold" :class="getSetColorClass(4, 'team2')">
                  {{
                    state.matchInfo?.sets?.find((set) => set.setIndex == 4)?.totalTeam2 ??
                    getSetFiller()
                  }}
                </span>
              </td>

              <!-- Satz 5 -->
              <td class="px-1 pb-1 whitespace-nowrap text-center">
                <span class="text-lg font-bold" :class="getSetColorClass(5, 'team2')">
                  {{
                    state.matchInfo?.sets?.find((set) => set.setIndex == 5)?.totalTeam2 ??
                    getSetFiller()
                  }}
                </span>
              </td>

              <!-- Stechpfeile -->
              <td class="px-1 pb-1 whitespace-nowrap text-center">
                <span class="text-lg font-bold" :class="getSetColorClass(6, 'team2')">
                  {{
                    state.matchInfo?.sets?.find((set) => set.setIndex == 6)?.totalTeam2 ??
                    getSetFiller(true)
                  }}
                </span>
              </td>

              <!-- Satzpunkte -->
              <td class="px-1 pb-1 whitespace-nowrap text-center">
                <div
                  class="rounded-xs text-lg font-bold text-white h-9 flex items-center justify-center"
                  :class="getSetPointsColorClass('team2')"
                >
                  {{ getTotalPoints('team2') }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
</template>
