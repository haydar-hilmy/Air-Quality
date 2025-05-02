const PostLocation = (req, res, next) => {
    console.log("Request Body: ", req.body);
  
    //     const latitude = req.body.location?.latitude;
    //   const longitude = req.body.location?.longitude;
  
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
    //   const data = await response.json();
  
    //   // Mengirimkan data sebagai JSON
    //   res.status(200).json(data);
  
    //   // const locationRef = ref(dbFirebase, "location");
  
    //   // try {
    //   //   const newLocationRef = push(locationRef, {
    //   //     latitude: latitude,
    //   //     longitude: longitude,
    //   //   });
    //   //   res.status(200).json({
    //   //     message: "Data saved to Firebase successfully",
    //   //     id: newLocationRef.key,
    //   //   });
    //   // } catch (error) {
    //   //   console.error(error);
    //   //   res
    //   //     .status(500)
    //   //     .json({ message: "Failed to save data", error: error.message });
    //   // }
  };
  
  export { PostLocation };
  