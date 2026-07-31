"use client";

import { useActionState } from "react";
import { connexionAdminAction } from "../actions";
import AuthCard, {
  ChampAvecIcone,
  ErreurFormulaire,
  Diviseur,
  BoutonGoogle,
} from "@/components/AuthCard";
import { IconMail, IconLock } from "@/components/icons";

export default function ConnexionAdminPage() {
  const [state, formAction, pending] = useActionState(
    connexionAdminAction,
    undefined
  );

  return (
    <AuthCard
      title="Administration"
      subtitle="Accès réservé à l'équipe Gamos."
    >
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Email
          </label>
          <ChampAvecIcone
            icon={<IconMail />}
            name="email"
            type="email"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Mot de passe
          </label>
          <ChampAvecIcone
            icon={<IconLock />}
            name="motDePasse"
            type="password"
            required
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

      <Diviseur />
      <BoutonGoogle role="admin" />
    </AuthCard>
  );
}
