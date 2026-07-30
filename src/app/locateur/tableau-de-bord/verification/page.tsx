import Link from "next/link";
import { requireLocateur } from "@/lib/auth";
import VerificationForm from "./VerificationForm";

const STATUTS: Record<string, { label: string; classes: string; texte: string }> = {
  non_soumis: {
    label: "Non soumis",
    classes: "bg-zinc-100 text-zinc-600",
    texte: "Envoie une pièce d'identité ou ta carte grise pour obtenir le badge Vérifié.",
  },
  en_attente: {
    label: "En attente",
    classes: "bg-amber-50 text-amber-700",
    texte: "Ta pièce a bien été reçue, elle est en cours de vérification.",
  },
  verifie: {
    label: "Vérifié ✓",
    classes: "bg-green-50 text-green-700",
    texte: "Ton compte est vérifié. Le badge apparaît sur toutes tes annonces.",
  },
  refuse: {
    label: "Refusé",
    classes: "bg-red-50 text-red-700",
    texte: "Ta pièce a été refusée. Tu peux en envoyer une nouvelle ci-dessous.",
  },
};

export default async function VerificationPage() {
  const locateur = await requireLocateur();
  const statut = STATUTS[locateur.statutVerification] ?? STATUTS.non_soumis;

  return (
    <div className="max-w-lg mx-auto w-full px-4 sm:px-6 py-10">
      <Link
        href="/locateur/tableau-de-bord"
        className="text-sm text-zinc-500 hover:text-zinc-900"
      >
        ← Retour au tableau de bord
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold text-zinc-900">
        Vérification du compte
      </h1>

      <div className="mt-4 flex items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${statut.classes}`}>
          {statut.label}
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-600">{statut.texte}</p>

      {locateur.statutVerification !== "verifie" && (
        <div className="mt-6">
          <VerificationForm />
        </div>
      )}
    </div>
  );
}
