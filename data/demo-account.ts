import type { AuditEntry, JourneyPhase, VaultDocument } from "@/types/domain";

/**
 * ⚠️ COMPTE DE DÉMONSTRATION
 *
 * Patiente fictive, documents fictifs, historique fictif. Ce module remplace
 * l'authentification et la base de données le temps de la démonstration ; il
 * disparaît dès qu'un vrai socle Auth + PostgreSQL est branché.
 *
 * Les dates sont figées volontairement : une date calculée à l'exécution
 * produirait un rendu différent côté serveur et côté client.
 */

export const DEMO_PATIENT = {
  firstName: "Sarah",
  lastName: "B.",
  origin: "etranger" as const,
  languages: ["Français", "Arabe"],
  demo: true,
};

export const DEMO_JOURNEY = {
  title: "10 jours à Alger — bilan, dentaire et récupération",
  destination: "Alger",
  startsOn: "2026-09-14",
  endsOn: "2026-09-23",
  /** Phase atteinte dans le parcours en six temps. */
  currentPhase: "plan" as JourneyPhase,
  phases: [
    { key: "discover" as JourneyPhase, label: "Projet", done: true },
    { key: "assess" as JourneyPhase, label: "Dossier", done: true },
    { key: "plan" as JourneyPhase, label: "Planification", done: false },
    { key: "book" as JourneyPhase, label: "Rendez-vous", done: false },
    { key: "experience" as JourneyPhase, label: "Séjour", done: false },
    { key: "follow-up" as JourneyPhase, label: "Suivi", done: false },
  ],
};

export const DEMO_APPOINTMENTS = [
  {
    id: "apt-1",
    date: "2026-09-15",
    time: "08:30",
    title: "Bilan de santé — prélèvements",
    facility: "Laboratoire Méditerranée",
    note: "À jeun. Prévoir une heure sur place.",
  },
  {
    id: "apt-2",
    date: "2026-09-16",
    time: "10:30",
    title: "Consultation dentaire et plan de traitement",
    facility: "Centre dentaire Andalus",
    note: "Devis écrit remis avant tout acte.",
  },
  {
    id: "apt-3",
    date: "2026-09-17",
    time: "14:00",
    title: "Restitution du bilan avec le médecin",
    facility: "Clinique Ryad",
    note: "Préparez vos questions en amont.",
  },
];

export const DEMO_DOCUMENTS: VaultDocument[] = [
  {
    id: "doc-1",
    name: "Bilan sanguin — mars 2026.pdf",
    category: "analyses",
    sizeKb: 412,
    addedAt: "2026-07-28",
    needsAttention: null,
    shares: [
      {
        id: "share-1",
        recipient: "Dr A. Benali — Clinique Ryad",
        recipientKind: "medecin",
        grantedAt: "2026-08-12",
        expiresAt: "2026-09-30",
        revokedAt: null,
      },
    ],
    demo: true,
  },
  {
    id: "doc-2",
    name: "Panoramique dentaire.jpg",
    category: "imagerie",
    sizeKb: 2_180,
    addedAt: "2026-08-02",
    needsAttention: "Cliché non daté — une date de réalisation faciliterait la lecture.",
    shares: [],
    demo: true,
  },
  {
    id: "doc-3",
    name: "Compte rendu de consultation — juin 2026.pdf",
    category: "comptes-rendus",
    sizeKb: 288,
    addedAt: "2026-08-05",
    needsAttention: null,
    shares: [
      {
        id: "share-2",
        recipient: "Centre dentaire Andalus",
        recipientKind: "clinique",
        grantedAt: "2026-08-10",
        expiresAt: "2026-08-17",
        revokedAt: "2026-08-14",
      },
    ],
    demo: true,
  },
  {
    id: "doc-4",
    name: "Ordonnance en cours.pdf",
    category: "ordonnances",
    sizeKb: 96,
    addedAt: "2026-08-09",
    needsAttention: null,
    shares: [],
    demo: true,
  },
  {
    id: "doc-5",
    name: "Attestation d'assurance voyage.pdf",
    category: "administratif",
    sizeKb: 154,
    addedAt: "2026-08-11",
    needsAttention: null,
    shares: [],
    demo: true,
  },
];

export const DEMO_AUDIT: AuditEntry[] = [
  {
    id: "audit-1",
    at: "2026-08-14 09:12",
    actor: "Vous",
    action: "document.revoque",
    target: "Compte rendu de consultation — juin 2026.pdf",
    detail: "Accès du Centre dentaire Andalus révoqué avant échéance.",
  },
  {
    id: "audit-2",
    at: "2026-08-13 16:40",
    actor: "Dr A. Benali — Clinique Ryad",
    action: "document.consulte",
    target: "Bilan sanguin — mars 2026.pdf",
    detail: "Consultation dans le cadre du partage en cours.",
  },
  {
    id: "audit-3",
    at: "2026-08-12 11:05",
    actor: "Vous",
    action: "document.partage",
    target: "Bilan sanguin — mars 2026.pdf",
    detail: "Accès accordé à Dr A. Benali jusqu'au 30 septembre 2026.",
  },
  {
    id: "audit-4",
    at: "2026-08-11 18:22",
    actor: "Vous",
    action: "document.ajoute",
    target: "Attestation d'assurance voyage.pdf",
    detail: "Document déposé dans la catégorie Administratif.",
  },
  {
    id: "audit-5",
    at: "2026-08-09 10:03",
    actor: "Concierge",
    action: "parcours.genere",
    target: "10 jours à Alger",
    detail: "Parcours construit à partir de votre description.",
  },
];

export const DOCUMENT_CATEGORY_LABEL: Record<VaultDocument["category"], string> = {
  analyses: "Analyses",
  imagerie: "Imagerie",
  ordonnances: "Ordonnances",
  "comptes-rendus": "Comptes rendus",
  factures: "Factures",
  administratif: "Administratif",
};
