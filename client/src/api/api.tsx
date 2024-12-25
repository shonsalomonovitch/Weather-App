import { ApiResponse } from "../types";

const baseUrl = "http://localhost:3000/";

/* Function send get request for data about the cities from DB */
const fetchCitiesWeatherData = async (): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${baseUrl}`, {
      method: "GET",
    });
    const { data, message, isSuccess } = await res.json();
    return {
      isSuccess: isSuccess,
      data: data,
      message: message,
    };
  } catch (error) {
    return {
      isSuccess: false,
      data: "",
      message: "Unexpected error",
    };
  }
};

/* Function to send post request for particular city */

const sendCityNameByPost = async (cityName: string): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${baseUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: `${cityName}` }),
    });

    const { data, message, isSuccess } = await res.json();

    return {
      isSuccess: isSuccess,
      data: data,
      message: message,
    };
  } catch (error) {
    return {
      isSuccess: false,
      data: "",
      message: "Unexpected error",
    };
  }
};

/* Function to send delete request for particular city */
const sendCityNameForDelete = async (
  cityName: string
): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${baseUrl}${cityName}`, {
      method: "DELETE",
    });

    const { data, message, isSuccess } = await res.json();

    return {
      isSuccess: isSuccess,
      data: data,
      message: message,
    };
  } catch (error) {
    return {
      isSuccess: false,
      data: "",
      message: `${error}`,
    };
  }
};

export { fetchCitiesWeatherData, sendCityNameByPost, sendCityNameForDelete };
