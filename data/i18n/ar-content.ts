import type { GoalId } from "@/types/domain";

/**
 * Contenu éditorial en arabe.
 *
 * ⚠️ EN ATTENTE DE RELECTURE PAR UN LOCUTEUR NATIF.
 *
 * Portée volontairement limitée aux libellés courts : objectifs, noms de
 * destination et de site, accroches, noms d'univers. Ce sont eux qui
 * apparaissent dans le titre du parcours, dans son résumé et dans les étapes —
 * donc ceux dont la traduction change vraiment l'expérience.
 *
 * Les longs textes éditoriaux — les huit fiches destination, les vingt-deux
 * fiches d'établissement — retombent sur le français. C'est le repli prévu par
 * l'architecture, et il est assumé : mieux vaut un paragraphe lisible en
 * français qu'un paragraphe traduit sans relecture sur un sujet de santé.
 *
 * Les toponymes suivent la graphie arabe usuelle en Algérie.
 */

export interface ArGoalText {
  label: string;
  short: string;
}

export const AR_GOALS: Record<GoalId, ArGoalText> = {
  soins: { label: "أن أتعالج", short: "استشارة، وفحوص، وتكفّل" },
  dentaire: { label: "الأسنان", short: "علاج، وتركيبات، وجماليات الابتسامة" },
  esthetique: { label: "التجميل", short: "طبّ الجلد والطبّ التجميلي" },
  forme: { label: "أن أستعيد لياقتي", short: "استئناف تدريجي ومؤطَّر" },
  detente: { label: "أن أسترخي", short: "منتجع، وراحة، وارتخاء" },
  thermalisme: { label: "الحمّامات المعدنية", short: "محطّات حمّامات وحصص عافية" },
  nutrition: { label: "التغذية", short: "تقييم ومرافقة غذائية" },
  prevention: { label: "الوقاية", short: "فحص صحي شامل" },
  mental: { label: "العافية النفسية", short: "النوم، والعبء الذهني، والصفاء" },
  sport: { label: "الرياضة والاستجمام", short: "الأداء والعودة إلى الجهد" },
  entrainement: { label: "أن أتمرّن", short: "الحفاظ على إيقاعي الرياضي أثناء الإقامة" },
  avis: { label: "طلب رأي", short: "رأي ثانٍ في ملفّ قائم" },
  sejour: { label: "تنظيم إقامة صحية", short: "تنسيق كامل للرحلة" },
};

export interface ArDestinationText {
  name: string;
  tagline: string;
}

export const AR_DESTINATIONS: Record<string, ArDestinationText> = {
  alger: { name: "الجزائر", tagline: "الصحة بين المتوسط والتراث" },
  oran: { name: "وهران", tagline: "البحر المفتوح واستعادة اللياقة" },
  constantine: { name: "قسنطينة", tagline: "هدوء الصخر للاستجمام" },
  tlemcen: { name: "تلمسان", tagline: "ارتفاع لطيف وفنّ عيش أندلسي" },
  bejaia: { name: "بجاية", tagline: "جبل وبحر لاستعادة الحركة" },
  annaba: { name: "عنابة", tagline: "لطف الساحل الشرقي" },
  biskra: { name: "بسكرة", tagline: "باب الصحراء، حرارة جافّة وواحات نخيل" },
  ghardaia: { name: "غرداية", tagline: "صمت مزاب وإيقاع بطيء" },
};

export const AR_HERITAGE: Record<string, string> = {
  "casbah-alger": "قصبة الجزائر",
  tipasa: "تيبازة",
  djemila: "جميلة",
  timgad: "تيمقاد",
  "vallee-mzab": "وادي مزاب",
  "tassili-najjer": "الطاسيلي ناجر",
  "qalaa-beni-hammad": "قلعة بني حمّاد",
  "mansourah-tlemcen": "المنصورة",
  "hippone-annaba": "هيبون",
  "gorges-ghoufi": "شرفات غوفي",
  "gouraya-bejaia": "الحظيرة الوطنية غورايا",
  "santa-cruz-oran": "حصن سانتا كروز",
};

export interface ArUniverseText {
  name: string;
  claim: string;
  description: string;
  suitedFor: string[];
  honestNote: string;
}

/**
 * Les six univers de séjour, en arabe.
 *
 * Les « notes de franchise » — ce que la plateforme ne prétend pas — sont
 * traduites mot pour mot. Ce sont elles qui distinguent une offre sérieuse
 * d'une promesse, et les affaiblir en arabe reviendrait à ne les tenir qu'en
 * français.
 */
