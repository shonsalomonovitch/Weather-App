import { useWeather } from "../../App";
import { useEffect, useRef, useState } from "react";
import styles from "./City.module.css";
import { WeatherData } from "../../types";
import { sendCityNameForDelete } from "../../api/api";
import { celsiusToFahrenheit } from "../../utils/utils";

type cityProps = {
  children: WeatherData;
  key: string;
};

const City: React.FC<cityProps> = ({ children }) => {
  const { setWeatherDashboard, setCity, dark, fahrenheit } = useWeather();

  const cityDiv = useRef<HTMLDivElement | null>(null);
  const [showDeleteDiv, setShowDeleteDiv] = useState(false);

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (event.button === 2) {
      setShowDeleteDiv(true);
    }

    if (event.button === 0) {
      setWeatherDashboard(children);
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (cityDiv.current && !cityDiv.current.contains(event.target as Node)) {
      setShowDeleteDiv(false);
    }
  };

  const handleContextMenu = (event:MouseEvent) => {
    event.preventDefault();
  }

  const handleOnClickOnDeleteDiv = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    const targetElement = event.currentTarget;
    const parentElement = targetElement.parentNode as HTMLElement;
    if (parentElement) {
      const cityNameToDelete = parentElement.classList[0].replace("-", " ");
      sendCityNameForDelete(cityNameToDelete)
        .then((res) => {
          setCity(res.message);
          console.log(res.message);
        })
        .catch((res) => {
          console.log(res.message);
        });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <>
      <div
        className={`${children.cityName.replace(" ", "-")} ${styles.city} ${
          dark ? "dark" : "light"
        }`}
        onMouseDown={handleOnClick}
        ref={cityDiv}
      >
        <div className={`${styles.locationData}`}>
          <p>{children.cityName}</p>
          <p>{children.time}</p>
          <br />
          <p>{children.condition?.text}</p>
        </div>
        {showDeleteDiv && children.cityName !== "Tel Aviv-Yafo" && (
          <div
            onMouseDown={handleOnClickOnDeleteDiv}
            className={`${styles.deleteDiv}`}
          >
            <p>Delete</p>
          </div>
        )}
        <div className={`${styles.weatherData}`}>
          <h1>
            {fahrenheit
              ? celsiusToFahrenheit(children.temp?.current)
              : children.temp?.current}
          </h1>
          <br />
          <p>{`H:${
            fahrenheit ? celsiusToFahrenheit(children.temp?.max) : children.temp?.max
          } L:${
            fahrenheit ? celsiusToFahrenheit(children.temp?.min) : children.temp?.min
          }`}</p>
        </div>
      </div>
      <hr />
    </>
  );
};

export default City;
