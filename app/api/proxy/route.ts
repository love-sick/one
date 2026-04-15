import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return Response.json(
        { error: "Missing url parameter" },
        { status: 400 }
      );
    }

    // امنیت پایه (جلوگیری از لوکال/شبکه داخلی)
    if (
      url.includes("localhost") ||
      url.includes("127.0.0.1") ||
      url.includes("10.") ||
      url.includes("192.168.") ||
      url.includes("169.254.")
    ) {
      return Response.json(
        { error: "Blocked URL" },
        { status: 403 }
      );
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Vercel-Proxy/1.0",
        "Accept": "*/*",
      },
    });

    const contentType = response.headers.get("content-type");

    // اگر JSON بود
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      return Response.json(data);
    }

    // متن معمولی
    const text = await response.text();
    return new Response(text, {
      headers: {
        "Content-Type": contentType || "text/plain",
      },
    });

  } catch (err: any) {
    return Response.json(
      { error: "Proxy failed", details: err.message },
      { status: 500 }
    );
  }
}