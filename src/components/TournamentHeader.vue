<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useTeamSlots } from '@/composables/useTeamSlots'
import TournamentNavbar from './TournamentNavbar.vue'
import banner from '@/assets/img/banner.jpg'
import icon from '@/assets/img/indi.png'

const TOURNAMENT_NAME = '2. Wedemark Team Open'
const TOURNAMENT_DATE = new Date('2025-08-17')
const TOURNAMENT_LOCATION = 'Fuhrenkamp 5, 30900 Wedemark'
const REGISTRATION_DEADLINE = new Date('2025-06-01')
const ALLOW_REGISTRATION_AFTER_DEADLINE = true

const { slotsLeft, fetchSlotsLeft } = useTeamSlots()

// Computed properties
const isDeadlinePassed = computed(() => {
  const currentDate = new Date()
  return currentDate > REGISTRATION_DEADLINE
})

const hasAvailableSlots = computed(() => {
  return slotsLeft.value !== null && slotsLeft.value > 0
})

const shouldShowGreenButton = computed(() => {
  return hasAvailableSlots.value && !isDeadlinePassed.value
})

const shouldShowYellowButton = computed(() => {
  return hasAvailableSlots.value && isDeadlinePassed.value && ALLOW_REGISTRATION_AFTER_DEADLINE
})

const shouldShowRedButton = computed(() => {
  return isDeadlinePassed.value && !ALLOW_REGISTRATION_AFTER_DEADLINE
})

const shouldShowAvailabilityMessage = computed(() => {
  return !isDeadlinePassed.value && hasAvailableSlots.value
})

const shouldShowLastMinuteMessage = computed(() => {
  return ALLOW_REGISTRATION_AFTER_DEADLINE && hasAvailableSlots.value && isDeadlinePassed.value
})

onMounted(() => {
  fetchSlotsLeft(true)
})
</script>

