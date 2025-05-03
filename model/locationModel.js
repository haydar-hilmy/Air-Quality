import { get, onValue, push, ref } from "firebase/database";
import { dbFirebase } from "./firebase.js";

// Get All Location
const getAllLocation = async () => {
  try {
    const dataRef = ref(dbFirebase, "location");
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

const saveLocation = async (latitude, longitude) => {
  const locationRef = ref(dbFirebase, "location");

  try {
    const newLocationRef = push(locationRef, {
      latitude: latitude,
      longitude: longitude,
    });
    return {
      message: "Data saved to Firebase successfully",
      id: newLocationRef.key,
    };
  } catch (error) {
    console.error(error);
    return { message: "Failed to save data", error: error.message };
  }
};

export { getAllLocation, saveLocation };
