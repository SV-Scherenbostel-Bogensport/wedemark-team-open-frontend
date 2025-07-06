<script lang="ts" setup>
import TournamentNavbar from './TournamentNavbar.vue'
import banner from '@/assets/img/banner.jpg'
import icon from '@/assets/img/indi.png'
</script>

<template>
  <div class="relative w-full overflow-hidden">
    <img
      :src="banner"
      alt="Turnier-Banner"
      class="w-full h-[300px] object-cover brightness-50 blur-sm scale-110"
    />
    <div class="absolute left-32 top-1/2 transform -translate-y-1/2 pointer-events-none"></div>
    <div
      class="absolute inset-0 flex justify-end items-center pointer-events-none text-white pr-20"
    >
      <div class="flex items-center gap-6">
        <div class="text-right">
          <h1 class="text-4xl font-bold drop-shadow-md uppercase mb-2">2. Wedemark Team Open</h1>
          <p class="text-lg drop-shadow-md mb-1">Sonntag, 17. August 2025</p>
          <h2 class="text-xl drop-shadow-md font-semibold">Fuhrenkamp 5, 30900 Wedemark</h2>
        </div>
        <img :src="icon" alt="Tournament Icon" class="w-auto h-40 drop-shadow-lg" />
      </div>
    </div>
    <!--* Button auf der linken Seite *-->
    <div class="absolute left-32 top-1/2 transform -translate-y-1/2">
      <h2 class="text-white text-xl drop-shadow-md font-semibold mb-2">
        Meldeschluss: 01. Juni 2025
      </h2>
      <div class="flex items-center gap-4">
        <div class="relative group inline-block">
          <RouterLink
            to="/enter"
            class="relative rounded px-3 py-2 overflow-hidden bg-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white transition-all ease-out duration-300 block"
          >
            <span
              class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-45 ease"
            ></span>
            <span class="relative font-bold">Startplatz sichern! </span>
          </RouterLink>
          <div
            class="absolute group-hover:-inset-1 -inset-0 rounded-[7px] border-2 border-green-400 duration-200 pointer-events-none -z-10 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
          ></div>
        </div>
      </div>
      <h2 class="text-white text-md italic drop-shadow-md ml-1 pt-5">
        <i class="pi pi-arrow-circle-right text-white align-middle translate-y-[-2px]"></i>
        Nur noch 2 Startplätze verfügbar!
      </h2>
    </div>
  </div>
  <TournamentNavbar />
</template>
