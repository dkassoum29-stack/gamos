"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getClient } from "@/lib/auth";

function seChevauchent(
  debutA: Date,
  finA: Date,
  debutB: Date,
  finB: Date
): boolean {
  return debutA <= finB && finA >= debutB;
}

export type ReservationFormState = { error?: string; success?: boolean } | undefined;

export async function creerReservationAction(
  voitureId: string,
  _prevState: ReservationFormState,
  formData: FormData
): Promise<ReservationFormState> {
  const client = await getClient();
  if (!client) {
    return { error: "Connecte-toi à ton compte pour envoyer une demande de réservation." };
  }

  const dateDebutStr = String(formData.get("dateDebut") ?? "");
  const dateFinStr = String(formData.get("dateFin") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  if (!dateDebutStr || !dateFinStr) {
    return { error: "Merci de remplir les dates de réservation." };
  }

  const dateDebut = new Date(dateDebutStr);
  const dateFin = new Date(dateFinStr);

  if (Number.isNaN(dateDebut.getTime()) || Number.isNaN(dateFin.getTime())) {
    return { error: "Dates invalides." };
  }
  if (dateFin < dateDebut) {
    return { error: "La date de fin doit être après la date de début." };
  }

  const voiture = await prisma.voiture.findUnique({ where: { id: voitureId } });
  if (!voiture) {
    return { error: "Cette voiture n'existe plus." };
  }

  const [reservationsConfirmees, indisponibilites] = await Promise.all([
    prisma.reservation.findMany({
      where: { voitureId, statut: "confirmee" },
    }),
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
      error:
        "Cette voiture n'est pas disponible sur ces dates. Regarde le calendrier ci-dessus pour choisir d'autres dates.",
    };
  }

  await prisma.reservation.create({
    data: {
      voitureId,
      clientId: client.id,
      nomClient: client.nom,
      telephoneClient: client.telephone,
      dateDebut,
      dateFin,
      message: message || null,
    },
  });

  revalidatePath(`/voitures/${voitureId}`);
  return { success: true };
}

export type AvisFormState = { error?: string; success?: boolean } | undefined;

export async function creerAvisAction(
  voitureId: string,
  _prevState: AvisFormState,
  formData: FormData
): Promise<AvisFormState> {
  const client = await getClient();
  if (!client) {
    return { error: "Connecte-toi à ton compte pour laisser un avis." };
  }

  const note = Number(formData.get("note"));
  const commentaire = String(formData.get("commentaire") ?? "").trim();

  if (!note || note < 1 || note > 5) {
    return { error: "Merci de choisir une note entre 1 et 5." };
  }

  const voiture = await prisma.voiture.findUnique({ where: { id: voitureId } });
  if (!voiture) {
    return { error: "Cette voiture n'existe plus." };
  }

  const reservation = await prisma.reservation.findFirst({
    where: { voitureId, clientId: client.id, statut: "confirmee" },
    include: { avis: true },
  });

  if (!reservation) {
    return {
      error:
        "Tu dois avoir une réservation confirmée pour cette voiture afin de laisser un avis.",
    };
  }

  if (reservation.avis) {
    return { error: "Tu as déjà laissé un avis pour cette réservation." };
  }

  await prisma.avis.create({
    data: {
      voitureId,
      reservationId: reservation.id,
      clientId: client.id,
      nomClient: client.nom,
      note,
      commentaire: commentaire || null,
    },
  });

  revalidatePath(`/voitures/${voitureId}`);
  return { success: true };
}
