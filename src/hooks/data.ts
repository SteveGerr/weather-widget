import { ref } from 'vue'
import { weatherData as wd} from "../interfaces/weatherI"

export function useData() {

    const ls = window.localStorage
    const weatherData = ref({} as wd)
    const cities = ref([] as wd[])

    const isData = (data: any) => data ? true : false

    const getData = (url:string) => fetch(url)
    .then(res => res.json())
    .then(setData)
    .catch(error => console.error(error))

    const setData = (data: any) => {
      if (!isData(data)) return

      const {name, sys, main, wind: {speed}, weather, id} = data

      weatherData.value = {
        id,
        city: name,
        country: sys.country,
        feels_like: Math.round(main.feels_like),
        humidity: Math.round(main.humidity),
        pressure: main.pressure,
        temp: Math.round(main.temp),
        wind: Math.round(speed),
        icon: weather[0].icon,
        desc: weather[0].description
      }
      if (ls.getItem("wData") !== null) {
        cities.value = [...JSON.parse(ls.getItem("wData") || "")]
      } else {
        ls.setItem("wData", JSON.stringify([weatherData.value]))
        cities.value = [...JSON.parse(ls.getItem("wData") || "")]
      }
    }

    const setUpdateData = (data: any, citiesList:wd[]) => {
        if (!isData(data)) return

        const {name, sys, main, wind: {speed}, weather, id} = data
        // Check city clone
        if (citiesList.find((c:wd) => c.id === id)) return

        weatherData.value = {
          id,
          city: name,
          country: sys.country,
          feels_like: Math.round(main.feels_like),
          humidity: Math.round(main.humidity),
          pressure: main.pressure,
          temp: Math.round(main.temp),
          wind: Math.round(speed),
          icon: weather[0].icon,
          desc: weather[0].description
        }

        const arr =  [...JSON.parse(ls.getItem("wData") || "")]
        arr.push(weatherData.value)
        ls.setItem("wData", JSON.stringify(arr))
        cities.value = [...JSON.parse(ls.getItem("wData") || "")]
    }


    return { getData, setData, cities, setUpdateData }
}
