export interface IspitsModule {
  rank: number;
  name: string;
  description: string;
  semester: string; // S1, S2, S3, S4, S5, S6
  specialty: 'common' | 'nursing' | 'anesthesia' | 'midwifery' | 'health_tech' | 'rehab';
  popularity: string;
  pdf_file: string | null;
  pdf_parts?: string[];
  slug: string;
}

/** Derive a URL-safe slug from a module name. */
function ispitsSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['''"""]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const _RAW: Omit<IspitsModule, 'slug'>[] = [
  {
    rank: 1,
    name: "Introduction aux sciences infirmières",
    description: "Concepts fondamentaux, théories de soins, démarche de soins, démarche scientifique.",
    semester: "S1",
    specialty: "common",
    popularity: "97 %",
    pdf_file: null
  },
  {
    rank: 2,
    name: "Anatomie et Physiologie I",
    description: "Système locomoteur, cardio-vasculaire, respiratoire et digestif de l'être humain.",
    semester: "S1",
    specialty: "common",
    popularity: "96 %",
    pdf_file: null
  },
  {
    rank: 3,
    name: "Soins infirmiers de base",
    description: "Mesures d'hygiène, techniques d'asepsie, constantes vitales, pansements simples.",
    semester: "S1",
    specialty: "nursing",
    popularity: "95 %",
    pdf_file: null
  },
  {
    rank: 4,
    name: "Pharmacologie fondamentale et clinique",
    description: "Pharmacodynamie, pharmacocinétique, calcul de doses, surveillance thérapeutique, règles d'administration.",
    semester: "S2",
    specialty: "common",
    popularity: "94 %",
    pdf_file: null
  },
  {
    rank: 5,
    name: "Physiopathologie générale",
    description: "Mécanismes d'altération cellulaire, processus inflammatoire, immunitaire, infectieux et tumoral.",
    semester: "S2",
    specialty: "common",
    popularity: "90 %",
    pdf_file: null
  },
  {
    rank: 6,
    name: "Microbiologie, Parasitologie et Immunologie",
    description: "Bactéries, virus, champignons, parasites cliniques et principes des défenses immunitaires.",
    semester: "S1",
    specialty: "common",
    popularity: "89 %",
    pdf_file: null
  },
  {
    rank: 7,
    name: "Anesthésiologie générale et Pharmacie spécifique",
    description: "Agents anesthésiques, analgésiques, curares, matériel d'anesthésie et monitorage.",
    semester: "S3",
    specialty: "anesthesia",
    popularity: "88 %",
    pdf_file: null
  },
  {
    rank: 8,
    name: "Secourisme et Urgences Pré-hospitalières",
    description: "Gestes de premiers secours, réanimation cardio-pulmonaire (RCP), prise en charge des traumatismes.",
    semester: "S2",
    specialty: "common",
    popularity: "87 %",
    pdf_file: null
  },
  {
    rank: 9,
    name: "Soins infirmiers en Anesthésie Réanimation I",
    description: "Période pré-anesthésique, induction, entretien et réveil du patient opéré.",
    semester: "S3",
    specialty: "anesthesia",
    popularity: "86 %",
    pdf_file: null
  },
  {
    rank: 10,
    name: "Obstétrique et Physiologie de la Grossesse",
    description: "Suivi prénatal, développement fœtal, mécanique obstétricale, étapes de l'accouchement.",
    semester: "S3",
    specialty: "midwifery",
    popularity: "85 %",
    pdf_file: null
  },
  {
    rank: 11,
    name: "Pédiatrie et Néonatologie de base",
    description: "Croissance et développement de l'enfant, calendrier vaccinal, pathologies infantiles courantes.",
    semester: "S2",
    specialty: "common",
    popularity: "82 %",
    pdf_file: null
  },
  {
    rank: 12,
    name: "Pathologies Médicales et Chirurgicales I",
    description: "Sémiologie clinique et thérapeutique des appareils respiratoire, cardiovasculaire et digestif.",
    semester: "S3",
    specialty: "common",
    popularity: "80 %",
    pdf_file: null
  },
  {
    rank: 13,
    name: "Soins de Santé Primaires et Santé Communautaire",
    description: "Programmes nationaux de santé, centres de santé, éducation à la santé, hygiène et salubrité.",
    semester: "S4",
    specialty: "nursing",
    popularity: "78 %",
    pdf_file: null
  },
  {
    rank: 14,
    name: "Soins infirmiers en Médecine et Spécialités",
    description: "Démarche clinique infirmière auprès des patients atteints de pathologies chroniques et aiguës.",
    semester: "S3",
    specialty: "nursing",
    popularity: "77 %",
    pdf_file: null
  },
  {
    rank: 15,
    name: "Soins infirmiers en Chirurgie et Bloc Opératoire",
    description: "Préparation préopératoire, soins postopératoires, rôles de l'infirmier circulant et instrumentiste.",
    semester: "S4",
    specialty: "nursing",
    popularity: "76 %",
    pdf_file: null
  },
  {
    rank: 16,
    name: "Techniques de Radiologie Diagnostique",
    description: "Principes physiques des rayons X, radiologie conventionnelle, produits de contraste.",
    semester: "S3",
    specialty: "health_tech",
    popularity: "75 %",
    pdf_file: null
  },
  {
    rank: 17,
    name: "Hématologie et Biochimie Clinique",
    description: "Analyses de laboratoire, hémogramme, hémostase, marqueurs enzymatiques et métaboliques.",
    semester: "S3",
    specialty: "health_tech",
    popularity: "74 %",
    pdf_file: null
  },
  {
    rank: 18,
    name: "Épidémiologie et Santé Publique",
    description: "Méthodes épidémiologiques, indicateurs de santé, transition démographique, veille sanitaire.",
    semester: "S4",
    specialty: "common",
    popularity: "72 %",
    pdf_file: null
  },
  {
    rank: 19,
    name: "Éthique, Déontologie et Droit de la Santé",
    description: "Responsabilité médicale et infirmière, droits des patients, secret professionnel, serment professionnel.",
    semester: "S5",
    specialty: "common",
    popularity: "70 %",
    pdf_file: null
  },
  {
    rank: 20,
    name: "Psychiatrie et Santé Mentale",
    description: "Sémiologie des troubles psychiatriques, relation d'aide infirmière, traitements en santé mentale.",
    semester: "S4",
    specialty: "nursing",
    popularity: "68 %",
    pdf_file: null
  },
  {
    rank: 21,
    name: "Rééducation fonctionnelle et Kinésithérapie active",
    description: "Bilan articulaire et musculaire, techniques de mobilisation, kinésithérapie respiratoire.",
    semester: "S3",
    specialty: "rehab",
    popularity: "65 %",
    pdf_file: null
  },
  {
    rank: 22,
    name: "Soins infirmiers en Néphrologie et Dialyse",
    description: "Insuffisance rénale chronique, hémodialyse, dialyse péritonéale, soins infirmiers spécifiques.",
    semester: "S4",
    specialty: "nursing",
    popularity: "62 %",
    pdf_file: null
  },
  {
    rank: 23,
    name: "Soins d'Urgence et de Réanimation complexes",
    description: "Monitorage invasif, ventilation artificielle, états de choc, triage des polytraumatisés.",
    semester: "S5",
    specialty: "nursing",
    popularity: "60 %",
    pdf_file: null
  },
  {
    rank: 24,
    name: "Gestion des Services de Santé et Management",
    description: "Système de santé marocain, gestion d'équipe, planification sanitaire, qualité des soins.",
    semester: "S6",
    specialty: "common",
    popularity: "55 %",
    pdf_file: null
  },
  {
    rank: 25,
    name: "Méthodologie de Recherche et PFE",
    description: "Problématique, cadre conceptuel, recueil et analyse de données, rédaction du Projet de Fin d'Études.",
    semester: "S5",
    specialty: "common",
    popularity: "50 %",
    pdf_file: null
  }
];

export const ISPITS_MODULES: IspitsModule[] = _RAW.map(m => ({ ...m, slug: ispitsSlug(m.name) }));

/** O(1) lookup: slug → module */
export const ISPITS_MODULE_BY_SLUG: Record<string, IspitsModule> = Object.fromEntries(
  ISPITS_MODULES.map(m => [m.slug, m])
);
