import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from "react-toastify";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1330" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://gpayment.ao"),
  title: {
    default: "Gpayment — Gateway de Pagamento em Angola | Multicaixa Express, Referências & Stripe",
    template: "%s | Gpayment — Gateway de Pagamento Angola",
  },
  description:
    "Gpayment é o gateway de pagamento completo para empresas em Angola. Aceite pagamentos via Multicaixa Express, Referências Multicaixa, PayPay e cartões internacionais (Visa/Mastercard) via Stripe. Integração rápida, taxas competitivas e segurança bancária.",
  keywords: [
    // Core
    "gateway de pagamento angola",
    "pagamento online angola",
    "processamento de pagamentos angola",
    "sistema de pagamento digital angola",
    // Multicaixa
    "multicaixa express",
    "pagamento multicaixa express",
    "referência multicaixa",
    "pagamento por referência multicaixa",
    // Métodos
    "paypay angola",
    "pagamento stripe angola",
    "cartão internacional angola",
    "transferência bancária angola",
    "pagamento digital angola",
    "pagamento eletrónico angola",
    // Business
    "gateway pagamento africa",
    "fintech angola",
    "checkout online angola",
    "receber pagamentos online",
    "integração pagamento api",
    "api pagamento angola",
    // Brand
    "gpayment",
    "g-payment",
    "gpay",
    "gpaygo",
    "gpay go",
    "gpay angola",
    // Long tail
    "como receber pagamento online em angola",
    "melhor gateway de pagamento angola",
    "pagamento seguro para loja online angola",
    "gateway pagamento multicaixa express",
    "sistema de cobrança online angola",
    "plataforma de pagamentos para empresas angola",
  ],
  authors: [{ name: "Gpayment", url: "https://gpayment.ao" }],
  creator: "Gpayment",
  publisher: "Gpayment",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_AO",
    url: "https://gpayment.ao",
    siteName: "Gpayment",
    title: "Gpayment — Gateway de Pagamento em Angola",
    description:
      "Aceite pagamentos online em Angola com Multicaixa Express, Referências Multicaixa, PayPay e cartões internacionais via Stripe. Integração rápida e segura.",
    images: [
      {
        url: "https://gpayment.ao/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gpayment — Gateway de Pagamento em Angola",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gpayment — Gateway de Pagamento em Angola",
    description:
      "Aceite pagamentos online em Angola com Multicaixa Express, Referências Multicaixa e cartões internacionais via Stripe.",
    images: ["https://gpayment.ao/og-image.png"],
    creator: "@gpayment",
    site: "@gpayment",
  },
  alternates: {
    canonical: "https://gpayment.ao",
    languages: {
      "pt-AO": "https://gpayment.ao",
    },
  },
  verification: {},
  category: "Fintech",
  referrer: "origin-when-cross-origin",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-AO" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon1.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TZLRXBBK');
          `,
        }}
      />
      <body className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} font-sans antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TZLRXBBK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
        >
          <ReactQueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </ReactQueryProvider>
          <ToastContainer position="top-right" autoClose={3000} />
        </ThemeProvider>
      </body>
    </html>
  )
}
