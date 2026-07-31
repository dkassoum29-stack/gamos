"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireLocateur } from "@/lib/auth";
import { enregistrerPhotoVoiture } from "@/lib/stockage";

export type VoitureFormState = { error?: string } | undefined;

async function resoudrePhoto(
  formData: FormData,
  champFichier: string,
  champUrl: string
): Promise<string | null | { error: string }> {
  const fichier = formData.get(champFichier);
  if (fichier instanceof File && fichier.size > 0) {
    const resultat = await enregistrerPhotoVoiture(fichier);
    if ("error" in resultat) return { error: resultat.error };
    return resultat.url;
  }
  const url = String(formData.get(champUrl) ?? "").trim();
  return url || null;
}

export async function ajouterVoitureAction(
  _prevState: VoitureFormState,
  formData: FormData
): Promise<VoitureFormState> {
  const locateur = await requireLocateur();

  const marque = String(formData.get("marque") ?? "").trim();
  const modele = String(formData.get("modele") ?? "").trim();
  const annee = Number(formData.get("annee"));
  const ville = String(formData.get("ville") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  const transmission = String(formData.get("transmission") ?? "").trim();
  const places = Number(formData.get("places"));
  const prixParJour = Number(formData.get("prixParJour"));
  const description = String(formData.get("description") ?? "").trim();

  if (
    !marque ||
    !modele ||
    !ville ||
    !type ||
    !transmission ||
    !annee ||
    !places ||
    !prixParJour
  ) {
    return { error: "Merci de remplir tous les champs obligatoires." };
  }

  const photoUrl = await resoudrePhoto(formData, "photoFichier", "photoUrl");
  if (photoUrl && typeof photoUrl === "object") return { error: photoUrl.error };
  const photoUrl2 = await resoudrePhoto(formData, "photoFichier2", "photoUrl2");
  if (photoUrl2 && typeof photoUrl2 === "object") return { error: photoUrl2.error };
  const photoUrl3 = await resoudrePhoto(formData, "photoFichier3", "photoUrl3");
  if (photoUrl3 && typeof photoUrl3 === "object") return { error: photoUrl3.error };

  const voiture = await prisma.voiture.create({
    data: {
      locateurId: locateur.id,
      marque,
      modele,
      annee,
      ville,
      type,
      transmission,
      places,
      prixParJour,
      photoUrl: photoUrl || null,
      photoUrl2: photoUrl2 || null,
      photoUrl3: photoUrl3 || null,
      description: description || null,
    },
  });

  revalidatePath("/locateur/tableau-de-bord");
  revalidatePath("/");
  redirect(`/voitures/${voiture.id}`);
}

export async function toggleDisponibiliteAction(voitureId: string) {
  const locateur = await requireLocateur();

  const voiture = await prisma.voiture.findFirst({
    where: { id: voitureId, locateurId: locateur.id },
  });
  if (!voiture) return;

  await prisma.voiture.update({
    where: { id: voitureId },
    data: { disponible: !voiture.disponible },
  });

  revalidatePath("/locateur/tableau-de-bord");
  revalidatePath("/");
}

export async function supprimerVoitureAction(voitureId: string) {
  const locateur = await requireLocateur();

  await prisma.voiture.deleteMany({
    where: { id: voitureId, locateurId: locateur.id },
  });

  revalidatePath("/locateur/tableau-de-bord");
  revalidatePath("/");
}

export async function repondreReservationAction(
  reservationId: string,
  statut: "confirmee" | "refusee"
) {
  const locateur = await requireLocateur();

  const reservation = await prisma.reservation.findFirst({
    where: { id: reservationId, voiture: { locateurId: locateur.id } },
  });
  if (!reservation) return;

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { statut },
  });

  revalidatePath("/locateur/tableau-de-bord/reservations");
}

export type IndisponibiliteFormState = { error?: string } | undefined;

