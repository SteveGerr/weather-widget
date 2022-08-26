
import { ref, useData } from '../main'

export function useCoords() {
    const API_key = "74c12883141c83cfc50a2134a0fbba7a"
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/'
    const ls = window.localStorage
    const city = ref("")
    const { getData } = useData()

    const getCoords = () => {

        const success = (d: any) => {

          const lat = d.coords.latitude
          const long = d.coords.longitude

          const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}`

          fetch(url)
            .then(res => res.json())
            .then(data => {
              ls.setItem("userCoord", data.city || data["localityInfo"]["administrative"][2].name)
              const uc = ls.getItem("userCoord") || ""
              city.value = uc
              const URL = `${BASE_URL}weather?q=${ uc }&units=metric&appid=${API_key}`
              getData(URL)
            })
            .catch(error => console.error(error))
        }

        const error = () => {
            console.error("Get coords error");
        }

        navigator.geolocation.getCurrentPosition(success, error)
    }

    return { city, getCoords, BASE_URL, API_key, ls }
}

