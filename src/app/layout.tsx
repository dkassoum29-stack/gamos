import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gamos — Location de voitures partout au Burkina Faso",
  description:
    "Gamos met en relation locataires et locateurs (agences et particuliers) partout au Burkina Faso. Compare, réserve, roule.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-zinc-200 bg-white py-8 text-center text-sm text-zinc-500">
          <p className="font-display font-semibold text-zinc-900">Gamos</p>
          <p className="mt-1">
            Mettre en relation locateurs et locataires partout au Burkina Faso
          </p>
        </footer>
      </body>
    </html>
  );
}
