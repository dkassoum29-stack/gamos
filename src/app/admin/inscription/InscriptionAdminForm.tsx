"use client";

import { useActionState } from "react";
import { inscriptionAdminAction } from "../actions";
import { ChampAvecIcone, ErreurFormulaire } from "@/components/AuthCard";
import { IconMail, IconLock, IconUser } from "@/components/icons";

export default function InscriptionAdminForm() {
  const [state, formAction, pending] = useActionState(
    inscriptionAdminAction,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">
          Ton nom
        </label>
        <ChampAvecIcone icon={<IconUser />} name="nom" required />
      </div>
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
          minLength={8}
          placeholder="8 caractères minimum"
        />
      </div>

      {state?.error && <ErreurFormulaire message={state.error} />}

      <button
        type="submit"
        disabled={pending}
        className="btn-brand mt-2 rounded-full px-4 py-2.5 font-medium transition-all disabled:opacity-60"
      >
        {pending ? "Création..." : "Créer le compte admin"}
      </button>
    </form>
  );
}
