import { useWeather } from "../../App";
import { useEffect, useRef, useState } from "react";
import styles from "./Search.module.css";
import { sendCityNameByPost } from "../../api/api";
import { fetchWeatherData } from "../../utils/utils";

const Search = () => {
  const { loading, setCity } = useWeather();
  const cityRef = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [cities, setCities] = useState([]);
  const autoCompleteRef = useRef<HTMLDivElement | null>(null);
  
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cityToAdd = cityRef.current;

    if (!cityToAdd) {
      alert("You must write a city name!");
      return;
    }
    const { isSuccess, message } = await sendCityNameByPost(cityToAdd);
    if (!isSuccess) {
      alert(message);
      return;
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setCity(cityToAdd);
  };

  const handleAutoCompleteInputOnChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    cityRef.current = event.target.value;
    try {
      const data = await fetchWeatherData("search.json", cityRef.current);
      setCities(
        data.map((city: any) => {
          if (`${city.name} ${city.country}`.length > 25)
            return `${city.name}, ${city.country}`.substring(0, 21) + "...";
          return `${city.name}, ${city.country}`;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleAutoCompleteItemOnClick = (city: string) => {
    if (inputRef.current) {
      inputRef.current.value = city;
    }
    
    setCities([]);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      autoCompleteRef.current &&
      !autoCompleteRef.current.contains(event.target as Node)
    ) {
      setCities([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <form
      autoComplete="off"
      onSubmit={handleOnSubmit}
      className={styles.searchBar}
    >
      <div className={`${styles.autoComplete}`}>
        <input
          ref={inputRef}
          onChange={handleAutoCompleteInputOnChange}
          className={styles.searchInput}
          placeholder="Search for a city"
        />
        <div className={`${styles.autoCompleteItems}`} ref={autoCompleteRef}>
          {cities &&
            cities.map((city: string) => (
              <div onClick={() => handleAutoCompleteItemOnClick(city)}>
                <strong>{city.substring(0, cityRef.current.length)}</strong>
                {city.substring(cityRef.current.length)}
              </div>
            ))}
        </div>
      </div>
      <button className={styles.searchButton} type="submit" disabled={loading}>
        {loading ? "Loading" : "Add"}
      </button>
    </form>
  );
};

export default Search;
