"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireLocateur } from "@/lib/auth";

export type VoitureFormState = { error?: string } | undefined;

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
  const photoUrl = String(formData.get("photoUrl") ?? "").trim();
  const photoUrl2 = String(formData.get("photoUrl2") ?? "").trim();
  const photoUrl3 = String(formData.get("photoUrl3") ?? "").trim();
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
