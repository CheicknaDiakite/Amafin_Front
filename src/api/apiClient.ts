// src/api/apiClient.ts
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/entreprise/";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Important: allow sending cookies (sessionid / csrftoken) to the API
  withCredentials: true,
});

// Ajouter le token JWT à chaque requête
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token_1"); // ou 'token_1' selon ton login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Lire le cookie CSRF (si présent) et l'envoyer dans l'en-tête attendu par Django
  try {
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return null;
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };
    const csrf = getCookie('csrftoken') || getCookie('CSRF-TOKEN');
    if (csrf) {
      config.headers['X-CSRFToken'] = csrf;
    }
  } catch (e) {
    // ignore in non-browser environments
  }
  return config;
});
