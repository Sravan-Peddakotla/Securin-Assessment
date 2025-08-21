import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
});

export const getRecipes = (page, limit) => api.get(`/api/recipes`, { params: { page, limit } });
export const searchRecipes = (params) => api.get(`/api/recipes/search`, { params });

export default api;
