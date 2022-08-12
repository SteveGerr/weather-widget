<template>
    <div class="widget__settings">
      <div class="widget__settings-header">
        <div>Settings</div>
        <button class="widget__settings-close" @click="$emit('showWidgetSettings')">
          <img src="../assets/close.png" alt="close settings">
        </button>
      </div>

        <!-- eslint-disable-next-line vue/no-mutating-props -->
        <draggable v-model="getCities">
          <template class="widget__settings-city-list" #item="{ element }">
            <li
              class="widget__settings-city-item"
              :id="element.id"
              :key="element.id"
              >
              <img class="widget__settings-burger" src="../assets/burger.png" alt="burger-menu">
              <div class="widget__settings-city-name">{{ element.city }}</div>
              <button class="widget__settings-city-remove" @click="$emit('removeCity', element.id)">
                <img src="../assets/trash.png" alt="remove item">
              </button>
            </li>
          </template>
        </draggable>

      <div class="widget__settings-add-city">
        <label for="add">Add city

          <input name="add" v-model="cityAdded" type="text">
        </label>
        <button class="widget__settings-add-btn" @click="$emit('addCity', cityAdded)"><img src="../assets/enter.png" alt="add city"></button>
      </div>
    </div>

</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { weatherData as wd } from "../interfaces/weatherI"
import Draggable from "vuedraggable";


export default defineComponent({
  name: "WidgetSettings",
  components: {
      Draggable
  },

  props: {
      cities: {
          type: Array as PropType<Array<wd>> | undefined,
          require: true,
          default: null
      }
  },

  emits: ["showWidgetSettings", "removeCity", "addCity", "dragCities"],

  setup(props, {emit}) {
    const cityAdded = ref("")

    const getIconSrc = (iconCode: string) => `http://openweathermap.org/img/wn/${iconCode}@2x.png`

    const getCities = computed({
      get: () => props.cities,
      set: (val) => {
        window.localStorage.setItem("wData", JSON.stringify(val))
        emit("dragCities", val)
      }
    })


    return {
      getCities,
      cityAdded,
      getIconSrc
    }
  }

})
</script>

<style>

</style>