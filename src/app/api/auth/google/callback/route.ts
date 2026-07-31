import { NextRequest, NextResponse } from "next/server";
import { profilDepuisCodeGoogle, type RoleGoogle } from "@/lib/googleAuth";
import { prisma } from "@/lib/prisma";
import {
  createClientSession,
  createSession,
  createAdminSession,
  assurerAdminProprietaire,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const role = request.nextUrl.searchParams.get("state") as RoleGoogle | null;

  if (!code || !role) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const redirectUri = new URL("/api/auth/google/callback", request.nextUrl.origin).toString();
  const profil = await profilDepuisCodeGoogle(code, redirectUri);
  if (!profil) {
    return NextResponse.redirect(new URL("/?erreur=google", request.url));
  }

  const email = profil.email.toLowerCase();

  if (role === "client") {
    let client = await prisma.client.findUnique({ where: { email } });
    if (!client) {
      client = await prisma.client.create({
        data: { nom: profil.nom, email },
      });
    }
    await createClientSession(client.id);
    return NextResponse.redirect(new URL("/compte/tableau-de-bord", request.url));
  }

  if (role === "locateur") {
    let locateur = await prisma.locateur.findUnique({ where: { email } });
    if (!locateur) {
      locateur = await prisma.locateur.create({
        data: { nomAgence: profil.nom, email },
      });
    }
    await createSession(locateur.id);
    return NextResponse.redirect(new URL("/locateur/tableau-de-bord", request.url));
  }

  // role === "admin" : Google ne crée jamais un nouvel admin, sauf le propriétaire défini par env.
  await assurerAdminProprietaire();
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return NextResponse.redirect(new URL("/admin/connexion?erreur=inconnu", request.url));
  }
  await createAdminSession(admin.id);
  return NextResponse.redirect(new URL("/admin", request.url));
}
