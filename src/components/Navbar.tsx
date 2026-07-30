import Link from "next/link";
import { getSession, getClient, getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/locateur/actions";
import { deconnexionClientAction } from "@/app/compte/actions";
import { deconnexionAdminAction } from "@/app/admin/actions";
import AccountDropdown from "./AccountDropdown";
import { IconHeart, IconCar, IconSearch, IconKey, IconHome } from "./icons";

export default async function Navbar() {
  const session = await getSession();
  const [locateur, client, admin] = await Promise.all([
    session
      ? prisma.locateur.findUnique({ where: { id: session.locateurId } })
      : null,
    getClient(),
    getAdmin(),
  ]);

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B82F6] text-white">
            <IconCar className="h-4.5 w-4.5" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-zinc-950">
            Gamos
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
          >
            Voitures
          </Link>
          <Link
            href="/favoris"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
          >
            <IconHeart />
            Favoris
          </Link>
        </nav>

        <form action="/" className="relative ml-auto hidden md:block max-w-xs flex-1">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            name="q"
            placeholder="Rechercher une voiture, une ville..."
            className="h-10 w-full rounded-full border border-zinc-200 bg-zinc-50/60 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/10"
          />
        </form>

        <div className="ml-auto flex items-center gap-1 sm:ml-2">
          <Link
            href="/"
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-full text-zinc-600 hover:bg-zinc-100 transition-colors"
            aria-label="Accueil"
            title="Accueil"
          >
            <IconHome />
          </Link>
          <Link
            href="/favoris"
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-full text-zinc-600 hover:bg-zinc-100 transition-colors"
            aria-label="Favoris"
          >
            <IconHeart />
          </Link>

          {!locateur && (
            <Link
              href="/locateur/inscription"
              className="btn-brand hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all"
            >
              <IconKey className="h-4 w-4" />
              Devenir locateur
            </Link>
          )}

          <AccountDropdown
            sections={[
              {
                titre: "Locataire",
                connecte: !!client,
                nom: client?.nom,
                sousTitre: client?.email,
                dashboardHref: "/compte/tableau-de-bord",
                dashboardLabel: "Mes réservations",
                deconnexionAction: deconnexionClientAction,
                liensConnexion: [
                  { label: "Connexion", href: "/compte/connexion" },
                  { label: "Créer un compte", href: "/compte/inscription" },
                ],
              },
              {
                titre: "Locateur",
                connecte: !!locateur,
                nom: locateur?.nomAgence,
                dashboardHref: "/locateur/tableau-de-bord",
                dashboardLabel: "Tableau de bord",
                deconnexionAction: logoutAction,
                liensConnexion: [
                  { label: "Connexion", href: "/locateur/connexion" },
                  { label: "Devenir locateur", href: "/locateur/inscription" },
                ],
              },
              {
                titre: "Administration",
                connecte: !!admin,
                nom: admin?.nom,
                dashboardHref: "/admin",
                dashboardLabel: "Tableau de bord admin",
                deconnexionAction: deconnexionAdminAction,
                liensConnexion: [{ label: "Connexion", href: "/admin/connexion" }],
              },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
