"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "../actions";
import { VILLES } from "@/lib/format";
import AuthCard, { ChampAvecIcone, ErreurFormulaire } from "@/components/AuthCard";
import { IconMail, IconLock, IconBuilding, IconPhone } from "@/components/icons";

export default function InscriptionPage() {
  const [state, formAction, pending] = useActionState(signupAction, undefined);

  return (
    <AuthCard
      title="Devenir locateur"
      subtitle="Crée un compte pour mettre tes voitures en location sur Gamos."
      footer={
        <>
          Déjà locateur ?{" "}
          <Link
            href="/locateur/connexion"
            className="font-semibold text-zinc-900 underline underline-offset-2"
          >
            Se connecter
          </Link>
        </>
      }
    >
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Nom de l&apos;agence ou ton nom
          </label>
          <ChampAvecIcone
            icon={<IconBuilding />}
            name="nomAgence"
            required
            placeholder="Ex : Faso Auto Location"
          />
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
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Email
          </label>
          <ChampAvecIcone
            icon={<IconMail />}
            name="email"
            required
            type="email"
            placeholder="toi@exemple.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Mot de passe
          </label>
          <ChampAvecIcone
            icon={<IconLock />}
            name="motDePasse"
            required
            type="password"
            minLength={6}
            placeholder="6 caractères minimum"
          />
        </div>

        {state?.error && <ErreurFormulaire message={state.error} />}

        <button
          type="submit"
          disabled={pending}
          className="btn-brand mt-2 rounded-full px-4 py-2.5 font-medium transition-all disabled:opacity-60"
        >
          {pending ? "Création du compte..." : "Créer mon compte locateur"}
        </button>
      </form>
    </AuthCard>
  );
}
