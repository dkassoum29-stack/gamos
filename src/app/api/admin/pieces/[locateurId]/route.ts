import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ locateurId: string }> }
) {
  if (!(await getAdmin())) {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  const { locateurId } = await params;

  const locateur = await prisma.locateur.findUnique({ where: { id: locateurId } });
  if (!locateur?.pieceIdentiteChemin) {
    return new NextResponse("Introuvable", { status: 404 });
  }

  const reponse = await fetch(locateur.pieceIdentiteChemin);
  if (!reponse.ok || !reponse.body) {
    return new NextResponse("Fichier introuvable", { status: 404 });
  }

  return new NextResponse(reponse.body, {
    headers: {
      "Content-Type": reponse.headers.get("content-type") ?? "application/octet-stream",
    },
  });
}
