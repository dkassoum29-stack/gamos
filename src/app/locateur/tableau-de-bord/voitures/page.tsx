import Link from "next/link";
import { requireLocateur } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatFCFA } from "@/lib/format";
import { toggleDisponibiliteAction, supprimerVoitureAction } from "../actions";

export default async function MesVoituresPage() {
  const locateur = await requireLocateur();

  const voitures = await prisma.voiture.findMany({
    where: { locateurId: locateur.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-zinc-900">
          Mes voitures ({voitures.length})
        </h1>
        <Link
          href="/locateur/tableau-de-bord/voitures/nouvelle"
          className="btn-brand rounded-full px-4 py-2 text-sm font-medium transition-all"
        >
          + Ajouter une voiture
        </Link>
      </div>

      <div className="mt-6">
        {voitures.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-zinc-500">
            Tu n&apos;as pas encore ajouté de voiture.{" "}
            <Link
              href="/locateur/tableau-de-bord/voitures/nouvelle"
              className="text-zinc-900 font-semibold underline underline-offset-2"
            >
              Ajoute ta première voiture
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {voitures.map((v) => (
              <div
                key={v.id}
                className="rounded-2xl border border-zinc-200 bg-white p-4 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/voitures/${v.id}`}
                      className="font-semibold text-zinc-900 hover:underline"
                    >
                      {v.marque} {v.modele}
                    </Link>
                    <p className="text-sm text-zinc-500">
                      {v.ville} · {formatFCFA(v.prixParJour)}/jour
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      v.disponible
                        ? "bg-green-50 text-green-700"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {v.disponible ? "Disponible" : "Masquée"}
                  </span>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Link
                    href={`/locateur/tableau-de-bord/voitures/${v.id}/calendrier`}
                    className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Calendrier
                  </Link>
                  <form action={toggleDisponibiliteAction.bind(null, v.id)}>
                    <button
                      type="submit"
                      className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      {v.disponible ? "Masquer" : "Rendre disponible"}
                    </button>
                  </form>
                  <form action={supprimerVoitureAction.bind(null, v.id)}>
                    <button
                      type="submit"
                      className="rounded-full border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Supprimer
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
