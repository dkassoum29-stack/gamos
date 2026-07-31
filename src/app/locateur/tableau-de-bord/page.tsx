import Link from "next/link";
import { requireLocateur } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatFCFA } from "@/lib/format";
import StatTile from "@/components/StatTile";
import BarChart from "@/components/BarChart";
import { IconCar, IconClipboard, IconShieldCheck, IconStar, IconCheck } from "@/components/icons";

const JOURS_HISTORIQUE = 14;

const STATUT_LABELS: Record<string, { label: string; classes: string }> = {
  en_attente: { label: "En attente", classes: "bg-amber-50 text-amber-700" },
  confirmee: { label: "Confirmée", classes: "bg-green-50 text-green-700" },
  refusee: { label: "Refusée", classes: "bg-zinc-100 text-zinc-500" },
};

export default async function TableauDeBordPage() {
  const locateur = await requireLocateur();

  const depuis = new Date();
  depuis.setDate(depuis.getDate() - (JOURS_HISTORIQUE - 1));
  depuis.setHours(0, 0, 0, 0);

  const [nombreVoitures, demandesEnAttente, avisDesVoitures, reservationsRecentes, dernieresReservations] =
    await Promise.all([
      prisma.voiture.count({ where: { locateurId: locateur.id } }),
      prisma.reservation.count({
        where: { statut: "en_attente", voiture: { locateurId: locateur.id } },
      }),
      prisma.avis.findMany({ where: { voiture: { locateurId: locateur.id } } }),
      prisma.reservation.findMany({
        where: { voiture: { locateurId: locateur.id }, createdAt: { gte: depuis } },
        select: { createdAt: true },
      }),
      prisma.reservation.findMany({
        where: { voiture: { locateurId: locateur.id } },
        include: { voiture: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

  const noteMoyenne = avisDesVoitures.length
    ? (avisDesVoitures.reduce((s, a) => s + a.note, 0) / avisDesVoitures.length).toFixed(1)
    : "—";

  const donneesGraphique = Array.from({ length: JOURS_HISTORIQUE }, (_, i) => {
    const jour = new Date(depuis);
    jour.setDate(jour.getDate() + i);
    const cle = jour.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
    const valeur = reservationsRecentes.filter(
      (r) => r.createdAt.toDateString() === jour.toDateString()
    ).length;
    return { label: cle, value: valeur };
  });

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2">
        <h1 className="font-display text-2xl font-bold text-zinc-900">
          Bonjour {locateur.nomAgence}
        </h1>
        {locateur.statutVerification === "verifie" && (
          <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            <IconCheck className="h-3 w-3" />
            Vérifié
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-500">{locateur.ville}</p>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Mes voitures"
          value={nombreVoitures}
          icon={<IconCar />}
          href="/locateur/tableau-de-bord/voitures"
        />
        <StatTile
          label="Réservations en attente"
          value={demandesEnAttente}
          icon={<IconClipboard />}
          href="/locateur/tableau-de-bord/reservations"
        />
        <StatTile label="Note moyenne" value={noteMoyenne} icon={<IconStar />} />
        <StatTile
          label="Vérification"
          value={
            locateur.statutVerification === "verifie"
              ? "OK"
              : locateur.statutVerification === "en_attente"
                ? "En cours"
                : "À faire"
          }
          icon={<IconShieldCheck />}
          href="/locateur/tableau-de-bord/verification"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="font-display font-semibold text-zinc-900 mb-4">
          Réservations reçues — {JOURS_HISTORIQUE} derniers jours
        </h2>
        <BarChart data={donneesGraphique} />
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="font-display font-semibold text-zinc-900 mb-4">
          Demandes récentes
        </h2>
        {dernieresReservations.length === 0 ? (
          <p className="text-sm text-zinc-500">Aucune demande pour l&apos;instant.</p>
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
          href="/locateur/tableau-de-bord/reservations"
          className="mt-3 inline-block text-sm text-zinc-900 underline underline-offset-2"
        >
          Voir toutes les demandes
        </Link>
      </div>
    </div>
  );
}
