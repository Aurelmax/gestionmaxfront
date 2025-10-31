import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/api/users/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/api/users/logout');
    return response.data;
  },
  
  me: async (): Promise<User> => {
    const response = await api.get('/api/users/me');
    return response.data.user;
  },
};

export default api;
