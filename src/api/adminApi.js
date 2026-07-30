import axios from "axios";

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com"
).replace(/\/$/, "");


const AdminAPI = axios.create({
  baseURL: BASE_URL + "/",
});

const getAdminAccess = () => localStorage.getItem("admin_access");
const getAdminRefresh = () => localStorage.getItem("admin_refresh");
const setAdminAccess = (t) => {
  localStorage.setItem("admin_access", t);
  localStorage.setItem("access", t);
};
const clearAdminTokens = () => {
  localStorage.removeItem("admin_access");
  localStorage.removeItem("admin_refresh");
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("vendor_name");
};

/* ── REQUEST — attach admin access token ── */
AdminAPI.interceptors.request.use((config) => {
  const token = getAdminAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ── RESPONSE — auto-refresh on 401 ── */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

AdminAPI.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    /* Only handle 401 (token expired / invalid) */
    if (error.response?.status === 401 && !originalRequest._retry) {

      /* Queue concurrent requests while refreshing */
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return AdminAPI(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getAdminRefresh();

      if (!refreshToken) {

        clearAdminTokens();
        window.location.href = "/AdminLogin";
        return Promise.reject(error);
      }

      try {

        const res = await axios.post(
          `${BASE_URL}/api/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccess = res.data.access;
        setAdminAccess(newAccess);

        // Save rotated refresh token if backend returns one (ROTATE_REFRESH_TOKENS=True)
        if (res.data.refresh) {
          localStorage.setItem("admin_refresh", res.data.refresh);
          localStorage.setItem("refresh", res.data.refresh);
        }

        /* Update default header & retry queued requests */
        AdminAPI.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return AdminAPI(originalRequest);

      } catch (refreshError) {

        processQueue(refreshError, null);
        clearAdminTokens();
        window.location.href = "/AdminLogin";
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default AdminAPI;
