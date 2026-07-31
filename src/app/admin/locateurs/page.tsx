import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUT_LABELS: Record<string, { label: string; classes: string }> = {
  non_soumis: { label: "Non soumis", classes: "bg-zinc-100 text-zinc-500" },
  en_attente: { label: "En attente", classes: "bg-amber-50 text-amber-700" },
  verifie: { label: "Vérifié", classes: "bg-green-50 text-green-700" },
  refuse: { label: "Refusé", classes: "bg-red-50 text-red-700" },
};

export default async function LocateursAdminPage() {
  await requireAdmin();

  const locateurs = await prisma.locateur.findMany({
    include: { _count: { select: { voitures: true } }, client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-zinc-900">
        Locateurs ({locateurs.length})
      </h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-zinc-500">
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Ville</th>
              <th className="px-4 py-3 font-medium">Voitures</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {locateurs.map((l) => {
              const statut = STATUT_LABELS[l.statutVerification] ?? STATUT_LABELS.non_soumis;
              return (
                <tr key={l.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-zinc-900">{l.nomAgence}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {l.client.email}
                    <br />
                    {l.telephone}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{l.ville}</td>
                  <td className="px-4 py-3 text-zinc-600">{l._count.voitures}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statut.classes}`}>
                      {statut.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {l.createdAt.toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
