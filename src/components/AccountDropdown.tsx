"use client";

import { useRef } from "react";
import Link from "next/link";
import { IconMenu, IconLogOut } from "./icons";

type Section = {
  titre: string;
  icon: React.ReactNode;
  connecte: boolean;
  nom?: string;
  sousTitre?: string;
  dashboardHref?: string;
  dashboardLabel?: string;
  deconnexionAction?: () => void;
  liensConnexion?: { label: string; href: string }[];
};

function SectionCompte({ section, onNavigate }: { section: Section; onNavigate: () => void }) {
  const s = section;

  return (
    <div className="flex gap-2.5 px-3 py-2.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
        {s.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
          {s.titre}
        </p>

        {s.connecte ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-900 truncate">{s.nom}</p>
              {s.deconnexionAction && (
                <form action={s.deconnexionAction} onSubmit={onNavigate}>
                  <button
                    type="submit"
                    aria-label="Déconnexion"
                    title="Déconnexion"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
                  >
                    <IconLogOut className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>
            {s.sousTitre && <p className="text-xs text-zinc-500 truncate">{s.sousTitre}</p>}
            {s.dashboardHref && (
              <Link
                href={s.dashboardHref}
                onClick={onNavigate}
                className="mt-1 inline-block text-xs font-medium text-[#3B82F6] hover:underline underline-offset-2"
              >
                {s.dashboardLabel}
              </Link>
            )}
          </>
        ) : (
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {s.liensConnexion?.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={onNavigate}
                className={
                  i === 0
                    ? "rounded-full border border-zinc-300 px-2.5 py-1 text-xs font-semibold text-zinc-900 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors"
                    : "text-xs text-zinc-500 hover:text-zinc-900 hover:underline underline-offset-2"
                }
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountDropdown({ sections }: { sections: Section[] }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const fermer = () => {
    if (detailsRef.current) detailsRef.current.open = false;
  };

  return (
    <details ref={detailsRef} className="group relative">
      <summary className="relative flex cursor-pointer list-none items-center gap-1.5 rounded-full px-2.5 py-1.5 hover:bg-zinc-100 transition-colors [&::-webkit-details-marker]:hidden">
        <IconMenu className="text-zinc-700" />
      </summary>

      <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg shadow-zinc-900/5">
        {sections.map((s, i) => (
          <div key={s.titre} className={i > 0 ? "border-t border-zinc-100" : ""}>
            <SectionCompte section={s} onNavigate={fermer} />
          </div>
        ))}
      </div>
    </details>
  );
}
