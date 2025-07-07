import './assets/main.css'
import 'primeicons/primeicons.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import axios from 'axios'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueSpinnersPlugin } from 'vue3-spinners'

const app = createApp(App)

app.use(router)
app.use(VueSpinnersPlugin)
app.use(Toast)

// API-Timeout 30 Sekunden
axios.defaults.timeout = 30000

app.mount('#app')