export const AR_UNIVERSE_TEXTS: Record<string, ArUniverseText> = {
  thalasso: {
    name: "العلاج بمياه البحر",
    claim: "ماء البحر، والضوء، وإيقاع الساحل.",
    description:
      "حمّامات بمياه بحر مُسخَّنة، وأحواض، وعلاجات بالماء، وفضاءات راحة تطلّ على المتوسط. ويمتدّ الساحل الجزائري على أكثر من ألف ومئتي كيلومتر، يبقى جزء كبير منه قليل البناء.",
    suitedFor: [
      "انقطاع بضعة أيام بين البحر والراحة",
      "استجمام بعد فترة مثقلة",
      "إقامة لشخصين أو للعائلة، دون برنامج ثقيل",
    ],
    honestNote:
      "العلاج بمياه البحر إطار للاسترخاء والاستجمام. وهو لا يعالج أيّ مرض، ولن نقدّمه أبدًا على هذا النحو.",
  },
  thermalisme: {
    name: "الحمّامات المعدنية والحصص",
    claim: "منابع مقصودة منذ العصور القديمة.",
    description:
      "تعدّ الجزائر منابع ساخنة كثيرة، استُغلّ بعضها منذ العهد الروماني — ولا تزال حمّامات Aquae Flavianae بخنشلة شاهدة على ذلك. حمّامات، وحمّامات بخارية تقليدية، وأوقات راحة منظَّمة.",
    suitedFor: [
      "إقامة بطيئة، محورها الحمّام والراحة",
      "الموسم البارد، من أكتوبر إلى أفريل",
      "من يبحث عن إيقاع، لا عن برنامج",
    ],
    honestNote:
      "لا تُقدَّم هنا أيّ مياه معدنية على أنّها علاج لمرض: فمثل هذا الادّعاء يقتضي مصدرًا طبيًا رسميًا لا نملكه.",
  },
  "remise-en-forme": {
    name: "استعادة اللياقة والتمرين",
    claim: "أن تستأنف، أو ألّا تفقد شيئًا فحسب.",
    description:
      "حاجتان مختلفتان تحت سقف واحد. الاستئناف التدريجي، بتقييم انطلاق ورفع حمل مؤطَّر. أو الحفاظ على الإيقاع لمن يتمرّن أصلًا، مع دخول إلى القاعة وحوض سباحة.",
    suitedFor: [
      "استئناف بعد انقطاع طويل",
      "مواصلة التمرين أثناء العطلة",
      "العودة إلى الجهد بعد إجراء، متى صودق عليها",
    ],
    honestNote:
      "الاستئناف بعد إجراء طبي يُقرَّر مع الممارس الذي يتابعك، لا مع منصّة. نحن ننظّم الإطار، لا القرار.",
  },
  repos: {
    name: "الراحة والتجدّد",
    claim: "الصمت مورد، وهو نادر.",
    description:
      "أماكن يُنام فيها أفضل لأنّ المكان يهيّئ لذلك: هواء جافّ، وليالٍ باردة، وتلوّث ضوئي ضعيف، وضجيج قليل. ويوفّر وادي مزاب وواحات الجنوب ظروفًا يصعب أن تُوجد في مكان آخر.",
    suitedFor: [
      "عبء ذهني ينبغي تخفيفه",
      "نوم ينبغي استعادته",
      "انقطاع رقمي بمحض الإرادة",
    ],
    honestNote:
      "الراحة تساعد، وهي لا تعالج. وإن كان نومك أو حالتك يقلقانك، فتحدّث إلى مهني صحّة قبل السفر.",
  },
  evasion: {
    name: "السفر والهواء الطلق",
    claim: "من الطاسيلي إلى قمم القبائل.",
    description:
      "مشي، وتضاريس، وفضاءات واسعة. تغطّي الصحراء أكثر من ثمانية أعشار البلاد، ويصطفّ في الشمال كتل مشجّرة وحظائر وطنية تنحدر إلى البحر. إقامة يعمل فيها الجسد دون قاعة.",
    suitedFor: [
      "المشي عدّة ساعات في اليوم",
      "إقامة نشطة لا إقامة علاج",
      "اكتشاف مناظر قليلة الارتياد",
    ],
    honestNote:
      "الجنوب الكبير يُزار من أكتوبر إلى أفريل، بمرافقة منظَّمة. وفي الصيف تجعل الحرارة كلّ جهد غير مستحسن.",
  },
  soin: {
    name: "العلاج والوقاية",
    claim: "فحص، أو رأي، أو إجراء مبرمَج.",
    description:
      "الشقّ الطبي من الإقامة: فحص صحي شامل، واستشارة تخصّصية، وعلاج أسنان، ورأي ثانٍ في ملفّ قائم. منظَّم حول الراحة اللازمة، دون تعاقب بلا تنفّس.",
    suitedFor: [
      "أخذ صورة عن الحال في أيام قليلة",
      "إجراء مبرمَج، مع وقت للاستجمام في المكان",
      "رأي ثانٍ في ملفّ مكوَّن سلفًا",
    ],
    honestNote:
      "المنصّة تنظّم وتوجّه. وهي لا تضع أيّ تشخيص، ولا تصف شيئًا، ولا تفسّر أبدًا نتيجة تحليل أو تصوير.",
  },
};

