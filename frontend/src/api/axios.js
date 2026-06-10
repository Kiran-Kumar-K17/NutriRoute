import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.BACKEND_URL
    ? `${import.meta.env.BACKEND_URL}/api`
    : "http://localhost:8000/api",
});
export default API;
