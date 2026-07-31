"use client";

import { useActionState } from "react";
import { completerProfilAction } from "../actions";
import AuthCard, { ChampAvecIcone, ErreurFormulaire } from "@/components/AuthCard";
import { IconBuilding, IconPhone } from "@/components/icons";
import { VILLES } from "@/lib/format";

export default function CompleterProfilPage() {
  const [state, formAction, pending] = useActionState(
    completerProfilAction,
    undefined
  );

  return (
    <AuthCard
      title="Complète ton profil"
      subtitle="Encore une étape avant d'accéder à ton tableau de bord : ces informations apparaissent sur tes annonces."
    >
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Nom de l&apos;agence ou ton nom
          </label>
          <ChampAvecIcone icon={<IconBuilding />} name="nomAgence" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Ville
          </label>
          <select
            name="ville"
            required
            defaultValue=""
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="" disabled>
              Choisir une ville
            </option>
            {VILLES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Téléphone
          </label>
          <ChampAvecIcone
            icon={<IconPhone />}
            name="telephone"
            required
            type="tel"
            placeholder="Ex : 70 00 00 00"
          />
        </div>

        {state?.error && <ErreurFormulaire message={state.error} />}

        <button
          type="submit"
          disabled={pending}
          className="btn-brand mt-2 rounded-full px-4 py-2.5 font-medium transition-all disabled:opacity-60"
        >
          {pending ? "Enregistrement..." : "Continuer"}
        </button>
      </form>
    </AuthCard>
  );
}
