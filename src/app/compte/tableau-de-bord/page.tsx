import Link from "next/link";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatFCFA } from "@/lib/format";
import StarRating from "@/components/StarRating";

const STATUT_LABELS: Record<string, { label: string; classes: string }> = {
  en_attente: { label: "En attente", classes: "bg-amber-50 text-amber-700" },
  confirmee: { label: "Confirmée", classes: "bg-green-50 text-green-700" },
  refusee: { label: "Refusée", classes: "bg-zinc-100 text-zinc-500" },
};

export default async function TableauDeBordClientPage() {
  const client = await requireClient();

  const reservations = await prisma.reservation.findMany({
    where: { clientId: client.id },
    include: { voiture: { include: { locateur: true } } },
    orderBy: { createdAt: "desc" },
  });

  const avis = await prisma.avis.findMany({
    where: { clientId: client.id },
    include: { voiture: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-zinc-900">
        Bonjour {client.nom}
      </h1>
      <p className="text-sm text-zinc-500">{client.email}</p>

      <div className="mt-8">
        <h2 className="font-display font-semibold text-zinc-900 mb-3">
          Mes réservations
        </h2>
        {reservations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 py-10 text-center text-zinc-500">
            Aucune demande de réservation pour l&apos;instant.{" "}
            <Link href="/" className="text-zinc-900 font-semibold underline underline-offset-2">
              Parcourir les voitures
            </Link>
            .
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reservations.map((r) => {
              const statut = STATUT_LABELS[r.statut] ?? STATUT_LABELS.en_attente;
              return (
                <div key={r.id} className="rounded-2xl border border-zinc-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/voitures/${r.voiture.id}`}
                        className="font-semibold text-zinc-900 hover:underline"
                      >
                        {r.voiture.marque} {r.voiture.modele}
                      </Link>
                      <p className="text-sm text-zinc-500">
                        {r.dateDebut.toLocaleDateString("fr-FR")} → {r.dateFin.toLocaleDateString("fr-FR")}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {r.voiture.locateur.nomAgence} · {r.voiture.locateur.telephone}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statut.classes}`}>
                      {statut.label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-zinc-900">
                    {formatFCFA(r.voiture.prixParJour)} / jour
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-display font-semibold text-zinc-900 mb-3">
          Mes avis
        </h2>
        {avis.length === 0 ? (
          <p className="text-sm text-zinc-500">Tu n&apos;as pas encore laissé d&apos;avis.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {avis.map((a) => (
              <div key={a.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/voitures/${a.voiture.id}`}
                    className="font-semibold text-zinc-900 hover:underline"
                  >
                    {a.voiture.marque} {a.voiture.modele}
                  </Link>
                  <StarRating note={a.note} className="h-3.5 w-3.5" />
                </div>
                {a.commentaire && (
                  <p className="mt-1 text-sm text-zinc-600">{a.commentaire}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
