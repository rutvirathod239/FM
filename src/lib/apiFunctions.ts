import axios from 'axios';
import { toast } from 'react-toastify';
import { NextRouter } from 'next/router';

interface Register {
    name: string
    email: string
    password: string
}

interface Login {
    email: string
    password: string
}
type Router = {
    replace: (path: string) => void;
};
const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user');
        console.log("🚀 ~ user:", user)
        const parsedUser = user && JSON.parse(user);
        console.log("🚀 ~ parsedUser:", parsedUser.token)
        if (parsedUser?.token) {
            config.headers.Authorization = `Bearer ${parsedUser?.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const registerApi = async (data: Register, router: Router, reset: () => void) => {
    try {
        const response = await axios.post("/api/auth/register", data);
        if (response.data.status == 200 || response.data.status == 201) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.replace('/dashboard');
            reset()
        } else {
            toast.error(response.data.message)
        }
    } catch (error) {
        console.error("Registration failed:", error);
        toast.error('Something went wrong!');
    }
}

export const loginApi = async (data: Login, router: Router, reset: () => void ) => {
    try {
        const response = await axios.post("/api/auth/login", data);
        if (response.data.status == 200 || response.data.status == 201) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.replace('/dashboard');
            reset()
        } else {
            toast.error(response.data.message)
        }
    } catch (error) {
        console.error("Login failed:", error);
        toast.error('Something went wrong!');
    }
}

export const getFlights = async () => {
    try {
        const response = await api.get('/flights')
        return response.data
    } catch (error) {
        console.log("🚀 ~ getFlights ~ error:", error)
        toast.error('Something went wrong!');
    }
}

export const updateFlightStatus = async (flightId: string, status: string) => {
    try {
        const response = await api.patch('/flights', { flightId, status })
        console.log("🚀 ~ updateFlightStatus ~ response:", response.data)
    } catch (error) {
        console.log("🚀 ~ updateFlightStatus ~ error:", error)
        toast.error('Something went wrong!');
    }
}

export const updateStatus = async () => {
    try {
        const response = await api.post('/updateFlightStatus');
        console.log("🚀 ~ updateStatus ~ response:", response)
    } catch (error) {
        console.log("🚀 ~ updateStatus ~ error:", error)        
    }
}