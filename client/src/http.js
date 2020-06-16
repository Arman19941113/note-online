import axios from 'axios'

const axiosInstance = axios.create({
    withCredentials: true,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    baseURL: 'http://127.0.0.1:3000/'
})

export default axiosInstance
