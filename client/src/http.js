import axios from 'axios'

const axiosInstance = axios.create({
    withCredentials: true,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    baseURL: 'http://127.0.0.1:3000/'
})

export default axiosInstance

export function injectCSRFTokenToHeaders () {
    const cookies = {}
    document.cookie.split('; ').forEach(item => {
        const coo = item.split('=')
        cookies[coo[0]] = coo[1]
    })
    const CSRFToken = cookies.note_online_csrftoken
    if (CSRFToken !== undefined) {
        axiosInstance.defaults.headers.common['X-CSRFToken'] = CSRFToken
    }
}
