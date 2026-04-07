import axios, { AxiosError } from 'axios'
import { destroyCookie, parseCookies } from 'nookies'
import { AuthTokenError } from './errors/AuthTokenError'

function signOut() {
  try {
    destroyCookie(undefined, '@gCorporate.token')

  } catch {
    // erro ao deslogar
  }
}

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || process.env.BASE_API_URL,
  })

  if (cookies['@gCorporate.token']) {
    api.defaults.headers['Authorization'] = `Bearer ${cookies['@gCorporate.token']}`;
  }

  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if (error.response?.status === 401) {
      // qualquer erro 401 (não autorizado) devemos deslogar o usuário
      if (typeof window === 'undefined') {
        // Estamos no lado do servidor, então você não deve chamar singOut() aqui
        return Promise.reject(new AuthTokenError());
      } else {
        // Estamos no lado do cliente, então é seguro chamar singOut()
        signOut()
      }
    }
    return Promise.reject(error);
  })

  return api;
}
