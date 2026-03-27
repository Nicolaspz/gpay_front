"use client"

import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import Link from "next/link"

export function Footer() {
    return (
        <footer id="newsletter" className="bg-[url('/assets/images/footer-bg.png')] bg-cover bg-no-repeat bg-top pt-[300px] pb-[60px] mt-[130px]">
            <div className="container mx-auto px-4">
                {/* Newsletter Section */}
                <ScrollAnimation animation="animate__fadeIn">
                    <div className="mb-20">
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2">
                                <div className="text-center mb-10">
                                    <h4 className="text-3xl font-bold text-white mb-6">
                                        Junte-se à nossa lista e receba as novidades
                                    </h4>
                                </div>
                            </div>
                            <div className="max-w-3xl mx-auto w-full">
                                <form className="bg-transparent border border-white rounded-[40px] p-2 pr-2 flex flex-col md:flex-row items-center">
                                    <input
                                        type="email"
                                        placeholder="Endereço de Email..."
                                        className="flex-grow bg-transparent border-none outline-none px-6 py-4 text-white placeholder:text-white/70 w-full focus:border-none focus:outline-none focus:ring-0 focus:ring-offset-0"
                                        required
                                    />
                                    <button type="submit" className="mt-2 md:mt-0 w-full md:w-auto bg-white text-[#4b8ef1] font-medium px-8 py-4 rounded-[30px] hover:bg-[#eee] transition-all whitespace-nowrap cursor-pointer">
                                        Subscrever Agora <i className="fa fa-angle-right ml-2"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Links Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-t border-white/20">
                    <div className="footer-widget">
                        <h4 className="text-[20px] font-bold text-white mb-6">Contacte-nos</h4>
                        <p className="text-white text-[15px] mb-2">Luanda, Angola</p>
                        <p className="mb-2"><a href="#" className="text-white hover:text-white/80">+244 222 123 456</a></p>
                        <p><a href="#" className="text-white hover:text-white/80">info@gpayment.ao</a></p>
                    </div>
                    <div className="footer-widget">
                        <h4 className="text-[20px] font-bold text-white mb-6">Sobre Nós</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-white text-[15px] hover:text-white/80">Início</a></li>
                            <li><a href="#" className="text-white text-[15px] hover:text-white/80">Serviços</a></li>
                            <li><a href="#" className="text-white text-[15px] hover:text-white/80">Sobre</a></li>
                            <li><a href="#" className="text-white text-[15px] hover:text-white/80">Preços</a></li>
                        </ul>
                    </div>
                    <div className="footer-widget">
                        <h4 className="text-[20px] font-bold text-white mb-6">Links Úteis</h4>
                        <ul className="space-y-2">
                            <li><a href="/docoment" className="text-white text-[15px] hover:text-white/80">Documentação</a></li>
                            <li><a href="#" className="text-white text-[15px] hover:text-white/80">Suporte - suporte@gpayment.ao</a></li>
                            <li><a href="#" className="text-white text-[15px] hover:text-white/80">vendas - vendas@gpayment.ao, +244 222 123 457  </a></li>
                        </ul>
                    </div>
                    <div className="footer-widget">
                        <h4 className="text-[20px] font-bold text-white mb-6">Sobre a Empresa</h4>
                        <span className="text-2xl font-bold text-[#5b68eb]">
                           <Link href="/" className="flex items-center">
                                <img
                                src="/assets/images/Gpay2.1.png" 
                                alt=""
                                className="w-full h-full object-cover object-bottom"
                                />
                            </Link>
                        </span>
                        <p className="text-white text-[15px]">Inovando nos pagamentos online em Angola.</p>
                    </div>
                </div>

                <div className="py-8 border-t border-white/20 text-center">
                    <p className="text-white text-[15px]">
                        Copyright © 2024 Gpayment. Todos os Direitos Reservados.
                    </p>
                </div>
            </div>
        </footer>
    )
}
