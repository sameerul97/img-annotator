import axios from "axios";
import { API_DOMAIN } from "../utils/helper";

const API = axios.create({ baseURL: API_DOMAIN });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `${localStorage.getItem("token")}`;
  }

  return req;
});

export default API;
export const fetchAllImages = () => API.get(`/allimages/index.php`);
export const fetchImages = (page_no = 1, search_query = "") =>
  API.get(`/images/index.php?page_no=${page_no}&image_name=${search_query}`);
