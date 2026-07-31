"use client";

import { useActionState } from "react";
import { ajouterVoitureAction } from "../../actions";
import { VILLES, TYPES_VOITURE, TRANSMISSIONS } from "@/lib/format";

export default function AjouterVoitureForm() {
  const [state, formAction, pending] = useActionState(
    ajouterVoitureAction,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Marque
          </label>
          <input
            name="marque"
            required
            placeholder="Ex : Toyota"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Modèle
          </label>
          <input
            name="modele"
            required
            placeholder="Ex : Corolla"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Année
          </label>
          <input
            name="annee"
            type="number"
            required
            min={1990}
            max={2030}
            placeholder="Ex : 2018"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Places
          </label>
          <input
            name="places"
            type="number"
            required
            min={1}
            max={30}
            placeholder="Ex : 5"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Ville
          </label>
          <select
            name="ville"
            required
            defaultValue=""
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="" disabled>
              Choisir
            </option>
            {VILLES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Type
          </label>
          <select
            name="type"
            required
            defaultValue=""
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="" disabled>
              Choisir
            </option>
            {TYPES_VOITURE.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Transmission
          </label>
          <select
            name="transmission"
            required
            defaultValue=""
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="" disabled>
              Choisir
            </option>
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Prix / jour (FCFA)
          </label>
          <input
            name="prixParJour"
            type="number"
            required
            min={0}
            placeholder="Ex : 25000"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Photos (jusqu&apos;à 3, optionnel)
        </label>
        <p className="text-xs text-zinc-500 mb-2">
          Choisis une photo depuis ta galerie, ou colle un lien si tu en as
          déjà un en ligne.
        </p>
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex flex-col gap-1.5 rounded-lg border border-zinc-200 p-2.5">
              <span className="text-xs font-medium text-zinc-500">
                Photo {n === 1 ? "principale" : n} {n > 1 && "(optionnel)"}
              </span>
              <input
                name={`photoFichier${n === 1 ? "" : n}`}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="w-full text-sm text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
              />
              <input
                name={`photoUrl${n === 1 ? "" : n}`}
                type="url"
                placeholder="ou colle un lien : https://..."
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Description (optionnel)
        </label>
        <textarea
          name="description"
          rows={3}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          placeholder="Climatisation, kilométrage illimité, etc."
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
        className="btn-brand mt-1 rounded-full px-4 py-2.5 font-medium text-white transition-all disabled:opacity-60"
      >
        {pending ? "Ajout..." : "Ajouter la voiture"}
      </button>
    </form>
  );
}
