/**
 * Compte de démonstration, en anglais.
 *
 * Les noms d'établissement restent français : ce sont les mêmes fiches fictives
 * que dans le catalogue, et un visiteur qui les recroise doit les reconnaître.
 * Les notes de rendez-vous sont traduites — ce sont des consignes pratiques, et
 * une consigne qu'on ne lit pas ne sert à rien.
 */

export const EN_DEMO_JOURNEY = {
  title: "10 days in Algiers — check-up, dental care and recovery",
  phases: {
    discover: "Plan",
    assess: "File",
    plan: "Planning",
    book: "Appointments",
    experience: "Stay",
    "follow-up": "Follow-up",
  } as Record<string, string>,
};

export const EN_DEMO_APPOINTMENTS: Record<string, { title: string; note: string }> = {
  "Bilan de santé — prélèvements": {
    title: "Health check — samples taken",
    note: "Fasting required. Allow an hour on site.",
  },
  "Consultation dentaire et plan de traitement": {
    title: "Dental consultation and treatment plan",
    note: "A written estimate is given before any procedure.",
  },
  "Restitution du bilan avec le médecin": {
    title: "Reviewing the results with the doctor",
    note: "Prepare your questions beforehand.",
  },
};

export const EN_DEMO_DOCUMENTS: Record<string, string> = {
  "Bilan sanguin — mars 2026.pdf": "Blood test — March 2026.pdf",
  "Panoramique dentaire.jpg": "Dental panoramic X-ray.jpg",
  "Compte rendu de consultation — juin 2026.pdf": "Consultation report — June 2026.pdf",
  "Ordonnance en cours.pdf": "Current prescription.pdf",
  "Attestation d'assurance voyage.pdf": "Travel insurance certificate.pdf",
};
