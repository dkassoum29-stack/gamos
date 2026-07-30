import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const motDePasse = await bcrypt.hash("motdepasse123", 10);

  const fasoAuto = await prisma.locateur.upsert({
    where: { email: "contact@fasoauto.bf" },
    update: {},
    create: {
      nomAgence: "Faso Auto Location",
      ville: "Ouagadougou",
      telephone: "70 12 34 56",
      email: "contact@fasoauto.bf",
      motDePasse,
    },
  });

  const boboRent = await prisma.locateur.upsert({
    where: { email: "contact@bobocarrent.bf" },
    update: {},
    create: {
      nomAgence: "Bobo Car Rent",
      ville: "Bobo-Dioulasso",
      telephone: "76 22 33 44",
      email: "contact@bobocarrent.bf",
      motDePasse,
    },
  });

  const particulier = await prisma.locateur.upsert({
    where: { email: "issa.k@example.com" },
    update: {},
    create: {
      nomAgence: "Issa K. (particulier)",
      ville: "Ouagadougou",
      telephone: "78 55 66 77",
      email: "issa.k@example.com",
      motDePasse,
    },
  });

  const voitures = [
    {
      locateurId: fasoAuto.id,
      marque: "Toyota",
      modele: "Corolla",
      annee: 2019,
      ville: "Ouagadougou",
      type: "Berline",
      transmission: "Automatique",
      places: 5,
      prixParJour: 25000,
      description: "Climatisation, kilométrage illimité, très bon état.",
      photoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Toyota_Corolla_Hybrid_Sedan%2C_GIMS_2019%2C_Le_Grand-Saconnex_%28GIMS1338%29.jpg/960px-Toyota_Corolla_Hybrid_Sedan%2C_GIMS_2019%2C_Le_Grand-Saconnex_%28GIMS1338%29.jpg",
      avis: [
        { nomClient: "Awa T.", note: 5, commentaire: "Voiture impeccable, climatisation nickel. Je recommande !" },
        { nomClient: "Boureima S.", note: 4, commentaire: "Très bon rapport qualité-prix, RAS." },
      ],
    },
    {
      locateurId: fasoAuto.id,
      marque: "Toyota",
      modele: "Hilux",
      annee: 2021,
      ville: "Ouagadougou",
      type: "Pick-up",
      transmission: "Manuelle",
      places: 5,
      prixParJour: 45000,
      description: "Idéal pour les déplacements en brousse et le transport.",
      photoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/2020_Toyota_Hilux_E_%28front_left_side_view%29.jpg/960px-2020_Toyota_Hilux_E_%28front_left_side_view%29.jpg",
      avis: [
        { nomClient: "Rasmané O.", note: 5, commentaire: "Parfait pour transporter du matériel, moteur puissant." },
      ],
    },
    {
      locateurId: boboRent.id,
      marque: "Hyundai",
      modele: "i10",
      annee: 2020,
      ville: "Bobo-Dioulasso",
      type: "Citadine",
      transmission: "Manuelle",
      places: 4,
      prixParJour: 15000,
      description: "Petite citadine économique, parfaite en ville.",
      photoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/2023_Hyundai_i10_N_Line_1X7A1551.jpg/960px-2023_Hyundai_i10_N_Line_1X7A1551.jpg",
      avis: [
        { nomClient: "Fatimata Z.", note: 5, commentaire: "Économique en carburant, facile à garer." },
        { nomClient: "Idrissa N.", note: 4, commentaire: "Bon état général, un peu petite pour 4 avec bagages." },
      ],
    },
    {
      locateurId: boboRent.id,
      marque: "Toyota",
      modele: "Land Cruiser Prado",
      annee: 2018,
      ville: "Bobo-Dioulasso",
      type: "4x4",
      transmission: "Automatique",
      places: 7,
      prixParJour: 60000,
      description: "Confortable pour les longs trajets en famille.",
      photoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/TOYOTA_LAND_CRUISER_PRADO_%28J150%29_China_%2815%29.jpg/960px-TOYOTA_LAND_CRUISER_PRADO_%28J150%29_China_%2815%29.jpg",
      avis: [
        { nomClient: "Salif K.", note: 5, commentaire: "Très confortable pour un long trajet Bobo-Ouaga." },
      ],
    },
    {
      locateurId: particulier.id,
      marque: "Kia",
      modele: "Rio",
      annee: 2017,
      ville: "Ouagadougou",
      type: "Citadine",
      transmission: "Manuelle",
      places: 5,
      prixParJour: 18000,
      description: "Voiture personnelle bien entretenue, dispo le week-end.",
      photoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/2018_Kia_Rio_%28YB%29_S_5-door_hatchback_%282018-08-06%29_01.jpg/960px-2018_Kia_Rio_%28YB%29_S_5-door_hatchback_%282018-08-06%29_01.jpg",
      avis: [
        { nomClient: "Aminata D.", note: 4, commentaire: "Bonne expérience, Issa est très réactif." },
      ],
    },
    {
      locateurId: particulier.id,
      marque: "Toyota",
      modele: "HiAce",
      annee: 2016,
      ville: "Ouagadougou",
      type: "Minibus",
      transmission: "Manuelle",
      places: 15,
      prixParJour: 55000,
      description: "Pour vos événements, mariages et transports en groupe.",
      photoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/2017_Toyota_HiAce_%28TRH201R%29_LWB_van_%282018-10-01%29_01.jpg/960px-2017_Toyota_HiAce_%28TRH201R%29_LWB_van_%282018-10-01%29_01.jpg",
      avis: [
        { nomClient: "Groupe Yennenga", note: 5, commentaire: "Parfait pour notre mariage, 15 places bien utiles !" },
        { nomClient: "Paul G.", note: 4, commentaire: "Bon véhicule, un peu bruyant sur route mais fiable." },
      ],
    },
  ];

  for (const { avis, ...v } of voitures) {
    const existante = await prisma.voiture.findFirst({
      where: { locateurId: v.locateurId, marque: v.marque, modele: v.modele },
    });

    const voiture = existante
      ? await prisma.voiture.update({ where: { id: existante.id }, data: v })
      : await prisma.voiture.create({ data: v });

    const avisExistants = await prisma.avis.count({ where: { voitureId: voiture.id } });
    if (avisExistants === 0) {
      for (const a of avis) {
        await prisma.avis.create({ data: { voitureId: voiture.id, ...a } });
      }
    }
  }

  const motDePasseClient = await bcrypt.hash("motdepasse123", 10);
  const clientTest = await prisma.client.upsert({
    where: { email: "aicha.client@example.com" },
    update: {},
    create: {
      nom: "Aïcha Client",
      email: "aicha.client@example.com",
      telephone: "70 99 99 99",
      motDePasse: motDePasseClient,
    },
  });

  const corolla = await prisma.voiture.findFirst({
    where: { marque: "Toyota", modele: "Corolla" },
  });
  if (corolla) {
    const reservationExistante = await prisma.reservation.findFirst({
      where: { voitureId: corolla.id, clientId: clientTest.id },
    });
    if (!reservationExistante) {
      await prisma.reservation.create({
        data: {
          voitureId: corolla.id,
          clientId: clientTest.id,
          nomClient: clientTest.nom,
          telephoneClient: clientTest.telephone,
          dateDebut: new Date(new Date().setDate(new Date().getDate() + 5)),
          dateFin: new Date(new Date().setDate(new Date().getDate() + 8)),
          statut: "confirmee",
        },
      });
    }
  }

  console.log("Données de démonstration créées.");
  console.log("Connexion locateur de test : contact@fasoauto.bf / motdepasse123");
  console.log(
    "Connexion client de test : aicha.client@example.com / motdepasse123 (réservation confirmée sur la Toyota Corolla, pour tester un avis)"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