export async function ajouterIndisponibiliteAction(
  voitureId: string,
  _prevState: IndisponibiliteFormState,
  formData: FormData
): Promise<IndisponibiliteFormState> {
  const locateur = await requireLocateur();

  const voiture = await prisma.voiture.findFirst({
    where: { id: voitureId, locateurId: locateur.id },
  });
  if (!voiture) {
    return { error: "Cette voiture ne t'appartient pas." };
  }

  const dateDebutStr = String(formData.get("dateDebut") ?? "");
  const dateFinStr = String(formData.get("dateFin") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  const dateDebut = new Date(dateDebutStr);
  const dateFin = new Date(dateFinStr);

  if (Number.isNaN(dateDebut.getTime()) || Number.isNaN(dateFin.getTime())) {
    return { error: "Dates invalides." };
  }
  if (dateFin < dateDebut) {
    return { error: "La date de fin doit être après la date de début." };
  }

  await prisma.indisponibilite.create({
    data: { voitureId, dateDebut, dateFin, note: note || null },
  });

  revalidatePath(`/locateur/tableau-de-bord/voitures/${voitureId}/calendrier`);
  revalidatePath(`/voitures/${voitureId}`);
}

export type ReservationManuelleFormState = { error?: string; success?: boolean } | undefined;

function seChevauchent(debutA: Date, finA: Date, debutB: Date, finB: Date) {
  return debutA <= finB && finA >= debutB;
}

export async function ajouterReservationManuelleAction(
  _prevState: ReservationManuelleFormState,
  formData: FormData
): Promise<ReservationManuelleFormState> {
  const locateur = await requireLocateur();

  const voitureId = String(formData.get("voitureId") ?? "");
  const nomClient = String(formData.get("nomClient") ?? "").trim();
  const telephoneClient = String(formData.get("telephoneClient") ?? "").trim();
  const dateDebutStr = String(formData.get("dateDebut") ?? "");
  const dateFinStr = String(formData.get("dateFin") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  if (!nomClient || !telephoneClient || !dateDebutStr || !dateFinStr) {
    return { error: "Merci de remplir tous les champs obligatoires." };
  }

  const voiture = await prisma.voiture.findFirst({
    where: { id: voitureId, locateurId: locateur.id },
  });
  if (!voiture) {
    return { error: "Voiture invalide." };
  }

  const dateDebut = new Date(dateDebutStr);
  const dateFin = new Date(dateFinStr);
  if (Number.isNaN(dateDebut.getTime()) || Number.isNaN(dateFin.getTime())) {
    return { error: "Dates invalides." };
  }
  if (dateFin < dateDebut) {
    return { error: "La date de fin doit être après la date de début." };
  }

  const [reservationsConfirmees, indisponibilites] = await Promise.all([
    prisma.reservation.findMany({ where: { voitureId, statut: "confirmee" } }),
    prisma.indisponibilite.findMany({ where: { voitureId } }),
  ]);
  const enConflit =
    reservationsConfirmees.some((r) =>
      seChevauchent(dateDebut, dateFin, r.dateDebut, r.dateFin)
    ) ||
    indisponibilites.some((i) =>
      seChevauchent(dateDebut, dateFin, i.dateDebut, i.dateFin)
    );
  if (enConflit) {
    return {
      error: "Ces dates chevauchent déjà une réservation ou un blocage pour cette voiture.",
    };
  }

  await prisma.reservation.create({
    data: {
      voitureId,
      nomClient,
      telephoneClient,
      dateDebut,
      dateFin,
      message: message || null,
      statut: "confirmee",
    },
  });

  revalidatePath("/locateur/tableau-de-bord/reservations");
  revalidatePath(`/voitures/${voitureId}`);
  return { success: true };
}

export async function supprimerIndisponibiliteAction(
  indisponibiliteId: string
) {
  const locateur = await requireLocateur();

  const indisponibilite = await prisma.indisponibilite.findFirst({
    where: { id: indisponibiliteId, voiture: { locateurId: locateur.id } },
  });
  if (!indisponibilite) return;

  await prisma.indisponibilite.delete({ where: { id: indisponibiliteId } });

  revalidatePath(
    `/locateur/tableau-de-bord/voitures/${indisponibilite.voitureId}/calendrier`
  );
  revalidatePath(`/voitures/${indisponibilite.voitureId}`);
}
