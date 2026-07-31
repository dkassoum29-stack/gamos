"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, requireLocateur } from "@/lib/auth";
import { VILLES } from "@/lib/format";

export type FormState = { error?: string } | undefined;

export async function signupAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const nomAgence = String(formData.get("nomAgence") ?? "").trim();
  const ville = String(formData.get("ville") ?? "").trim();
  const telephone = String(formData.get("telephone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const motDePasse = String(formData.get("motDePasse") ?? "");

  if (!nomAgence || !ville || !telephone || !email || !motDePasse) {
    return { error: "Merci de remplir tous les champs." };
  }
  if (motDePasse.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  const existant = await prisma.locateur.findUnique({ where: { email } });
  if (existant) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const hash = await bcrypt.hash(motDePasse, 10);
  const locateur = await prisma.locateur.create({
    data: { nomAgence, ville, telephone, email, motDePasse: hash },
  });

  await createSession(locateur.id);
  redirect("/locateur/tableau-de-bord");
}

export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const motDePasse = String(formData.get("motDePasse") ?? "");

  const locateur = await prisma.locateur.findUnique({ where: { email } });
  if (!locateur) {
    return { error: "Email ou mot de passe incorrect." };
  }
  if (!locateur.motDePasse) {
    return { error: "Ce compte utilise la connexion Google. Utilise le bouton Google ci-dessous." };
  }

  const valide = await bcrypt.compare(motDePasse, locateur.motDePasse);
  if (!valide) {
    return { error: "Email ou mot de passe incorrect." };
  }

  await createSession(locateur.id);
  redirect("/locateur/tableau-de-bord");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function completerProfilAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const locateur = await requireLocateur();

  const nomAgence = String(formData.get("nomAgence") ?? "").trim();
  const ville = String(formData.get("ville") ?? "").trim();
  const telephone = String(formData.get("telephone") ?? "").trim();

  if (!nomAgence || !ville || !telephone) {
    return { error: "Merci de remplir tous les champs." };
  }
  if (!VILLES.includes(ville)) {
    return { error: "Ville invalide." };
  }

  await prisma.locateur.update({
    where: { id: locateur.id },
    data: { nomAgence, ville, telephone },
  });

  redirect("/locateur/tableau-de-bord");
}
