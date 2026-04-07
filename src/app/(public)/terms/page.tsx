import { Header } from "@/components/publicc/Header"
import { Footer } from "@/components/publicc/Footer"

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-28">
                <h1 className="text-4xl font-bold mb-8 text-blue-600">Termos e Condições</h1>

                <section className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-3">1. Introdução</h2>
                        <p className="leading-relaxed text-slate-600">
                            Bem-vindo ao GPay Angola. Ao utilizar os nossos serviços de pagamentos, você concorda em cumprir e vincular-se aos seguintes termos e condições de uso.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">2. Descrição do Serviço</h2>
                        <p className="leading-relaxed text-slate-600">
                            O GPay Angola atua como um gateway de pagamento que processa transações através de Multicaixa Express, Referência Bancária e Cartão Internacional (via Stripe). Não somos uma instituição bancária, mas facilitamos a liquidação entre comerciantes e clientes.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">3. Obrigações do Usuário</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Fornecer informações precisas e atualizadas durante o checkout.</li>
                            <li>Garantir a segurança dos seus data de acesso ao Multicaixa Express.</li>
                            <li>Não utilizar a plataforma para atividades ilícitas ou fraudulentas em Angola.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">4. Taxas e Pagamentos</h2>
                        <p className="leading-relaxed text-slate-600">
                            As taxas aplicáveis às transações são informadas no momento da configuração da conta do comerciante. O GPay reserva-se o direito de ajustar estas taxas mediante aviso prévio.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">5. Limitação de Responsabilidade</h2>
                        <p className="leading-relaxed text-slate-600">
                            O GPay Angola não se responsabiliza por falhas técnicas originadas por parceiros bancários ou instabilidades na rede EMIS/Multicaixa, embora envidemos todos os esforços para garantir a continuidade do serviço.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">6. Contacto</h2>
                        <p className="leading-relaxed text-slate-600">
                            Para questões sobre estes termos, entre em contacto com o suporte oficial da GPay Angola através do nosso portal de ajuda.
                        </p>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}
