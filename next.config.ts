import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BASE_API_URL: process.env.BASE_API_URL,
    BASE_APIPAY_URL: process.env.BASE_APIPAY_URL,
    NEXT_PUBLIC_BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL || process.env.BASE_API_URL,
    NEXT_PUBLIC_BASE_APIPAY_URL: process.env.NEXT_PUBLIC_BASE_APIPAY_URL || process.env.BASE_APIPAY_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/pay",
        destination: `${process.env.NEXT_PUBLIC_BASE_APIPAY_URL || process.env.BASE_APIPAY_URL}/api/pay`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://github.com https://*.github.com https://*.stripe.com; frame-src 'self' https://js.stripe.com https://hooks.stripe.com; connect-src 'self' https://*.gpayment.ao https://*.gpayangola.com https://*.google-analytics.com https://api.stripe.com https://stripe-server-ztck.onrender.com;",
          },
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  }
};

export default nextConfig;
