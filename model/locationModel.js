import { get, onValue, ref } from "firebase/database";
import { dbFirebase } from "./firebase.js";

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

export { getAllLocation };
