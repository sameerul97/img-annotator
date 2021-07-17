import axios from "axios";
import { API_DOMAIN } from "./helper";

const token = localStorage.getItem("token");

var instance = axios.create({
  baseURL: API_DOMAIN,
});

export function updateAxiosInt() {
  instance.interceptors.request.use(
    function (config) {
      if (token) {
        config.headers["Authorization"] = localStorage.getItem("token");
      }
      return config;
    }
  );
}

updateAxiosInt();

export default instance;
