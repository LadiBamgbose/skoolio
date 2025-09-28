import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const isCloud = import.meta.env.VITE_APP_ENV === 'dev' || import.meta.env.VITE_APP_ENV === 'prod';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const port = import.meta.env.VITE_BACKEND_PORT || 4000; // Your backend runs on port 4000

const ApiHandler: AxiosInstance = axios.create({
    baseURL: isCloud ? `${backendUrl}/api` : `http://localhost:${port}/api`
})

ApiHandler.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // attach the token to the request
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
ApiHandler.interceptors.response.use(
    (response: AxiosResponse) => {
        // Any 200 status code - return just the data
        return response.data;
    },
    error => {
        // Any status codes that falls outside the range of 200 causes this function to trigger
        return Promise.reject(error);
    }
);

export default ApiHandler;
