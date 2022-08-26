import { createApp } from 'vue'
import App from './App.vue'

import { ref } from 'vue'
import { weatherData as wd} from "./interfaces/weatherI"
import { useData } from './hooks/data'
import { useCoords } from './hooks/coords'
import { useDataURL } from './hooks/dataURL'
import { useCheckData } from './hooks/checkData'

createApp(App).mount('#app')
export { ref, wd, useData, useCoords, useDataURL, useCheckData }