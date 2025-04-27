import axios from 'axios'

// axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_URI

axios.defaults.headers.common['origin'] = 'https://cms.dev.jmd.fifasoft.me'
axios.defaults.headers.common['accept-language'] = localStorage.getItem('appLang')

axios.interceptors.request.use((config) => {
  try {
    config.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('token'))}`
  } catch (error) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  }
  config.headers.Accept = 'application/json'
  config.headers["Content-Type"] = "application/json";
  return config
})
