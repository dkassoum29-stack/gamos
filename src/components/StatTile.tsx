import Link from "next/link";
import type { ReactNode } from "react";

type StatTileProps = {
  label: string;
  value: number | string;
  icon?: ReactNode;
  href?: string;
};

export default function StatTile({ label, value, icon, href }: StatTileProps) {
  const contenu = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{label}</p>
        {icon && <span className="text-zinc-400">{icon}</span>}
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-zinc-900">
        {value}
      </p>
    </>
  );

  const classes =
    "rounded-2xl border border-zinc-200 bg-white p-4 transition-all";

  if (href) {
    return (
      <Link href={href} className={`${classes} hover:border-zinc-300 hover:shadow-sm block`}>
        {contenu}
      </Link>
    );
  }

  return <div className={classes}>{contenu}</div>;
}
