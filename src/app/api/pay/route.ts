import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const token = req.headers.get("Authorization") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlLZXkiOiJjM2ZjZjUwN2I4ODU2MDBhMDIyOTBkZWVkNjlmZGY2NjA1ODYxZmI2NjlhNzkwOTMwYWJhOTljZjg2MDg0ZWFkIiwidGVuYW50X2lkIjoiYTUwODliM2QtZDY5ZC00N2U2LWE5NjQtZWQ1OTY1MjIwYjA0IiwiaWF0IjoxNzcyODEyMjg4LCJleHAiOjE4MDQzNjk4ODh9.iaworKY6Cz0OIaKPnWLoKMsePRnom0QeSBgALBaA7h4";

    const response = await fetch("https://pays.gpayangola.com/api/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "gpay-x-api": `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("API Proxy Route Error:", error);
    
    return NextResponse.json(
      { message: "Erro interno no Proxy Next.js", error: error.message },
      { status: 500 }
    );
  }
}
