export type Plan = {
  name: string
  price: string
  features: string[]
  highlight?: boolean
}

export const plans: Plan[] = [
  {
    name: "Básico",
    price: "5.000 Kz/mês",
    features: ["1 Usuário", "Relatórios Simples", "Suporte por Email"],
  },
  {
    name: "Profissional",
    price: "12.000 Kz/mês",
    features: ["5 Usuários", "Dashboard Completo", "Suporte Prioritário"],
    highlight: true,
  },
  {
    name: "Empresarial",
    price: "25.000 Kz/mês",
    features: ["Usuários Ilimitados", "Integrações Avançadas", "Suporte 24/7"],
  },
]
