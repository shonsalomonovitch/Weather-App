import { useWeather } from "../../App";
import ForecastItem from "../ForecastItem/ForecastItem";
import WeatherDetail4Row from "../WeatherDetail4Row/WeatherDetail4Row";
import WeatherDetail2Row from "../WeatherDetail2Row/WeatherDetail2Row";
import styles from "./WeatherDashboard.module.css";
import { celsiusToFahrenheit } from "../../utils/utils";
import WindyMap from "../WindyMap/WindyMap";

const WeatherDashboard = () => {
  const { dark, weatherDashboard, fahrenheit } = useWeather();

  return (
    <>
      {weatherDashboard && (
        <div className={`${styles.infoColumn} ${dark ? "dark" : "light"}`}>
          <div className={`${styles.infoRow}`}>
            <h2>{weatherDashboard.cityName}</h2>
            <h1>
              {fahrenheit
                ? celsiusToFahrenheit(weatherDashboard.temp?.current)
                : weatherDashboard.temp?.current}
            </h1>
            <h4>{`H:${
              fahrenheit
                ? celsiusToFahrenheit(weatherDashboard.temp?.max)
                : weatherDashboard.temp?.max
            } L:${
              fahrenheit
                ? celsiusToFahrenheit(weatherDashboard.temp?.min)
                : weatherDashboard.temp?.min
            }`}</h4>
          </div>
          <div className={`${styles.tempForecast} ${styles.gridItem}`}>
            {weatherDashboard.hours?.map((hour) => {
              return (
                hour && (
                  <ForecastItem
                    img={`${hour.img}`}
                    key={`${hour.time}`}
                    temp={`${
                      fahrenheit ? celsiusToFahrenheit(hour.temp) : hour.temp
                    }`}
                    time={`${hour.time}`}
                  ></ForecastItem>
                )
              );
            })}
          </div>
          <div className={`${styles.condition} ${styles.gridItem}`}>
            <h4>Condition</h4>
            <img src={`${weatherDashboard.condition?.icon}`} alt="icon" />
            <p>{`${weatherDashboard.condition?.text}`}</p>
          </div>
          <WeatherDetail2Row
            key={`${weatherDashboard.humidity}`}
            firstRow={`Humidity`}
            secondRow={`${weatherDashboard.humidity}`}
            className={`${styles.gridItem}`}
          ></WeatherDetail2Row>
          <WeatherDetail4Row
            key={`${weatherDashboard.wind?.kph}`}
            firstRow={`Wind kph`}
            secondRow={`${weatherDashboard.wind?.kph}`}
            thirdRow={`Wind temp`}
            fourthRow={`${
              fahrenheit
                ? celsiusToFahrenheit(weatherDashboard.wind?.chill_temp)
                : weatherDashboard.wind?.chill_temp
            }`}
            className={`${styles.gridItem}`}
          ></WeatherDetail4Row>
          <WeatherDetail4Row
            key={`${weatherDashboard.pressure?.in}`}
            firstRow={`Pressure in`}
            secondRow={`${weatherDashboard.pressure?.in}`}
            thirdRow={`Pressure mb`}
            fourthRow={`${weatherDashboard.pressure?.mb}`}
            className={`${styles.gridItem}`}
          ></WeatherDetail4Row>
          <WeatherDetail2Row
            key={`${weatherDashboard.visibility}`}
            firstRow={`Visibility`}
            secondRow={`${weatherDashboard.visibility}`}
            className={`${styles.gridItem}`}
          ></WeatherDetail2Row>
          <WeatherDetail2Row
            key={`${weatherDashboard.uv}`}
            firstRow={`UV Index`}
            secondRow={`${weatherDashboard.uv}`}
            className={`${styles.gridItem}`}
          ></WeatherDetail2Row>
          <WeatherDetail4Row
            key={`${weatherDashboard.sunrise}`}
            firstRow={`Sunrise`}
            secondRow={`${weatherDashboard.sunset}`}
            thirdRow={`Sunset`}
            fourthRow={`${weatherDashboard.sunset}`}
            className={`${styles.gridItem}`}
          ></WeatherDetail4Row>
          <WeatherDetail2Row
            key={`${weatherDashboard.temp?.feelslike}`}
            firstRow={`Feelslike`}
            secondRow={`${
              fahrenheit
                ? celsiusToFahrenheit(weatherDashboard.temp?.feelslike)
                : weatherDashboard.temp?.feelslike
            }`}
            className={`${styles.gridItem}`}
          ></WeatherDetail2Row>
          <div className={`${styles.map}`}>
            {weatherDashboard.coordinates && (
              <WindyMap
                lat={`${weatherDashboard.coordinates.lat}`}
                lon={`${weatherDashboard.coordinates.lon}`}
              ></WindyMap>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default WeatherDashboard;
