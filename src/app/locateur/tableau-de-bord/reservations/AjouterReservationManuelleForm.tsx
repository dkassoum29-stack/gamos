"use client";

import { useActionState, useState } from "react";
import { ajouterReservationManuelleAction } from "../actions";
import { IconCheck } from "@/components/icons";

type Voiture = { id: string; marque: string; modele: string };

function Formulaire({ voitures, onSuccess }: { voitures: Voiture[]; onSuccess: () => void }) {
  const [state, formAction, pending] = useActionState(
    ajouterReservationManuelleAction,
    undefined
  );

  if (state?.success) {
    return (
      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-800">
        <span className="flex items-center gap-1.5">
          <IconCheck className="h-4 w-4 shrink-0" />
          Réservation ajoutée et confirmée.
        </span>
        <button
          type="button"
          onClick={onSuccess}
          className="shrink-0 font-semibold underline underline-offset-2"
        >
          Ajouter une autre
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-3 flex flex-col gap-3">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Voiture
        </label>
        <select
          name="voitureId"
          required
          defaultValue=""
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
        >
          <option value="" disabled>
            Choisir une voiture
          </option>
          {voitures.map((v) => (
            <option key={v.id} value={v.id}>
              {v.marque} {v.modele}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Nom du client
          </label>
          <input
            name="nomClient"
            required
            placeholder="Ex : Awa T."
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Téléphone
          </label>
          <input
            name="telephoneClient"
            required
            type="tel"
            placeholder="Ex : 70 00 00 00"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Date de début
          </label>
          <input
            type="date"
            name="dateDebut"
            required
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
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Note (optionnel)
        </label>
        <input
          name="message"
          placeholder="Ex : réservation prise par téléphone"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-brand self-start rounded-full px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-60"
      >
        {pending ? "Ajout..." : "Ajouter la réservation"}
      </button>
    </form>
  );
}

export default function AjouterReservationManuelleForm({ voitures }: { voitures: Voiture[] }) {
  const [ouvert, setOuvert] = useState(false);
  const [formKey, setFormKey] = useState(0);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        className="text-sm font-semibold text-zinc-900 hover:underline underline-offset-2"
      >
        {ouvert ? "Annuler" : "+ Ajouter une réservation manuelle"}
      </button>
      <p className="mt-0.5 text-xs text-zinc-500">
        Pour une réservation prise par téléphone ou en personne, hors du site.
      </p>

      {ouvert && voitures.length === 0 && (
        <p className="mt-3 text-sm text-zinc-500">
          Ajoute d&apos;abord une voiture pour pouvoir enregistrer une réservation.
        </p>
      )}

      {ouvert && voitures.length > 0 && (
        <Formulaire
          key={formKey}
          voitures={voitures}
          onSuccess={() => setFormKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
