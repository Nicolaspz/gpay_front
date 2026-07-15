import Image from "next/image";
import GButton from "./ui/g-button";

type GPayGoFooterProps = {
  backgroundSrc?: string;
  logoSrc?: string;
};

export default function GPayGoCTA({
  backgroundSrc = "/page/footer-bg.png",
}: GPayGoFooterProps) {
  return (
    <footer className="bg-white px-4 pb-8 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1100px]">
        <section className="relative overflow-hidden rounded-[14px]">
          <div className="absolute inset-0">
            <Image
              src={backgroundSrc}
              alt="Fundo da chamada final"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="relative flex min-h-[452px] flex-col items-center justify-center px-5 py-10 text-center sm:px-8">
            <h2 className="max-w-[560px] text-[24px] font-semibold leading-[1.18] tracking-[0.05em] text-white sm:text-[28px]">
              Pronto para vivenciar pagamentos
              <br />
              seguros e fluídos?
            </h2>

            <p className="mt-3 max-w-[600px] font-medium text-[12px] leading-[1.5] text-white/85 sm:text-[14px]">
              Pronto para pagamentos seguros e descomplicados ? Comece a usar a
              G-PayGo hoje mesmo: é rápido, gratuito e focado em manter suas
              transações seguras !
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <GButton variant="primary" size="lg" href="/login">
                Entrar Em Contato
              </GButton>

              <GButton variant="outline" size="lg" href="/register">
                Comece Agora
              </GButton>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}
