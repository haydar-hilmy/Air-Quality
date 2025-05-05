import { get, push, ref } from "firebase/database";
import { dbFirebase } from "./firebase.js";
import dotenv from "dotenv";
dotenv.config();

const COLLECTION = "air-quality";

// get from firebase
const getAllAirQuality = async () => {
  try {
    const dataRef = ref(dbFirebase, COLLECTION);
    const snapshot = await get(dataRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting location data: ", error);
    throw error;
  }
};

// save to firebase
const saveAirQuality = async (dataAQ) => {
  const dataRef = ref(dbFirebase, COLLECTION);
  try {
    const newDataRef = push(dataRef, dataAQ);
    return {
      message: "Data Air Quality saved to Firebase successfully",
      id: newDataRef.key,
    };
  } catch (error) {
    console.error(error);
    return { message: "Failed to save AQ data", error: error.message };
  }
};

// fetch to API Air Quality Google
const fetchAirQuality = async ({ latitude, longitude }) => {
  const response = await fetch(
    `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${process.env.AIRQUALITY_APIKEY}`,
    {
      method: "POST",
      body: JSON.stringify({
        location: {
          latitude: latitude,
          longitude: longitude,
        },
        extraComputations: [
          "LOCAL_AQI",
          "HEALTH_RECOMMENDATIONS",
          "DOMINANT_POLLUTANT_CONCENTRATION",
        ],
        universalAqi: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch air quality: ${response.status} ${response.statusText} - ${errorBody}`);
  }
  const data = await response.json();

  return data;
};

export { getAllAirQuality, saveAirQuality, fetchAirQuality };
