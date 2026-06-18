"use client"

import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"

export function Pricing() {
    const plans = [
        {
            name: "Starter",
            price: "5.000",
            currency: "Kz",
            features: ["Pequenas Lojas Online e Freelancers", "Até 500 Transações/mês", "Multicaixa Express, Pagamento por Referência ", "Suporte por Email (24-48h)", "Relatórios Básicos,Dashboard Simples", "API dedicada: Não", "Webhooks: Não", "Taixa de Transação 2,5%", "Integração com Plataformas: Não", "Gerente de Conta Dedicado: Não"],
            highlight: false
        },
        {
            name: "Profissional",
            price: "15.000",
            currency: "Kz",
            features: ["Empresa Em Crescimento ", "Até 5.000 Transações/mês", "Multicaixa Express, Pagamento por Referência ", "Suporte prioritário por (Chat + Email 24-48h)", "Relatórios Avançados,Dashboard Completos", "API dedicada: Sim", "Webhooks: Sim", "Taixa de Transação 1,8%", "Integração com Plataformas: Não", "Gerente de Conta Dedicado: Não"],
            highlight: true
        },
        {
            name: "Enterprise",
            price: "Personalizado",
            currency: "(Contactar Vendas)",
            features: ["Empresa Em Crescimento ", "Transações/mês Ilimitadas", "Multicaixa Express, Pagamento por Referência ", "Suporte Dedicado(Gerente da Conta)", "Relatórios Personalizados,Dashboard Avançado", "API dedicada: Sim, com SLA", "Webhooks: Avançado", "Taixa de Transação 1,2%", "Integração com Plataformas Ilimitada", "Gerente de Conta Dedicado: Sim"],
            highlight: false
        }
    ]

    return (
        <section id="pricing" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <ScrollAnimation animation="animate__fadeInDown">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h4 className="text-3xl font-bold text-[#2a2a2a] mb-4">
                            Temos os Melhores <em className="text-[#4b8ef1] not-italic">Preços</em> para Você
                        </h4>
                        <img src="/assets/images/heading-line-dec.png" alt="line" className="mx-auto mb-6 block" />
                        <p className="text-[#afafaf] text-[15px] leading-[30px]">
                            Escolha o plano que melhor se adapta ao volume do seu negócio. Transparência total.
                        </p>
                    </div>
                </ScrollAnimation>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <ScrollAnimation key={index} animation="animate__fadeInUp" delay={index * 0.2}>
                            <div className="relative group">
                                <div className={`p-10 rounded-[40px] text-center transition-all duration-300 relative overflow-hidden ${plan.highlight ? 'bg-white shadow-[0px_0px_30px_rgba(0,0,0,0.15)]' : 'bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.1)]'}`}>
                                    {plan.highlight ? (
                                        <>
                                            <div className="absolute top-0 left-0 w-[281px] h-[251px] bg-no-repeat z-0 pointer-events-none" style={{ backgroundImage: 'url("/assets/images/pro-table-top.png")' }}></div>
                                            <div className="absolute bottom-0 right-0 w-full h-[201px] bg-no-repeat bg-cover z-0 pointer-events-none" style={{ backgroundImage: 'url("/assets/images/pro-table-bottom.png")' }}></div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="absolute top-0 left-0 w-[274px] h-[221px] bg-no-repeat z-0 pointer-events-none" style={{ backgroundImage: 'url("/assets/images/regular-table-top.png")' }}></div>
                                            <div className="absolute bottom-0 right-0 w-[370px] h-[171px] bg-no-repeat z-0 pointer-events-none" style={{ backgroundImage: 'url("/assets/images/regular-table-bottom.png")' }}></div>
                                        </>
                                    )}
                                    <div className="relative z-10">
                                        <span className={`block text-[18px] font-bold mb-4 ${plan.highlight ? 'text-[#ff695f]' : 'text-[#4b8ef1]'}`}>
                                           {plan.price} {plan.currency}  
                                        </span>
                                        <h4 className={`text-[20px] font-bold mb-6 ${plan.highlight ? 'text-[#2a2a2a]' : 'text-[#2a2a2a]'}`}>
                                            {plan.name}
                                        </h4>
                                        <div className="w-[100px] h-[160px] mx-auto mb-8 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url("/assets/images/logo2.png")' }}></div>
                                        <ul className="mb-8 space-y-4">
                                            {plan.features.map((feature, fIdx) => (
                                                <li key={fIdx} className="text-[#afafaf] text-[14px]">{feature}</li>
                                            ))}
                                        </ul>
                                        <div className="inline-block">
                                            <a href="#" className={`inline-block px-6 py-3 rounded-3xl border transition-all font-medium text-[14px] ${plan.highlight ? 'bg-[#4b8ef1] text-white border-[#4b8ef1] hover:bg-transparent hover:text-[#4b8ef1]' : 'bg-transparent text-[#4b8ef1] border-[#4b8ef1] hover:bg-[#4b8ef1] hover:text-white'}`}>
                                                Subscrever Agora
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    )
}
