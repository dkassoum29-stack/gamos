import Link from "next/link";
import { getClient, getLocateur, getAdmin } from "@/lib/auth";
import { deconnexionClientAction } from "@/app/compte/actions";
import AccountDropdown from "./AccountDropdown";
import {
  IconHeart,
  IconCar,
  IconSearch,
  IconKey,
  IconHome,
  IconClipboard,
  IconShieldCheck,
} from "./icons";

export default async function Navbar() {
  const [client, locateur, admin] = await Promise.all([
    getClient(),
    getLocateur(),
    getAdmin(),
  ]);

  const liens = client
    ? [
        {
          label: "Mes réservations",
          href: "/compte/tableau-de-bord",
          icon: <IconClipboard className="h-4 w-4 text-zinc-400" />,
        },
        ...(locateur
          ? [
              {
                label: "Tableau de bord locateur",
                href: "/locateur/tableau-de-bord",
                icon: <IconKey className="h-4 w-4 text-zinc-400" />,
              },
            ]
          : []),
        ...(admin
          ? [
              {
                label: "Tableau de bord admin",
                href: "/admin",
                icon: <IconShieldCheck className="h-4 w-4 text-zinc-400" />,
              },
            ]
          : []),
      ]
    : [];

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
            connecte={!!client}
            nom={client?.nom}
            email={client?.email}
            liens={liens}
            deconnexionAction={deconnexionClientAction}
          />
        </div>
      </div>
    </header>
  );
}
