import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { locale } = await req.json();
  if (!locale) {
    return NextResponse.json({ error: "Locale is required" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  response.headers.set(
    "Set-Cookie",
    `NEXT_LOCALE=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 365}`
  );
  return response;
}

export async function GET() {
  const { cookies } = await import("next/headers");
  const locale = (await cookies()).get("NEXT_LOCALE")?.value || null;
  return NextResponse.json({ locale }, { status: 200 });
}
