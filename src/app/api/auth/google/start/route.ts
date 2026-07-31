import { NextRequest, NextResponse } from "next/server";
import { urlAutorisationGoogle, type RoleGoogle } from "@/lib/googleAuth";

const ROLES_VALIDES: RoleGoogle[] = ["client", "locateur", "admin"];

export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get("role") as RoleGoogle | null;
  if (!role || !ROLES_VALIDES.includes(role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const redirectUri = new URL("/api/auth/google/callback", request.nextUrl.origin).toString();
  return NextResponse.redirect(urlAutorisationGoogle(role, redirectUri));
}
