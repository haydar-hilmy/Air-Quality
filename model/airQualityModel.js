import { get, push, ref } from "firebase/database";
import { dbFirebase } from "./firebase.js";

const COLLECTION = 'air-quality';

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
}

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
        return { message: "Failed to save data AQ", error: error.message };
      }
}

export { getAllAirQuality, saveAirQuality }