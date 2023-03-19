<template>
  <div v-if="compCoords">
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
        @dragCities="(val = []) => getCities = val"
        @showWidgetSettings="widgetVisibleToggler"
      />
    </template>
  </div>
  <p class="widget__warning" v-else>Your geolocation is blocked or no data! Please, unblock geolocation and refresh the page!</p>
</template>

<script lang="ts">
import { useDataURL, useData, useCoords } from './main'
import { defineComponent, ref, onMounted, computed} from 'vue';
import Widget from './components/AppWidget.vue';
import WidgetSettings from './components/WidgetSettings.vue';

export default defineComponent({
  name: 'App',

  components: {
    Widget,
    WidgetSettings
  },

  setup() {

    const { city, getCoords, BASE_URL, API_key, ls: lsCoords} = useCoords()
    const { getDataURL } = useDataURL()
    const { cities, getData, setUpdateData } = useData()

    const ls = window.localStorage
    const isCoords = ref(lsCoords.getItem("userCoord"))
    const widgetShow = ref(true)
    const addedCity = ref("")

    onMounted(() => {
      isCoords.value = lsCoords.getItem("userCoord")
      checkCoords()
    })

    const widgetVisibleToggler = () => widgetShow.value = !widgetShow.value

    const checkCoords = () => {
      if (isCoords.value !== null) {
        city.value = isCoords.value
        getData(getDataURL(BASE_URL, isCoords.value, API_key))
      } else {
        getCoords()
        isCoords.value = lsCoords.getItem("userCoord")
      }
    }

    const updateData = (url:string) => fetch(url)
      .then(res => res.json())
      .then(res => setUpdateData(res, cities.value))
      .catch(error => console.error(error))

    const addCity = (e:string) => {
      if (!e) return
      updateData(getDataURL(BASE_URL, e, API_key))
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

    const compCoords = computed({
      get: () => isCoords.value,
      set: (val) => isCoords.value = val
    })

    return {
      addCity,
      getCities,
      addedCity,
      compCoords,
      widgetShow,
      deleteCity,
      widgetVisibleToggler,
      ...useCoords(),
      ...useData()
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
  .widget__warning {
    font-size: 30px;
    font-weight: 600;
    text-align: center;
  }
</style>