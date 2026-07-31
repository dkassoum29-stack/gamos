"use client";

import { useActionState } from "react";
import { promouvoirAdminAction } from "../actions";
import { ChampAvecIcone, ErreurFormulaire } from "@/components/AuthCard";
import { IconMail } from "@/components/icons";

export default function PromouvoirAdminForm() {
  const [state, formAction, pending] = useActionState(
    promouvoirAdminAction,
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
      <button
        type="submit"
        disabled={pending}
        className="btn-brand shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-60"
      >
        {pending ? "..." : "Promouvoir en admin"}
      </button>
    </form>
  );
}
