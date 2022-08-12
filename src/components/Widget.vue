<template>
    <div class="widget">
      <template v-for="city in cities.filter((c, i) => i === 0)" :key="city.id">

        <div class="widget__menu">
          <div class="widget__city"><span class="widget__city-name">{{ city.city }}</span>, {{ city.country }}</div>
          <button class="widget__settings-btn" @click="$emit('showWidget')">
            <img class="widget__settings-img" src="../assets/gear-solid.svg" alt="gear">
          </button>
        </div>

        <div class="widget__temp">
          <div class="widget__temp-row">
            <div class="widget__weather-description">{{ city.desc }}</div>
          </div>
          <div class="widget__temp-row">
            <img class="widget__temp-img" :src="getIconSrc(city.icon)" :alt="`${city.desc}`">
            <div class="widget__display-temp">{{ city.temp }}°</div>
          </div>
        </div>

        <div class="widget__weather-params">
          <div class="widget__weather-params-item">feels like: {{ city.feels_like }}°</div>
          <div class="widget__weather-params-item">
            <img class="widget__weather-img" src="../assets/drop-silhouette.png" alt="humidity">
            <span>{{ city.humidity }}%</span>
          </div>
          <div class="widget__weather-params-item">
            <img class="widget__weather-img" src="../assets/wind-solid.svg" alt="wind speed">
            <span>{{ city.wind }} m/s</span>
          </div>
        </div>

      </template>
    </div>

</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { weatherData as wd } from "../interfaces/weatherI"

export default defineComponent({
    name: "Widget",

    props: {
        cities: {
            type: Array as PropType<Array<wd>> | undefined,
            require: true,
            default: null
        }
    },

    emits: ["showWidget"],

    setup(props, { emit }:any) {
        const getIconSrc = (iconCode: string) => `http://openweathermap.org/img/wn/${iconCode}@2x.png`

        emit('showWidget')

        return {
            getIconSrc,
        }
    }

})
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

    .widget__settings-btn,
    .widget__settings-close,
    .widget__settings-add-btn,
    .widget__settings-city-remove {
        border: none;
        background: transparent;
        cursor: pointer;
        &:active {
        transform: scale(.8);
        }

    }

    .widget__settings-btn {
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
        object-fit: cover;
    }

</style>