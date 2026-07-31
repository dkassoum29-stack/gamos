"use client";

import { useActionState } from "react";
import Link from "next/link";
import { demanderReinitialisationAction } from "../actions";
import AuthCard, { ChampAvecIcone, ErreurFormulaire } from "@/components/AuthCard";
import { IconMail, IconCheck } from "@/components/icons";

export default function MotDePasseOubliePage() {
  const [state, formAction, pending] = useActionState(
    demanderReinitialisationAction,
    undefined
  );

  if (state?.success) {
    return (
      <AuthCard title="Vérifie tes emails">
        <p className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-800">
          <IconCheck className="h-4 w-4 shrink-0" />
          Si un compte existe avec cet email, un lien de réinitialisation
          vient d&apos;être envoyé.
        </p>
        <Link
          href="/compte/connexion"
          className="mt-4 inline-block text-sm font-semibold text-zinc-900 underline underline-offset-2"
        >
          Retour à la connexion
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="Indique ton email, on t'envoie un lien pour en choisir un nouveau."
      footer={
        <Link
          href="/compte/connexion"
          className="font-semibold text-zinc-900 underline underline-offset-2"
        >
          Retour à la connexion
        </Link>
      }
    >
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Email
          </label>
          <ChampAvecIcone icon={<IconMail />} name="email" required type="email" />
        </div>

        {state?.error && <ErreurFormulaire message={state.error} />}

        <button
          type="submit"
          disabled={pending}
          className="btn-brand mt-2 rounded-full px-4 py-2.5 font-medium transition-all disabled:opacity-60"
        >
          {pending ? "Envoi..." : "Envoyer le lien"}
        </button>
      </form>
    </AuthCard>
  );
}
