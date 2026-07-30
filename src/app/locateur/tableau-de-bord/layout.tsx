import Link from "next/link";
import { requireLocateur } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/locateur/actions";
import { IconHome, IconCar, IconClipboard, IconShieldCheck } from "@/components/icons";

export default async function TableauDeBordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locateur = await requireLocateur();

  const demandesEnAttente = await prisma.reservation.count({
    where: { statut: "en_attente", voiture: { locateurId: locateur.id } },
  });

  const liens = [
    { href: "/locateur/tableau-de-bord", label: "Vue d'ensemble", icon: IconHome },
    { href: "/locateur/tableau-de-bord/voitures", label: "Mes voitures", icon: IconCar },
    {
      href: "/locateur/tableau-de-bord/reservations",
      label: "Réservations",
      icon: IconClipboard,
      badge: demandesEnAttente,
    },
    {
      href: "/locateur/tableau-de-bord/verification",
      label: "Vérification",
      icon: IconShieldCheck,
    },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#f9f9f7]">
      <aside className="hidden md:flex md:w-56 shrink-0 border-r border-zinc-200 bg-white flex-col">
        <div className="h-16 flex items-center px-5 border-b border-zinc-200">
          <span className="font-display font-bold text-zinc-900 truncate">
            {locateur.nomAgence}
          </span>
        </div>
        <nav className="flex-1 flex flex-col gap-1 p-3">
          {liens.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            >
              <l.icon className="shrink-0" />
              <span className="flex-1">{l.label}</span>
              {!!l.badge && (
                <span className="rounded-full bg-[#3B82F6] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {l.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="border-t border-zinc-200 p-3">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <nav className="md:hidden flex items-center gap-1.5 overflow-x-auto border-b border-zinc-200 bg-white px-3 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {liens.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <l.icon className="h-4 w-4 shrink-0" />
            {l.label}
            {!!l.badge && (
              <span className="rounded-full bg-[#3B82F6] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {l.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
