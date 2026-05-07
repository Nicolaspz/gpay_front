import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let apiKey = req.headers.get("gpay-x-api");
    
    if (!apiKey) {
      const fallbackToken = req.headers.get("Authorization") || "";
      apiKey = fallbackToken.startsWith("Bearer ") ? fallbackToken : `Bearer ${fallbackToken}`;
    }

    console.log("=== INICIANDO PROXY PARA A API EXTERNA ===");
    console.log("URL de Destino:", "https://pays.gpayangola.com/api/pay");
    console.log("API KEY enviada:", apiKey ? "Presente (ocultada por segurança)" : "Ausente");
    console.log("Payload sendo enviado:", JSON.stringify(body));

    const response = await fetch("https://pays.gpayangola.com/api/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "gpay-x-api": apiKey || ""
      },
      body: JSON.stringify(body),
    });

    console.log("STATUS DA RESPOSTA EXTERNA:", response.status);
    
    const data = await response.json().catch(() => ({}));
    console.log("DADOS DA RESPOSTA:", data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("=== ERRO CATASTRÓFICO NO FETCH PROXY ===");
    console.error("Erro message:", error.message);
    console.error("Erro cause:", error.cause);
    console.error("Erro code:", error.code);
    
    return NextResponse.json(
      { message: "Erro interno no Proxy Next.js", error: error.message, cause: error.cause },
      { status: 500 }
    );
  }
}
