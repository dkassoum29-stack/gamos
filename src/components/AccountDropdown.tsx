"use client";

import { useRef } from "react";
import Link from "next/link";
import { IconMenu, IconLogOut } from "./icons";

type Section = {
  titre: string;
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

  if (!s.connecte) {
    return (
      <div className="flex flex-wrap gap-x-3 px-3 pb-2">
        {s.liensConnexion?.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            className="text-xs text-zinc-700 underline underline-offset-2 hover:text-zinc-900"
          >
            {l.label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2 px-3 pb-1">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900 truncate">{s.nom}</p>
          {s.sousTitre && <p className="text-xs text-zinc-500 truncate">{s.sousTitre}</p>}
        </div>
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
      {s.dashboardHref && (
        <Link
          href={s.dashboardHref}
          onClick={onNavigate}
          className="block px-3 pb-2 text-xs font-medium text-[#3B82F6] hover:underline underline-offset-2"
        >
          {s.dashboardLabel}
        </Link>
      )}
    </>
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

      <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg shadow-zinc-900/5">
        {sections.map((s, i) => (
          <div key={s.titre} className={i > 0 ? "border-t border-zinc-100" : ""}>
            <p className="px-3 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
              {s.titre}
            </p>
            <SectionCompte section={s} onNavigate={fermer} />
          </div>
        ))}
      </div>
    </details>
  );
}
