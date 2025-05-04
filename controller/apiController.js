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

  const pushAirQualityFetch = (locationKey) => {
    console.log("PUSHAIRQUALITYFETCH")
    fetchPromises.push(
      fetchAirQuality(locationKey).then((data) => {
        result.push({ source: 'api', data });
      })
    );
  };

  try {
    const getAllData = await getAllAirQuality();
    if (checkIsCoord.isValid == false) {
      throw new Error(checkIsCoord.message);
    }

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

          // 12 km and 45 minute
          if (getDistance <= 12) {
            if (diffMinute(item.timestamp) < 45) {
              console.log("waktu kurang dari 45")
              console.log("CACHING")
              // CACHING
              result.push({
                source: 'cache',
                item,
              });
            } else {
              console.log("waktu lebih dari 45")
              // FETCH API AIR QUALITY
              pushAirQualityFetch(item.locationKey)
            }
          } else {
            console.log("distance lebih dari 12")
            // FETCH API AIR QUALITY
            pushAirQualityFetch(item.locationKey);
          }
        }
      }
      await Promise.all(fetchPromises);
    } else {
      console.log("Tidak ada collection air-quality")
      pushAirQualityFetch({ latitude, longitude })
      await Promise.all(fetchPromises);
    }

    let data = {
      locationKey: {
        latitude: latitude,
        longitude: longitude,
      },
      apiData: result,
      timestamp: getTimestamp,
    };

    res.status(200).json({
      saved: await saveAirQuality(data),
      // data: getAllData,
      data
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};

export { PostLocation };
