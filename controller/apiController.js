import { get, onValue, push, ref } from "firebase/database";
import { dbFirebase } from "../model/firebase.js";
import { getDistanceFromLatLonInKm } from "../model/haversine.js";
import { getAllLocation, saveLocation } from "../model/locationModel.js";
import { isCoord } from "../function/coordChecker.js";
import { getAllAirQuality, saveAirQuality } from "../model/airQualityModel.js";

const PostLocation = async (req, res, next) => {
  const latitude = req.body.location?.latitude;
  const longitude = req.body.location?.longitude;

  const getTimestamp = new Date().toISOString();

  try {
    const checkIsCoord = isCoord(latitude, longitude);
    const getAllData = await getAllLocation();

    let data = {
      locationKey: {
        latitude: latitude,
        longitude: longitude,
      },
      apiData: "",
      timestamp: getTimestamp
    };

    // {
    //   "locationKey": "lat,lng",
    //   "aqiData": { ... },
    //   "timestamp": "2025-04-30T10:00:00Z"
    // }

    res.status(200).json({
      data: await saveAirQuality(data),
      sending: data
    });
  } catch (error) {
    console.log("Error: ", error);
  }

  //   // MAIN
  //   const response = await fetch(
  //     `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${process.env.AIRQUALITY_APIKEY}`,
  //     {
  //       method: "POST",
  //       body: JSON.stringify({
  //         location: {
  //           latitude: latitude,
  //           longitude: longitude,
  //         },
  //         extraComputations: [
  //           "LOCAL_AQI",
  //           "HEALTH_RECOMMENDATIONS",
  //           "DOMINANT_POLLUTANT_CONCENTRATION",
  //         ],
  //         universalAqi: true,
  //       }),
  //       headers: {
  //         "Content-Type": "application/json", // Jangan lupa untuk menyertakan header ini
  //       },
  //     }
  //   );

  //   // Mengecek apakah respons berhasil
  //   if (!response.ok) {
  //     // Jika response tidak sukses, beri pesan kesalahan
  //     return res.status(response.status).json({
  //       message: "Failed to fetch air quality data",
  //       error: await response.text(), // Ambil pesan error dari response jika ada
  //     });
  //   }

  //   // Mengambil body dari response sebagai JSON
  // const data = await response.json();

  //   // Mengirimkan data sebagai JSON
  //   res.status(200).json(data);

  // try {
  //   res.status(200).json({data: await getAllLocation()})
  // } catch (error) {
  //   console.log(error)
  //   res.json({message: "Error"})
  // }
};

export { PostLocation };
