"use client";

import { useActionState, useState } from "react";
import { creerAvisAction } from "./actions";

export default function AvisForm({ voitureId }: { voitureId: string }) {
  const action = creerAvisAction.bind(null, voitureId);
  const [state, formAction, pending] = useActionState(action, undefined);
  const [note, setNote] = useState(5);

  if (state?.success) {
    return (
      <p className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
        Merci pour ton avis !
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <p className="text-xs text-zinc-500 -mb-1">
        Réservé à celles et ceux ayant une réservation confirmée pour cette
        voiture.
      </p>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Note
        </label>
        <input type="hidden" name="note" value={note} />
        <div className="flex gap-1 text-2xl">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNote(n)}
              aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
              className={n <= note ? "text-amber-500" : "text-zinc-300"}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Commentaire (optionnel)
        </label>
        <textarea
          name="commentaire"
          rows={2}
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
        {pending ? "Envoi..." : "Publier l'avis"}
      </button>
    </form>
  );
}
