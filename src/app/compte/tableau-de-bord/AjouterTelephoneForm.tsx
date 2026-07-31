"use client";

import { useActionState } from "react";
import { mettreAJourTelephoneAction } from "../actions";
import { ChampAvecIcone, ErreurFormulaire } from "@/components/AuthCard";
import { IconPhone } from "@/components/icons";

export default function AjouterTelephoneForm() {
  const [state, formAction, pending] = useActionState(
    mettreAJourTelephoneAction,
    undefined
  );

  return (
    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-medium text-amber-900">
        Ajoute ton numéro de téléphone pour pouvoir réserver une voiture.
      </p>
      <form action={formAction} className="mt-2 flex flex-col gap-2 sm:flex-row">
        <ChampAvecIcone
          icon={<IconPhone />}
          name="telephone"
          required
          type="tel"
          placeholder="Ex : 70 00 00 00"
        />
        <button
          type="submit"
          disabled={pending}
          className="btn-brand shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-60"
        >
          {pending ? "..." : "Enregistrer"}
        </button>
      </form>
      {state?.error && (
        <div className="mt-2">
          <ErreurFormulaire message={state.error} />
        </div>
      )}
    </div>
  );
}
