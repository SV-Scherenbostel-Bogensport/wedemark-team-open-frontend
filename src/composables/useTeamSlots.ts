import { ref } from 'vue'
import axios from 'axios'

const TOTAL_SLOTS = 8
const slotsLeft = ref<number | null>(null)
const loading = ref(false)

export async function fetchSlotsLeft(force = false) {
  if (loading.value) return

  // Nur abbrechen, wenn NICHT forced und bereits ein Wert vorhanden ist
  if (!force && slotsLeft.value !== null) return

  loading.value = true
  try {
    const response = await axios.get<{ total: number }>('/api/teams/count')
    slotsLeft.value = TOTAL_SLOTS - response.data.total
  } catch (e) {
    console.error('Failed to fetch slot count', e)
  } finally {
    loading.value = false
  }
}

export function useTeamSlots() {
  return {
    slotsLeft,
    fetchSlotsLeft,
  }
}
