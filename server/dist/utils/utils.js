"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanDataForCities = exports.fetchWeatherData = exports.loadingDataForCities = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
/* Loading weather data */
const loadingDataForCities = (API_Method, cities) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const citiesData = yield Promise.all(cities.map((city) => {
            return (0, exports.fetchWeatherData)(API_Method, city);
        }));
        return citiesData;
    }
    catch (error) {
        console.error(error);
    }
});
exports.loadingDataForCities = loadingDataForCities;
/* Fetching weather data */
const fetchWeatherData = (API_Method, city) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let url = '';
        const apiKey = process.env.API_KEY_WEATHER;
        if (typeof city === "object") {
            url = `http://api.weatherapi.com/v1/${API_Method}?key=${apiKey}&lat=${city.latitude}&lon=${city.longitude}&days=2`;
        }
        else {
            url = `http://api.weatherapi.com/v1/${API_Method}?key=${apiKey}&q=${city}&days=2`;
        }
        const response = yield fetch(url);
        const weatherData = yield response.json();
        return weatherData;
    }
    catch (error) {
        console.error(error);
    }
});
exports.fetchWeatherData = fetchWeatherData;
/* Cleaning data for the server */
const cleanDataForCities = (cities) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const citiesData = yield (0, exports.loadingDataForCities)("forecast.json", cities);
        if (!citiesData)
            return undefined;
        const cleanData = citiesData.map((cityData) => {
            let count8Hours = 0;
            const nowHour = cityData.location.localtime.split(' ')[1].split(':')[0];
            const hoursData = [];
            cityData.forecast.forecastday[0].hour.forEach((hour) => {
                let time = hour.time.split(" ")[1].split(":")[0];
                if (Number(nowHour) <= Number(time) && count8Hours < 8) {
                    count8Hours++;
                    hoursData.push({
                        time: time,
                        img: hour.condition.icon.replace("///", ""),
                        temp: `${Math.trunc(hour.temp_c)}°`,
                    });
                }
                else {
                    return;
                }
            });
            if (count8Hours < 8) {
                cityData.forecast.forecastday[1].hour.forEach((hour) => {
                    if (count8Hours === 8) {
                        return;
                    }
                    let time = hour.time.split(" ")[1].split(":")[0];
                    count8Hours++;
                    hoursData.push({
                        time: time,
                        img: hour.condition.icon.replace("///", ""),
                        temp: `${Math.trunc(hour.temp_c)}°`,
                    });
                });
            }
            const jsonData = {
                cityName: cityData.location.name,
                time: cityData.location.localtime.split(" ")[1],
                condition: {
                    text: cityData.current.condition.text.split(/\s+/).slice(0, 2).join(" "),
                    icon: cityData.current.condition.icon,
                },
                temp: {
                    current: `${Math.trunc(cityData.current.temp_c)}°`,
                    min: `${Math.trunc(cityData.forecast.forecastday[0].day.mintemp_c)}°`,
                    max: `${Math.trunc(cityData.forecast.forecastday[0].day.maxtemp_c)}°`,
                    feelslike: `${Math.trunc(cityData.current.feelslike_c)}°`,
                },
                sunset: cityData.forecast.forecastday[0].astro.sunset,
                sunrise: cityData.forecast.forecastday[0].astro.sunrise,
                wind: {
                    chill_temp: `${Math.trunc(cityData.current.windchill_c)}°`,
                    kph: cityData.current.wind_kph,
                },
                pressure: {
                    in: cityData.current.pressure_in,
                    mb: cityData.current.pressure_mb,
                },
                humidity: `${cityData.current.humidity}%`,
                visibility: cityData.current.vis_km,
                uv: cityData.current.uv,
                hours: hoursData,
                coordinates: {
                    lat: cityData.location.lat,
                    lon: cityData.location.lon
                }
            };
            return jsonData;
        });
        return cleanData;
    }
    catch (error) {
        console.error(error);
    }
});
exports.cleanDataForCities = cleanDataForCities;
