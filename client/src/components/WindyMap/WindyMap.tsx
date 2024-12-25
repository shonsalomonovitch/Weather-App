import { useEffect, useRef } from "react";
import L from "leaflet";
import styles from "./WindyMap.module.css";

type WindyMapProps = {
  lat: string;
  lon: string;
};

const WindyMap: React.FC<WindyMapProps> = ({lat,lon}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api.windy.com/assets/map-forecast/libBoot.js";
    script.async = true;

    script.onload = async () => {
      const options = {
        key: process.env.REACT_APP_API_KEY_MAP,
        lat: lat,
        lon: lon,
        zoom: 5,
      };

      if (window.windyInit) {
        window.windyInit(options, (windyAPI: any) => {
          // const { map } = windyAPI;
          L.popup();
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [lat,lon]);

  return <div id="windy" ref={mapContainerRef} className={`${styles.map}`} />;
};

export default WindyMap;