/** Résumés des sites patrimoniaux : ils servent aussi de détail d'étape. */
export const AR_HERITAGE_SUMMARIES: Record<string, string> = {
  "casbah-alger":
    "المدينة العتيقة العثمانية بالجزائر، مبنيّة على شكل مدرّج فوق الخليج. متاهة من الأزقّة والممرّات المغطّاة والدور ذات الأفنية، ما تزال مأهولة.",
  tipasa:
    "موقع أثري قائم مباشرة على المتوسط، تتراكب فيه آثار بونية ورومانية ومسيحية أولى، في مواجهة البحر.",
  djemila:
    "كويكول القديمة، مدينة رومانية جبلية على ارتفاع 900 متر، لافتة بتكيّفها مع التضاريس بدل المخطّط الشبكي المعتاد.",
  timgad:
    "مستعمرة عسكرية أسّسها تراجان نحو سنة 100، كثيرًا ما تُذكر بوصفها أكمل نموذج محفوظ للتخطيط الروماني الشبكي.",
  "vallee-mzab":
    "خمس مدن محصَّنة بُنيت ابتداءً من القرن الحادي عشر في واد صحراوي. مجموعة كثيرًا ما تُذكر نموذجًا لعمارة متكيّفة مع الصحراء.",
  "tassili-najjer":
    "هضبة رملية في وسط الصحراء، تشتهر بآلاف الرسوم والنقوش الصخرية وبغاباتها الحجرية. موقع ثقافي وطبيعي في آن.",
  "qalaa-beni-hammad":
    "أوّل عاصمة للحمّاديين، أُسّست سنة 1007 ثم هُجرت. وتحتفظ أطلالها، على ارتفاع ألف متر، بأكبر مئذنة في الجزائر.",
  "mansourah-tlemcen":
    "آثار مدينة حصار من القرن الرابع عشر، تعلوها مئذنة بأربعين مترًا انهار أحد وجوهها، فبقي الهيكل مفتوحًا.",
  "hippone-annaba":
    "المدينة القديمة التي عاش فيها أوغسطين، وهي اليوم موقع أثري عند سفح الكاتدرائية التي تحمل اسمه، بإطلالة على الخليج.",
  "gorges-ghoufi":
    "أخدود في الأوراس يتشبّث فيه السكن الكهفي بالجدار الصخري، فوق واحة نخيل غائرة.",
  "gouraya-bejaia":
    "كتلة مشجّرة تنحدر إلى المتوسط، بخلجانها ورأسها وحصنها المشرف على الخليج.",
  "santa-cruz-oran":
    "قلعة إسبانية من القرن السادس عشر تعتلي جبل مرجاجو، ومنها يُطلّ على خليج وهران كلّه.",
};


/** Catégories d'établissement et vocabulaire commun des fiches. */
export const AR_TERMS: Record<string, string> = {
  "Identité juridique": "الهوية القانونية",
  Identité: "الهوية",
  Adresse: "العنوان",
  "Spécialités déclarées": "التخصّصات المصرَّح بها",
  "Spécialité déclarée": "التخصّص المصرَّح به",
  "Langues d'accueil": "لغات الاستقبال",
  "Équipe déclarée": "الفريق المصرَّح به",
  "Encadrement déclaré": "التأطير المصرَّح به",
  "Rattachement à l'établissement": "الانتماء إلى المؤسسة",
  "Informations déclarées par l'établissement, non encore contrôlées":
    "معلومات صرّحت بها المؤسسة، لم يجرِ التحقّق منها بعد",

  "Médecine interne": "الطبّ الداخلي",
  Cardiologie: "طبّ القلب",
  "Chirurgie dentaire": "جراحة الأسنان",
  "Chirurgie orthopédique": "جراحة العظام",
  Kinésithérapie: "العلاج الحركي",
  Neurologie: "طبّ الأعصاب",
  "Diététique et nutrition": "الحمية والتغذية",
  "Préparation physique": "التحضير البدني",
  Dermatologie: "طبّ الجلد",

  Arabe: "العربية",
  Français: "الفرنسية",
  Anglais: "الإنجليزية",
  Espagnol: "الإسبانية",
  Italien: "الإيطالية",
  Kabyle: "القبائلية",
  Allemand: "الألمانية",
  Tamazight: "الأمازيغية",
};
