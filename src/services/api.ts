import axios, { AxiosError } from 'axios'
import { destroyCookie, parseCookies } from 'nookies'
import { AuthTokenError } from './errors/AuthTokenError'

function signOut() {
  try {
    destroyCookie(undefined, '@gCorporate.token')
  } catch {
  }
}

export function setupAPIClient(ctx?: Parameters<typeof parseCookies>[0]) {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || process.env.BASE_API_URL,
  })

  api.interceptors.request.use((config) => {
    const cookies = parseCookies(ctx);
    const token = cookies['@gCorporate.token'];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window === 'undefined') {
        return Promise.reject(new AuthTokenError());
      } else {
        signOut()
      }
    }
    return Promise.reject(error);
  })

  return api;
}
