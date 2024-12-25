import React from "react";
import { useWeather } from "../../App";
import styles from "./ForecastItem.module.css";


type ForecastItemProps = {
  time: string;
  img: string;
  temp: string;
  key: string;
};

const ForecastItem: React.FC<ForecastItemProps> = ({time,img,temp}) => {
  const { dark } = useWeather();
  return (
    <div className={`${styles.tempForecastItem} ${dark ? "dark" : "light"}`}>
      <p>{time}</p>
      <img src={img} alt="img" />
      <p>{temp}</p>
    </div>
  );
};

export default ForecastItem;
