"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { reinitialiserMotDePasseAction } from "../actions";
import AuthCard, { ChampMotDePasse, ErreurFormulaire } from "@/components/AuthCard";
import { IconLock } from "@/components/icons";

export default function ReinitialiserForm() {
  const token = useSearchParams().get("token") ?? "";
  const action = reinitialiserMotDePasseAction.bind(null, token);
  const [state, formAction, pending] = useActionState(action, undefined);

  if (!token) {
    return (
      <AuthCard title="Lien invalide">
        <ErreurFormulaire message="Ce lien de réinitialisation est incomplet." />
        <Link
          href="/compte/mot-de-passe-oublie"
          className="mt-4 inline-block text-sm font-semibold text-zinc-900 underline underline-offset-2"
        >
          Refaire une demande
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Choisis un nouveau mot de passe"
      subtitle="Ce lien est valable 1 heure."
    >
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Nouveau mot de passe
          </label>
          <ChampMotDePasse
            icon={<IconLock />}
            name="motDePasse"
            required
            minLength={6}
            placeholder="6 caractères minimum"
          />
        </div>

        {state?.error && (
          <div className="flex flex-col gap-2">
            <ErreurFormulaire message={state.error} />
            <Link
              href="/compte/mot-de-passe-oublie"
              className="text-sm font-semibold text-zinc-900 underline underline-offset-2"
            >
              Refaire une demande
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn-brand mt-2 rounded-full px-4 py-2.5 font-medium transition-all disabled:opacity-60"
        >
          {pending ? "Enregistrement..." : "Réinitialiser mon mot de passe"}
        </button>
      </form>
    </AuthCard>
  );
}
