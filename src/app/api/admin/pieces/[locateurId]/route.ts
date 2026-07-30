import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cheminCompletPiece } from "@/lib/stockage";

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

  const extension = locateur.pieceIdentiteChemin.split(".").pop();
  const contentType =
    extension === "pdf"
      ? "application/pdf"
      : extension === "png"
        ? "image/png"
        : extension === "webp"
          ? "image/webp"
          : "image/jpeg";

  try {
    const octets = await readFile(cheminCompletPiece(locateur.pieceIdentiteChemin));
    return new NextResponse(new Uint8Array(octets), {
      headers: { "Content-Type": contentType },
    });
  } catch {
    return new NextResponse("Fichier introuvable", { status: 404 });
  }
}
