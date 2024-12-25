import { useWeather } from "../../App";
import styles from "./Header.module.css";
import Search from "../Search/Search";
import Toggle from "../Toggle/Toggle";
import nightIcon from "../../assets/nightIcon.png";
import dayIcon from "../../assets/dayIcon.png";
import { useEffect, useState } from "react";

const Header = () => {
  const {
    hideCityList,
    setHideCityList,
    dark,
    setDark,
    fahrenheit,
    setFahrenheit,
  } = useWeather();
  const mainRow = document.querySelector(".mainRow");

  const [menuOpen, setMenuOpen] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  const themeOnChange = () => {
    setDark(!dark);
  };

  const degreeOnChange = () => {
    setFahrenheit(!fahrenheit);
  };

  const ifHideCityListIsTrue = () => {
    if (mainRow && mainRow instanceof HTMLElement) {
      mainRow.style.gridTemplateColumns = "220px 1fr";
      mainRow.style.gridTemplateAreas = '"cities info"';
    }
  };

  const ifHideCitylistIsFalse = () => {
    if (mainRow && mainRow instanceof HTMLElement) {
      mainRow.style.gridTemplateColumns = "1fr";
      mainRow.style.gridTemplateAreas = '"info"';
    }
  };

  const handleOnClickOnImg = () => {
    setHideCityList(!hideCityList);
    if (!hideCityList) {
      ifHideCitylistIsFalse();
    } else {
      ifHideCityListIsTrue();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    if (screenSize <= 980 ) {
      ifHideCitylistIsFalse();
      const citiesList = document.querySelector(".citiesList");
      if (citiesList) mainRow?.append(citiesList);
    }
    if (screenSize > 980 && hideCityList) {
      ifHideCityListIsTrue();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header>
      <div className={`${styles.headerRow}`}>
        <div className={styles.logoContainer}>
          {screenSize > 980 && (
            <img
              onClick={handleOnClickOnImg}
              className={styles.logo}
              src={dark ? nightIcon : dayIcon}
              alt="img"
            />
          )}
          <Toggle
            toggleType={"theme"}
            isChecked={dark}
            handleOnChange={themeOnChange}
          ></Toggle>
          <Toggle
            toggleType={"degree"}
            isChecked={fahrenheit}
            handleOnChange={degreeOnChange}
          ></Toggle>
        </div>
        {screenSize > 980 && <Search />}
      </div>
    </header>
  );
};
export default Header;
