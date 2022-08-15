<template>
    <div class="widget__settings">
      <div class="widget__settings-header">
        <div>Settings</div>
        <button class="widget__settings-close" @click="$emit('showWidgetSettings')">
          <img src="../assets/close.png" alt="close settings">
        </button>
      </div>

        <draggable v-model="getCities" item-key="id">
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
        <label for="add">
          Add city
          <input name="add" v-model="cityAdded" type="text">
        </label>
        <button class="widget__settings-add-btn" @click="emitCityName">
          <img src="../assets/enter.png" alt="add city">
        </button>
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

    const emitCityName = () => {
      emit('addCity', cityAdded.value)
      cityAdded.value = ""
    }

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
      getIconSrc,
      emitCityName
    }
  }

})
</script>

<style lang="scss">
  .widget__settings {
    display: flex;
    flex-direction: column;
  }

  .widget__settings-header{
    display: flex;
    justify-content: space-between;
  }

  .widget__settings-city-list {
    padding-left: 0;
  }

  .widget__settings-city-item {
    display: flex;
    justify-content: space-between;
  }

  .widget__settings-add-city {
    display: flex;
    align-items: flex-end;
    margin: 10px 0 0 0;
    input {
      max-width: 150px;
      max-height: 20px;
      margin-top: 5px;
    }
    label {
      margin-bottom: 5px;
    }
  }

  .widget__settings-close img,
  .widget__settings-city-remove img {
    width: 20px;
    pointer-events: none;
  }

  .widget__settings-burger {
    cursor: move;
  }

</style>