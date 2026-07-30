export function formatFCFA(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

export const VILLES = [
  "Ouagadougou",
  "Bobo-Dioulasso",
  "Koudougou",
  "Ouahigouya",
  "Banfora",
  "Kaya",
  "Tenkodogo",
  "Fada N'Gourma",
  "Dédougou",
  "Gaoua",
];

export const TYPES_VOITURE = [
  "Citadine",
  "Berline",
  "SUV",
  "4x4",
  "Minibus",
  "Pick-up",
];

export const TRANSMISSIONS = ["Manuelle", "Automatique"];

export function typeStyle(_type: string): string {
  return "badge-type";
}

export function lienWhatsApp(telephone: string, message: string): string {
  const chiffres = telephone.replace(/\D/g, "").replace(/^0+/, "");
  const numero = chiffres.startsWith("226") ? chiffres : `226${chiffres}`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}
