export type HourData = {
  time: string;
  img: string;
  temp: string;
};

export type ApiResponse = {
  isSuccess: boolean;
  data: string;
  message: string;
};

export type currentLocationData = { lat: number; lng: number };

export type WeatherData = {
  cityName: string;
  time: string;
  condition: {
    text: string;
    icon: string;
  };
  temp: {
    current: string;
    min: string;
    max: string;
    feelslike: string;
  };
  sunset: string;
  sunrise: string;
  wind: {
    chill_temp: string;
    kph: string;
  };
  pressure: {
    in: string;
    mb: string;
  };
  humidity: string;
  visibility: string;
  uv: string;
  hours: HourData[];
  coordinates: {
    lat: string;
    lon: string;
  };
};

export type ContextType = {
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  weatherDashboard: WeatherData | null;
  setWeatherDashboard: React.Dispatch<React.SetStateAction<WeatherData | null>>;
  fahrenheit: boolean;
  setFahrenheit: React.Dispatch<React.SetStateAction<boolean>>;
  hideCityList: boolean;
  setHideCityList: React.Dispatch<React.SetStateAction<boolean>>;
};
