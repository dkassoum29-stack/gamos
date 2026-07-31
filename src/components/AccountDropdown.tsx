"use client";

import { useRef } from "react";
import Link from "next/link";
import { IconMenu, IconLogOut, IconUser } from "./icons";

export type CouleurLien = "bleu" | "ambre" | "violet";

type Lien = { label: string; href: string; icon: React.ReactNode; couleur: CouleurLien };

type Props = {
  connecte: boolean;
  nom?: string;
  email?: string;
  liens?: Lien[];
  deconnexionAction?: () => void;
};

const STYLES_COULEUR: Record<CouleurLien, string> = {
  bleu: "bg-blue-50 text-[#3B82F6]",
  ambre: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
};

export default function AccountDropdown({
  connecte,
  nom,
  email,
  liens = [],
  deconnexionAction,
}: Props) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const fermer = () => {
    if (detailsRef.current) detailsRef.current.open = false;
  };

  return (
    <details ref={detailsRef} className="group relative">
      <summary className="relative flex cursor-pointer list-none items-center gap-1.5 rounded-full px-2.5 py-1.5 hover:bg-zinc-100 transition-colors [&::-webkit-details-marker]:hidden">
        <IconMenu className="text-zinc-700" />
      </summary>

      <div className="absolute right-0 z-20 mt-2 w-72 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/10">
        {connecte ? (
          <>
            <div className="flex items-center gap-3 bg-gradient-to-br from-blue-50 via-white to-white px-4 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-white shadow-md shadow-blue-500/30">
                <IconUser className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[16px] font-bold text-zinc-900 truncate">{nom}</p>
                {email && <p className="text-xs text-zinc-500 truncate">{email}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-1 p-2">
              {liens.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={fermer}
                  className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[14.5px] font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 active:bg-zinc-100"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${STYLES_COULEUR[l.couleur]}`}
                  >
                    {l.icon}
                  </span>
                  {l.label}
                </Link>
              ))}
            </div>

            {deconnexionAction && (
              <div className="border-t border-zinc-100 p-2">
                <form action={deconnexionAction} onSubmit={fermer}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-[14.5px] font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <IconLogOut className="h-4 w-4" />
                    </span>
                    Déconnexion
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-2.5 p-4">
            <p className="mb-0.5 text-sm font-medium text-zinc-500">
              Connecte-toi pour réserver ou gérer tes annonces.
            </p>
            <Link
              href="/compte/connexion"
              onClick={fermer}
              className="btn-brand rounded-full px-4 py-2.5 text-center text-sm font-semibold transition-all"
            >
              Se connecter
            </Link>
            <Link
              href="/compte/inscription"
              onClick={fermer}
              className="rounded-full border border-zinc-300 px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Créer un compte
            </Link>
          </div>
        )}
      </div>
    </details>
  );
}
