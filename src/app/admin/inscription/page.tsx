import Link from "next/link";
import { prisma } from "@/lib/prisma";
import InscriptionAdminForm from "./InscriptionAdminForm";
import AuthCard from "@/components/AuthCard";

export default async function InscriptionAdminPage() {
  const dejaExistant = await prisma.admin.count();

  return (
    <AuthCard
      title="Créer le compte administrateur"
      subtitle="Cette page ne fonctionne qu'une seule fois, pour créer le tout premier compte admin de Gamos."
    >
      {dejaExistant > 0 ? (
        <p className="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-600">
          Un compte administrateur existe déjà.{" "}
          <Link
            href="/admin/connexion"
            className="font-semibold underline underline-offset-2"
          >
            Se connecter
          </Link>
          .
        </p>
      ) : (
        <InscriptionAdminForm />
      )}
    </AuthCard>
  );
}
