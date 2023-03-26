import axios from 'axios'

const backend = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_BACKEND
      : process.env.REACT_APP_BACKEND_DEV,
})

backend.interceptors.request.use(
  (config) => {
    let user = ''
    if (!user)
      user = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user'))
        : null
    if (user) config.headers = { Authorization: `Bearer ${user.token}` }
    console.log(config)
    return config
  },
  (error) => Promise.reject(error)
)

export default backend
