import { useEffect, useState } from "react";
import { WeatherData } from "../../types";
import { useWeather } from "../../App";
import City from "../City/City";
import styles from "./CitiesList.module.css";
import { fetchCitiesWeatherData } from "../../api/api";
import Search from "../Search/Search";

const CitiesList = () => {
  const { hideCityList, city, setCity, dark, setWeatherDashboard } =
    useWeather();
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  const [data, setData] = useState(Object);

  useEffect(() => {
    fetchCitiesWeatherData().then((newData) => {
      if (newData.isSuccess) {
        setData(newData.data);
        const dataForDashboard = JSON.parse(newData.data);
        setWeatherDashboard(dataForDashboard[dataForDashboard.length - 1]);
      } else {
        console.log(`Message: an error occured, Success: ${newData.isSuccess}`);
      }
    });
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [city, setCity]);

  return (
    <>
      {!hideCityList && (
        <div
          className={`${styles.citiesList} ${
            dark ? "dark" : "light"
          } citiesList`}
        >
          {data && data.length > 0 ? (
            JSON.parse(data).map((currentData: WeatherData) => {
              return <City key={currentData.cityName}>{currentData}</City>;
            })
          ) : (
            <h1>Couldn't find data</h1>
          )}
          {screenSize < 980 && <Search />}
        </div>
      )}
    </>
  );
};

export default CitiesList;
