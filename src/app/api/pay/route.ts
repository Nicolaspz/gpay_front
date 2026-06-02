import { NextResponse } from "next/server";

function getRouteErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Erro desconhecido";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let apiKey = req.headers.get("gpay-x-api");
    
    if (!apiKey) {
      const fallbackToken = req.headers.get("Authorization") || "";
      apiKey = fallbackToken.startsWith("Bearer ") ? fallbackToken : `Bearer ${fallbackToken}`;
    }

    const response = await fetch("https://pays.gpayangola.com/api/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "gpay-x-api": apiKey || ""
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    const message = getRouteErrorMessage(error);

    return NextResponse.json(
      { message: "Erro interno no Proxy Next.js", error: message },
      { status: 500 }
    );
  }
}
