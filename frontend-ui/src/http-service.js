import axios from "axios";
import Store from "./vuex/store";

const HTTP = axios.create({
  baseURL: `http://localhost:4000`,
});

// Request Interceptor
HTTP.interceptors.request.use(function (config) {
  const token = Store.getters.getToken;
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

// Response Interceptor
HTTP.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response.status === 401 &&
      error.response.data.meta.error === "TokenExpiredError"
    ) {
      const { data } = await HTTP.post("/refreshToken", {
        currentUser: Store.state.currentUser,
      });
      const token = data;
      Store.commit("SET_TOKEN", token);
      Store.commit("SET_AUTH_STATUS", true);
      return HTTP.request(error.response.config);
    }
    return Promise.reject(error);
  }
);

const HTTP_Flask = axios.create({
  baseURL: `http://127.0.0.1:5000`,
});

const HTTP_text = axios.create();

export { HTTP, HTTP_text, HTTP_Flask };
