import { requireLocateur } from "@/lib/auth";
import AjouterVoitureForm from "./AjouterVoitureForm";

export default async function NouvelleVoiturePage() {
  await requireLocateur();

  return (
    <div className="max-w-lg mx-auto px-4 py-10 w-full">
      <h1 className="font-display text-2xl font-bold text-zinc-900">Ajouter une voiture</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Elle apparaîtra immédiatement sur la page d&apos;accueil du site.
      </p>
      <div className="mt-6">
        <AjouterVoitureForm />
      </div>
    </div>
  );
}
