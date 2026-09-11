import { CONFIG } from "./config.js";
import { fetchAPI } from "./api.js";

export const AuthService = {
    async login(email, password) {
        const data = await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (data.token) {
            localStorage.setItem(CONFIG.TOKEN_KEY, data.token);
        }
        return data;
    },

    async register(userData) {
        const data = await fetchAPI('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        })
        return data;
    },

    async me() {
        return await fetchAPI('/estudiantes/me', {
            method: 'GET'
        });
    },

    logout () {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        window.location.href = "/index.html";
    },

    isAuthenticated() {
        return !!localStorage.getItem(CONFIG.TOKEN_KEY);
    },

    checkAuthGuard(isProtectedRoute = true) {
        const authenticated = this.isAuthenticated();
        if (isProtectedRoute && !authenticated) {
            window.location.href = "/index.html";
        } else if (!isProtectedRoute && authenticated) {
            window.location.href = "/dashboard.html";
        }
    }
};