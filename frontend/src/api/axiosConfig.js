import axios from 'axios'

const api = axios.create({
    baseURL: 'https://the-daily-cup-production.up.railway.app/api',
    // baseURL: 'http://localhost:5000/api',
})

// automatically attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api