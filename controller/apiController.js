import { getDistanceFromLatLonInKm } from "../function/haversine.js";
import { isCoord } from "../function/coordChecker.js";
import {
  fetchAirQuality,
  getAllAirQuality,
  saveAirQuality,
} from "../model/airQualityModel.js";
import { isNullOrEmptyObject } from "../function/objectFunction.js";
import { diffMinute } from "../function/timeFunction.js";

const PostLocation = async (req, res, next) => {
  const latitude = req.body.location?.latitude;
  const longitude = req.body.location?.longitude;

  const getTimestamp = new Date().toISOString();
  const checkIsCoord = isCoord(latitude, longitude);

  const result = [],
    fetchPromises = [];

  let isSource = undefined;

  const pushAirQualityFetch = (locationKey) => {
    console.log("fetching air quality | source: api");
    fetchPromises.push(
      fetchAirQuality(locationKey).then((data) => {
        isSource = 'api'
        result.push(data);
      })
    );
  };

  try {
    const getAllData = await getAllAirQuality();
    if (checkIsCoord.isValid == false) {
      throw new Error(checkIsCoord.message);
    }

    let closestItem = null;
    let minDistance = Infinity;

    if (getAllData && Object.keys(getAllData).length > 0) {
      for (const key in getAllData) {
        if (getAllData.hasOwnProperty(key)) {
          const item = getAllData[key];
          let getDistance = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            item.locationKey.latitude,
            item.locationKey.longitude
          );

          if (getDistance <= 12 && getDistance < minDistance) {
            closestItem = item; // getting closest radius
            minDistance = getDistance;
          }
        }
      }

      if (closestItem) {
        if (diffMinute(closestItem.timestamp) < 45) {
          console.log("Waktu kurang dari 45");
          console.log("Cache");
          isSource = 'cache';
          result.push(closestItem.aq);
        } else {
          console.log("Waktu lebih dari 45");
          pushAirQualityFetch(closestItem.locationKey);
        }
      } else {
        console.log("Tidak ada data dalam radius 12km");
        pushAirQualityFetch({ latitude, longitude });
      }
      await Promise.all(fetchPromises);
    } else {
      console.log("Tidak ada collection air-quality");
      pushAirQualityFetch({ latitude, longitude });
      console.log("Menambahkan data baru");
      await Promise.all(fetchPromises);
    }

    let data = {
      locationKey: {
        latitude: latitude,
        longitude: longitude,
      },
      source: isSource,
      aq: result[0],
      timestamp: getTimestamp,
    };

    res.status(200).json({
      saved: await saveAirQuality({
        locationKey: data.locationKey,
        aq: data.aq[0],
      }),
      // data: getAllData,
      data,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};

export { PostLocation };
