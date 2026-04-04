import axios, { AxiosInstance } from "axios";

// URL de base pour l'API
// http://127.0.0.1:8000
// https://backAmafin.diakitedigital.com

const BaseDomaine = {
    URL: 'http://127.0.0.1:8000'
}

export const Base = {
    baseURL: `${BaseDomaine.URL}/api`
}

// Créer une instance d'Axios
const Axios: AxiosInstance = axios.create({
    baseURL: `${Base.baseURL}`,
    // timeout: 5000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// Injecter automatiquement le token d'accès sur chaque requête
Axios.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('token_1'); // access
    if (accessToken) {
        config.headers = config.headers || {};
        (config.headers as any)['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
});

// Gérer le rafraîchissement du token sur 401
Axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;
        if (!originalRequest) return Promise.reject(error);

        // éviter les boucles infinies
        if (error.response?.status === 401 && !(originalRequest as any)._retry) {
            (originalRequest as any)._retry = true;

            const refreshToken = localStorage.getItem('token'); // refresh
            if (!refreshToken) {
                return Promise.reject(error);
            }

            try {
                const refreshResponse = await axios.post(
                    `${Base.baseURL}/utilisateur/token/refresh/`,
                    { refresh: refreshToken },
                    { withCredentials: true }
                );

                const newAccess = refreshResponse?.data?.access;

                if (newAccess) {
                    localStorage.setItem('token_1', newAccess);
                    originalRequest.headers = originalRequest.headers || {};
                    (originalRequest.headers as any)['Authorization'] = `Bearer ${newAccess}`;
                    return Axios.request(originalRequest);
                }
            } catch (e) {
                // échec du refresh -> nettoyer et laisser l'appel échouer
                localStorage.removeItem('token');
                localStorage.removeItem('token_1');
                return Promise.reject(e);
            }
        }

        return Promise.reject(error);
    }
);

// Exposer Axios pour utilisation ailleurs
export default Axios;

export const BASE = (img: string | File | unknown) => {
    return `${BaseDomaine.URL}/${img}`;
};
