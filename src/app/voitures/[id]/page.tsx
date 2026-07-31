import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getClient } from "@/lib/auth";
import { formatFCFA, typeStyle } from "@/lib/format";
import ReservationForm from "./ReservationForm";
import AvisForm from "./AvisForm";
import GaleriePhotos from "./GaleriePhotos";
import Calendrier from "./Calendrier";
import StarRating from "@/components/StarRating";
import { IconMapPin, IconStar, IconCheck } from "@/components/icons";

function ConnexionRequise({ texte }: { texte: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-600">
      <p>{texte}</p>
      <div className="mt-2 flex gap-3">
        <Link href="/compte/connexion" className="font-semibold text-zinc-900 underline underline-offset-2">
          Se connecter
        </Link>
        <Link href="/compte/inscription" className="font-semibold text-zinc-900 underline underline-offset-2">
          Créer un compte
        </Link>
      </div>
    </div>
  );
}

export default async function VoiturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const voiture = await prisma.voiture.findUnique({
    where: { id },
    include: {
      locateur: true,
      avis: { orderBy: { createdAt: "desc" } },
      reservations: { where: { statut: "confirmee" } },
      indisponibilites: true,
    },
  });

  if (!voiture) notFound();

  const client = await getClient();
  const monAvis = client
    ? voiture.avis.find((a) => a.clientId === client.id)
    : undefined;

  const photos = [voiture.photoUrl, voiture.photoUrl2, voiture.photoUrl3].filter(
    (p): p is string => Boolean(p)
  );
  const nombreAvis = voiture.avis.length;
  const noteMoyenne = nombreAvis
    ? voiture.avis.reduce((s, a) => s + a.note, 0) / nombreAvis
    : null;
  const plagesIndisponibles = [
    ...voiture.reservations.map((r) => ({
      debut: r.dateDebut.toISOString(),
      fin: r.dateFin.toISOString(),
    })),
    ...voiture.indisponibilites.map((i) => ({
      debut: i.dateDebut.toISOString(),
      fin: i.dateFin.toISOString(),
    })),
  ];

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <GaleriePhotos
            photos={photos}
            alt={`${voiture.marque} ${voiture.modele}`}
          />

          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-display text-2xl font-bold text-zinc-900">
                {voiture.marque} {voiture.modele} ({voiture.annee})
              </h1>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${typeStyle(voiture.type)}`}
              >
                {voiture.type}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-zinc-500">
              <span className="flex items-center gap-1">
                <IconMapPin className="h-4 w-4 shrink-0" />
                {voiture.ville}
              </span>
              {noteMoyenne != null && (
                <span className="flex items-center gap-1 text-amber-600 font-medium">
                  <IconStar filled className="h-4 w-4" />
                  {noteMoyenne.toFixed(1)}
                  <span className="text-zinc-400 font-normal">
                    ({nombreAvis} avis)
                  </span>
                </span>
              )}
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl border border-zinc-200 p-3 text-center">
                <dt className="text-zinc-500">Transmission</dt>
                <dd className="font-medium text-zinc-900">{voiture.transmission}</dd>
              </div>
              <div className="rounded-xl border border-zinc-200 p-3 text-center">
                <dt className="text-zinc-500">Places</dt>
                <dd className="font-medium text-zinc-900">{voiture.places}</dd>
              </div>
              <div className="rounded-xl border border-zinc-200 p-3 text-center">
                <dt className="text-zinc-500">Prix / jour</dt>
                <dd className="font-display font-bold text-zinc-950">
                  {formatFCFA(voiture.prixParJour)}
                </dd>
              </div>
            </dl>

            {voiture.description && (
              <p className="mt-4 text-zinc-600 whitespace-pre-line">
                {voiture.description}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-200 p-4">
            <p className="text-sm text-zinc-500">Proposé par</p>
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-zinc-900">{voiture.locateur.nomAgence}</p>
              {voiture.locateur.statutVerification === "verifie" && (
                <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#3B82F6]">
                  <IconCheck className="h-3 w-3" />
                  Vérifié
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-500">
              {voiture.locateur.ville} · {voiture.locateur.telephone}
            </p>
          </div>

          <Calendrier plages={plagesIndisponibles} />

          <div className="rounded-2xl border border-zinc-200 p-4">
            <h2 className="font-display font-semibold text-zinc-900 mb-3">
              Avis {nombreAvis > 0 && `(${nombreAvis})`}
            </h2>
            {voiture.avis.length > 0 && (
              <ul className="flex flex-col gap-3 mb-4">
                {voiture.avis.map((a) => (
                  <li key={a.id} className="border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-zinc-900">{a.nomClient}</span>
                      <StarRating note={a.note} className="h-3.5 w-3.5" />
                    </div>
                    {a.commentaire && (
                      <p className="text-sm text-zinc-600 mt-1">{a.commentaire}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {!client ? (
              <ConnexionRequise texte="Connecte-toi pour laisser un avis (réservé aux clients ayant une réservation confirmée)." />
            ) : monAvis ? (
              <p className="text-sm text-zinc-500">
                Tu as déjà laissé un avis pour cette voiture, merci !
              </p>
            ) : (
              <AvisForm voitureId={voiture.id} />
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 lg:sticky lg:top-24 self-start">
            <h2 className="font-display font-semibold text-zinc-900 mb-1">
              Demander une réservation
            </h2>
            <p className="text-sm text-zinc-500 mb-4">
              Le locateur te recontacte pour confirmer les dates et le
              paiement.
            </p>
            {client ? (
              <ReservationForm
                voitureId={voiture.id}
                locateurTelephone={voiture.locateur.telephone ?? ""}
                marque={voiture.marque}
                modele={voiture.modele}
              />
            ) : (
              <ConnexionRequise texte="Connecte-toi pour envoyer une demande de réservation." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
