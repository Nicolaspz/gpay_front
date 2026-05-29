"use client"

import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"

export function About() {
    return (
        <section id="about" className="py-24 bg-white overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl opacity-40 translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header Section */}
                <ScrollAnimation animation="animate__fadeInDown">
                    <div className="text-center mb-16">
                        <h4 className="text-3xl font-bold text-[#2a2a2a] mb-4">
                            Sobre <em className="text-[#4b8ef1] not-italic">A Gpayment</em>
                        </h4>
                        <img src="/assets/images/heading-line-dec.png" alt="line" className="mx-auto mb-6 block" />
                        <p className="text-[#afafaf] text-[15px] leading-[30px] max-w-2xl mx-auto">
                            A Plataforma que Integra, Simplifica e Impulsiona Pagamentos Digitais em Angola
                        </p>
                    </div>
                </ScrollAnimation>

                <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
                    <div className="lg:w-1/2">
                        <ScrollAnimation animation="animate__fadeInLeft">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-[#2a2a2a] mb-4">Quem Somos</h3>
                                <p className="text-[#afafaf] text-[15px] leading-[30px] text-justify">
                                    A Gpayment é um integrador de pagamentos digitais que liga empresas, consumidores e instituições financeiras através de soluções tecnológicas modernas, seguras e eficientes. Atuamos como um elo estratégico entre os diversos meios de pagamento, ajudando os negócios a crescerem de forma sustentável na economia digital angolana.
                                </p>
                            </div>
                        </ScrollAnimation>
                    </div>
                    <div className="lg:w-1/2">
                        <ScrollAnimation animation="animate__fadeInRight">
                            <div className="relative">
                                <img
                                    src="/assets/images/about-right-dec.png"
                                    alt="About Gpayment"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </ScrollAnimation>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.1)] p-8 rounded-[20px]">
                        <h4 className="text-xl font-bold text-[#2a2a2a] mb-4">A Nossa Missão</h4>
                        <p className="text-[#afafaf] text-[15px] leading-[26px]">
                            Na Gpayment, a nossa missão é simplificar e integrar os pagamentos digitais em Angola, oferecendo soluções seguras, escaláveis e acessíveis que permitem às empresas focarem-se no que realmente importa: vender mais, atender melhor e crescer com eficiência.
                            <br /><br />
                            Acreditamos que pagamentos devem ser rápidos, confiáveis e integrados aos processos do negócio.
                        </p>
                    </div>
                    <div className="bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.1)] p-8 rounded-[20px]">
                        <h4 className="text-xl font-bold text-[#2a2a2a] mb-4">A Nossa Visão</h4>
                        <p className="text-[#afafaf] text-[15px] leading-[26px]">
                            Ser o principal integrador de pagamentos em Angola, reconhecido pela robustez tecnológica, elevados padrões de segurança e pela capacidade de gerar valor real para os nossos parceiros e clientes.
                            <br /><br />
                            Trabalhamos para um futuro onde todas as transações sejam simples, instantâneas e totalmente seguras, contribuindo para a inclusão financeira e o desenvolvimento económico do país.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-20 relative py-16 px-8 rounded-[30px] overflow-hidden">
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: "url('/assets/images/payment.jpg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed'
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-white/30 z-[1] "></div>

                    <div className="relative z-10">
                        <div className="text-center mb-12">
                            <h4 className="text-2xl font-bold text-white">Os Nossos Valores</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { title: "Inovação", desc: "Desenvolvemos e integramos soluções de pagamento alinhadas às melhores práticas e tendências globais." },
                                { title: "Segurança", desc: "Garantimos a proteção de dados e a integridade das transações, cumprindo rigorosamente os mais altos padrões de segurança." },
                                { title: "Transparência", desc: "Operamos com clareza total, sem custos ocultos, promovendo confiança e previsibilidade para os nossos parceiros." },
                                { title: "Foco no Cliente", desc: "Criamos soluções flexíveis e personalizadas, com suporte dedicado, para responder às reais necessidades do mercado." },
                                { title: "Integridade", desc: "Atuamos com ética, responsabilidade e compromisso em cada parceria e transação." }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white/100 backdrop-blur-md p-6 rounded-[20px] shadow-[0px_0px_15px_rgba(0,0,0,0.05)] hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 border border-white/20">
                                    <h5 className="text-lg font-bold text-[#2a2a2a] mb-3 text-[#4b8ef1]">{item.title}</h5>
                                    <p className="text-[#afafaf] text-[14px] leading-[24px]">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Commitment & Team */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-[#f9f9f9] p-8 rounded-[20px]">
                        <h4 className="text-xl font-bold text-[#2a2a2a] mb-4">O Nosso Compromisso com Angola</h4>
                        <p className="text-[#afafaf] text-[15px] leading-[26px]">
                            A Gpayment é uma empresa angolana, desenvolvida para responder aos desafios e oportunidades do mercado local. Conhecemos o ecossistema financeiro nacional e trabalhamos para facilitar a digitalização dos pagamentos, apoiando empresas de todos os portes na adoção de soluções modernas e eficientes.
                        </p>
                    </div>
                    <div className="bg-[#f9f9f9] p-8 rounded-[20px]">
                        <h4 className="text-xl font-bold text-[#2a2a2a] mb-4">A Nossa Equipa</h4>
                        <p className="text-[#afafaf] text-[15px] leading-[26px]">
                            Contamos com uma equipa multidisciplinar, especializada em tecnologia, integração de sistemas e pagamentos digitais, com experiência prática no setor financeiro. O nosso foco é garantir uma plataforma estável, escalável e preparada para o crescimento dos nossos clientes.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
