import { config } from "dotenv";
config();

type HourData = {
    time: string;
    img: string;
    temp: string;
};

type WeatherData = {
    cityName: string,
    time: string,
    condition: {
        text: string,
        icon: string,
    },
    temp: {
        current: string,
        min: string,
        max: string,
        feelslike: string,
    },
    sunset: string,
    sunrise: string,
    wind: {
        chill_temp: string,
        kph: string,
    },
    pressure: {
        in: string,
        mb: string,
    },
    humidity: string,
    visibility: string,
    uv: string,
    hours: HourData[],
    coordinates: {
        lat: string;
        lon: string;
    }
};

/* Loading weather data */
export const loadingDataForCities = async (API_Method: string, cities: string[]) => {
    try {
        const citiesData = await Promise.all(
            cities.map((city: string) => {
                return fetchWeatherData(API_Method, city);
            })
        );
        return citiesData;
    } catch (error) {
        console.error(error);
    }
};

/* Fetching weather data */
export const fetchWeatherData = async (API_Method: string, city: string | { latitude: string; longitude: string }) => {
    try {
        let url = '';
        const apiKey = process.env.API_KEY_WEATHER;
        if (typeof city === "object") {
            url = `http://api.weatherapi.com/v1/${API_Method}?key=${apiKey}&lat=${city.latitude}&lon=${city.longitude}&days=2`;
        } else {
            url = `http://api.weatherapi.com/v1/${API_Method}?key=${apiKey}&q=${city}&days=2`;
        }
        const response = await fetch(url);
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.error(error);
    }
};


/* Cleaning data for the server */
export const cleanDataForCities = async (cities: string[]): Promise<WeatherData[] | undefined> => {
    try {
        const citiesData = await loadingDataForCities("forecast.json", cities);
        if (!citiesData)
            return undefined;
        const cleanData = citiesData.map((cityData) => {
            let count8Hours: number = 0;
            const nowHour: string = cityData.location.localtime.split(' ')[1].split(':')[0];
            const hoursData: HourData[] = [];

            cityData.forecast.forecastday[0].hour.forEach((hour: any) => {
                let time: string = hour.time.split(" ")[1].split(":")[0];
                if (Number(nowHour) <= Number(time) && count8Hours < 8) {
                    count8Hours++;
                    hoursData.push({
                        time: time,
                        img: hour.condition.icon.replace("///", ""),
                        temp: `${Math.trunc(hour.temp_c)}°`,
                    });
                } else {
                    return;
                }
            });
            if (count8Hours < 8) {
                cityData.forecast.forecastday[1].hour.forEach((hour: any) => {
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
    } catch (error) {
        console.error(error);
    }
};




