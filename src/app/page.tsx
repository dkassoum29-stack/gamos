import { prisma } from "@/lib/prisma";
import CarCard from "@/components/CarCard";
import { VILLES, TYPES_VOITURE } from "@/lib/format";

type SearchParams = {
  ville?: string;
  type?: string;
  prixMax?: string;
  tri?: string;
  q?: string;
};

const ORDRES: Record<string, { createdAt?: "desc"; prixParJour?: "asc" | "desc" }> = {
  recent: { createdAt: "desc" },
  prix_asc: { prixParJour: "asc" },
  prix_desc: { prixParJour: "desc" },
};

const SEPT_JOURS_MS = 7 * 24 * 60 * 60 * 1000;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { ville, type, prixMax, tri, q } = await searchParams;
  const triActif = tri && ORDRES[tri] ? tri : "recent";

  const voitures = await prisma.voiture.findMany({
    where: {
      disponible: true,
      ...(ville ? { ville } : {}),
      ...(type ? { type } : {}),
      ...(prixMax ? { prixParJour: { lte: Number(prixMax) } } : {}),
      ...(q
        ? {
            OR: [
              { marque: { contains: q } },
              { modele: { contains: q } },
              { ville: { contains: q } },
            ],
          }
        : {}),
    },
    include: { locateur: true, avis: true },
    orderBy: ORDRES[triActif],
  });

  const maintenant = Date.now();

  return (
    <div className="flex flex-col flex-1">
      <section className="relative overflow-hidden bg-white text-zinc-900">
        <div className="glow absolute inset-0" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
            Déjà des dizaines de locateurs partout au pays
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight max-w-2xl">
            Trouve ta voiture, où que tu sois au Burkina.
          </h1>
          <p className="text-zinc-600 max-w-xl text-lg">
            Compare les voitures de plusieurs agences et particuliers
            inscrits sur Gamos, et envoie ta demande de réservation en
            quelques clics.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 -mt-14 relative z-10">
        <form className="bg-white rounded-2xl border border-zinc-200 shadow-xl shadow-zinc-900/10 p-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
          <select
            name="ville"
            defaultValue={ville ?? ""}
            className="rounded-xl border border-zinc-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="">Toutes les villes</option>
            {VILLES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <select
            name="type"
            defaultValue={type ?? ""}
            className="rounded-xl border border-zinc-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="">Tous les types</option>
            {TYPES_VOITURE.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="prixMax"
            defaultValue={prixMax ?? ""}
            placeholder="Prix max / jour (FCFA)"
            className="rounded-xl border border-zinc-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
          <select
            name="tri"
            defaultValue={triActif}
            className="rounded-xl border border-zinc-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="recent">Plus récentes</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
          </select>
          <button
            type="submit"
            className="btn-brand rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all"
          >
            Rechercher
          </button>
        </form>
      </section>

      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 flex-1">
        <p className="text-sm text-zinc-500 mb-4">
          {voitures.length} voiture{voitures.length > 1 ? "s" : ""}{" "}
          disponible{voitures.length > 1 ? "s" : ""}
        </p>
        {voitures.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-zinc-500">
            Aucune voiture ne correspond à ta recherche pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {voitures.map((v) => {
              const nombreAvis = v.avis.length;
              const noteMoyenne = nombreAvis
                ? v.avis.reduce((s, a) => s + a.note, 0) / nombreAvis
                : null;
              const estNouvelle =
                maintenant - v.createdAt.getTime() < SEPT_JOURS_MS;

              return (
                <CarCard
                  key={v.id}
                  id={v.id}
                  marque={v.marque}
                  modele={v.modele}
                  annee={v.annee}
                  ville={v.ville}
                  type={v.type}
                  transmission={v.transmission}
                  places={v.places}
                  prixParJour={v.prixParJour}
                  photoUrl={v.photoUrl}
                  nomAgence={v.locateur.nomAgence}
                  locateurVerifie={v.locateur.statutVerification === "verifie"}
                  noteMoyenne={noteMoyenne}
                  nombreAvis={nombreAvis}
                  estNouvelle={estNouvelle}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
