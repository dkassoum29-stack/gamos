"use client";

import { useRef } from "react";
import Link from "next/link";
import { IconMenu, IconLogOut, IconUser } from "./icons";

type Lien = { label: string; href: string; icon: React.ReactNode };

type Props = {
  connecte: boolean;
  nom?: string;
  email?: string;
  liens?: Lien[];
  deconnexionAction?: () => void;
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

      <div className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg shadow-zinc-900/5">
        {connecte ? (
          <>
            <div className="flex items-center gap-2.5 px-3 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                <IconUser className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900 truncate">{nom}</p>
                {email && <p className="text-xs text-zinc-500 truncate">{email}</p>}
              </div>
            </div>
            <div className="border-t border-zinc-100 py-1">
              {liens.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={fermer}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  {l.icon}
                  {l.label}
                </Link>
              ))}
            </div>
            {deconnexionAction && (
              <div className="border-t border-zinc-100 py-1">
                <form action={deconnexionAction} onSubmit={fermer}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
                  >
                    <IconLogOut className="h-4 w-4 text-zinc-400" />
                    Déconnexion
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-2 p-3">
            <Link
              href="/compte/connexion"
              onClick={fermer}
              className="rounded-full bg-zinc-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/compte/inscription"
              onClick={fermer}
              className="rounded-full border border-zinc-300 px-3 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Créer un compte
            </Link>
          </div>
        )}
      </div>
    </details>
  );
}
