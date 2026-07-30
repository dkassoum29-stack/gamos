"use server";

import { revalidatePath } from "next/cache";
import { requireLocateur } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enregistrerPieceIdentite } from "@/lib/stockage";

export type VerificationFormState = { error?: string } | undefined;

export async function soumettreVerificationAction(
  _prevState: VerificationFormState,
  formData: FormData
): Promise<VerificationFormState> {
  const locateur = await requireLocateur();

  const fichier = formData.get("piece");
  if (!(fichier instanceof File) || fichier.size === 0) {
    return { error: "Merci de choisir un fichier." };
  }

  const resultat = await enregistrerPieceIdentite(locateur.id, fichier);
  if ("error" in resultat) {
    return { error: resultat.error };
  }

  await prisma.locateur.update({
    where: { id: locateur.id },
    data: {
      pieceIdentiteChemin: resultat.chemin,
      pieceIdentiteEnvoyeeLe: new Date(),
      statutVerification: "en_attente",
    },
  });

  revalidatePath("/locateur/tableau-de-bord/verification");
}
