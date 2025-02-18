import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

export default axios;
