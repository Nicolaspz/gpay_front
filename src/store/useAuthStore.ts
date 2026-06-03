import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import { AuthService } from '@/services/auth.service'
import { api } from '@/services/apiClients'
import { getErrorMessage } from '@/utils/api-error'
import type { User, SignInCredentials, SignUpCredentials, LoginResponse } from '@/types/global'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoadingUser: boolean
  isLoading: boolean
  error: string | null

  // Actions
  checkToken: () => Promise<void>
  signIn: (credentials: SignInCredentials) => Promise<LoginResponse>
  signOut: () => void
  signUp: (credentials: SignUpCredentials) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoadingUser: true,
      isLoading: false,
      error: null,

      checkToken: async () => {
        try {
          set({ isLoadingUser: true })
          const { '@gCorporate.token': token } = parseCookies()
          
          if (token) {
            api.defaults.headers.Authorization = `Bearer ${token}`
            const currentUser = await AuthService.me()
            set({ 
              user: { ...currentUser, token }, 
              isAuthenticated: true,
              isLoadingUser: false 
            })
          } else {
            set({ isLoadingUser: false })
          }
        } catch {
          get().signOut()
        }
      },

      signIn: async (credentials: SignInCredentials) => {
        try {
          set({ isLoading: true, error: null })
          const response = await AuthService.signIn(credentials)

          setCookie(undefined, '@gCorporate.token', response.token, {
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })

          api.defaults.headers.Authorization = `Bearer ${response.token}`
          
          set({
            user: { ...response.user, token: response.token },
            isAuthenticated: true,
            isLoading: false
          })

          return response
        } catch (error) {
          const errorMessage = getErrorMessage(error, 'Erro ao fazer login')
          set({ error: errorMessage, isLoading: false })
          throw error
        }
      },

      signOut: () => {
        destroyCookie(undefined, '@gCorporate.token')
        delete api.defaults.headers.Authorization
        set({ 
          user: null, 
          isAuthenticated: false,
          error: null 
        })
      },

      signUp: async (credentials: SignUpCredentials) => {
        try {
          set({ isLoading: true, error: null })
          await AuthService.signUp(credentials)
          set({ isLoading: false })
        } catch (error) {
          const errorMessage = getErrorMessage(error, 'Erro ao registrar')
          set({ error: errorMessage, isLoading: false })
          throw error
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
