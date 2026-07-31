"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function validerLocateurAction(
  locateurId: string,
  statut: "verifie" | "refuse"
) {
  await requireAdmin();

  await prisma.locateur.update({
    where: { id: locateurId },
    data: { statutVerification: statut },
  });

  revalidatePath("/admin/verifications");
}

export type PromotionFormState = { error?: string; success?: string } | undefined;

export async function promouvoirRoleAction(
  _prevState: PromotionFormState,
  formData: FormData
): Promise<PromotionFormState> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "");

  if (!email) {
    return { error: "Merci de renseigner un email." };
  }
  if (role !== "admin" && role !== "locateur") {
    return { error: "Rôle invalide." };
  }

  let client = await prisma.client.findUnique({ where: { email } });
  if (!client) {
    client = await prisma.client.create({
      data: { nom: email.split("@")[0], email },
    });
  }

  if (role === "admin") {
    if (client.estAdmin) {
      return { error: "Cette personne est déjà administrateur." };
    }
    await prisma.client.update({
      where: { id: client.id },
      data: { estAdmin: true },
    });
    revalidatePath("/admin/parametres");
    return { success: `${email} est maintenant administrateur.` };
  }

  const dejaLocateur = await prisma.locateur.findUnique({
    where: { clientId: client.id },
  });
  if (dejaLocateur) {
    return { error: "Cette personne est déjà locateur." };
  }

  await prisma.locateur.create({
    data: { nomAgence: client.nom, clientId: client.id },
  });
  revalidatePath("/admin/parametres");
  return {
    success: `${email} est maintenant locateur. Cette personne devra compléter son profil (ville, téléphone) avant de publier des annonces.`,
  };
}

export async function retirerAdminAction(clientId: string) {
  const admin = await requireAdmin();
  if (admin.id === clientId) {
    return;
  }

  await prisma.client.update({
    where: { id: clientId },
    data: { estAdmin: false },
  });
  revalidatePath("/admin/parametres");
}
