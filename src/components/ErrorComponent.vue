<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

interface Props {
  errorCode?: string | number
  errorMessage?: string
  showRetry?: boolean
  showDetails?: boolean
  error?: unknown
  toastMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  errorCode: undefined,
  errorMessage: undefined,
  showRetry: true,
  showDetails: false,
  error: undefined,
  toastMessage: undefined,
})

const emit = defineEmits<{
  retry: []
}>()

const handleRetry = () => {
  emit('retry')
}

const showDetailsOpen = ref(false)
const toggleDetails = () => {
  showDetailsOpen.value = !showDetailsOpen.value
}

const copyButtonPressed = ref(false)

// Type guards für bessere Typisierung
const isAxiosError = (
  err: unknown,
): err is {
  response?: {
    status: number
    statusText?: string
    data: unknown
    headers?: Record<string, string>
  }
  config?: {
    url?: string
    method?: string
    baseURL?: string
    params?: Record<string, unknown>
    headers?: Record<string, string>
  }
  request?: {
    responseURL?: string
    status?: number
    statusText?: string
  }
  code?: string
  message?: string
} => {
  return (
    typeof err === 'object' &&
    err !== null &&
    ('response' in err || 'request' in err || 'config' in err)
  )
}

const hasMessage = (err: unknown): err is { message: string } => {
  return (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as { message: unknown }).message === 'string'
  )
}

const hasCode = (err: unknown): err is { code: string | number } => {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (typeof (err as { code: unknown }).code === 'string' ||
      typeof (err as { code: unknown }).code === 'number')
  )
}

// Automatische Extraktion von errorCode und errorMessage aus dem error
const extractedErrorCode = computed(() => {
  // Wenn explizit errorCode übergeben wurde, verwende diesen
  if (props.errorCode !== undefined) {
    return props.errorCode
  }

  // Ansonsten versuche aus dem error zu extrahieren
  if (!props.error) {
    return 'Unbekannter Fehler'
  }

  if (isAxiosError(props.error)) {
    // HTTP Response Error
    if (props.error.response) {
      return props.error.response.status
    }
    // Network Error
    else if (props.error.request) {
      return props.error.code || 'NETWORK_ERROR'
    }
    // Request Setup Error
    else {
      return 'REQUEST_ERROR'
    }
  }

  // Fallback für andere Error-Typen
  if (hasCode(props.error)) {
    return props.error.code
  }

  return 'ERROR'
})

const extractedErrorMessage = computed(() => {
  // Wenn explizit errorMessage übergeben wurde, verwende diese
  if (props.errorMessage !== undefined) {
    return props.errorMessage
  }

  // Ansonsten versuche aus dem error zu extrahieren
  if (!props.error) {
    return 'Ein unbekannter Fehler ist aufgetreten.'
  }

  if (isAxiosError(props.error)) {
    // HTTP Response Error
    if (props.error.response) {
      const { status, statusText, data } = props.error.response

      // Versuche eine benutzerfreundliche Nachricht aus den Response-Daten zu extrahieren
      if (data && typeof data === 'object' && data !== null) {
        const dataObj = data as Record<string, unknown>
        if (dataObj.message && typeof dataObj.message === 'string') {
          return dataObj.message
        }
        if (dataObj.error && typeof dataObj.error === 'string') {
          return dataObj.error
        }
      }

      // Fallback zu HTTP-Status
      if (status >= 400 && status < 500) {
        return `Client-Fehler: ${statusText || 'Ungültige Anfrage'}`
      }
      if (status >= 500) {
        return `Server-Fehler: ${statusText || 'Interner Serverfehler'}`
      }

      return `HTTP-Fehler: ${status} ${statusText || ''}`
    }

    // Network Error
    else if (props.error.request) {
      return 'Netzwerkfehler: Server nicht erreichbar'
    }

    // Request Setup Error
    else if (props.error.message) {
      return `Anfrage-Fehler: ${props.error.message}`
    }
  }

  // Fallback für andere Error-Typen
  if (hasMessage(props.error)) {
    return props.error.message
  }

  if (props.error instanceof Error) {
    return props.error.message
  }

  if (typeof props.error === 'string') {
    return props.error
  }

  return 'Ein unbekannter Fehler ist aufgetreten.'
})

