import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-secret"
);
const COOKIE_NAME = "session";

export async function createSession(locateurId: string) {
  const token = await new SignJWT({ locateurId })
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

export async function getSession(): Promise<{ locateurId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return { locateurId: payload.locateurId as string };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function requireLocateur() {
  const session = await getSession();
  if (!session) redirect("/locateur/connexion");

  const locateur = await prisma.locateur.findUnique({
    where: { id: session.locateurId },
  });
  if (!locateur) redirect("/locateur/connexion");

  return locateur;
}

// --- Comptes locataires (clients) ---

const CLIENT_COOKIE_NAME = "session_client";

export async function createClientSession(clientId: string) {
  const token = await new SignJWT({ clientId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(CLIENT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getClientSession(): Promise<{ clientId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENT_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return { clientId: payload.clientId as string };
  } catch {
    return null;
  }
}

export async function destroyClientSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENT_COOKIE_NAME);
}

export async function getClient() {
  const session = await getClientSession();
  if (!session) return null;
  return prisma.client.findUnique({ where: { id: session.clientId } });
}

export async function requireClient() {
  const client = await getClient();
  if (!client) redirect("/compte/connexion");
  return client;
}

// --- Admin ---

const ADMIN_COOKIE_NAME = "admin_session";

export async function createAdminSession(adminId: string) {
  const token = await new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function getAdminSession(): Promise<{ adminId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.adminId !== "string") return null;
    return { adminId: payload.adminId };
  } catch {
    return null;
  }
}

export async function getAdmin() {
  const session = await getAdminSession();
  if (!session) return null;
  return prisma.admin.findUnique({ where: { id: session.adminId } });
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/connexion");
  return admin;
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

// Garantit que le compte administrateur "propriétaire" existe toujours,
// même si la ligne a été supprimée de la table Admin par erreur.
export async function assurerAdminProprietaire() {
  const email = process.env.OWNER_ADMIN_EMAIL?.trim().toLowerCase();
  const motDePasse = process.env.OWNER_ADMIN_PASSWORD;
  if (!email || !motDePasse) return;

  const existant = await prisma.admin.findUnique({ where: { email } });
  if (!existant) {
    const hash = await bcrypt.hash(motDePasse, 10);
    await prisma.admin.create({
      data: { nom: "Propriétaire", email, motDePasse: hash },
    });
  }
}
