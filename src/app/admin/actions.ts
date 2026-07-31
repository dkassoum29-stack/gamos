"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createAdminSession,
  destroyAdminSession,
  requireAdmin,
  assurerAdminProprietaire,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AdminFormState = { error?: string } | undefined;

export async function inscriptionAdminAction(
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  const dejaExistant = await prisma.admin.count();
  if (dejaExistant > 0) {
    return { error: "Un compte administrateur existe déjà." };
  }

  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const motDePasse = String(formData.get("motDePasse") ?? "");

  if (!nom || !email || !motDePasse) {
    return { error: "Merci de remplir tous les champs." };
  }
  if (motDePasse.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const hash = await bcrypt.hash(motDePasse, 10);
  const admin = await prisma.admin.create({
    data: { nom, email, motDePasse: hash },
  });

  await createAdminSession(admin.id);
  redirect("/admin");
}

export async function connexionAdminAction(
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const motDePasse = String(formData.get("motDePasse") ?? "");

  await assurerAdminProprietaire();

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return { error: "Email ou mot de passe incorrect." };
  }
  if (!admin.motDePasse) {
    return { error: "Ce compte utilise la connexion Google. Utilise le bouton Google ci-dessous." };
  }

  const valide = await bcrypt.compare(motDePasse, admin.motDePasse);
  if (!valide) {
    return { error: "Email ou mot de passe incorrect." };
  }

  await createAdminSession(admin.id);
  redirect("/admin");
}

export async function deconnexionAdminAction() {
  await destroyAdminSession();
  redirect("/admin/connexion");
}

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

export async function promouvoirAdminAction(
  _prevState: PromotionFormState,
  formData: FormData
): Promise<PromotionFormState> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    return { error: "Merci de renseigner un email." };
  }

  const dejaAdmin = await prisma.admin.findUnique({ where: { email } });
  if (dejaAdmin) {
    return { error: "Cette personne est déjà administrateur." };
  }

  const [client, locateur] = await Promise.all([
    prisma.client.findUnique({ where: { email } }),
    prisma.locateur.findUnique({ where: { email } }),
  ]);
  const nom = client?.nom ?? locateur?.nomAgence ?? email.split("@")[0];

  await prisma.admin.create({ data: { nom, email } });

  revalidatePath("/admin/parametres");
  return {
    success: `${email} est maintenant administrateur. Cette personne doit se connecter avec Google (aucun mot de passe n'a été défini).`,
  };
}

export async function retirerAdminAction(adminId: string) {
  const admin = await requireAdmin();
  if (admin.id === adminId) {
    return;
  }

  await prisma.admin.delete({ where: { id: adminId } });
  revalidatePath("/admin/parametres");
}
