"use client"

import Link from "next/link"

export function Hero() {
    return (
        <section id="top" className="pt-[150px] pb-[50px] bg-white overflow-hidden relative">
            <div
                className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-contain z-0 pointer-events-none"
                style={{ backgroundImage: "url('/assets/images/slider-left-dec.png')" }}
            ></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 mb-10 lg:mb-0">
                        <div className="space-y-6 animate-fade-in-left"> {/* Need to check/add animations later */}
                            <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-[#2a2a2a]">
                                A PLATAFORMA QUE INTEGRA PAGAMENTOS ONLINE EM ANGOLA <br />
                            </h2>

                            
                        </div>
                    </div>
                    <div className="lg:w-1/2">
                        <div className="relative animate-fade-in-right">
                            <img
                                src="/assets/images/slider-dec.png"
                                alt="Gpayment App"
                                className="w-full h-auto object-contain max-w-[600px] mx-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
