type Plage = { debut: Date; fin: Date };

const JOURS = ["L", "M", "M", "J", "V", "S", "D"];
const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function estDansUnePlage(jour: Date, plages: Plage[]): boolean {
  return plages.some((p) => jour >= p.debut && jour <= p.fin);
}

function construireMois(annee: number, mois: number, plages: Plage[]) {
  const premierJour = new Date(annee, mois, 1);
  const nombreJours = new Date(annee, mois + 1, 0).getDate();
  const decalage = (premierJour.getDay() + 6) % 7; // lundi = 0

  const cases: { jour: number; bloque: boolean }[] = [];
  for (let i = 0; i < decalage; i++) {
    cases.push({ jour: 0, bloque: false });
  }
  for (let j = 1; j <= nombreJours; j++) {
    const date = new Date(annee, mois, j);
    cases.push({ jour: j, bloque: estDansUnePlage(date, plages) });
  }
  return cases;
}

export default function Calendrier({ plages }: { plages: { debut: string; fin: string }[] }) {
  const plagesDate: Plage[] = plages.map((p) => ({
    debut: new Date(p.debut),
    fin: new Date(p.fin),
  }));

  const maintenant = new Date();
  const mois = [0, 1].map((decalage) => {
    const date = new Date(maintenant.getFullYear(), maintenant.getMonth() + decalage, 1);
    return {
      label: `${MOIS[date.getMonth()]} ${date.getFullYear()}`,
      cases: construireMois(date.getFullYear(), date.getMonth(), plagesDate),
    };
  });

  return (
    <div className="rounded-2xl border border-zinc-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-zinc-900">Disponibilités</h2>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-zinc-100 border border-zinc-300" /> libre
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-zinc-800" /> pris
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mois.map((m) => (
          <div key={m.label}>
            <p className="text-sm font-medium text-zinc-700 mb-2 capitalize">{m.label}</p>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-zinc-400 mb-1">
              {JOURS.map((j, i) => (
                <span key={i}>{j}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {m.cases.map((c, i) =>
                c.jour === 0 ? (
                  <span key={i} />
                ) : (
                  <span
                    key={i}
                    className={`aspect-square flex items-center justify-center rounded text-[11px] ${
                      c.bloque
                        ? "bg-zinc-800 text-white"
                        : "bg-zinc-50 text-zinc-600"
                    }`}
                  >
                    {c.jour}
                  </span>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
