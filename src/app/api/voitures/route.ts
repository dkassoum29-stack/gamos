import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json({ voitures: [] });
  }

  const voitures = await prisma.voiture.findMany({
    where: { id: { in: ids } },
    include: { locateur: true, avis: true },
  });

  return NextResponse.json({
    voitures: voitures.map((v) => {
      const nombreAvis = v.avis.length;
      const noteMoyenne = nombreAvis
        ? v.avis.reduce((s, a) => s + a.note, 0) / nombreAvis
        : null;
      return {
        id: v.id,
        marque: v.marque,
        modele: v.modele,
        annee: v.annee,
        ville: v.ville,
        type: v.type,
        transmission: v.transmission,
        places: v.places,
        prixParJour: v.prixParJour,
        photoUrl: v.photoUrl,
        nomAgence: v.locateur.nomAgence,
        locateurVerifie: v.locateur.statutVerification === "verifie",
        noteMoyenne,
        nombreAvis,
      };
    }),
  });
}
