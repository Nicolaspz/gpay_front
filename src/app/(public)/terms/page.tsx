import type { Metadata } from "next";
import { Header } from "@/components/publicc/Header";
import { Footer } from "@/components/publicc/Footer";
import { BreadcrumbJsonLd } from "@/components/landing/seo-jsonld";

export const metadata: Metadata = {
  title: "Termos e Condições — Gpayment Angola",
  description:
    "Leia os termos e condições de uso da plataforma Gpayment Angola. Conheça as regras, taxas, obrigações e políticas de uso do gateway de pagamento.",
  keywords: [
    "termos e condições gpayment",
    "termos uso gateway pagamento angola",
    "política pagamento angola",
    "contrato serviços pagamento",
  ],
  openGraph: {
    title: "Termos e Condições — Gpayment",
    description:
      "Termos e condições de uso da plataforma de pagamento Gpayment Angola.",
    url: "https://gpayment.ao/terms",
    type: "website",
  },
  alternates: {
    canonical: "https://gpayment.ao/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://gpayment.ao" },
          { name: "Termos e Condições", url: "https://gpayment.ao/terms" },
        ]}
      />
      <Header />
      <article className="max-w-4xl mx-auto px-6 py-28">
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
              <li>Garantir a segurança dos seus dados de acesso ao Multicaixa Express.</li>
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
      </article>
      <Footer />
    </main>
  );
}