// Erweiterte Error-Details extrahieren
const extractErrorDetails = (error: unknown): string => {
  const details: string[] = []

  if (isAxiosError(error)) {
    // HTTP Response Error
    if (error.response) {
      const { status, statusText, data, headers } = error.response
      const { url, method, baseURL, params } = error.config || {}

      // Vollständige URL zusammenbauen
      const fullUrl = url ? (baseURL ? `${baseURL}${url}` : url) : 'Unbekannt'

      details.push(`=== HTTP Response Error ===`)
      details.push(`${method?.toUpperCase() || 'GET'} ${fullUrl}`)
      details.push(`Status: ${status} ${statusText || ''}`)

      // Query Parameter anzeigen
      if (params && Object.keys(params).length > 0) {
        details.push(`Parameter: ${JSON.stringify(params)}`)
      }

      // Response Headers (nur wichtige)
      if (headers) {
        const importantHeaders = ['content-type', 'content-length', 'server']
        const relevantHeaders = Object.entries(headers)
          .filter(([key]) => importantHeaders.includes(key.toLowerCase()))
          .map(([key, value]) => `${key}: ${value}`)

        if (relevantHeaders.length > 0) {
          details.push(`Headers: ${relevantHeaders.join(', ')}`)
        }
      }

      // Response Data strukturiert anzeigen
      if (data) {
        if (typeof data === 'string') {
          details.push(`Response: ${data}`)
        } else if (typeof data === 'object' && data !== null) {
          const dataObj = data as Record<string, unknown>
          if (dataObj.error) {
            details.push(`Error: ${dataObj.error}`)
          } else if (dataObj.message) {
            details.push(`Message: ${dataObj.message}`)
          } else if (dataObj.errors) {
            details.push(`Validation Errors: ${JSON.stringify(dataObj.errors, null, 2)}`)
          } else {
            details.push(`Response Data: ${JSON.stringify(dataObj, null, 2)}`)
          }
        }
      }
    }

    // Network Error
    else if (error.request) {
      details.push(`=== Network Error ===`)
      details.push(`URL: ${error.request.responseURL || error.config?.url || 'Unbekannt'}`)
      details.push(`Method: ${error.config?.method?.toUpperCase() || 'GET'}`)
      details.push(`Error Code: ${error.code || 'NETWORK_ERROR'}`)

      if (error.message) {
        details.push(`Message: ${error.message}`)
      }
    }

    // Request Setup Error
    else if (error.message) {
      details.push(`=== Request Setup Error ===`)
      details.push(`Message: ${error.message}`)
      if (error.config?.url) {
        details.push(`URL: ${error.config.url}`)
      }
    }
  }

  // Fallback für andere Error-Typen
  else if (hasMessage(error)) {
    details.push(`=== General Error ===`)
    details.push(`Message: ${error.message}`)
  }

  // Zusätzliche Error-Eigenschaften
  if (error && typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>
    const excludeKeys = ['message', 'code', 'response', 'request', 'config']

    const additionalProps = Object.entries(errorObj)
      .filter(([key]) => !excludeKeys.includes(key))
      .filter(([, value]) => value !== undefined && value !== null)

    if (additionalProps.length > 0) {
      details.push(``)
      details.push(`=== Additional Properties ===`)
      additionalProps.forEach(([key, value]) => {
        details.push(`${key}: ${JSON.stringify(value)}`)
      })
    }
  }

  // Zeitstempel
  details.push(``)
  details.push(`Timestamp: ${new Date().toLocaleString('de-DE')}`)

  return details.join('\n')
}

// Computed property für errorDetails
const errorDetails = computed(() => {
  if (props.error) {
    return extractErrorDetails(props.error)
  }
  return ''
})

const copyError = async () => {
  copyButtonPressed.value = true
  try {
    await navigator.clipboard.writeText(
      `${extractedErrorCode.value}: ${extractedErrorMessage.value}${errorDetails.value ? '\n' + errorDetails.value : ''}`,
    )

    // Reset nach 2 Sekunden
    setTimeout(() => {
      copyButtonPressed.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy error:', err)
    copyButtonPressed.value = false
  }
}

onMounted(() => {
  if (props.toastMessage !== null) {
    toast.error(props.toastMessage, {
      timeout: 5000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: false,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: true,
      hideProgressBar: false,
      closeButton: 'button',
      icon: true,
      rtl: false,
    })
  }
})
</script>

<template>
  <div class="flex flex-col items-center py-8 px-4">
    <!-- Main Error Card -->
    <section class="flex justify-center items-center h-96 w-full">
      <div
        class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl w-full mx-4 text-center relative"
      >
        <i class="pi pi-exclamation-triangle text-red-500 text-7xl mb-5"></i>

        <!--* Error Code *-->
        <h1 class="text-5xl font-bold mb-4 tracking-tight text-red-600">
          {{ extractedErrorCode }}
        </h1>

        <!--* Error Message *-->
        <p class="text-xl mb-8 leading-relaxed text-red-600">
          {{ extractedErrorMessage }}
        </p>

        <!--* Action Buttons *-->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            v-if="props.showRetry"
            @click="handleRetry"
            class="text-white bg-red-600 hover:bg-red-700 rounded-md px-4 py-2 transition-colors flex items-center justify-center cursor-pointer"
          >
            <i class="pi pi-refresh mr-2"></i>
            Anfrage erneut senden
          </button>
        </div>

        <!--* Additional Actions *-->
        <div class="flex justify-center mt-4">
          <button
            v-if="props.showDetails && errorDetails"
            @click="toggleDetails"
            class="text-sm px-4 py-2 rounded-md transition-colors duration-200 text-red-400 hover:text-red-600 flex items-center cursor-pointer"
          >
            <i class="pi pi-info-circle mr-1"></i>
            Details {{ showDetailsOpen ? 'ausblenden' : 'anzeigen' }}
          </button>
          <button
            v-if="props.showDetails && errorDetails"
            @click="copyError"
            class="text-sm px-4 py-2 rounded-md transition-all duration-200 flex items-center cursor-pointer"
            :class="
              copyButtonPressed
                ? 'text-green-400 hover:text-green-600'
                : 'text-red-400 hover:text-red-600'
            "
          >
            <i class="pi pi-copy mr-1"></i>
            {{ copyButtonPressed ? 'Fehler kopiert!' : 'Fehler kopieren' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Error Details Accordion -->
    <div
      v-if="props.showDetails && errorDetails"
      class="w-full max-w-2xl mx-4 mt-4 overflow-hidden transition-all duration-300"
      :class="showDetailsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
    >
      <div class="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 class="font-semibold mb-3 flex items-center text-red-800">
          <i class="pi pi-cog mr-2"></i>
          Technische Details
        </h3>
        <pre
          class="text-sm bg-white bg-opacity-60 p-4 rounded-lg overflow-x-auto border whitespace-pre-wrap text-red-700"
          >{{ errorDetails }}</pre
        >
      </div>
    </div>

    <!-- Help Text -->
    <!-- <div class="w-full max-w-2xl mx-4 mt-6 text-center">
      <p class="text-sm text-gray-500">
        Falls das Problem weiterhin besteht, wenden Sie sich an den Support.
      </p>
    </div> -->
  </div>
</template>
