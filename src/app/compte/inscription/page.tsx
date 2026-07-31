"use client";

import { useActionState } from "react";
import Link from "next/link";
import { inscriptionClientAction } from "../actions";
import AuthCard, {
  ChampAvecIcone,
  ChampMotDePasse,
  ErreurFormulaire,
  Diviseur,
  BoutonGoogle,
} from "@/components/AuthCard";
import { IconMail, IconLock, IconUser, IconPhone } from "@/components/icons";

export default function InscriptionClientPage() {
  const [state, formAction, pending] = useActionState(
    inscriptionClientAction,
    undefined
  );

  return (
    <AuthCard
      title="Créer mon compte"
      subtitle="Pour réserver une voiture et laisser des avis sur Gamos."
      footer={
        <>
          Déjà un compte ?{" "}
          <Link
            href="/compte/connexion"
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
            Ton nom
          </label>
          <ChampAvecIcone icon={<IconUser />} name="nom" required />
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
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Mot de passe
          </label>
          <ChampMotDePasse
            icon={<IconLock />}
            name="motDePasse"
            required
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
          {pending ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <Diviseur />
      <BoutonGoogle />
    </AuthCard>
  );
}
