import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[REGISTER] Request body:", JSON.stringify(body, null, 2));
    
    const res = await fetch("http://20.207.122.201/evaluation-service/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = { error: "Could not parse API response" };
    }
    
    console.log("[REGISTER] Response status:", res.status);
    console.log("[REGISTER] Response data:", JSON.stringify(data, null, 2));
    
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[REGISTER] Proxy error:", error);
    return NextResponse.json({ error: `Registration proxy failed: ${String(error)}` }, { status: 500 });
  }
}
