/**
 * Programmes de séjour, en anglais.
 *
 * Le nom du séjour est déjà anglais et ne bouge pas. Ce qui compte ici est le
 * registre : chaque ligne décrit ce qui est fait, jamais l'effet obtenu. On ne
 * traduit pas « couper net » par une promesse de résultat, et le mot « detox »
 * reste écarté dans les deux langues — il n'a pas de définition médicale.
 */

export interface RetreatText {
  claim: string;
  includes: string[];
  rhythm: string[];
}

export const EN_RETREATS: Record<string, RetreatText> = {
  "reset-3": {
    claim: "Three days to break off cleanly and find a rhythm again.",
    includes: [
      "Accommodation at altitude, quiet room",
      "Two bathing and hammam sessions",
      "Guided walking on the plateau",
      "Simple meals at regular times",
    ],
    rhythm: [
      "Arrival and rest",
      "Baths, a short walk, a long night",
      "Walking, a relaxation session, departure",
    ],
  },
  "sleep-5": {
    claim: "Five days organised around a single priority: sleeping better.",
    includes: [
      "Traditional guest house, screen-free areas",
      "Regular meal and bedtime hours",
      "End-of-day walks",
      "A sleep diary handed over at the end of the stay",
    ],
    rhythm: [
      "Arrival, settling in, an early dinner",
      "Slow days, morning light exposure",
      "A walk at sunset",
      "Stimulation gradually reduced",
      "Review of the stay and return",
    ],
  },
  "fit-7": {
    claim: "Seven days of supervised return to training, between hills and sea.",
    includes: [
      "Fitness assessment on arrival",
      "Five supervised sessions, gentle progression",
      "Two spa recovery sessions",
      "Nutrition consultation and a written plan",
    ],
    rhythm: [
      "Assessment and a light session",
      "Uphill walking",
      "Strength work then recovery",
      "A gentle day, swimming",
      "A demanding session",
      "Recovery and nutrition",
      "Review session and plan to continue",
    ],
  },
  "recovery-10": {
    claim: "Ten days to pick up again after a procedure, at an approved pace.",
    includes: [
      "Functional assessment at a rehabilitation centre",
      "Six physiotherapy sessions",
      "Adapted accommodation, transfers included",
      "Written report at the end of care",
    ],
    rhythm: [
      "Arrival and functional assessment",
      "Short sessions, long rest",
      "Load increased gradually",
      "A full recovery day",
      "Longer walking resumed",
      "A pool session",
      "Spa recovery",
      "Light strength work",
      "Discharge assessment",
      "Plan to continue, and departure",
    ],
  },
  "mind-body-7": {
    claim: "Seven days between gentle movement, breathing and heritage.",
    includes: [
      "Mobility and breathing sessions",
      "Two days of guided discovery",
      "A relaxation cure at a thermal spa in the region",
      "Structured free time, without overload",
    ],
    rhythm: [
      "Arrival and a mobility session",
      "Exploring the city on foot",
      "A thermal day",
      "Breathing and rest",
      "A gentle excursion",
      "Mobility session, quiet evening",
      "Review and departure",
    ],
  },
  "digital-break-5": {
    claim: "Five days without notifications, in a Saharan valley.",
    includes: [
      "Accommodation in a palm grove",
      "Screen-free days, phone handed in on request",
      "Morning walks in the oases",
      "Local meals at fixed times",
    ],
    rhythm: [
      "Arrival, screens handed in",
      "Morning walk, a nap, reading",
      "Excursion to the gorges",
      "A free day in the palm grove",
      "A gradual return, and departure",
    ],
  },
};
