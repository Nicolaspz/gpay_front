import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from "react-toastify";

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

export const metadata: Metadata = {
  title: {
    default: "Gpayment - Gateway de Pagamento em Angola",
    template: "%s | Gpayment - Soluções de Pagamento Seguro"
  },
  description: "Solução completa de pagamentos em Angola com Multicaixa Express, Referências Multicaixa, Transferências Bancárias e pagamentos internacionais. Processamento seguro e eficiente.",
  keywords: [
    "pagamento", "pagamentos", "pagamento Angola", "pagamentos Angola", "gateway pagamento", "gateway de pagamento",
    "Gpayment", "Gpayment Angola", "Gpayments", "G-payment",
    "Multicaixa Express", "Multicaixa", "Referência Multicaixa", "Multicaixa Referência", "pagamento por referência",
    "pagamento seguro", "pagamentos seguros", "pagamento online seguro", "transação segura",
    "transferência bancária", "pagamento digital", "pagamento eletrônico", "e-payment", "payment gateway",
    "solução pagamento", "plataforma pagamento", "sistema pagamento", "processamento pagamento", "checkout online",
    "multibanco", "pagamento multibanco",
    "online payment", "payment processing", "Angola payments", "Angola payment gateway"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_AO",
    url: "https://gpayment.ao/",
    title: "Gpayment - Gateway de Pagamento em Angola",
    description: "Soluções completas de pagamento digital para empresas em Angola",
    siteName: "Gpayment",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gpayment - Soluções de Pagamento",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gpayment - Gateway de Pagamento em Angola",
    description: "Soluções completas de pagamento digital para empresas em Angola",
    images: ["/twitter-image.jpg"],
    creator: "@gpayment",
  },
  alternates: {
    canonical: "https://gpayment.ao/",
    languages: {
      'pt-AO': 'https://gpayment.ao/',
      'pt-PT': 'https://gpayment.ao/pt-pt/',
    },
  },
  category: "Fintech, Pagamentos, Tecnologia",
  authors: [{ name: "Gpayment" }],
  publisher: "Gpayment",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-AO" suppressHydrationWarning>
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="icon" href="/gpay.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TZLRXBBK');
        `}
      </Script>
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
          <AuthProvider>{children}</AuthProvider>
          <ToastContainer position="top-right" autoClose={3000} />
        </ThemeProvider>
      </body>
    </html>
  )
}

