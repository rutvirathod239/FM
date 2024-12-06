import axios from 'axios';
import { toast } from 'react-toastify';
export const registerApi = async (data: any, router: any, reset: any) => {
    try {
        const response = await axios.post("/api/auth/register", data);
        console.log("Registration successful:", response.data);
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

export const loginApi = async (data: any, router: any, reset: any) => {
    try {
        const response = await axios.post("/api/auth/login", data);
        console.log("Login successful:", response.data);
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
        const response = await axios.get('/api/flights')
        return response.data
    } catch (error) {
        console.log("🚀 ~ getFlights ~ error:", error)
        toast.error('Something went wrong!');
    }
}

export const updateFlightStatus = async (flightId: string, status: string) => {
    try {
        const response = await axios.patch('/api/flights', { flightId, status })
        console.log("🚀 ~ updateFlightStatus ~ response:", response.data)
    } catch (error) {
        console.log("🚀 ~ updateFlightStatus ~ error:", error)
        toast.error('Something went wrong!');
    }
}

export const updateStatus = async () => {
    try {
        const response = await axios.post('/api/updateFlightStatus');
        console.log("🚀 ~ updateStatus ~ response:", response)
    } catch (error) {
        console.log("🚀 ~ updateStatus ~ error:", error)        
    }
}