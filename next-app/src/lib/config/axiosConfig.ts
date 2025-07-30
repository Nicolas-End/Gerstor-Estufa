'use client'
import axios from "axios";


const token = localStorage.getItem('token_from_user')
export const api = axios.create({
    baseURL: "http://127.0.0.1:5000",
    headers: {
        "Content-Type": "application/json",
        'Authorization':  token || ''
    },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token_from_user');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api