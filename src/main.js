import './assets/main.css'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

// PRIMEVUE
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes';
import 'primeicons/primeicons.css'

// AXIOS
import axios from 'axios'
import VueAxios from 'vue-axios'
axios.defaults.baseURL = "http://margaret.api.test/v1/"


const app = createApp(App)


const MyPreset = definePreset(Aura, {
    semantic : {
        primary : {
            50: '{indigo.50}',
            100: '{indigo.100}',
            200: '{indigo.200}',
            300: '{indigo.300}',
            400: '{indigo.400}',
            500: '{indigo.500}',
            600: '{indigo.600}',
            700: '{indigo.700}',
            800: '{indigo.800}',
            900: '{indigo.900}',
            950: '{indigo.950}'
        }
    }
});

app.use(router)
// app.use(PrimeVue);
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            prefix: 'p',
            darkModeSelector: '.my-app-dark',
            cssLayer: false
        }
    }
 });
app.use(VueAxios, axios)




app.mount('#app')
