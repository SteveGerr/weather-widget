<template>
  <main>
    <div class="widget">
      <div class="widget__menu">
        <div class="widget__city">{{ weatherData.name }}, {{ weatherData.country }}</div>
        <button class="widget__settings-btn">
          <img class="widget__settings-img" src="./assets/gear-solid.svg" alt="gear">
        </button>
      </div>
      <div class="widget__temp">
        <div class="widget__temp-row">
          <div class="widget__weather-description">{{ weatherData.desc }}</div>
        </div>
        <div class="widget__temp-row">
          <img class="widget__temp-img" :src="`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`" :alt="`${weatherData.desc}`">
          <div class="widget__display-temp">{{ weatherData.temp }}°</div>
        </div>
      </div>
      <div class="widget__weather-params">
        <div class="widget__weather-params-item">feels like: {{ weatherData.feels_like }}°</div>
        <div class="widget__weather-params-item">
          <img class="widget__weather-img" src="./assets/drop-silhouette.png" alt="humidity">
          <span>{{ weatherData.humidity }}%</span>
        </div>
        <div class="widget__weather-params-item">
          <img class="widget__weather-img" src="./assets/wind-solid.svg" alt="wind speed">
          <span>{{ weatherData.wind }} m/s</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { weatherData as wd } from "./interfaces/weatherI"

export default defineComponent({
  name: 'App',

  components: {
  },

  setup() {

    const API_key = "74c12883141c83cfc50a2134a0fbba7a"
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/'
    let city = ref("")

    /** All data */
    let weatherData = ref({} as wd)

    onMounted(() => {
      getData()
    })

    const isData = (data: any) => data ? true : false

    const setData = (data: any) => {
      if (!isData(data)) return
      console.log(data);
      const {name, sys, main, wind: {speed}, weather} = data

      weatherData.value = {
        name,
        country: sys.country,
        feels_like: Math.round(main.feels_like),
        humidity: Math.round(main.humidity),
        pressure: main.pressure,
        temp: Math.round(main.temp),
        wind: Math.round(speed),
        icon: weather[0].icon,
        desc: weather[0].description
      }
    }

    const getData = () => fetch(`${BASE_URL}weather?q=${city.value || 'Samara'}&units=metric&appid=${API_key}`)
        .then(res => res.json())
        .then(setData)
        .catch(error => console.error(error))

    return {
      getData,
      weatherData,
    }
  },

});
</script>

<style lang="scss">
  .widget {
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
  .widget__menu,
  .widget__temp-row,
  .widget__weather-params {
    display: flex;
    flex-direction: row;
  }

  .widget__menu {
    justify-content: space-between;
    font-size: 22px;
  }

  .widget__settings-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    &:hover {
      .widget__settings-img {
        transform: rotate(45deg);
        transition: transform .4s;
      }
    }
  }

  .widget__weather-description {
    width: 100%;
    margin: auto;
    text-align: center;
  }

  .widget__weather-params {
    flex-wrap: wrap;
  }

  .widget__display-temp {
    margin: auto;
    font-size: 46px;
  }

  .widget__weather-params-item {
    display: flex;
    align-items: center;
  }

  .widget__weather-params-item:first-child {
    width: 100%;
    font-size: 22px;
  }
  .widget__weather-params-item:nth-child(2),
  .widget__weather-params-item:nth-child(3) {
    width: 50%;
    font-size: 22px;
  }

  .widget__weather-img,
  .widget__settings-img {
    width: 16px;
    height: 16px;
    transition: transform .4s;
  }

  .widget__weather-img {
    margin: 5px;
  }

  .widget__temp-img {
    width: 100%;
    max-width: 100px;
    max-height: 100px;
  }
</style>
