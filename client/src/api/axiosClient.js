import axios from "axios";
import basePath from "../config/api-config";
import { storage } from "../utils/storage";

// create resuable axios instance for all API requests
const axiosClient = axios.create({
    baseURL: basePath,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptros runs before every request
// It automatically add JWT token into Authorization header if token exists
axiosClient.interceptors.request.use(
    // Promise to set authorization header
    (config) => {
        const token = storage.getToken();

        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosClient;