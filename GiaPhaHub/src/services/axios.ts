import axios from "axios";
import { store } from "../features";
import { logout, refreshToken } from "@/features/slices/auth/thunks";

const API_URL = "http://localhost:5261/api";

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ========================
   Request interceptor
======================== */

instance.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ========================
   Refresh token queue
======================== */

let isRefreshing = false;

let failedQueue: {
  resolve: () => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
};

/* ========================
   Response interceptor
======================== */

instance.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      /* Nếu chưa refresh */
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // refresh token
          await store.dispatch(refreshToken()).unwrap();

          // retry các request đang queue
          processQueue(null);

          // retry request hiện tại
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      /* Nếu đang refresh → đưa request vào queue */

      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return instance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    return Promise.reject(error.response?.data || error);
  },
);

export default instance;

