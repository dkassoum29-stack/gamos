"use client";

import { useActionState } from "react";
import { soumettreVerificationAction } from "./actions";

export default function VerificationForm() {
  const [state, formAction, pending] = useActionState(
    soumettreVerificationAction,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Pièce d&apos;identité ou carte grise (photo ou PDF)
        </label>
        <input
          name="piece"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Ce document est privé : seul l&apos;équipe Gamos peut le consulter
          pour valider ton compte.
        </p>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-brand self-start rounded-full px-4 py-2 text-sm font-medium transition-all disabled:opacity-60"
      >
        {pending ? "Envoi..." : "Envoyer pour vérification"}
      </button>
    </form>
  );
}
