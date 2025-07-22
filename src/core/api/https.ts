import axios from "axios";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const baseURL = import.meta.env.VITE_APP_API_URL;

const https = axios.create({
  baseURL,
  headers,
});

export const getToken = () => localStorage.getItem("accessToken");

https.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers!["Authorization"] = `Bearer ${token}`;
    }

    // if (config.data instanceof FormData) {
    //   delete config.headers!["Content-Type"];
    // }
    return config;
  },
  (error) => Promise.reject(error)
);


https.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const res = await axios.post(`${baseURL}/api/accounts/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = res.data;
          localStorage.setItem("accessToken", access);
          https.defaults.headers["Authorization"] = `Bearer ${access}`;
          originalRequest.headers["Authorization"] = `Bearer ${access}`;
          return https(originalRequest);
        } catch (refreshError) {
          console.error("Error al refrescar token:", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } else {
        localStorage.removeItem("accessToken");
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export { https };
