"use client";

import { useActionState, useMemo, useState } from "react";
import { creerReservationAction } from "./actions";
import { lienWhatsApp } from "@/lib/format";
import { IconCheck, IconAlertCircle } from "@/components/icons";

type ReservationFormProps = {
  voitureId: string;
  locateurTelephone: string;
  marque: string;
  modele: string;
  plagesIndisponibles: { debut: string; fin: string }[];
};

function seChevauchent(debutA: Date, finA: Date, debutB: Date, finB: Date) {
  return debutA <= finB && finA >= debutB;
}

export default function ReservationForm({
  voitureId,
  locateurTelephone,
  marque,
  modele,
  plagesIndisponibles,
}: ReservationFormProps) {
  const action = creerReservationAction.bind(null, voitureId);
  const [state, formAction, pending] = useActionState(action, undefined);
  const [dates, setDates] = useState({ debut: "", fin: "" });

  const datesEnConflit = useMemo(() => {
    if (!dates.debut || !dates.fin) return false;
    const debut = new Date(dates.debut);
    const fin = new Date(dates.fin);
    if (fin < debut) return false;
    return plagesIndisponibles.some((p) =>
      seChevauchent(debut, fin, new Date(p.debut), new Date(p.fin))
    );
  }, [dates, plagesIndisponibles]);

  if (state?.success) {
    const message = `Bonjour, j'ai fait une demande de réservation sur Gamos pour la ${marque} ${modele}${
      dates.debut && dates.fin ? ` du ${dates.debut} au ${dates.fin}` : ""
    }. Pouvez-vous me confirmer la disponibilité ?`;

    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-green-800">
        <p className="flex items-center gap-1.5 font-semibold">
          <IconCheck className="h-4 w-4" />
          Demande envoyée
        </p>
        <p className="text-sm mt-1">
          Le locateur va te contacter directement pour confirmer la
          réservation. Tu peux aussi le prévenir tout de suite :
        </p>
        <a
          href={lienWhatsApp(locateurTelephone, message)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1ebe57] transition-colors"
        >
          Prévenir sur WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Date de début
          </label>
          <input
            type="date"
            name="dateDebut"
            required
            value={dates.debut}
            onChange={(e) => setDates((d) => ({ ...d, debut: e.target.value }))}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Date de fin
          </label>
          <input
            type="date"
            name="dateFin"
            required
            value={dates.fin}
            onChange={(e) => setDates((d) => ({ ...d, fin: e.target.value }))}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Message (optionnel)
        </label>
        <textarea
          name="message"
          rows={3}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          placeholder="Précisions sur ta demande..."
        />
      </div>

      {datesEnConflit && (
        <p className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <IconAlertCircle className="h-4 w-4 shrink-0" />
          Ces dates sont déjà prises pour cette voiture. Regarde le
          calendrier ci-dessus pour choisir d&apos;autres dates.
        </p>
      )}

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || datesEnConflit}
        className="btn-brand mt-1 rounded-full px-4 py-2.5 font-medium transition-all disabled:opacity-60"
      >
        {pending ? "Envoi..." : "Envoyer la demande de réservation"}
      </button>
    </form>
  );
}
