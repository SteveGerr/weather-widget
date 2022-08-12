import { CompositionAPIEmit } from 'vue-typed-emit'

export type weatherData = {
  id: number,
  /** city */
  city: string,
  country: string,
  feels_like: number,
  humidity: number,
  pressure: number,
  temp: number,
  wind: number,
  icon: string,
  desc: string
}