'use client'
import { createContext, ReactNode, useState, useEffect, useCallback, Suspense, useRef } from "react";
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { api } from '../services/apiClients';
import { AuthService } from "@/services/auth.service";
import type { SignInCredentials, SignUpCredentials, User } from "@/types/global";
import { getErrorMessage } from "@/utils/api-error";

type AuthContextData = {
  user: User | null;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user?.token;
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactivityTimeout = 15 * 60 * 1000;

  const signOut = useCallback(() => {
    try {
      destroyCookie(undefined, '@gCorporate.token')
      delete api.defaults.headers.Authorization;
      setUser(null)
      router.push('/')
    } catch {
    }
  }, [router])

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(() => {
      signOut();
    }, inactivityTimeout);
  }, [signOut, inactivityTimeout]);

  const handleUserInteraction = useCallback(() => {
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  const checkToken = useCallback(async () => {
    try {
      const { '@gCorporate.token': token } = parseCookies();
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        const currentUser = await AuthService.me();
        setUser({ ...currentUser, token });
      }
    } catch {
      signOut();
    } finally {
      setIsLoadingUser(false);
    }
  }, [signOut]);

  useEffect(() => {
    checkToken();

    window.addEventListener('mousemove', handleUserInteraction);
    window.addEventListener('mousedown', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    resetInactivityTimer();

    return () => {
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [checkToken, handleUserInteraction, resetInactivityTimer]);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await AuthService.signIn({ email, password });

      toast.success("Login feito com sucesso!");

      setCookie(undefined, '@gCorporate.token', response.token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      api.defaults.headers.Authorization = `Bearer ${response.token}`;
      setUser({
        ...response.user,
        token: response.token
      });

      router.push("/dashboard");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro inesperado, tente novamente."));
    }
  }

  async function signUp(credentials: SignUpCredentials) {
    try {
      await AuthService.signUp(credentials);
      toast.success("Cadastrado com sucesso!");
      router.push('/');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao se Cadastrar"));
    }
  }

  return (
    <Suspense>
      <AuthContext.Provider value={{ user, isAuthenticated, isLoadingUser, signIn, signOut, signUp }}>
        {children}
      </AuthContext.Provider>
    </Suspense>
  )
}
