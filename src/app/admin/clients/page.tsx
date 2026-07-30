import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ClientsAdminPage() {
  await requireAdmin();

  const clients = await prisma.client.findMany({
    include: { _count: { select: { reservations: true, avis: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-zinc-900">
        Clients ({clients.length})
      </h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-zinc-500">
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Réservations</th>
              <th className="px-4 py-3 font-medium">Avis</th>
              <th className="px-4 py-3 font-medium">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  Aucun client inscrit pour l&apos;instant.
                </td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr key={c.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-zinc-900">{c.nom}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {c.email}
                    <br />
                    {c.telephone}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{c._count.reservations}</td>
                  <td className="px-4 py-3 text-zinc-600">{c._count.avis}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {c.createdAt.toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
