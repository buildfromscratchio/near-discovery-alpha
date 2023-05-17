import axios from "axios";

const API_URL = process.env.API_URL;
// const API_URL = "http://localhost:8000/api/v1";
const httpClient = (baseURL = API_URL) => {
  const token = localStorage.getItem("accessToken");
  const instance = axios.create({
    baseURL,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      Authorization: `Bearer ${token}`,
    },
    // validateStatus: false,
  });

  return instance;
};

export default httpClient;
