import { Header } from "@/components/publicc/Header"
import { Footer } from "@/components/publicc/Footer"

export default function RefundPolicyPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-28">
                <h1 className="text-4xl font-bold mb-8 text-blue-600">Política de Reembolso</h1>

                <section className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-3">1. Elegibilidade para Reembolso</h2>
                        <p className="leading-relaxed text-slate-600">
                            O GPay Angola processa reembolsos de acordo com a política de cada comerciante individual. Como processador, facilitamos o estorno do valor assim que solicitado e aprovado pelo vendedor original.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">2. Prazo para Solicitação</h2>
                        <p className="leading-relaxed text-slate-600">
                            As solicitações de reembolso devem ser feitas no prazo máximo de 7 dias úteis após a transação, a menos que o comerciante especifique um prazo superior.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">3. Processo de Reembolso</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong>Multicaixa Express:</strong> O valor é devolvido para a conta associada ao número de telefone.</li>
                            <li><strong>Referência Bancária:</strong> O estorno pode exigir o fornecimento de IBAN para transferência manual pelo comerciante.</li>
                            <li><strong>Cartão Internacional:</strong> O estorno é creditado diretamente no extrato do cartão de crédito (prazo de 5 a 10 dias úteis).</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">4. Transações Não Reembolsáveis</h2>
                        <p className="leading-relaxed text-slate-600">
                            Pagamentos de taxas de serviço da plataforma GPay não são reembolsáveis uma vez que a transação tenha sido processada com sucesso junto às entidades bancárias.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">5. Disputas e Chargebacks</h2>
                        <p className="leading-relaxed text-slate-600">
                            Em caso de chargebacks (contestação de pagamento) em cartões internacionais, o GPay seguirá os procedimentos de arbitragem definidos pela Stripe e pelas bandeiras de cartão (Visa/Mastercard).
                        </p>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}
