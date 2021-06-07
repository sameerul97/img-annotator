import axios from "axios";
import { API_DOMAIN } from "./helper";

// export default axios.create({
//   baseURL: API_DOMAIN,

//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded",
//   },
// });
const token = localStorage.getItem("token");

var instance = axios.create({
  baseURL: API_DOMAIN,
  // headers: {
  //   "Content-Type": "application/x-www-form-urlencoded",
  // },
  // headers: {
  //   "Content-Type": "application/x-www-form-urlencoded",
  //   Authorization: localStorage.getItem("token"),

  //   // "Content-Type": "application/json",
  // },
});

// instance.defaults.headers.common["Authorization"] = localStorage.getItem(
//   "token"
// );

// instance.interceptors.request.use(
//   function (config) {
//     if (token) {
//       config.headers["Authorization"] = localStorage.getItem("token");
//     }
//     return config;
//   }
//   // function (error) {
//   //   return Promise.reject(error);
//   // }
// );

export function updateAxiosInt() {
  instance.interceptors.request.use(
    function (config) {
      if (token) {
        config.headers["Authorization"] = localStorage.getItem("token");
      }
      return config;
    }
    // function (error) {
    //   return Promise.reject(error);
    // }
  );
}

updateAxiosInt();

// instance.interceptors.request.use((req) => {
//   // `req` is the Axios request config, so you can modify
//   // the `headers`.
//   req.headers.Authorization = token;
//   return req;
// });

export default instance;
