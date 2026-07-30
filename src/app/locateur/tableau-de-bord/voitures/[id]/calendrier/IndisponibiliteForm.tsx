"use client";

import { useActionState } from "react";
import { ajouterIndisponibiliteAction } from "../../../actions";

export default function IndisponibiliteForm({ voitureId }: { voitureId: string }) {
  const action = ajouterIndisponibiliteAction.bind(null, voitureId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Du
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
            Au
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
          Raison (optionnel)
        </label>
        <input
          name="note"
          placeholder="Ex : entretien, déjà louée hors du site..."
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
        className="self-start rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-60"
      >
        {pending ? "Ajout..." : "Bloquer ces dates"}
      </button>
    </form>
  );
}
