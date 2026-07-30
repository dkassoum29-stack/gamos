import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatFCFA } from "@/lib/format";
import StatTile from "@/components/StatTile";
import BarChart from "@/components/BarChart";
import {
  IconBuilding,
  IconUsers,
  IconCar,
  IconClipboard,
  IconShieldCheck,
} from "@/components/icons";

const JOURS_HISTORIQUE = 14;

export default async function AdminAccueilPage() {
  await requireAdmin();

  const depuis = new Date();
  depuis.setDate(depuis.getDate() - (JOURS_HISTORIQUE - 1));
  depuis.setHours(0, 0, 0, 0);

  const [
    nombreLocateurs,
    nombreClients,
    nombreVoitures,
    verificationsEnAttente,
    reservationsRecentes,
    reservationsParStatut,
    dernieresReservations,
  ] = await Promise.all([
    prisma.locateur.count(),
    prisma.client.count(),
    prisma.voiture.count(),
    prisma.locateur.count({ where: { statutVerification: "en_attente" } }),
    prisma.reservation.findMany({
      where: { createdAt: { gte: depuis } },
      select: { createdAt: true },
    }),
    Promise.all(
      ["en_attente", "confirmee", "refusee"].map((statut) =>
        prisma.reservation.count({ where: { statut } })
      )
    ),
    prisma.reservation.findMany({
      include: { voiture: true, client: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const [enAttente, confirmees, refusees] = reservationsParStatut;

  const donneesGraphique = Array.from({ length: JOURS_HISTORIQUE }, (_, i) => {
    const jour = new Date(depuis);
    jour.setDate(jour.getDate() + i);
    const cle = jour.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
    const valeur = reservationsRecentes.filter(
      (r) => r.createdAt.toDateString() === jour.toDateString()
    ).length;
    return { label: cle, value: valeur };
  });

  const STATUT_LABELS: Record<string, { label: string; classes: string }> = {
    en_attente: { label: "En attente", classes: "bg-amber-50 text-amber-700" },
    confirmee: { label: "Confirmée", classes: "bg-green-50 text-green-700" },
    refusee: { label: "Refusée", classes: "bg-zinc-100 text-zinc-500" },
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-zinc-900">
        Vue d&apos;ensemble
      </h1>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Locateurs" value={nombreLocateurs} icon={<IconBuilding />} href="/admin/locateurs" />
        <StatTile label="Clients" value={nombreClients} icon={<IconUsers />} href="/admin/clients" />
        <StatTile label="Voitures" value={nombreVoitures} icon={<IconCar />} href="/" />
        <StatTile
          label="Vérifications en attente"
          value={verificationsEnAttente}
          icon={<IconShieldCheck />}
          href="/admin/verifications"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="font-display font-semibold text-zinc-900 mb-4">
            Réservations — {JOURS_HISTORIQUE} derniers jours
          </h2>
          <BarChart data={donneesGraphique} />
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="font-display font-semibold text-zinc-900 mb-4">
            Réservations par statut
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-zinc-600">
                <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                Confirmées
              </span>
              <span className="font-display font-semibold text-zinc-900">{confirmees}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-zinc-600">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                En attente
              </span>
              <span className="font-display font-semibold text-zinc-900">{enAttente}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-zinc-600">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
                Refusées
              </span>
              <span className="font-display font-semibold text-zinc-900">{refusees}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-zinc-900 flex items-center gap-2">
            <IconClipboard className="text-zinc-400" />
            Activité récente
          </h2>
        </div>
        {dernieresReservations.length === 0 ? (
          <p className="text-sm text-zinc-500">Aucune réservation pour l&apos;instant.</p>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-100">
            {dernieresReservations.map((r) => {
              const statut = STATUT_LABELS[r.statut] ?? STATUT_LABELS.en_attente;
              return (
                <div key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {r.nomClient} → {r.voiture.marque} {r.voiture.modele}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {formatFCFA(r.voiture.prixParJour)}/jour · {r.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statut.classes}`}>
                    {statut.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        <Link
          href="/admin/locateurs"
          className="mt-3 inline-block text-sm text-zinc-900 underline underline-offset-2"
        >
          Voir tous les locateurs
        </Link>
      </div>
    </div>
  );
}
