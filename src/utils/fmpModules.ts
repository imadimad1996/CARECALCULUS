export interface FmpModule {
  rank: number;
  name: string;
  description: string;
  year: string;
  popularity: string;
  pdf_file: string | null;
  pdf_parts?: string[];
  slug: string;
}

/** Derive a URL-safe slug from a module name (mirrors the app-wide slugify logic). */
function fmpSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['''"""]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const _RAW: Omit<FmpModule, 'slug'>[] = [
  {
    "rank": 1,
    "name": "Pharmacologie générale",
    "description": "Mécanismes d'action, classes médicamenteuses, posologie",
    "year": "3ème – S5",
    "popularity": "98 %",
    "pdf_file": "poly_pharmacologie_generale.pdf"
  },
  {
    "rank": 2,
    "name": "Urgences et Réanimation – Douleurs et Soins palliatifs",
    "description": "Urgences et Réanimation · Douleurs et Soins palliatifs",
    "year": "5ème – S9",
    "popularity": "96 %",
    "pdf_file": "21-02-10 lecon 01 - pronostic.pdf"
  },
  {
    "rank": 3,
    "name": "Pathologie cardiovasculaire",
    "description": "Cardiopathies, HTA, insuffisance cardiaque, ECG",
    "year": "3ème – S6",
    "popularity": "95 %",
    "pdf_file": "Chapitre2.pdf"
  },
  {
    "rank": 4,
    "name": "Maladies du système nerveux",
    "description": "Neurologie · Neurochirurgie",
    "year": "4ème – S7",
    "popularity": "93 %",
    "pdf_file": "martin_d._neurochirurgie-corpus_.pdf"
  },
  {
    "rank": 5,
    "name": "Gynécologie-Obstétrique",
    "description": "Gynécologie · Obstétrique",
    "year": "5ème – S10",
    "popularity": "92 %",
    "pdf_file": "fascicule_5_maj_2011gynobs.pdf"
  },
  {
    "rank": 6,
    "name": "Maladies de l'enfant",
    "description": "Pédiatrie · Chirurgie pédiatrique",
    "year": "4ème – S8",
    "popularity": "91 %",
    "pdf_file": "battisti_clinicalsurgery_soft.pdf"
  },
  {
    "rank": 7,
    "name": "Hématologie – Cancérologie",
    "description": "Hématologie · Cancérologie (oncologie)",
    "year": "4ème – S7",
    "popularity": "90 %",
    "pdf_file": "doc_attach_45610.pdf"
  },
  {
    "rank": 8,
    "name": "Pathologie respiratoire",
    "description": "Pneumologie, BPCO, asthme, tuberculose",
    "year": "3ème – S6",
    "popularity": "88 %",
    "pdf_file": "doc_attach_45610.pdf"
  },
  {
    "rank": 9,
    "name": "Santé Mentale",
    "description": "Psychiatrie, troubles mentaux, psychopathologie",
    "year": "5ème – S9",
    "popularity": "87 %",
    "pdf_file": "synthese_bilan-fdr-sante-mentale-psychiatrie.pdf"
  },
  {
    "rank": 10,
    "name": "Glandes endocrines – Peau",
    "description": "Endocrinologie · Dermatologie",
    "year": "4ème – S7",
    "popularity": "86 %",
    "pdf_file": "MANIFESTATIONS CUTANEES.pdf"
  },
  {
    "rank": 11,
    "name": "Appareil locomoteur",
    "description": "Rhumatologie · Traumatologie, orthopédie et réadaptation",
    "year": "4ème – S8",
    "popularity": "82 %",
    "pdf_file": null,
    "pdf_parts": [
      "livre iECN orthopédie traumatologie v2 - Partie 1.pdf",
      "livre iECN orthopédie traumatologie v2 - Partie 2.pdf",
      "livre iECN orthopédie traumatologie v2 - Partie 3.pdf"
    ]
  },
  {
    "rank": 12,
    "name": "Immunopathologie",
    "description": "Maladies systémiques et immunopathologie · Génétique",
    "year": "4ème – S8",
    "popularity": "80 %",
    "pdf_file": "CoursL2-L3_ImmunologieFondamentaleImmunopathologie-ASSIM2018.pdf"
  },
  {
    "rank": 13,
    "name": "Parasitologie-Mycologie & Maladies Infectieuses",
    "description": "Parasitologie-Mycologie · Maladies Infectieuses",
    "year": "3ème – S5",
    "popularity": "79 %",
    "pdf_file": "Polycopie_Parasito-Myco_2006-2007.pdf"
  },
  {
    "rank": 14,
    "name": "Pathologie de l'appareil digestif",
    "description": "Gastro-entérologie, hépatologie, chirurgie digestive",
    "year": "3ème – S6",
    "popularity": "78 %",
    "pdf_file": "chap-1_fondamentaux-pathologie-digestive_octobre-2014.pdf"
  },
  {
    "rank": 15,
    "name": "Néphrologie-Urologie",
    "description": "Néphrologie · Urologie",
    "year": "5ème – S10",
    "popularity": "76 %",
    "pdf_file": "cours.pdf"
  },
  {
    "rank": 16,
    "name": "OTO-RHINO-LARYNGOLOGIE / OPHTALMOLOGIE",
    "description": "ORL, chirurgie de la tête et du cou, ophtalmologie",
    "year": "5ème – S10",
    "popularity": "74 %",
    "pdf_file": "cahier-module-m1-3_25-26.pdf"
  },
  {
    "rank": 17,
    "name": "Raisonnement Clinique & Synthèse Thérapeutique",
    "description": "Démarche diagnostique, thérapeutique",
    "year": "5ème – S9",
    "popularity": "72 %",
    "pdf_file": "17055854301569.pdf"
  },
  {
    "rank": 18,
    "name": "Anatomie pathologique générale",
    "description": "Histopathologie, lésions élémentaires",
    "year": "3ème – S5",
    "popularity": "70 %",
    "pdf_file": "poly-anatomie-pathologique.pdf"
  },
  {
    "rank": 19,
    "name": "Anatomie Pathologique spéciale",
    "description": "Pathologies d'organes spécifiques",
    "year": "4ème – S7",
    "popularity": "68 %",
    "pdf_file": "17_Anatomie pathologique speciale.pdf"
  },
  {
    "rank": 20,
    "name": "Imagerie médicale",
    "description": "Radiologie, scanner, IRM, échographie",
    "year": "3ème – S5",
    "popularity": "67 %",
    "pdf_file": "imagerie_medicale.pdf"
  },
  {
    "rank": 21,
    "name": "Bactériologie – Virologie – Immunologie",
    "description": "Bactériologie · Virologie · Immunologie",
    "year": "2ème – S3",
    "popularity": "64 %",
    "pdf_file": "3695-Maitrise-en-virologie-et-immunologie-1.pdf"
  },
  {
    "rank": 22,
    "name": "Physiologie I",
    "description": "Bases de physiologie humaine",
    "year": "2ème – S3",
    "popularity": "62 %",
    "pdf_file": "Introduction à la physiologie humaine.pdf"
  },
  {
    "rank": 23,
    "name": "Physiologie II",
    "description": "Physiologie des systèmes",
    "year": "2ème – S4",
    "popularity": "61 %",
    "pdf_file": "13_Physiologie 2.pdf"
  },
  {
    "rank": 24,
    "name": "Anatomie I",
    "description": "Bases d'anatomie humaine",
    "year": "1ère – S1",
    "popularity": "60 %",
    "pdf_file": "Cahier-Galien-Lille-Anatomie-Generale-Cours-1.pdf"
  },
  {
    "rank": 25,
    "name": "Anatomie II",
    "description": "Anatomie des membres et thorax",
    "year": "1ère – S2",
    "popularity": "59 %",
    "pdf_file": "Descritptif-du-module-Anatomie-II.pdf"
  },
  {
    "rank": 26,
    "name": "Anatomie III",
    "description": "Anatomie de l'abdomen et pelvis",
    "year": "2ème – S3",
    "popularity": "58 %",
    "pdf_file": "5b3e4197a8092.pdf"
  },
  {
    "rank": 27,
    "name": "Anatomie IV",
    "description": "Neuroanatomie, tête et cou",
    "year": "2ème – S4",
    "popularity": "57 %",
    "pdf_file": "Descritptif-du-module-Anatomie-IV-.pdf"
  },
  {
    "rank": 28,
    "name": "Biochimie-Chimie",
    "description": "Chimie · Biochimie structurale · Biochimie métabolique",
    "year": "1ère – S1",
    "popularity": "56 %",
    "pdf_file": "Cours introductif biochimie_Med2.pdf"
  },
  {
    "rank": 29,
    "name": "Biochimie clinique",
    "description": "Biochimie appliquée au diagnostic",
    "year": "2ème – S4",
    "popularity": "55 %",
    "pdf_file": "GES- site MS.pdf"
  },
  {
    "rank": 30,
    "name": "Sémiologie I",
    "description": "Interrogatoire, examen clinique, séméiologie générale",
    "year": "2ème – S3",
    "popularity": "54 %",
    "pdf_file": "poly-semiologie.pdf"
  },
  {
    "rank": 31,
    "name": "Sémiologie II",
    "description": "Séméiologie des différents appareils",
    "year": "2ème – S4",
    "popularity": "53 %",
    "pdf_file": "poly-semiologie.pdf"
  },
  {
    "rank": 32,
    "name": "Hématologie fondamentale",
    "description": "Hématopoïèse, cytologie sanguine",
    "year": "2ème – S4",
    "popularity": "52 %",
    "pdf_file": "140-421-SH_H2026_JFL16_jan.pdf"
  },
  {
    "rank": 33,
    "name": "Médecine légale et médecine du travail – Éthique et Déontologie",
    "description": "Médecine légale · Éthique et déontologie",
    "year": "5ème – S10",
    "popularity": "51 %",
    "pdf_file": "arrete_code_deont_med_fr.pdf"
  },
  {
    "rank": 34,
    "name": "Histologie – Embryologie I",
    "description": "Histologie des tissus, embryologie générale",
    "year": "1ère – S2",
    "popularity": "50 %",
    "pdf_file": "poly-histologie-et-embryologie-medicales.pdf"
  },
  {
    "rank": 35,
    "name": "Histologie – Embryologie II",
    "description": "Histologie des organes, embryologie spéciale",
    "year": "2ème – S3",
    "popularity": "49 %",
    "pdf_file": "06_Histologie - Embryologie 2.pdf"
  },
  {
    "rank": 36,
    "name": "Biologie et génétique fondamentale",
    "description": "Biologie cellulaire · Génétique fondamentale",
    "year": "1ère – S1",
    "popularity": "44 %",
    "pdf_file": "COURS GENETIQUE PDF.pdf"
  },
  {
    "rank": 37,
    "name": "Biophysique",
    "description": "Bases physiques de la médecine, optique, électricité",
    "year": "1ère – S2",
    "popularity": "42 %",
    "pdf_file": "Cours_Biophysique_Beldjilali.pdf"
  },
  {
    "rank": 38,
    "name": "Médecine Sociale, Santé Publique et Économie de la Santé",
    "description": "Santé communautaire · Informatique médicale",
    "year": "5ème – S9",
    "popularity": "40 %",
    "pdf_file": "seguin_mso_6039.pdf"
  },
  {
    "rank": 39,
    "name": "Santé publique",
    "description": "Médecine communautaire · Biostatistiques",
    "year": "1ère – S1",
    "popularity": "38 %",
    "pdf_file": "biostatistique_brochure.pdf"
  },
  {
    "rank": 40,
    "name": "Secourisme et médecine expérimentale",
    "description": "Secourisme · Médecine expérimentale",
    "year": "2ème – S3",
    "popularity": "36 %",
    "pdf_file": "GES- site MS.pdf"
  },
  {
    "rank": 41,
    "name": "Histoire de la Médecine et psycho-sociologie",
    "description": "Histoire de la Médecine · Psycho-sociologie",
    "year": "1ère – S2",
    "popularity": "34 %",
    "pdf_file": "Histoire de la médecine.pdf"
  },
  {
    "rank": 42,
    "name": "Communication et langues",
    "description": "TICE · Anglais médical",
    "year": "1ère – S1",
    "popularity": "30 %",
    "pdf_file": "cours sur la terminologie medicale.pdf"
  },
  {
    "rank": 43,
    "name": "Méthodes d'apprentissage et terminologie",
    "description": "Méthodes d'apprentissage · Terminologie médicale",
    "year": "1ère – S1",
    "popularity": "28 %",
    "pdf_file": "cours sur la terminologie medicale.pdf"
  },
  {
    "rank": 44,
    "name": "Techniques de communication",
    "description": "Communication professionnelle · Communication scientifique",
    "year": "1ère – S2",
    "popularity": "25 %",
    "pdf_file": "cours sur la terminologie medicale.pdf"
  },
  {
    "rank": 45,
    "name": "Stage d'immersion (1ère et 2ème année)",
    "description": "Stage en milieu hospitalier ou communautaire",
    "year": "2ème – S4",
    "popularity": "20 %",
    "pdf_file": "m1.pdf"
  }
];

export const FMP_MODULES: FmpModule[] = _RAW.map(m => ({ ...m, slug: fmpSlug(m.name) }));

/** O(1) lookup: slug → module */
export const FMP_MODULE_BY_SLUG: Record<string, FmpModule> = Object.fromEntries(
  FMP_MODULES.map(m => [m.slug, m])
);
