import Link from "next/link";
import { notFound } from "next/navigation";
import { requireLocateur } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supprimerIndisponibiliteAction } from "../../../actions";
import IndisponibiliteForm from "./IndisponibiliteForm";

export default async function CalendrierVoiturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const locateur = await requireLocateur();
  const { id } = await params;

  const voiture = await prisma.voiture.findFirst({
    where: { id, locateurId: locateur.id },
    include: {
      reservations: { where: { statut: "confirmee" }, orderBy: { dateDebut: "asc" } },
      indisponibilites: { orderBy: { dateDebut: "asc" } },
    },
  });

  if (!voiture) notFound();

  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-10">
      <Link
        href="/locateur/tableau-de-bord"
        className="text-sm text-zinc-500 hover:text-zinc-900"
      >
        ← Retour au tableau de bord
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold text-zinc-900">
        Calendrier — {voiture.marque} {voiture.modele}
      </h1>
      <p className="text-sm text-zinc-500 mt-1">
        Bloque des dates quand la voiture n&apos;est pas disponible (entretien,
        location hors du site...). Les réservations confirmées bloquent déjà
        automatiquement les dates.
      </p>

      <div className="mt-6 rounded-2xl border border-zinc-200 p-4">
        <h2 className="font-display font-semibold text-zinc-900 mb-3">
          Réservations confirmées
        </h2>
        {voiture.reservations.length === 0 ? (
          <p className="text-sm text-zinc-500">Aucune réservation confirmée pour l&apos;instant.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {voiture.reservations.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm"
              >
                <span className="text-zinc-700">{r.nomClient}</span>
                <span className="text-zinc-500">
                  {r.dateDebut.toLocaleDateString("fr-FR")} → {r.dateFin.toLocaleDateString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200 p-4">
        <h2 className="font-display font-semibold text-zinc-900 mb-3">
          Dates bloquées manuellement
        </h2>
        {voiture.indisponibilites.length > 0 && (
          <ul className="flex flex-col gap-2 mb-4">
            {voiture.indisponibilites.map((i) => (
              <li
                key={i.id}
                className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm"
              >
                <span className="text-zinc-700">
                  {i.dateDebut.toLocaleDateString("fr-FR")} → {i.dateFin.toLocaleDateString("fr-FR")}
                  {i.note && <span className="text-zinc-500"> — {i.note}</span>}
                </span>
                <form action={supprimerIndisponibiliteAction.bind(null, i.id)}>
                  <button
                    type="submit"
                    className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Retirer
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <IndisponibiliteForm voitureId={voiture.id} />
      </div>
    </div>
  );
}
