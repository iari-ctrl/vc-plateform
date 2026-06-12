// ── Interactive MCQ View Component ──────────────────────────────────────────
export interface ScenarioQuestion {
  id: string;
  dimensionId: string;
  q: string;
  hint: string;
  options: {
    text: string;
    explanation: string;
    profile: string;
  }[];
}

export const SCENARIOS: ScenarioQuestion[] = [
  {
    id: "sc-aime",
    dimensionId: "aime",
    q: "On vous propose de passer votre après-midi sur l'une des trois tâches suivantes. Laquelle choisissez-vous ?",
    hint: "Distingue votre intérêt pour le volume, l'analyse ou la rencontre humaine.",
    options: [
      {
        text: "Rencontrer un fondateur en pré-seed pour comprendre sa vision du marché et décortiquer sa thèse.",
        explanation: "Ce choix est typique de l'investisseur early-stage ou du mentor : vous privilégiez le contact humain et la confrontation d'idées brutes.",
        profile: "VC Early Stage / Mentor"
      },
      {
        text: "Auditer en profondeur les unit economics et le modèle de rétention d'une startup SaaS pendant 4 heures.",
        explanation: "Ce choix montre un profil d'analyse rigoureux et structuré : vous aimez le travail de due diligence et la validation par les chiffres.",
        profile: "Analyste / Auditeur"
      },
      {
        text: "Faire du sourcing à froid en épluchant 150 profils LinkedIn et newsletters sectorielles.",
        explanation: "Ce choix est typique du rôle d'exécution en fonds d'investissement (Analyst/Associate) : vous êtes orienté volume et rigueur dans le deal flow.",
        profile: "Analyste Deal Flow"
      }
    ]
  },
  {
    id: "sc-doue",
    dimensionId: "doue",
    q: "Quel est votre super-pouvoir ou votre posture naturelle dans une négociation serrée ?",
    hint: "Sépare l'approche financière, opérationnelle ou institutionnelle.",
    options: [
      {
        text: "Analyser et restructurer les clauses de liquidation préférentielle pour protéger les intérêts financiers.",
        explanation: "Vous êtes à l'aise avec la structuration financière et le compromis technique (typique des rôles de Principal / Partner en VC).",
        profile: "Investisseur VC / Deal Maker"
      },
      {
        text: "Trouver un compromis gagnant-gagnant pour préserver la relation de confiance avec le fondateur.",
        explanation: "Vous privilégiez l'accompagnement et la pérennité de la relation (typique de l'entrepreneur ou du mentor).",
        profile: "Entrepreneur / Mentor"
      },
      {
        text: "Rassurer les investisseurs et justifier que le deal respecte les contraintes institutionnelles.",
        explanation: "Vous excellez dans la communication de confiance et le respect des mandats (typique du responsable Relations Investisseurs).",
        profile: "Relations Investisseurs (IR)"
      }
    ]
  },
  {
    id: "sc-besoin",
    dimensionId: "besoin",
    q: "Selon vous, quelle est la faiblesse la plus critique de l'écosystème tech en France aujourd'hui ?",
    hint: "Permet de voir quel besoin macro-économique vous semble prioritaire.",
    options: [
      {
        text: "Le manque de fonds de capital-risque de taille massive (late-stage) pour éviter de dépendre des fonds US.",
        explanation: "Vous êtes sensible aux enjeux de souveraineté financière et d'attraction de capitaux LPs (sensibilité Relations Investisseurs / LPs).",
        profile: "Relations Investisseurs / LP Focus"
      },
      {
        text: "Le manque d'accompagnement post-investissement réellement utile aux fondateurs sur le go-to-market.",
        explanation: "Vous croyez que la valeur se crée dans l'exécution opérationnelle (sensibilité Opérateur / Startup Exec).",
        profile: "Startup Operator / Mentor"
      },
      {
        text: "La frilosité des investisseurs traditionnels sur l'amorçage technologique profond (deep tech / hardware).",
        explanation: "Vous croyez en la thèse d'investissement long terme et en la recherche de rupture (sensibilité Architecte de Thèse).",
        profile: "Architecte de Thèse (VC)"
      }
    ]
  },
  {
    id: "sc-remunere",
    dimensionId: "remunere",
    q: "Comment concevez-vous votre modèle de retour financier idéal à 10 ans ?",
    hint: "Distingue le carried interest, le salaire fixe avec bonus, ou les actions directes.",
    options: [
      {
        text: "Une part des profits importants (carried interest) indexée sur le succès exceptionnel d'un seul deal du fonds.",
        explanation: "Vous êtes parfaitement aligné avec la loi de puissance du capital-risque : vous acceptez le risque d'absence de gain pour maximiser l'upside (VC).",
        profile: "VC GP (Carried Interest)"
      },
      {
        text: "Un salaire fixe et des bonus de performance réguliers, basés sur le développement stable de la structure de gestion.",
        explanation: "Vous privilégiez la stabilité financière et la croissance structurée de l'organisation (typique des IR).",
        profile: "Relations Investisseurs / Management Fees"
      },
      {
        text: "De l'equity directe (capital) et des stock-options dans ma propre startup ou mes participations opérationnelles.",
        explanation: "Vous voulez être rémunéré pour votre création directe de valeur et votre travail quotidien (Entrepreneur / Opérateur).",
        profile: "Entrepreneur / Operator"
      }
    ]
  }
];
