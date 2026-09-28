import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
    withCredentials: true,
});

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', {
            username,
            email,
            password,
        });
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Registration failed" };
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post('/api/auth/login', {
            email,
            password,
        });
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Login failed" };
    }
}

export async function logout() {
    try {
        const response = await api.get('/api/auth/logout');
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Logout failed" };
    }
}

export async function getMe() {
    try {
        const response = await api.get('/api/auth/get-me');
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Failed to fetch user" };
    }
}

export async function verifyOtp({ email, otp }) {
    try {
        const response = await api.post('/api/auth/verify-otp', {
            email,
            otp,
        });
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "OTP verification failed" };
    }
}

export async function resendOtp({ email }) {
    try {
        const response = await api.post('/api/auth/resend-otp', {
            email,
        });
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Failed to resend OTP" };
    }
}