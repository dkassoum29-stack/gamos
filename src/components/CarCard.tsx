import Link from "next/link";
import { formatFCFA, typeStyle } from "@/lib/format";
import FavoriButton from "./FavoriButton";

type CarCardProps = {
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
  locateurVerifie?: boolean;
  noteMoyenne?: number | null;
  nombreAvis?: number;
  estNouvelle?: boolean;
};

export default function CarCard(car: CarCardProps) {
  return (
    <Link
      href={`/voitures/${car.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white hover:shadow-xl hover:shadow-zinc-200/60 hover:-translate-y-1 transition-all duration-200"
    >
      <div className="relative aspect-[4/3] w-full bg-zinc-100 flex items-center justify-center overflow-hidden">
        {car.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={car.photoUrl}
            alt={`${car.marque} ${car.modele}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-5xl" aria-hidden>
            🚗
          </span>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${typeStyle(car.type)}`}
          >
            {car.type}
          </span>
          {car.estNouvelle && (
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-zinc-900">
              Nouveau
            </span>
          )}
        </div>
        <FavoriButton voitureId={car.id} />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-zinc-900">
            {car.marque} {car.modele}
          </h3>
          {car.noteMoyenne != null && car.nombreAvis ? (
            <span className="shrink-0 flex items-center gap-1 text-sm text-amber-600 font-medium">
              ★ {car.noteMoyenne.toFixed(1)}
              <span className="text-zinc-400 font-normal">
                ({car.nombreAvis})
              </span>
            </span>
          ) : null}
        </div>
        <p className="text-sm text-zinc-500">
          {car.annee} · {car.transmission} · {car.places} places
        </p>
        <p className="text-sm text-zinc-500 flex items-center gap-1">
          📍 {car.ville} · {car.nomAgence}
          {car.locateurVerifie && (
            <span className="text-[#3B82F6]" title="Locateur vérifié">✓</span>
          )}
        </p>
        <p className="mt-2 font-display font-bold text-lg text-zinc-950">
          {formatFCFA(car.prixParJour)}{" "}
          <span className="text-sm font-sans font-normal text-zinc-500">
            / jour
          </span>
        </p>
      </div>
    </Link>
  );
}
