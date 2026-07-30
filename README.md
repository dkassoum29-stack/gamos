# Gamos — Location de voitures au Burkina Faso

Site de mise en relation entre **locateurs** (agences ou particuliers qui louent leurs voitures) et **clients** qui cherchent une voiture à louer. Plusieurs locateurs peuvent s'inscrire et gérer leurs propres véhicules.

## Fonctionnement

**Côté client (pas besoin de compte)**
- Parcourir toutes les voitures disponibles sur la page d'accueil
- Filtrer par ville, type de véhicule et prix maximum par jour
- Voir la fiche détaillée d'une voiture (caractéristiques, locateur, téléphone)
- Envoyer une demande de réservation (dates + nom + téléphone)

**Côté locateur (compte requis)**
- Créer un compte locateur (nom d'agence, ville, téléphone, email, mot de passe)
- Ajouter ses voitures : marque, modèle, année, ville, type, transmission, places, prix/jour, photo, description
- Masquer / rendre disponible ou supprimer une voiture
- Voir les demandes de réservation reçues et les **confirmer** ou **refuser**

Le paiement se fait **hors ligne** (cash ou Mobile Money en direct entre le client et le locateur) — le site sert de vitrine et de canal de demande.

## Démarrer le site en local

```bash
npm install
npx prisma migrate dev    # crée la base de données
npm run seed              # ajoute des données de démonstration
npm run dev
```

Le site est ensuite accessible sur http://localhost:3000

## Comptes de démonstration

Les données de démo créent 3 locateurs avec 6 voitures. Mot de passe pour tous : `motdepasse123`

| Locateur | Email |
| --- | --- |
| Faso Auto Location (Ouagadougou) | `contact@fasoauto.bf` |
| Bobo Car Rent (Bobo-Dioulasso) | `contact@bobocarrent.bf` |
| Issa K. — particulier (Ouagadougou) | `issa.k@example.com` |

## Technologies

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** pour le style
- **Prisma 7** + **SQLite** pour la base de données
- Authentification maison : mots de passe hachés avec **bcrypt**, session en cookie JWT signé (**jose**)

## Structure du projet

```
src/
├── app/
│   ├── page.tsx                        # Accueil : liste + filtres des voitures
│   ├── voitures/[id]/                  # Fiche voiture + formulaire de réservation
│   └── locateur/
│       ├── inscription/                # Création de compte locateur
│       ├── connexion/                  # Connexion locateur
│       ├── actions.ts                  # Inscription / connexion / déconnexion
│       └── tableau-de-bord/
│           ├── page.tsx                # Mes voitures
│           ├── voitures/nouvelle/      # Ajouter une voiture
│           ├── reservations/           # Demandes reçues (confirmer / refuser)
│           └── actions.ts              # Actions voitures + réponses réservations
├── components/                         # Navbar, CarCard
└── lib/
    ├── prisma.ts                       # Client base de données
    ├── auth.ts                         # Sessions et protection des pages
    └── format.ts                       # FCFA, listes villes / types / transmissions
prisma/
├── schema.prisma                       # Modèles Locateur, Voiture, Reservation
└── seed.ts                             # Données de démonstration
```

## Pistes pour la suite

- Paiement en ligne (Orange Money / Moov Money) pour un acompte à la réservation
- Notifications SMS ou WhatsApp au locateur quand une demande arrive
- Upload de photos depuis le téléphone (au lieu d'une URL)
- Avis et notes sur les locateurs
- Vérification des locateurs (pièce d'identité, carte grise) pour rassurer les clients

## Avant une mise en production

- Changer `AUTH_SECRET` dans `.env` par une valeur longue et aléatoire
- Passer de SQLite à PostgreSQL (base hébergée) pour supporter plusieurs utilisateurs simultanés
