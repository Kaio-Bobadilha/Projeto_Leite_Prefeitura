import axios from 'axios';

// Pega a URL do docker-compose ou usa localhost como fallback
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`, // O seu backend serve as rotas em /api/
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;