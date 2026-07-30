import axios from "axios";

// With client + api on the SAME Vercel project/domain, this can just be a
// relative path. No more VITE_API_URL juggling between environments.
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  timeout: 20000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("liftlog_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register");

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem("liftlog_token");
      window.dispatchEvent(new Event("liftlog:unauthorized"));
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(error, fallback = "Something went wrong.") {
  return error.response?.data?.message || error.message || fallback;
}

export default http;
