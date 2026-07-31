"use client";

import { useActionState } from "react";
import { promouvoirRoleAction } from "../actions";
import { ChampAvecIcone, ErreurFormulaire } from "@/components/AuthCard";
import { IconMail } from "@/components/icons";

export default function PromouvoirAdminForm() {
  const [state, formAction, pending] = useActionState(
    promouvoirRoleAction,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <ChampAvecIcone
          icon={<IconMail />}
          name="email"
          type="email"
          required
          placeholder="email@exemple.com"
        />
        {state?.error && (
          <div className="mt-2">
            <ErreurFormulaire message={state.error} />
          </div>
        )}
        {state?.success && (
          <p className="mt-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-800">
            {state.success}
          </p>
        )}
      </div>
      <select
        name="role"
        defaultValue="locateur"
        className="shrink-0 rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
      >
        <option value="locateur">Locateur</option>
        <option value="admin">Administrateur</option>
      </select>
      <button
        type="submit"
        disabled={pending}
        className="btn-brand shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-60"
      >
        {pending ? "..." : "Promouvoir"}
      </button>
    </form>
  );
}
