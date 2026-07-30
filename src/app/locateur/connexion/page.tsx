"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "../actions";
import AuthCard, { ChampAvecIcone, ErreurFormulaire } from "@/components/AuthCard";
import { IconMail, IconLock } from "@/components/icons";

export default function ConnexionPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <AuthCard
      title="Espace locateur"
      subtitle="Accède à ton tableau de bord pour gérer tes voitures."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link
            href="/locateur/inscription"
            className="font-semibold text-zinc-900 underline underline-offset-2"
          >
            Devenir locateur
          </Link>
        </>
      }
    >
      <form action={formAction} className="flex flex-col gap-4">
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
          <ChampAvecIcone
            icon={<IconLock />}
            name="motDePasse"
            required
            type="password"
          />
        </div>

        {state?.error && <ErreurFormulaire message={state.error} />}

        <button
          type="submit"
          disabled={pending}
          className="btn-brand mt-2 rounded-full px-4 py-2.5 font-medium transition-all disabled:opacity-60"
        >
          {pending ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </AuthCard>
  );
}
