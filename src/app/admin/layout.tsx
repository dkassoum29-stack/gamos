import Link from "next/link";
import { getAdmin } from "@/lib/auth";
import { deconnexionAdminAction } from "./actions";
import {
  IconHome,
  IconShieldCheck,
  IconBuilding,
  IconUsers,
} from "@/components/icons";

const LIENS = [
  { href: "/admin", label: "Vue d'ensemble", icon: IconHome },
  { href: "/admin/verifications", label: "Vérifications", icon: IconShieldCheck },
  { href: "/admin/locateurs", label: "Locateurs", icon: IconBuilding },
  { href: "/admin/clients", label: "Clients", icon: IconUsers },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdmin();

  if (!admin) {
    return <div className="flex-1 flex flex-col">{children}</div>;
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#f9f9f7]">
      <aside className="hidden md:flex md:w-56 shrink-0 border-r border-zinc-200 bg-white flex-col">
        <div className="h-16 flex items-center px-5 border-b border-zinc-200">
          <span className="font-display font-bold text-zinc-900">Gamos</span>
          <span className="ml-1.5 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            Admin
          </span>
        </div>
        <nav className="flex-1 flex flex-col gap-1 p-3">
          {LIENS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            >
              <l.icon className="shrink-0" />
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-zinc-200 p-3">
          <p className="px-3 text-xs text-zinc-500 truncate">{admin.nom}</p>
          <form action={deconnexionAdminAction} className="mt-1">
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
        {LIENS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <l.icon className="h-4 w-4 shrink-0" />
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
