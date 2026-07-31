"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  destroySession,
  requireClient,
  assurerAdminProprietaire,
} from "@/lib/auth";

export type FormState = { error?: string } | undefined;

export async function inscriptionClientAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const nom = String(formData.get("nom") ?? "").trim();
  const telephone = String(formData.get("telephone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const motDePasse = String(formData.get("motDePasse") ?? "");

  if (!nom || !telephone || !email || !motDePasse) {
    return { error: "Merci de remplir tous les champs." };
  }
  if (motDePasse.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  const existant = await prisma.client.findUnique({ where: { email } });
  if (existant) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const hash = await bcrypt.hash(motDePasse, 10);
  const client = await prisma.client.create({
    data: { nom, telephone, email, motDePasse: hash },
  });

  await createSession(client.id);
  redirect("/compte/tableau-de-bord");
}

export async function connexionClientAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const motDePasse = String(formData.get("motDePasse") ?? "");

  await assurerAdminProprietaire();

  const client = await prisma.client.findUnique({ where: { email } });
  if (!client) {
    return { error: "Email ou mot de passe incorrect." };
  }
  if (!client.motDePasse) {
    return { error: "Ce compte utilise la connexion Google. Utilise le bouton Google ci-dessous." };
  }

  const valide = await bcrypt.compare(motDePasse, client.motDePasse);
  if (!valide) {
    return { error: "Email ou mot de passe incorrect." };
  }

  await createSession(client.id);
  redirect("/compte/tableau-de-bord");
}

export async function deconnexionClientAction() {
  await destroySession();
  redirect("/");
}

export async function mettreAJourTelephoneAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const client = await requireClient();

  const telephone = String(formData.get("telephone") ?? "").trim();
  if (!telephone) {
    return { error: "Merci de renseigner un numéro de téléphone." };
  }

  await prisma.client.update({
    where: { id: client.id },
    data: { telephone },
  });

  revalidatePath("/compte/tableau-de-bord");
}
