<template>
  <template v-if="widgetShow">
    <Widget
      :cities="getCities"
      @showWidget="widgetVisibleToggler"
    />
  </template>
  <template v-else>
    <WidgetSettings
      :cities="getCities"
      @addCity="addCity"
      @removeCity="deleteCity"
      @dragCities="(val = []) => cities = val"
      @showWidgetSettings="widgetVisibleToggler"
    />
  </template>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, getCurrentInstance   } from 'vue';
import { weatherData as wd} from "./interfaces/weatherI"
import Widget from './components/Widget.vue';
import WidgetSettings from './components/WidgetSettings.vue';

export default defineComponent({
  name: 'App',

  components: {
    Widget,
    WidgetSettings
  },

  setup() {

    const API_key = "74c12883141c83cfc50a2134a0fbba7a"
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/'
    const ls = window.localStorage
    const city = ref("")
    let widgetShow = ref(true)
    const cities = ref([] as wd[])
    let urlQuery = ls.getItem("userCoord")
    let getDataURL = `${BASE_URL}weather?q=${ urlQuery }&units=metric&appid=${API_key}`
    const addedCity = ref("")
    const instance = getCurrentInstance()

    /** All data */
    let weatherData = ref({} as wd)

    onMounted(() => {
      checkCoords()
    })

    const widgetVisibleToggler = () => widgetShow.value = !widgetShow.value


    const getCoords = () => {
      const success = (d: any) => {

        const lat = d.coords.latitude
        const long = d.coords.longitude

        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}`

        fetch(url)
          .then(res => res.json())
          .then(data => {
            ls.setItem("userCoord", data.city || data["localityInfo"]["administrative"][2].name)
            let uc = ls.getItem("userCoord") || ""
            city.value = uc
            let getDataURL = `${BASE_URL}weather?q=${ uc }&units=metric&appid=${API_key}`
            getData(getDataURL)
          })
          .catch(error => console.error(error))
      }

      const error = () => {
        console.log("Get coords error");
      }

      navigator.geolocation.getCurrentPosition(success, error)

    }


    const getData = (url:string) => fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(error => console.error(error))

    const checkCoords = () => {
      const coords = ls.getItem("userCoord")
      if (coords) {
        city.value = coords
        getData(getDataURL)
      } else {
        getCoords()
      }
    }

    const isData = (data: any) => data ? true : false

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

    const setUpdateData = (data: any) => {
      if (!isData(data)) return

      const {name, sys, main, wind: {speed}, weather, id} = data

      // Check city clone
      if (getCities.value.find(c => c.id === id)) return

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

      let arr =  [...JSON.parse(ls.getItem("wData") || "")]
      arr.push(weatherData.value)
      ls.setItem("wData", JSON.stringify(arr))
      getData(getDataURL)
    }

    const updateData = () => fetch(`${BASE_URL}weather?q=${addedCity.value}&units=metric&appid=${API_key}`)
      .then(res => res.json())
      .then(setUpdateData)
      .catch(error => console.error(error))

    const addCity = (e:string) => {
      if (!e) return
      addedCity.value = e
      updateData()
    }

    const deleteCity = (id: number) => {
      cities.value = cities.value.filter((c) => c.id !== id)
      ls.setItem("wData", JSON.stringify(getCities.value))
    }

    const getCities = computed({
      get: () => cities.value,
      set: (val) => {
        cities.value = [...val]
        ls.setItem("wData", JSON.stringify(cities.value))
      }
    })

    return {
      city,
      cities,
      addCity,
      getData,
      instance,
      getCities,
      addedCity,
      widgetShow,
      deleteCity,
      widgetVisibleToggler
    }
  },

});
</script>

<style lang="scss">
  .widget,
  .widget__settings {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    max-width: 200px;
    margin: auto;
    padding: 5px;
    font-family: 'Mouse Memoirs', sans-serif;
    color: #565656;
    box-shadow: 1px 3px 8px 0px rgba(34, 60, 80, 0.2);
  }
</style>
