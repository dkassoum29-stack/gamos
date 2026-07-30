import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validerLocateurAction } from "../actions";

const STATUT_LABELS: Record<string, { label: string; classes: string }> = {
  non_soumis: { label: "Non soumis", classes: "bg-zinc-100 text-zinc-500" },
  en_attente: { label: "En attente", classes: "bg-amber-50 text-amber-700" },
  verifie: { label: "Vérifié", classes: "bg-green-50 text-green-700" },
  refuse: { label: "Refusé", classes: "bg-red-50 text-red-700" },
};

export default async function VerificationsAdminPage() {
  await requireAdmin();

  const locateurs = await prisma.locateur.findMany({
    where: { pieceIdentiteChemin: { not: null } },
    orderBy: { pieceIdentiteEnvoyeeLe: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-zinc-900">
        Vérification des locateurs
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        {locateurs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-zinc-500">
            Aucune pièce reçue pour l&apos;instant.
          </div>
        ) : (
          locateurs.map((l) => {
            const statut = STATUT_LABELS[l.statutVerification] ?? STATUT_LABELS.non_soumis;
            return (
              <div key={l.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-zinc-900">{l.nomAgence}</p>
                    <p className="text-sm text-zinc-500">
                      {l.email} · {l.telephone} · {l.ville}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Envoyée le{" "}
                      {l.pieceIdentiteEnvoyeeLe?.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statut.classes}`}>
                    {statut.label}
                  </span>
                </div>

                <a
                  href={`/api/admin/pieces/${l.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-zinc-900 underline underline-offset-2"
                >
                  Voir la pièce jointe
                </a>

                {l.statutVerification !== "verifie" && l.statutVerification !== "refuse" && (
                  <div className="mt-3 flex gap-2">
                    <form action={validerLocateurAction.bind(null, l.id, "verifie")}>
                      <button
                        type="submit"
                        className="rounded-full bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                      >
                        Valider
                      </button>
                    </form>
                    <form action={validerLocateurAction.bind(null, l.id, "refuse")}>
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
