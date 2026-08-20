/**
 * Traduction anglaise du catalogue de démonstration.
 *
 * Les noms restent tels quels : ce sont des noms propres, et un établissement
 * algérien ne change pas d'enseigne selon la langue du visiteur. Seul le texte
 * descriptif est traduit — description, spécialités, services, accessibilité.
 *
 * Le registre suit celui du français : factuel, sans superlatif, sans promesse
 * de résultat. Les mentions qui écartent toute revendication thérapeutique
 * sont traduites mot pour mot, ce sont elles qui portent la précaution.
 */

export interface FacilityText {
  summary: string;
  specialties: string[];
  services: string[];
  accessibility: string[];
}

export const EN_FACILITIES: Record<string, FacilityText> = {
  "clinique-ryad-alger": {
    summary:
      "A general facility oriented towards check-ups and planned journeys, with imaging and a laboratory on site.",
    specialties: ["Internal medicine", "Cardiology", "Endocrinology", "Health check"],
    services: [
      "Airport shuttle",
      "Interpreter on request",
      "Appointment coordination",
      "Room for a companion",
    ],
    accessibility: ["Wheelchair access", "Lift", "Reserved parking spaces"],
  },
  "centre-dentaire-andalus": {
    summary:
      "A group practice dedicated to restorative care, prosthetics and implants, with dental radiology on site.",
    specialties: ["Implantology", "Prosthetics", "Restorative care", "Cosmetic dentistry"],
    services: [
      "Written treatment plan",
      "Detailed estimate before any procedure",
      "Remote follow-up",
    ],
    accessibility: ["Ground floor", "Wheelchair access"],
  },
  "laboratoire-mediterranee": {
    summary:
      "Routine biological analyses and full panels, with results sent in digital form.",
    specialties: ["Medical biology", "Lipid panel", "Hormone panel", "Serology"],
    services: [
      "Morning sampling without an appointment",
      "Results online",
      "Sent to your practitioner",
    ],
    accessibility: ["Wheelchair access"],
  },
  "residence-baie-alger": {
    summary:
      "Accommodation designed for recovery stays: quiet rooms, adaptable catering, transfers to places of care.",
    specialties: ["Recovery stay", "Adaptable catering", "Extended stay"],
    services: [
      "Transfers to appointments",
      "Adapted meals on request",
      "Quiet floor",
      "Laundry",
    ],
    accessibility: ["Adapted rooms", "Lift", "Step-free shower"],
  },
  "clinique-santa-oran": {
    summary: "Planned surgery and post-operative follow-up, with an adjoining rehabilitation unit.",
    specialties: [
      "Orthopaedic surgery",
      "Trauma care",
      "Anaesthesia",
      "Post-operative follow-up",
    ],
    services: [
      "Pre-operative coordination",
      "Airport shuttle",
      "Remote post-operative follow-up",
    ],
    accessibility: ["Wheelchair access", "Lift"],
  },
  "centre-forme-corniche": {
    summary:
      "Fitness programmes supervised by sports instructors, with a baseline assessment and progression over the length of the stay.",
    specialties: [
      "Gradual return to fitness",
      "Strength work",
      "Water aerobics",
      "Fitness assessment",
    ],
    services: [
      "Initial assessment",
      "Written programme",
      "One-to-one or small-group sessions",
    ],
    accessibility: ["Wheelchair access", "Adapted changing rooms"],
  },
  "institut-nour-reeducation": {
    summary:
      "Physiotherapy and return-to-sport work, covering recovery after a procedure and sports injuries.",
    specialties: ["Physiotherapy", "Return to sport", "Post-operative rehabilitation"],
    services: [
      "Functional assessment",
      "Self-rehabilitation programme",
      "Written report at the end of care",
    ],
    accessibility: ["Wheelchair access", "Step-free training floor"],
  },
  "polyclinique-cirta": {
    summary:
      "Specialist consultations and second opinions on file, with access to a partner imaging centre.",
    specialties: ["Neurology", "Internal medicine", "General surgery", "Second opinion"],
    services: [
      "Second opinion on file",
      "Follow-up teleconsultation",
      "Written summary given to the patient",
    ],
    accessibility: ["Wheelchair access", "Lift"],
  },
  "imagerie-rhummel": {
    summary:
      "Radiology, ultrasound and CT, with reports issued the same day in most cases.",
    specialties: ["Radiology", "Ultrasound", "CT scan"],
    services: ["Digital report", "Images handed to the patient on media"],
    accessibility: ["Wheelchair access"],
  },
  "station-thermale-plateaux": {
    summary:
      "A thermal establishment oriented towards relaxation and recovery: baths, traditional hammam and rest areas. No therapeutic indication is claimed.",
    specialties: ["Thermal baths", "Hammam", "Supervised rest", "Relaxation massage"],
    services: ["Wellbeing cure programme", "Quiet areas", "Light catering"],
    accessibility: ["Partial wheelchair access", "Pool with gradual entry"],
  },
  "maison-nutrition-lalla-setti": {
    summary:
      "Dietary consultations and practical workshops built around local produce from the plateaus.",
    specialties: ["Nutrition assessment", "Dietary rebalancing", "Cookery workshops"],
    services: ["Written eating plan", "Remote follow-up after the stay"],
    accessibility: ["Ground floor"],
  },
  "centre-sport-soummam": {
    summary:
      "Physical preparation and recovery, with outdoor sessions along the coast and on the Gouraya hills.",
    specialties: [
      "Physical preparation",
      "Active recovery",
      "Uphill walking",
      "Supervised swimming",
    ],
    services: [
      "Simplified fitness test",
      "Progression over the length of the stay",
      "Outdoor sessions",
    ],
    accessibility: ["Step-free training floor"],
  },
  "spa-cap-carbon": {
    summary:
      "A recovery space facing the sea: sauna, cold plunge pool and relaxation massages.",
    specialties: ["Recovery", "Sauna", "Cold plunge", "Massage"],
    services: ["Quiet morning slots", "Sports recovery protocol"],
    accessibility: ["Partial wheelchair access"],
  },
  "centre-dentaire-hippone": {
    summary:
      "Dental care planned around a short stay, with sessions scheduled before you arrive.",
    specialties: ["Restorative care", "Prosthetics", "Scaling", "Cosmetic dentistry"],
    services: ["Planning before arrival", "Detailed estimate", "Remote follow-up"],
    accessibility: ["Wheelchair access"],
  },
  "residence-seraidi": {
    summary:
      "Quiet accommodation in the hills, thirty minutes from the city, suited to restful stays.",
    specialties: ["Quiet stay", "Rest after a procedure", "Family stay"],
    services: ["Transfers into the city", "Adapted meals on request", "Family rooms"],
    accessibility: ["Step-free rooms"],
  },
  "thermes-oasis": {
    summary:
      "Hot baths and rest areas on the edge of the palm grove. A traditional place of relaxation, with no therapeutic claim.",
    specialties: ["Hot baths", "Rest", "Hammam"],
    services: ["Reserved slots", "Shaded rest areas"],
    accessibility: ["Partial access"],
  },
  "maison-palmeraie-tolga": {
    summary: "A guest house in the palm grove, geared to slow stays in the cool season.",
    specialties: ["Slow stay", "Digital break", "Local cooking"],
    services: ["Full board", "Quiet nights", "Guided walks in the oases"],
    accessibility: ["Step-free"],
  },
  "maison-hotes-mzab": {
    summary:
      "Traditional accommodation in the valley, designed for stays built around silence and sleep.",
    specialties: ["Digital break", "Sleep", "Contemplative stay"],
    services: ["Full board", "Cultural guidance", "Screen-free areas"],
    accessibility: ["Partial access, traditional architecture"],
  },
  "salle-atlas-alger": {
    summary:
      "A full gym with a free-weights floor, cardio and group classes. Day or week access, with no commitment.",
    specialties: ["Weight training", "Cardio training", "Group classes", "One-to-one coaching"],
    services: [
      "Day or week pass",
      "Changing rooms and showers",
      "Coach available on booking",
      "Open early in the morning",
    ],
    accessibility: ["Wheelchair access", "Adapted changing rooms"],
  },
  "salle-mediterranee-oran": {
    summary:
      "A weights floor facing the sea, a 25-metre swimming pool and a recovery area. Designed for short stays.",
    specialties: ["Weight training", "Swimming", "Physical preparation", "Recovery"],
    services: [
      "Stay pass from 3 to 14 days",
      "25 m swimming pool",
      "Sauna and cold plunge",
      "Written programme on request",
    ],
    accessibility: ["Wheelchair access", "Pool with gradual entry"],
  },
  "salle-soummam-bejaia": {
    summary:
      "A well-equipped neighbourhood gym, with guided trail outings on the Gouraya paths twice a week.",
    specialties: ["Weight training", "Trail and running", "Strength work", "Group classes"],
    services: ["Week pass", "Guided trail outings", "Running kit on loan"],
    accessibility: ["Step-free training floor"],
  },
  "salle-hippone-annaba": {
    summary:
      "A gym near the seafront, with yoga and pilates classes at the end of the day and a quiet stretching area.",
    specialties: ["Weight training", "Yoga", "Pilates", "Cardio training"],
    services: ["Day pass", "Evening yoga classes", "Stretching area"],
    accessibility: ["Wheelchair access"],
  },
};
