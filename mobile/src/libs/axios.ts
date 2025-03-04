import { getTokenStorage } from "@/storages/token";
import axios, { type AxiosInstance } from "axios";

type ApiInstanceProps = AxiosInstance & {
  interceptToken: (logout: () => void) => () => void
}

const api = axios.create({
  baseURL: 'http://192.168.10.103:3333',
  timeout: 10000, // 🔥 Define um timeout de 10 segundos (pode aumentar se necessário)
  withCredentials: true ,// Se sua API usa autenticação por cookies

}) as ApiInstanceProps

api.interceptToken = logout => {
  const interceptor = api.interceptors.response.use(
    response => response,
    error => {
      if (error?.response?.status === 401) {
        logout()
      }
      return Promise.reject(error)
    }
  )

  return () => api.interceptors.response.eject(interceptor)
}

api.interceptors.request.use(async config => {
  const token = await getTokenStorage()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  await new Promise(resolve =>
    setTimeout(resolve, Math.round(Math.random() * 0))
  )

  return config
})

export { api };
