
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/* REQUEST INTERCEPTOR — attach access token */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/*  RESPONSE INTERCEPTOR — auto-refresh expired access token */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response, // 
  async (error) => {
    const originalRequest = error.config;

    //  Ignore 401 for login endpoints to prevent page reloads on wrong credentials
    if (
      originalRequest.url.includes("api/login/") ||
      originalRequest.url.includes("api/vendor/login/")
    ) {
      return Promise.reject(error);
    }
    // 🚫 If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // ⏳ Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh");

      if (!refreshToken) {
        // No refresh token — force logout
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // 🔄 Request new access token
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}api/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);

        // ✅ Update auth header and retry queued requests
        API.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return API(originalRequest);
      } catch (refreshError) {
        // ❌ Refresh token also expired — force logout
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "/admin-login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;

