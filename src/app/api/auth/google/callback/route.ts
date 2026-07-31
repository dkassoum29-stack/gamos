import { NextRequest, NextResponse } from "next/server";
import { profilDepuisCodeGoogle } from "@/lib/googleAuth";
import { prisma } from "@/lib/prisma";
import { createSession, assurerAdminProprietaire } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const redirectUri = new URL("/api/auth/google/callback", request.nextUrl.origin).toString();
  const profil = await profilDepuisCodeGoogle(code, redirectUri);
  if (!profil) {
    return NextResponse.redirect(new URL("/?erreur=google", request.url));
  }

  const email = profil.email.toLowerCase();

  await assurerAdminProprietaire();

  let client = await prisma.client.findUnique({ where: { email } });
  if (!client) {
    client = await prisma.client.create({ data: { nom: profil.nom, email } });
  }

  await createSession(client.id);
  return NextResponse.redirect(new URL("/compte/tableau-de-bord", request.url));
}
