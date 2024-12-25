import { useState, createContext, useContext, useEffect } from "react";
import Header from "./components/Header/Header";
import CitiesList from "./components/CitiesList/CitiesList";
import WeatherDashboard from "./components/WeatherDashboard/WeatherDashboard";
import { ContextType, WeatherData } from "./types";
import { defaultContextType } from "./defaultData";
import { fetchCitiesWeatherData } from "./api/api";
import NetworkStatus from "./components/NetworkStatus/NetworkStatus";
import "./App.css";

const Context = createContext<ContextType>(defaultContextType);

export const useWeather = () => useContext(Context);

export const App = () => {
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);

  const [dark, setDark] = useState(false);

  const [weatherDashboard, setWeatherDashboard] = useState<WeatherData | null>(
    null
  );

  const [fahrenheit, setFahrenheit] = useState(false);

  const [hideCityList, setHideCityList] = useState(false);

  useEffect(() => {
    const intialData = async () => {
      const newData = await fetchCitiesWeatherData();
      if (newData.isSuccess) {
        const dataForDashboard = JSON.parse(newData.data);
        setCity("Tel Aviv-Yafo");
        setWeatherDashboard(dataForDashboard[0]);
      }
    };
    intialData();
  }, []);

  return (
    <div className={`App ${dark ? "dark" : "light"}`}>
      <NetworkStatus />
      <Context.Provider
        value={{
          city,
          setCity,
          loading,
          setLoading,
          dark,
          setDark,
          weatherDashboard,
          setWeatherDashboard,
          fahrenheit,
          setFahrenheit,
          hideCityList,
          setHideCityList,
        }}
      >
        <Header />
        <main className="mainRow">
          <CitiesList />
          <WeatherDashboard />
        </main>
      </Context.Provider>
    </div>
  );
};
