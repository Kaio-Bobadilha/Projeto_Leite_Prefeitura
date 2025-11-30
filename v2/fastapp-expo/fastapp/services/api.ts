import axios from 'axios';

// Usa a variável de ambiente ou localhost como fallback
// No emulador Android, use 'http://10.0.2.2:8000/api'
// Na Web (Docker), 'http://localhost:8000/api' funciona bem
const API_URL = process.env.EXPO_PUBLIC_API_URL 
  ? `${process.env.EXPO_PUBLIC_API_URL}/api` 
  : 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;