<template>
  <div class="relative w-full overflow-hidden">
    <!-- Banner Image -->
    <img
      :src="banner"
      alt="Turnier-Banner"
      class="w-full h-[300px] object-cover brightness-50 blur-sm scale-110"
    />

    <!-- Tournament Info (Right Side) -->
    <div
      class="absolute inset-0 flex justify-end items-center pointer-events-none text-white pr-20"
    >
      <div class="flex items-center gap-6">
        <div class="text-right">
          <h1 class="text-4xl font-bold drop-shadow-md uppercase mb-2">
            {{ TOURNAMENT_NAME }}
          </h1>
          <p class="text-lg drop-shadow-md mb-1">
            {{
              TOURNAMENT_DATE.toLocaleDateString('de-DE', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            }}
          </p>
          <h2 class="text-xl drop-shadow-md font-semibold">
            {{ TOURNAMENT_LOCATION }}
          </h2>
        </div>
        <img :src="icon" alt="Tournament Icon" class="w-auto h-40 drop-shadow-lg" />
      </div>
    </div>

    <!-- Registration Section (Left Side) -->
    <div class="absolute left-32 top-1/2 transform -translate-y-1/2">
      <!-- Deadline Info -->
      <h2 class="text-white text-xl drop-shadow-md font-semibold mb-2">
        Meldeschluss:
        {{
          REGISTRATION_DEADLINE.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
        }}
      </h2>

      <!-- Registration Buttons -->
      <div class="flex items-center gap-4">
        <!-- Red Button: Deadline Passed (Registration Closed) -->
        <div v-if="shouldShowRedButton" class="relative group inline-block">
          <div
            class="relative rounded px-3 py-2 overflow-hidden from-red-500 to-red-600 bg-gradient-to-r text-white transition-all ease-out duration-300 block"
          >
            <span class="relative font-bold">Meldeschluss abgelaufen!</span>
          </div>
        </div>

        <!-- Yellow Button: Late Registration Available -->
        <div v-else-if="shouldShowYellowButton" class="relative group inline-block">
          <RouterLink
            to="/enter"
            class="relative rounded px-3 py-2 overflow-hidden bg-yellow-600 hover:bg-gradient-to-r hover:from-yellow-600 hover:to-yellow-500 text-white transition-all ease-out duration-300 block"
          >
            <span
              class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-65 ease"
            ></span>
            <span class="relative font-bold">Last-Minute Startplatz sichern!</span>
          </RouterLink>
          <div
            class="absolute group-hover:-inset-1 -inset-0 rounded-[7px] border-2 border-yellow-400 duration-200 pointer-events-none -z-10 group-hover:shadow-[0_0_20px_rgba(200,180,20,0.6)]"
          ></div>
        </div>

        <!-- Green Button: Normal Registration -->
        <div v-else-if="shouldShowGreenButton" class="relative group inline-block">
          <RouterLink
            to="/enter"
            class="relative rounded px-3 py-2 overflow-hidden bg-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white transition-all ease-out duration-300 block"
          >
            <span
              class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-45 ease"
            ></span>
            <span class="relative font-bold">Startplatz sichern!</span>
          </RouterLink>
          <div
            class="absolute group-hover:-inset-1 -inset-0 rounded-[7px] border-2 border-green-400 duration-200 pointer-events-none -z-10 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
          ></div>
        </div>

        <!-- Gray Button: Tournament Full -->
        <div v-else-if="slotsLeft !== null" class="relative group inline-block">
          <div
            class="relative rounded px-3 py-2 overflow-hidden from-gray-400 to-gray-500 bg-gradient-to-r text-white transition-all ease-out duration-300 block"
          >
            <span class="relative font-bold">Turnier ist ausgebucht!</span>
          </div>
        </div>

        <!-- Blue Button: Fallback if api server offline -->
        <div v-else class="relative group inline-block">
          <a
            href="https://www.sv-scherenbostel.de/app/download/27001608/Ausschreibung+2_SVS+Team-Turnier.pdf"
            target="_blank"
            rel="noopener noreferrer"
            class="relative rounded px-3 py-2 overflow-hidden bg-blue-500 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 text-white transition-all ease-out duration-300 block"
          >
            <span
              class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-65 ease"
            ></span>
            <span class="relative font-bold">Ausschreibung herunterladen</span>
          </a>
          <div
            class="absolute group-hover:-inset-1 -inset-0 rounded-[7px] border-2 border-blue-400 duration-200 pointer-events-none -z-10 group-hover:shadow-[0_0_20px_rgba(34,74,197,0.6)]"
          ></div>
        </div>
      </div>

      <!-- Status Messages -->
      <div class="pt-5">
        <!-- Normal Availability Message -->
        <h2
          v-if="shouldShowAvailabilityMessage"
          class="text-white text-md italic drop-shadow-md ml-1"
        >
          <i class="pi pi-arrow-circle-right text-white align-middle translate-y-[-2px]"></i>
          {{ slotsLeft !== null && slotsLeft <= 4 ? 'Nur noch' : 'Noch' }}
          {{ slotsLeft }} Startplätze verfügbar!
        </h2>

        <!-- Last-Minute Message -->
        <h2
          v-else-if="shouldShowLastMinuteMessage"
          class="text-white text-md italic drop-shadow-md ml-1"
        >
          <i class="pi pi-arrow-circle-right text-white align-middle translate-y-[-2px]"></i>
          Jetzt noch schnell nach Meldeschluss einen Startplatz sichern!
        </h2>

        <!-- Team Search Link -->
        <RouterLink v-else-if="slotsLeft !== null" to="/attendees">
          <h2 class="text-white text-md italic drop-shadow-md ml-1">
            <i class="pi pi-arrow-circle-right text-white align-middle translate-y-[-2px]"></i>
            <span class="ml-2 underline">Vielleicht sucht ja noch ein Team nach Mitgliedern</span>
          </h2>
        </RouterLink>

        <!-- Fallback if api server offline -->
        <a v-else href="mailto:bogensport@sv-scherenbostel.de">
          <h2 class="text-white text-md italic drop-shadow-md ml-1">
            <i class="pi pi-arrow-circle-right text-white align-middle translate-y-[-2px]"></i>
            <span class="ml-2 underline">Jetzt per E-Mail anmelden</span>
          </h2>
        </a>
      </div>
    </div>
  </div>

  <TournamentNavbar />
</template>
