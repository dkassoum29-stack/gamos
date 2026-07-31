import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-secret"
);
const COOKIE_NAME = "session";

export async function createSession(clientId: string) {
  const token = await new SignJWT({ clientId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getSession(): Promise<{ clientId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.clientId !== "string") return null;
    return { clientId: payload.clientId };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getClient() {
  const session = await getSession();
  if (!session) return null;
  return prisma.client.findUnique({ where: { id: session.clientId } });
}

export async function requireClient() {
  const client = await getClient();
  if (!client) redirect("/compte/connexion");
  return client;
}

export async function getLocateur() {
  const session = await getSession();
  if (!session) return null;
  return prisma.locateur.findUnique({ where: { clientId: session.clientId } });
}

export async function requireLocateur() {
  await requireClient();
  const locateur = await getLocateur();
  if (!locateur) redirect("/locateur/inscription");
  return locateur;
}

export async function getAdmin() {
  const client = await getClient();
  if (!client?.estAdmin) return null;
  return client;
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/compte/connexion");
  return admin;
}

// Garantit que le compte administrateur "propriétaire" existe toujours,
// même si son statut admin a été retiré par erreur.
export async function assurerAdminProprietaire() {
  const email = process.env.OWNER_ADMIN_EMAIL?.trim().toLowerCase();
  const motDePasse = process.env.OWNER_ADMIN_PASSWORD;
  if (!email || !motDePasse) return;

  const existant = await prisma.client.findUnique({ where: { email } });
  if (!existant) {
    const hash = await bcrypt.hash(motDePasse, 10);
    await prisma.client.create({
      data: { nom: "Propriétaire", email, motDePasse: hash, estAdmin: true },
    });
  } else if (!existant.estAdmin) {
    await prisma.client.update({
      where: { id: existant.id },
      data: { estAdmin: true },
    });
  }
}
