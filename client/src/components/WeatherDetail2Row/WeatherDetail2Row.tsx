import { useWeather } from "../../App";
import styles from "./WeatherDetail2Row.module.css";

type weatherDetail2RowProps = {
  firstRow: string;
  secondRow: string;
  className: string;
  key: string;
};

const WeatherDetail2Row: React.FC<weatherDetail2RowProps> = ({
  firstRow,
  secondRow,
  className,
  key,
}) => {
  const { dark } = useWeather();

  return (
    <div key={`${key}`} className={`${styles.weatherDetail2Row} ${className} ${dark ? "dark" : "light"}`}>
      <h4>{firstRow}</h4>
      <p>{secondRow}</p>
    </div>
  );
};

export default WeatherDetail2Row;
