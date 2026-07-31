import { put, del } from "@vercel/blob";

const TYPES_AUTORISES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const TAILLE_MAX = 8 * 1024 * 1024; // 8 Mo

export async function enregistrerPieceIdentite(
  locateurId: string,
  fichier: File,
  ancienChemin?: string | null
): Promise<{ chemin: string } | { error: string }> {
  if (!TYPES_AUTORISES.includes(fichier.type)) {
    return { error: "Format non supporté. Utilise une image (JPG, PNG) ou un PDF." };
  }
  if (fichier.size > TAILLE_MAX) {
    return { error: "Le fichier est trop lourd (8 Mo maximum)." };
  }

  const extension = fichier.type === "application/pdf" ? "pdf" : fichier.type.split("/")[1];
  const blob = await put(`pieces-identite/${locateurId}.${extension}`, fichier, {
    access: "private",
    addRandomSuffix: true,
  });

  if (ancienChemin) {
    await del(ancienChemin).catch(() => {});
  }

  return { chemin: blob.url };
}

const TYPES_PHOTO_AUTORISES = ["image/jpeg", "image/png", "image/webp"];
const TAILLE_MAX_PHOTO = 8 * 1024 * 1024; // 8 Mo

export async function enregistrerPhotoVoiture(
  fichier: File
): Promise<{ url: string } | { error: string }> {
  if (!TYPES_PHOTO_AUTORISES.includes(fichier.type)) {
    return { error: "Format non supporté. Utilise une image JPG, PNG ou WEBP." };
  }
  if (fichier.size > TAILLE_MAX_PHOTO) {
    return { error: "Photo trop lourde (8 Mo maximum)." };
  }

  const extension = fichier.type.split("/")[1];
  const nom = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const blob = await put(`photos-voitures/${nom}`, fichier, {
    access: "public",
    addRandomSuffix: true,
  });

  return { url: blob.url };
}
