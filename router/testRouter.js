import express from "express";
import dotenv from "dotenv";
import { toIsoWithOffset } from "../function/timeFunction.js";
dotenv.config();

const router = express.Router();

const AQ_APIKEY = process.env.AIRQUALITY_APIKEY;

router.get("/", async (req, res) => {
  try {
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes");
    const data = await response.json();

    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Forecast
router.post("/fc", async (req, res, next) => {
  const startTime = toIsoWithOffset(new Date());
  const endTime = toIsoWithOffset(new Date(Date.now() + 5 * 60 * 60 * 1000));

  console.log("startTime: ", startTime);
  console.log("endTime: ", endTime);

  try {
    const response = await fetch(
      `https://airquality.googleapis.com/v1/forecast:lookup?key=${AQ_APIKEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "*",
        },
        body: JSON.stringify({
          pageSize: 96,
          universalAqi: true,
          location: {
            latitude: -6.705014720971908,
            longitude: 108.42262795935487,
          },
          period: {
            startTime: "2025-05-7T13:58:14+02:00",
            endTime: "2025-05-8T13:58:14+02:00",
          },
          languageCode: "id",
          extraComputations: [
            "HEALTH_RECOMMENDATIONS",
            "DOMINANT_POLLUTANT_CONCENTRATION",
            "POLLUTANT_ADDITIONAL_INFO",
          ],
          uaqiColorPalette: "RED_GREEN",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Request failed: ${error}`);
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error(error?.response?.data || error);
    res.status(500).json({
      error: `Failed to fetch forecast: ${error}`,
    });
  }
});

export default router;
