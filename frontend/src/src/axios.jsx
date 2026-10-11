import axios from 'axios';

const api = axios.create({
  // Ensure the backend URL and port match your running Django server
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;