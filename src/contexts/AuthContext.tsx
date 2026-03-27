'use client'
import { createContext, ReactNode, useState, useEffect, useCallback, Suspense } from "react";
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { api } from '../services/apiClients';

type AuthContextData = {
  user: UserProps | null;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
  id?: string;
  fullname?: string;
  email?: string;
  token?: string;
  status?: string;
  user_type?: string;
  team_id?: string;
  tenant_id?: string;
  tenant: {
    tenant_id?: string;
    legal_name?: string;
    bank_iban?: string;
    bank_owner_name?: string;
    client_reference_count?: string;
  }

}

type SignInProps = {
  email: string;
  password: string;
}

type SignUpProps = {
  id: string;
  name: string;
  email: string;
  role: string;
  telefone: string;
  user_name: string;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const [user, setUser] = useState<UserProps | null>(null);
  const isAuthenticated = !!user?.token;

  const inactivityTimeout = 15 * 60 * 1000;
  let inactivityTimer: NodeJS.Timeout;

  function signOut() {
    try {
      destroyCookie(undefined, '@gCorporate.token')
      setUser(null) // limpa o estado também
      router.push('/')
    } catch {
      console.error("Erro ao deslogar")
    }
  }

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      signOut();
    }, inactivityTimeout);
  };

  const handleUserInteraction = () => {
    resetInactivityTimer();
  };

  const checkToken = useCallback(async () => {
    try {
      const { '@gCorporate.token': token } = parseCookies();

      if (token) {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/me');

        // Garante que o token também fica no estado
        setUser({
          ...response.data, // se /me já devolve user direto
          token,
        });

        console.log("user refres", user);
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        console.warn("Token inválido ou expirado, deslogando...");
      } else {
        console.error("Erro ao verificar token:", error?.message || error);
      }
      signOut();
    }
  }, []);

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
      clearTimeout(inactivityTimer);
    };
  }, [checkToken]);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post('/login', { email, password });

      toast.success("Login feito com sucesso!");

      // salva token no cookie
      setCookie(undefined, '@gCorporate.token', response.data.token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/"
      });

      // já atualiza estado com user + token
      setUser(
        response.data.user,
      );
      console.log("logado", response.data.user)
      router.push("/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro inesperado, tente novamente.";
      toast.error(errorMessage);
      // console.error("erro aki", err);
    }
  }

  async function signUp({ name, email, role, user_name }: SignUpProps) {
    try {
      await api.post('/users', {
        name,
        email,
        role,
        user_name
      });

      toast.success("Cadastrado com sucesso!");
      router.push('/');
    } catch (err) {
      toast.error("Erro ao se Cadastrar");
    }
  }

  return (
    <Suspense>
      <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
        {children}
      </AuthContext.Provider>
    </Suspense>
  )
}
