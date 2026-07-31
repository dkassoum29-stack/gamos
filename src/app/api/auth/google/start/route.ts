import { NextRequest, NextResponse } from "next/server";
import { urlAutorisationGoogle } from "@/lib/googleAuth";

export async function GET(request: NextRequest) {
  const redirectUri = new URL("/api/auth/google/callback", request.nextUrl.origin).toString();
  return NextResponse.redirect(urlAutorisationGoogle(redirectUri));
}
