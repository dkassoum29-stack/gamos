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

export function Diviseur() {
  return (
    <div className="my-4 flex items-center gap-3 text-xs font-medium text-zinc-400">
      <span className="h-px flex-1 bg-zinc-200" />
      OU
      <span className="h-px flex-1 bg-zinc-200" />
    </div>
  );
}

export function BoutonGoogle({ role }: { role: "client" | "locateur" | "admin" }) {
  return (
    <a
      href={`/api/auth/google/start?role=${role}`}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
    >
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#4285F4"
          d="M23.52 12.27c0-.82-.07-1.42-.22-2.05H12v3.72h6.53c-.13 1.09-.84 2.73-2.42 3.83l-.02.15 3.52 2.73.24.02c2.24-2.07 3.53-5.12 3.53-8.4z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.92l-3.78-2.9c-1.02.7-2.38 1.19-4.15 1.19-3.17 0-5.86-2.12-6.82-5.04l-.14.01-3.65 2.83-.05.14C3.28 21.34 7.31 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.18 14.33A7.35 7.35 0 0 1 4.75 12c0-.81.14-1.6.42-2.33l-.01-.15L1.47 6.63l-.12.06A11.96 11.96 0 0 0 0 12c0 1.94.47 3.77 1.35 5.38l3.83-3.05z"
        />
        <path
          fill="#EA4335"
          d="M12 4.74c2.26 0 3.78.97 4.65 1.79l3.39-3.3C17.94 1.19 15.24 0 12 0 7.31 0 3.28 2.66 1.35 6.62l3.82 3.05C6.14 6.86 8.83 4.74 12 4.74z"
        />
      </svg>
      Continuer avec Google
    </a>
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
