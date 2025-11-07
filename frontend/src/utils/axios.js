import axios from 'axios';

const api = axios.create({
    baseURL: 'https://employee-api-backend.vercel.app',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response error:', error.response.data);
            return Promise.reject(error);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Network error - no response received');
            return Promise.reject(new Error('Network error - please check your connection'));
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request setup error:', error.message);
            return Promise.reject(error);
        }
    }
);

export default api;