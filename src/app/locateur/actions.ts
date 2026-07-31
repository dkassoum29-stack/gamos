"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireClient, requireLocateur } from "@/lib/auth";
import { VILLES } from "@/lib/format";

export type FormState = { error?: string } | undefined;

export async function devenirLocateurAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const client = await requireClient();

  const dejaLocateur = await prisma.locateur.findUnique({
    where: { clientId: client.id },
  });
  if (dejaLocateur) {
    redirect("/locateur/tableau-de-bord");
  }

  const nomAgence = String(formData.get("nomAgence") ?? "").trim();
  const ville = String(formData.get("ville") ?? "").trim();
  const telephone = String(formData.get("telephone") ?? "").trim();

  if (!nomAgence || !ville || !telephone) {
    return { error: "Merci de remplir tous les champs." };
  }
  if (!VILLES.includes(ville)) {
    return { error: "Ville invalide." };
  }

  await prisma.locateur.create({
    data: { nomAgence, ville, telephone, clientId: client.id },
  });

  redirect("/locateur/tableau-de-bord");
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
