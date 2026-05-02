import { NextResponse } from "next/server";
import { MOCK_NOTIFICATIONS } from "@/lib/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "20";
  const page = searchParams.get("page") || "1";
  const type = searchParams.get("notification_type");

  const targetUrl = new URL("http://20.207.122.201/evaluation-service/notifications");
  targetUrl.searchParams.set("limit", limit);
  targetUrl.searchParams.set("page", page);
  if (type) targetUrl.searchParams.set("notification_type", type);

  // Get the authorization header from the incoming request
  const authHeader = request.headers.get("authorization");

  try {
    const res = await fetch(targetUrl.toString(), {
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      next: { revalidate: 0 },
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = { error: "Could not parse API response" };
    }

    // Return mock data on 401 for demo/testing
    if (res.status === 401) {
      console.log("[NOTIFICATIONS] External API returned 401, serving mock data");
      let mockData = MOCK_NOTIFICATIONS;
      
      // Filter by type if requested
      if (type) {
        mockData = mockData.filter(n => n.Type === type);
      }
      
      // Apply pagination
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 20;
      const start = (pageNum - 1) * limitNum;
      const paginatedData = mockData.slice(start, start + limitNum);
      
      return NextResponse.json({
        notifications: paginatedData,
        total: mockData.length,
        page: pageNum,
        limit: limitNum,
        source: "mock"
      });
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[NOTIFICATIONS] Proxy error:", error);
    // Fallback to mock data on any error
    console.log("[NOTIFICATIONS] Serving mock data due to error");
    return NextResponse.json({
      notifications: MOCK_NOTIFICATIONS,
      source: "mock_fallback"
    });
  }
}

