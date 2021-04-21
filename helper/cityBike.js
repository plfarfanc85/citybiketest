const axios = require("axios");

const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach";

const getCityBike = async () => {
  console.log("Executing call to API");
  const instance = axios.create({
    baseURL: citybikeurl,
  });

  const resp = await instance.get();
  const stations = resp.data.network.stations;
  const stationsMin = stations.map(
    ({ id, empty_slots, free_bikes, latitude, longitude, name }) => {
      return { id, empty_slots, free_bikes, latitude, longitude, name };
    }
  );
  return stationsMin;
};

module.exports = {
  getCityBike,
};
