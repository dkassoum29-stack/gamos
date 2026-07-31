import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { retirerAdminAction } from "../actions";
import PromouvoirAdminForm from "./PromouvoirAdminForm";

export default async function ParametresAdminPage() {
  const admin = await requireAdmin();
  const admins = await prisma.client.findMany({
    where: { estAdmin: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-zinc-900">Paramètres</h1>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="font-display font-semibold text-zinc-900 mb-1">
          Attribuer un rôle
        </h2>
        <p className="text-sm text-zinc-500 mb-4">
          Donne les droits de locateur ou d&apos;administration à n&apos;importe
          quel email déjà inscrit, ou nouveau. Tout le monde peut déjà réserver
          des voitures dès son inscription.
        </p>
        <PromouvoirAdminForm />
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="font-display font-semibold text-zinc-900 mb-4">
          Administrateurs ({admins.length})
        </h2>
        <div className="flex flex-col divide-y divide-zinc-100">
          {admins.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-900 truncate">
                  {a.nom} {a.id === admin.id && <span className="text-zinc-400">(toi)</span>}
                </p>
                <p className="text-xs text-zinc-500 truncate">{a.email}</p>
              </div>
              {a.id !== admin.id && (
                <form action={retirerAdminAction.bind(null, a.id)}>
                  <button
                    type="submit"
                    className="shrink-0 rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Retirer
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
