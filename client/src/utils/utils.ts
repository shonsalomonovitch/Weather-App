export const celsiusToFahrenheit = (num: string) => {
    const ans = parseInt(num);
    return String(Math.trunc(((ans * (9/5)) + 32))) + '°';
}

/* Fetching weather data */
export const fetchWeatherData = async (API_Method: string, city: string | { latitude: string; longitude: string }) => {
    try {
        let url = '';
        const apiKey = process.env.REACT_APP_API_KEY_WEATHER;
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