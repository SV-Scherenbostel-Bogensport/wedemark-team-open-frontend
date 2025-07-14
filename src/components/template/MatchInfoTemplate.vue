<script lang="ts" setup></script>

<template>
  <div class="text-gray-900 px-1 py-1 max-w-6xl mx-auto">
    <div class="flex items-center justify-between translate-y-[-1px]">
      <h2 class="text-xl font-bold flex items-center gap-2">3. Qualifikationsmatch</h2>
      <div>
        <span class="font-bold"> status </span>
      </div>
    </div>
  </div>

  <div class="bg-white rounded-md shadow-md overflow-hidden max-w-6xl mx-auto">
    <!-- Table Header -->
    <!-- <div class="bg-[#424242] text-white px-4 py-1.5">
      <div class="flex items-center justify-between translate-y-[-1px]">
        <h2 class="text-xl font-bold flex items-center gap-2">3. Qualifikationsmatch</h2>
        <div>
          <span class="font-bold"> status </span>
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
              Stechen
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
                1
              </div>
            </td>

            <!-- Team -->
            <td class="pr-1 py-1 whitespace-nowrap">
              <div class="text-lg font-bold text-gray-900 h-9 flex items-center pl-3">
                ASC Göttingen
              </div>
            </td>

            <!-- Satz 1 -->
            <td class="px-1 py-1 whitespace-nowrap text-center">
              <span class="text-lg font-bold text-gray-700"> 49 </span>
            </td>

            <!-- Satz 2 -->
            <td class="px-1 py-1 whitespace-nowrap text-center">
              <span class="text-lg font-bold text-red-600"> 49 </span>
            </td>

            <!-- Satz 3 -->
            <td class="px-1 py-1 whitespace-nowrap text-center">
              <span class="text-lg font-bold text-green-600"> 55 </span>
            </td>

            <!-- Satz 4 -->
            <td class="px-1 py-1 whitespace-nowrap text-center">
              <span class="text-lg font-bold text-green-600"> 53 </span>
            </td>

            <!-- Satz 5 -->
            <td class="px-1 py-1 whitespace-nowrap text-center">
              <span class="text-lg font-bold text-gray-700"> 46 </span>
            </td>

            <!-- Stechpfeile -->
            <td class="px-1 py-1 whitespace-nowrap text-center">
              <span class="text-lg font-bold text-gray-500"> - </span>
            </td>

            <!-- Satzpunkte -->
            <td class="px-1 py-1 whitespace-nowrap text-center">
              <div
                class="bg-[rgb(200,0,0)] rounded-xs text-lg font-bold text-white h-9 flex items-center justify-center"
              >
                6
              </div>
            </td>
          </tr>

          <tr class="h-10">
            <!-- Scheibe -->
            <td class="px-1 pb-1 whitespace-nowrap text-center">
              <div
                class="bg-[#424242] rounded-xs text-lg font-bold text-white flex items-center justify-center h-9"
              >
                2
              </div>
            </td>

            <!-- Team -->
            <td class="pr-1 pb-1 whitespace-nowrap">
              <div class="rounded-xs text-lg font-bold text-gray-900 h-9 flex items-center pl-3">
                Die Wunstorfer
              </div>
            </td>

            <!-- Satz 1 -->
            <td class="px-1 pb-1 whitespace-nowrap text-center">
              <span class="text-lg font-bold text-gray-700"> 49 </span>
            </td>

            <!-- Satz 2 -->
            <td class="px-1 pb-1 whitespace-nowrap text-center">
              <span class="text-lg font-bold text-green-600"> 51 </span>
            </td>

            <!-- Satz 3 -->
            <td class="px-1 pb-1 whitespace-nowrap text-center">
              <span class="text-lg font-bold text-red-600"> 54 </span>
            </td>

            <!-- Satz 4 -->
            <td class="px-1 pb-1 whitespace-nowrap text-center">
              <span class="text-lg font-bold text-red-600"> 45 </span>
            </td>

            <!-- Satz 5 -->
            <td class="px-1 pb-1 whitespace-nowrap text-center">
              <span class="text-lg font-bold text-gray-700"> 46 </span>
            </td>

            <!-- Stechpfeile -->
            <td class="px-1 pb-1 whitespace-nowrap text-center">
              <span class="text-lg font-bold text-gray-500"> - </span>
            </td>

            <!-- Satzpunkte -->
            <td class="px-1 pb-1 whitespace-nowrap text-center">
              <div
                class="bg-[rgb(0,200,0)] rounded-xs text-lg font-bold text-white h-9 flex items-center justify-center"
              >
                4
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
