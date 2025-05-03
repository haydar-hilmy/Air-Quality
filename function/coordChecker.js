import { messageReturner } from "./messageReturner.js";

const isCoord = (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    return messageReturner(false, "Latitude and longitude must be valid numbers");
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return messageReturner(false, 'Latitude must be between -90 and 90, and longitude between -180 and 180');
  }

  return messageReturner(true, "True Coord");
};

export { messageReturner, isCoord }