<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import axios from 'axios'
import ErrorComponent from './ErrorComponent.vue'

// Konstanten
const TOTAL_SLOTS = 8
const TOURNAMENT_DATE = '17. August 2025'
const REGISTRATION_DEADLINE = '01. Juni 2025'

// Typen definieren
interface Teams {
  teamId: number
  name: string
  contactEmail: string
  playerCount: string
  hasPayed: boolean
  lookingForTeammates: boolean
  createdAt: string
}

// Teilnehmer
// const teams = ref<Teams[]>([])
const state = reactive({
  teams: <Teams[]>[],
  isLoading: true,
  error: null as {
    code: string | number
    message: string
  } | null,
})

// Berechnete Eigenschaften
const freeSlots = computed(() => TOTAL_SLOTS - state.teams.length)
const isFull = computed(() => state.teams.length >= TOTAL_SLOTS)
const slotsStatusClass = computed(() =>
  isFull.value ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800',
)

// Sortierte Teilnehmer (bezahlte zuerst)
const sortedTeams = computed(() =>
  [...state.teams].sort((a, b) => Number(b.hasPayed) - Number(a.hasPayed)),
)

const fetchTeams = async () => {
  state.isLoading = true
  state.error = null

  try {
    const response = await axios.get('/api/teams')
    state.teams = response.data
  } catch (error) {
    console.error('Error fetching teams', error)

    // Error-Details aus der Axios-Response extrahieren
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server hat mit einem Fehlercode geantwortet
        state.error = {
          code: error.response.status,
          message: error.response.data?.message || 'Server-Fehler',
        }
      } else if (error.request) {
        // Request wurde gesendet, aber keine Antwort erhalten
        state.error = {
          code: 'Netzwerk-Fehler',
          message: 'Keine Verbindung zum Server möglich',
        }
      } else {
        // Anderer Axios-Fehler
        state.error = {
          code: 'Axios-Fehler',
          message: error.message || 'Ein Fehler bei der Anfrage ist aufgetreten',
        }
      }
    } else {
      // Unbekannter Fehler (nicht von Axios)
      state.error = {
        code: 'Unbekannter Fehler',
        message: error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten',
      }
    }
  } finally {
    state.isLoading = false
  }
}

const handleRetry = () => {
  fetchTeams()
}

onMounted(() => {
  fetchTeams()
})
</script>

<template>
  <div class="pt-16 bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Angemeldete Mannschaften</h1>
        <p class="text-lg text-gray-600">2. Wedemark Team Open - {{ TOURNAMENT_DATE }}</p>

        <div
          v-if="!state.isLoading && !state.error"
          :class="[
            'mt-4 mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full',
            slotsStatusClass,
          ]"
        >
          <i class="pi pi-users" aria-hidden="true"></i>
          <span class="font-semibold">
            {{ state.teams.length }} von {{ TOTAL_SLOTS }} Plätzen belegt
          </span>
        </div>
      </header>

      <!--* Loading State *-->
      <template v-if="state.isLoading">
        <div class="flex justify-center items-center py-12">
          <VueSpinner size="60" color="red" />
        </div>
      </template>

      <!--* Error State *-->
      <template v-else-if="state.error">
        <ErrorComponent
          :error-code="state.error.code"
          :error-message="state.error.message"
          @retry="handleRetry"
        />
      </template>

      <!--* Success State - Participants Table *-->
      <template v-else>
        <ParticipantsTable
          :teams="sortedTeams"
          :total-slots="TOTAL_SLOTS"
          :free-slots="freeSlots"
          :registration-deadline="REGISTRATION_DEADLINE"
          :is-loading="false"
        />
      </template>

      <!-- Spacer -->
      <div class="mb-48" />
    </div>
  </div>
</template>
