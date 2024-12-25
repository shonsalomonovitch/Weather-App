import { currentLocationData, ContextType, WeatherData } from "./types";

export const defaultWeatherData: WeatherData = {
  cityName: "",
  time: "",
  condition: {
    text: "",
    icon: "",
  },
  temp: {
    current: "",
    min: "",
    max: "",
    feelslike: "",
  },
  sunset: "",
  sunrise: "",
  wind: {
    chill_temp: "",
    kph: "",
  },
  pressure: {
    in: "",
    mb: "",
  },
  humidity: "",
  visibility: "",
  uv: "",
  hours: [{ img: "", temp: "", time: "" }],
  coordinates: {
    lat: "",
    lon: "",
  },
};

export const defaultLocationDataType: currentLocationData = {
  lat: 0,
  lng: 0,
};

export const defaultContextType: ContextType = {
  city: "",
  setCity: () => {},
  loading: false,
  setLoading: () => {},
  dark: false,
  setDark: () => {},
  weatherDashboard: null,
  setWeatherDashboard: () => {},
  fahrenheit: true,
  setFahrenheit: () => {},
  hideCityList: false,
  setHideCityList: () => {},
};
