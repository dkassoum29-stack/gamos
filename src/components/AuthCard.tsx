import Link from "next/link";
import { IconCar } from "./icons";

export default function AuthCard({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm shadow-zinc-900/5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3B82F6] text-white">
            <IconCar className="h-4.5 w-4.5" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-zinc-950">
            Gamos
          </span>
        </Link>

        <h1 className="font-display mt-6 text-2xl font-bold text-zinc-950">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}

        <div className="mt-6">{children}</div>

        {footer && (
          <p className="mt-6 text-center text-sm text-zinc-500">{footer}</p>
        )}
      </div>
    </div>
  );
}

export function ErreurFormulaire({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
        aria-hidden
      >
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 8v5" />
        <path d="M12 16h.01" />
      </svg>
      {message}
    </p>
  );
}

export function ChampAvecIcone({
  icon,
  ...props
}: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
        {icon}
      </span>
      <input
        {...props}
        className="w-full rounded-lg border border-zinc-300 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
      />
    </div>
  );
}
