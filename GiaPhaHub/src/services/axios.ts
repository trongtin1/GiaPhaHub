import axios from "axios";
const VITE_API_URL = "http://localhost:5261/api";
const instance = axios.create({
  baseURL: VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor – gắn access token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – trả thẳng response.data
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
    }
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error?.response?.data || error);
  },
);

export default instance;
