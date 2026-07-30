import { mkdir, writeFile } from "fs/promises";
import path from "path";

const DOSSIER_PIECES = path.join(process.cwd(), "stockage-prive", "pieces-identite");

const TYPES_AUTORISES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const TAILLE_MAX = 8 * 1024 * 1024; // 8 Mo

export async function enregistrerPieceIdentite(
  locateurId: string,
  fichier: File
): Promise<{ chemin: string } | { error: string }> {
  if (!TYPES_AUTORISES.includes(fichier.type)) {
    return { error: "Format non supporté. Utilise une image (JPG, PNG) ou un PDF." };
  }
  if (fichier.size > TAILLE_MAX) {
    return { error: "Le fichier est trop lourd (8 Mo maximum)." };
  }

  await mkdir(DOSSIER_PIECES, { recursive: true });

  const extension = fichier.type === "application/pdf" ? "pdf" : fichier.type.split("/")[1];
  const nomFichier = `${locateurId}.${extension}`;
  const cheminComplet = path.join(DOSSIER_PIECES, nomFichier);

  const octets = Buffer.from(await fichier.arrayBuffer());
  await writeFile(cheminComplet, octets);

  return { chemin: nomFichier };
}

export function cheminCompletPiece(nomFichier: string): string {
  return path.join(DOSSIER_PIECES, nomFichier);
}
