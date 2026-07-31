"use client";

import { useEffect, useState } from "react";
import { IconHeart } from "./icons";

const CLE_STOCKAGE = "gamos_favoris";

function lireFavoris(): string[] {
  try {
    return JSON.parse(localStorage.getItem(CLE_STOCKAGE) ?? "[]");
  } catch {
    return [];
  }
}

export function ecrireFavoris(favoris: string[]) {
  localStorage.setItem(CLE_STOCKAGE, JSON.stringify(favoris));
  window.dispatchEvent(new Event("favoris-changed"));
}

export { lireFavoris };

export default function FavoriButton({ voitureId }: { voitureId: string }) {
  const [actif, setActif] = useState(false);

  useEffect(() => {
    setActif(lireFavoris().includes(voitureId));
  }, [voitureId]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const favoris = lireFavoris();
    const next = favoris.includes(voitureId)
      ? favoris.filter((id) => id !== voitureId)
      : [...favoris, voitureId];
    ecrireFavoris(next);
    setActif(!actif);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={actif ? "Retirer des favoris" : "Ajouter aux favoris"}
      className="absolute top-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm hover:scale-110 transition-transform"
    >
      <IconHeart
        filled={actif}
        className={actif ? "text-rose-500" : "text-zinc-400"}
      />
    </button>
  );
}
