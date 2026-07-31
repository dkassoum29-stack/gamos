import { redirect } from "next/navigation";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AuthCard from "@/components/AuthCard";
import DevenirLocateurForm from "./DevenirLocateurForm";

export default async function DevenirLocateurPage() {
  const client = await requireClient();

  const dejaLocateur = await prisma.locateur.findUnique({
    where: { clientId: client.id },
  });
  if (dejaLocateur) {
    redirect("/locateur/tableau-de-bord");
  }

  return (
    <AuthCard
      title="Devenir locateur"
      subtitle="Ajoute tes voitures en location sur Gamos. Ton compte reste le même, ces infos apparaissent sur tes annonces."
    >
      <DevenirLocateurForm />
    </AuthCard>
  );
}
