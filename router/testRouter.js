import express from "express";
import dotenv from "dotenv";
import {
  toIsoWithOffset,
  toIsoWithOffsetRoundedToHour,
} from "../function/timeFunction.js";
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

function mostFrequent(arr) {
  const count = {};
  arr.forEach((val) => (count[val] = (count[val] || 0) + 1));
  return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
}

// Get Forecast
router.post("/fc", async (req, res, next) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startTime = toIsoWithOffsetRoundedToHour(tomorrow);
  const endTime = toIsoWithOffsetRoundedToHour(
    new Date(tomorrow.getTime() + 3 * 24 * 60 * 60 * 1000)
  );

  try {
    const days = 7;
    const pageSize = days * 24;

    const response = await fetch(
      `https://airquality.googleapis.com/v1/forecast:lookup?key=${AQ_APIKEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "*",
        },
        body: JSON.stringify({
          pageSize: pageSize,
          universalAqi: true,
          location: {
            latitude: -6.705014720971908,
            longitude: 108.42262795935487,
          },
          period: {
            startTime: startTime,
            endTime: endTime,
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

    // Data hasil dari hourly forecast
    const hourly = data.hourlyForecasts;
    console.log("Jumlah jam dikembalikan: ", hourly.length);

    console.log("Pagesize: ", pageSize);

    // Group berdasarkan tanggal (YYYY-MM-DD)
    const dailyGrouped = {};

    hourly.forEach((entry) => {
      const date = entry.dateTime.split("T")[0];
      if (!dailyGrouped[date]) dailyGrouped[date] = [];
      dailyGrouped[date].push(entry);
    });

    // Ringkas: rata-rata, min, max AQI per hari
    const dailySummary = Object.entries(dailyGrouped).map(([date, entries]) => {
      const aqis = entries.map((e) => e.indexes[0].aqi); // Gunakan indexes[0] = UAQI
      const avgAqi = aqis.reduce((sum, val) => sum + val, 0) / aqis.length;

      return {
        date,
        averageAqi: Math.round(avgAqi),
        maxAqi: Math.max(...aqis),
        minAqi: Math.min(...aqis),
        dominantCategory: mostFrequent(
          entries.map((e) => e.indexes[0].category)
        ),
      };
    });

    res.status(200).json({
      dailySummary,
      data,
    });
  } catch (error) {
    console.error(error?.response?.data || error);
    res.status(500).json({
      error: `Failed to fetch forecast: ${error}`,
    });
  }
});

// Get historical
router.post("/hst", async (req, res, next) => {
  try {
    const response = await fetch(
      `https://airquality.googleapis.com/v1/history:lookup?key=${AQ_APIKEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: {
            latitude: -6.705014720971908,
            longitude: 108.42262795935487,
          },
          hours: 30 * 24, // Ambil data 7 hari terakhir
          pageSize: 168,
          universalAqi: true,
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
    const hourly = data.hoursInfo;

    // Kelompokkan berdasarkan tanggal
    const dailyGrouped = {};

    hourly.forEach((entry) => {
      const date = entry.dateTime.split("T")[0];
      if (!dailyGrouped[date]) dailyGrouped[date] = [];
      dailyGrouped[date].push(entry);
    });

    // Ringkasan harian
    const mostFrequent = (arr) => {
      const count = {};
      arr.forEach((val) => (count[val] = (count[val] || 0) + 1));
      return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
    };

    const dailySummary = Object.entries(dailyGrouped).map(([date, entries]) => {
      const aqis = entries
        .map((e) => e.indexes?.[0]?.aqi)
        .filter((v) => v !== undefined);
      const categories = entries
        .map((e) => e.indexes?.[0]?.category)
        .filter((v) => v !== undefined);

      const avgAqi = aqis.reduce((sum, val) => sum + val, 0) / aqis.length;

      return {
        date,
        averageAqi: Math.round(avgAqi),
        maxAqi: Math.max(...aqis),
        minAqi: Math.min(...aqis),
        dominantCategory:
          categories.length > 0 ? mostFrequent(categories) : null,
      };
    });

    res.status(200).json({
      dailySummary,
      raw: data,
    });
  } catch (error) {
    console.error(error?.response?.data || error);
    res.status(500).json({
      error: `Failed to fetch history: ${error.message}`,
    });
  }
});

const fetchFullHistory = async () => {
  const allHours = [];
  let nextPageToken = null;

  const hoursToFetch = 720; // 30 hari
  const pageSize = 168; // maksimal 7 hari per page

  do {
    const body = {
      location: {
        latitude: -6.705014720971908,
        longitude: 108.42262795935487,
      },
      hours: hoursToFetch,
      pageSize,
      universalAqi: true,
      languageCode: "id",
      extraComputations: [
        "HEALTH_RECOMMENDATIONS",
        "DOMINANT_POLLUTANT_CONCENTRATION",
        "POLLUTANT_ADDITIONAL_INFO",
      ],
      uaqiColorPalette: "RED_GREEN",
    };

    if (nextPageToken) {
      body.pageToken = nextPageToken;
    }

    const response = await fetch(
      `https://airquality.googleapis.com/v1/history:lookup?key=${AQ_APIKEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Request failed: ${error}`);
    }

    const data = await response.json();
    allHours.push(...(data.hoursInfo || []));
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return allHours;
};

router.post("/hst2", async (req, res) => {
  try {
    const hourly = await fetchFullHistory();

    const dailyGrouped = {};
    hourly.forEach((entry) => {
      const date = entry.dateTime.split("T")[0];
      if (!dailyGrouped[date]) dailyGrouped[date] = [];
      dailyGrouped[date].push(entry);
    });

    const mostFrequent = (arr) => {
      const count = {};
      arr.forEach((val) => (count[val] = (count[val] || 0) + 1));
      return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
    };

    const dailySummary = Object.entries(dailyGrouped).map(([date, entries]) => {
      const aqis = entries
        .map((e) => e.indexes?.[0]?.aqi)
        .filter((v) => v !== undefined);
      const categories = entries
        .map((e) => e.indexes?.[0]?.category)
        .filter((v) => v !== undefined);

      const avgAqi =
        aqis.length > 0
          ? aqis.reduce((sum, val) => sum + val, 0) / aqis.length
          : null;

      return {
        date,
        averageAqi: avgAqi !== null ? Math.round(avgAqi) : null,
        maxAqi: aqis.length > 0 ? Math.max(...aqis) : null,
        minAqi: aqis.length > 0 ? Math.min(...aqis) : null,
        dominantCategory:
          categories.length > 0 ? mostFrequent(categories) : null,
      };
    });

    res.status(200).json({ dailySummary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
