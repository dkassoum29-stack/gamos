"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CarCard from "@/components/CarCard";
import { lireFavoris } from "@/components/FavoriButton";

type VoitureFavori = {
  id: string;
  marque: string;
  modele: string;
  annee: number;
  ville: string;
  type: string;
  transmission: string;
  places: number;
  prixParJour: number;
  photoUrl: string | null;
  nomAgence: string;
  locateurVerifie: boolean;
  noteMoyenne: number | null;
  nombreAvis: number;
};

export default function FavorisPage() {
  const [voitures, setVoitures] = useState<VoitureFavori[] | null>(null);

  useEffect(() => {
    async function charger() {
      const ids = lireFavoris();
      if (ids.length === 0) {
        setVoitures([]);
        return;
      }
      const res = await fetch(`/api/voitures?ids=${ids.join(",")}`);
      const data = await res.json();
      setVoitures(data.voitures);
    }
    charger();
    window.addEventListener("favoris-changed", charger);
    return () => window.removeEventListener("favoris-changed", charger);
  }, []);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
      <h1 className="font-display text-2xl font-bold text-zinc-900">
        Mes favoris
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Les voitures que tu as mises de côté, enregistrées sur cet appareil.
      </p>

      <div className="mt-8">
        {voitures === null ? (
          <p className="text-zinc-500">Chargement...</p>
        ) : voitures.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-zinc-500">
            Aucun favori pour l&apos;instant.{" "}
            <Link href="/" className="text-zinc-900 font-semibold underline underline-offset-2">
              Parcourir les voitures
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {voitures.map((v) => (
              <CarCard key={v.id} {...v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
