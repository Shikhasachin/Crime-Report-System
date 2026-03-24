import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import axios from 'axios';

// Set the base URL, defaulting to local during development
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

// Attach JWT token to all outgoing requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crs_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
