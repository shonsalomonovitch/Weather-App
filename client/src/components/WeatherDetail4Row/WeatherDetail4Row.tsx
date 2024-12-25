import styles from "./WeatherDetail4Row.module.css";
import { useWeather } from "../../App";

type weatherDetail4RowProps = {
  firstRow: string;
  secondRow: string;
  thirdRow: string;
  fourthRow: string;
  className: string;
  key: string;
};

const WeatherDetail4Row: React.FC<weatherDetail4RowProps> = ({
  firstRow,
  secondRow,
  thirdRow,
  fourthRow,
  className,
  key,
}) => {
  const { dark } = useWeather();

  return (
    <div key={`${key}`} className={`${styles.weatherDetail4Row} ${className} ${dark ? "dark" : "light"}`}>
      <h4>{firstRow}</h4>
      <p>{secondRow}</p>
      <h4>{thirdRow}</h4>
      <p>{fourthRow}</p>
    </div>
  );
};

export default WeatherDetail4Row;
