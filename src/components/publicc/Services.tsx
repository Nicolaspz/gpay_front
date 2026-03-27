"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CreditCard, Smartphone, Shield, Clock } from "lucide-react"
import { ScrollAnimation } from "@/components/ui/scroll-animation"

export function Services() {
    const services = [
        {
            title: "Pagamento por Referência",
            description: "Gere referências de pagamento automaticamente para os seus clientes, permitindo-lhes pagar em qualquer ATM ou através do Internet Banking. Esta opção oferece flexibilidade e conveniência, adaptando-se às preferências de pagamento de uma maior diversidade de clientes.",
            icon: <Shield className="h-10 w-10 text-white" />,
            bgIcon: "/assets/images/referenciaa.png",
            hoverBgIcon: "/assets/images/referenciaa.png"
        },
        {
            title: "Integração com paypay",
            description: "Receba pagamentos instantâneos via Multicaixa Express diretamente no seu site ou aplicativo.",
            icon: <Smartphone className="h-10 w-10 text-white" />,
            bgIcon: "/assets/images/pay.webp",
            hoverBgIcon: "/assets/images/pay1.png"
        },
        {
            title: "Pagamento Bai Paga",
            description: "Gere referências de pagamento automaticamente para seus clientes pagarem no ATM ou Internet Banking.",
            icon: <CreditCard className="h-10 w-10 text-white" />,
            bgIcon: "/assets/images/baipaga.png",
            hoverBgIcon: "/assets/images/baipaga.png"
        },
        {
            title: "Multicaixa Express",
            description: "Receba pagamentos de forma instantânea e segura diretamente no seu website ou aplicação através do Multicaixa Express. Esta funcionalidade permite que os seus clientes efetuem transações rápidas e convenientes, aproveitando a popularidade e a confiança deste método de pagamento em Angola.",
            icon: <Clock className="h-10 w-10 text-white" />,
            bgIcon: "/assets/images/xpress.png",
            hoverBgIcon: "/assets/images/xpress.png"
        }

    ]

    return (
        <section id="services" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <ScrollAnimation animation="animate__fadeInDown">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h4 className="text-3xl font-bold text-[#2a2a2a] mb-4">
                            Serviços Incríveis &amp; <em className="text-[#4b8ef1] not-italic">Funcionalidades</em>
                        </h4>
                        <img src="/assets/images/heading-line-dec.png" alt="line" className="mx-auto mb-6 block" />
                        <p className="text-[#afafaf] text-[15px] leading-[30px]">
                            O Gpayment oferece tudo o que precisa para aceitar pagamentos em Angola de forma simples e eficiente.
                        </p>
                    </div>
                </ScrollAnimation>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <ScrollAnimation key={index} animation="animate__fadeInUp" delay={index * 0.2}>
                            <Card className="group border border-none shadow-[0px_0px_15px_rgba(1,1,1,0.1)] hover:shadow-lg transition-all duration-300 rounded-[25px] hover:bg-[url('/assets/images/service-bg.jpg')] bg-cover bg-no-repeat bg-right-top  bg-white h-full">
                                <CardContent className="p-8 text-center flex flex-col items-center h-full">
                                    <div className="w-[100px] h-[100px] mb-6 flex items-center justify-center bg-center bg-no-repeat bg-contain transition-all duration-300 relative">
                                        <div
                                            className="absolute inset-0 bg-center bg-no-repeat bg-contain transition-opacity duration-300 group-hover:opacity-0"
                                            style={{ backgroundImage: `url(${service.bgIcon})` }}
                                        ></div>
                                        <div
                                            className="absolute inset-0 bg-center bg-no-repeat bg-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                            style={{ backgroundImage: `url(${service.hoverBgIcon})` }}
                                        ></div>
                                    </div>
                                    <h4 className="text-xl font-bold text-[#2a2a2a] mb-4 transition-colors duration-300 group-hover:text-white">{service.title}</h4>
                                    <p className="text-[#afafaf] text-[15px] leading-[28px] mb-6 flex-grow transition-colors duration-300 group-hover:text-white">
                                        {service.description}
                                    </p>

                                </CardContent>
                            </Card>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    )
}
