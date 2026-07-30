import Link from "next/link";
import { requireLocateur } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lienWhatsApp } from "@/lib/format";
import { repondreReservationAction } from "../actions";

const STATUT_LABELS: Record<string, { label: string; classes: string }> = {
  en_attente: { label: "En attente", classes: "bg-amber-50 text-amber-700" },
  confirmee: { label: "Confirmée", classes: "bg-green-50 text-green-700" },
  refusee: { label: "Refusée", classes: "bg-zinc-100 text-zinc-500" },
};

export default async function ReservationsPage() {
  const locateur = await requireLocateur();

  const reservations = await prisma.reservation.findMany({
    where: { voiture: { locateurId: locateur.id } },
    include: { voiture: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
      <Link
        href="/locateur/tableau-de-bord"
        className="text-sm text-zinc-500 hover:text-zinc-900"
      >
        ← Retour au tableau de bord
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold text-zinc-900">
        Demandes de réservation
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        {reservations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-zinc-500">
            Aucune demande de réservation pour le moment.
          </div>
        ) : (
          reservations.map((r) => {
            const statut = STATUT_LABELS[r.statut] ?? STATUT_LABELS.en_attente;
            return (
              <div
                key={r.id}
                className="rounded-2xl border border-zinc-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-zinc-900">
                      {r.voiture.marque} {r.voiture.modele}
                    </p>
                    <p className="text-sm text-zinc-500">
                      Du{" "}
                      {r.dateDebut.toLocaleDateString("fr-FR")} au{" "}
                      {r.dateFin.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statut.classes}`}
                  >
                    {statut.label}
                  </span>
                </div>

                <div className="mt-3 text-sm text-zinc-600">
                  <p>
                    <span className="text-zinc-500">Client : </span>
                    {r.nomClient} — {r.telephoneClient}
                  </p>
                  {r.message && (
                    <p className="mt-1 text-zinc-500 italic">
                      &laquo; {r.message} &raquo;
                    </p>
                  )}
                  <a
                    href={lienWhatsApp(
                      r.telephoneClient,
                      `Bonjour ${r.nomClient}, je vous contacte au sujet de votre demande de réservation pour la ${r.voiture.marque} ${r.voiture.modele}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1 text-xs font-semibold text-white hover:bg-[#1ebe57] transition-colors"
                  >
                    Contacter sur WhatsApp
                  </a>
                </div>

                {r.statut === "en_attente" && (
                  <div className="mt-3 flex gap-2">
                    <form
                      action={repondreReservationAction.bind(
                        null,
                        r.id,
                        "confirmee"
                      )}
                    >
                      <button
                        type="submit"
                        className="rounded-full bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                      >
                        Confirmer
                      </button>
                    </form>
                    <form
                      action={repondreReservationAction.bind(
                        null,
                        r.id,
                        "refusee"
                      )}
                    >
                      <button
                        type="submit"
                        className="rounded-full border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Refuser
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
