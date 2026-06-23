/*import { DatabaseState, UserProfile } from "../types";

export const INITIAL_USER: UserProfile = {
  fullName: "Koffi Amen",
  role: "student",
  classLevel: "terminale",
  email: "koffi.amen@education.tg",
  preferences: {
    notifications: true,
    offlineMode: false,
  },
};

export const INITIAL_DATABASE: DatabaseState = {
  levels: [
    {
      id: "seconde",
      name: "Seconde",
      description: "Classe de Seconde - Transition lycée",
    },
    {
      id: "premiere",
      name: "Première",
      description: "Classe de Première - Épreuves du premier bac",
    },
    {
      id: "terminale",
      name: "Terminale",
      description: "Classe de Terminale - Année du Baccalauréat",
    },
  ],
  subjects: [
    {
      id: "maths-terminale",
      levelId: "terminale",
      name: "Mathématiques",
      icon: "Calculator",
      color: "blue",
      progress: 65,
    },
    {
      id: "physique-terminale",
      levelId: "terminale",
      name: "Physique-Chimie",
      icon: "Flame",
      color: "indigo",
      progress: 40,
    },
    {
      id: "svt-terminale",
      levelId: "terminale",
      name: "SVT",
      icon: "Leaf",
      color: "green",
      progress: 50,
    },
    {
      id: "philo-terminale",
      levelId: "terminale",
      name: "Philosophie",
      icon: "BookOpen",
      color: "purple",
      progress: 30,
    },
    {
      id: "francais-terminale",
      levelId: "terminale",
      name: "Français",
      icon: "PenTool",
      color: "rose",
      progress: 80,
    },
    {
      id: "hg-terminale",
      levelId: "terminale",
      name: "Histoire-Géo",
      icon: "Globe",
      color: "amber",
      progress: 45,
    },
    {
      id: "anglais-terminale",
      levelId: "terminale",
      name: "Anglais",
      icon: "Languages",
      color: "teal",
      progress: 70,
    },

    // Maths and other subjects for other levels
    {
      id: "maths-premiere",
      levelId: "premiere",
      name: "Mathématiques",
      icon: "Calculator",
      color: "blue",
      progress: 0,
    },
    {
      id: "physique-premiere",
      levelId: "premiere",
      name: "Physique-Chimie",
      icon: "Flame",
      color: "indigo",
      progress: 0,
    },
    {
      id: "maths-seconde",
      levelId: "seconde",
      name: "Mathématiques",
      icon: "Calculator",
      color: "blue",
      progress: 0,
    },
  ],
  chapters: [
    {
      id: "chap-suites",
      subjectId: "maths-terminale",
      levelId: "terminale",
      number: 1,
      title: "Suites Numériques",
      description:
        "Suites arithmétiques, géométriques, convergence, théorème de la limite monotone.",
      isCompleted: true,
      isLocked: false,
    },
    {
      id: "chap-limites",
      subjectId: "maths-terminale",
      levelId: "terminale",
      number: 2,
      title: "Limites et Continuité",
      description:
        "Limites de fonctions, étude des asymptotes, théorème des valeurs intermédiaires.",
      isCompleted: true,
      isLocked: false,
    },
    {
      id: "chap-derivabilite",
      subjectId: "maths-terminale",
      levelId: "terminale",
      number: 3,
      title: "Dérivabilité et Étude de fonctions",
      description:
        "Théorème de Rolle, accroissements finis, dérivées successives et convexité.",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "chap-expo",
      subjectId: "maths-terminale",
      levelId: "terminale",
      number: 4,
      title: "Fonction Exponentielle",
      description:
        "Propriétés algébriques, limites remarquables, équations de croissance comparée.",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "chap-probabilites",
      subjectId: "maths-terminale",
      levelId: "terminale",
      number: 5,
      title: "Probabilités",
      description:
        "Maîtrisez les concepts fondamentaux du calcul des probabilités, variables aléatoires et loi binomiale.",
      isCompleted: false,
      isLocked: false,
    },
    {
      id: "chap-geometrie",
      subjectId: "maths-terminale",
      levelId: "terminale",
      number: 6,
      title: "Géométrie dans l'Espace",
      description:
        "Vecteurs, droites et plans de l'espace, produit scalaire, équation d'un plan.",
      isCompleted: false,
      isLocked: true,
    },
  ],
  courses: [
    {
      id: "course-proba",
      chapterId: "chap-probabilites",
      title: "Probabilités Conditionnelles et Indépendance",
      content: `### 1. Rappels et Définitions

Un univers $$\\Omega$$ représente l'ensemble de tous les résultats possibles d'une expérience aléatoire. Un événement $$A$$ est un sous-ensemble de $$\\Omega$$.

La probabilité $$P$$ d'un événement possède les propriétés fondamentales suivantes:
- $$0 \\le P(A) \\le 1$$ pour tout événement $$A$$
- $$P(\\Omega) = 1$$
- Pour deux événements disjoints $$A$$ et $$B$$ (c'est-à-dire $$A \\cap B = \\emptyset$$), nous avons la relation d'union :
  $$P(A \\cup B) = P(A) + P(B)$$
  
Dans le cas général (disjoints ou non) :
  $$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$`,
      sections: [
        {
          id: "sect-proba-1",
          title: "Introduction et Rappels généraux",
          content: `### 1. Rappels et Définitions

Un univers $$\\Omega$$ représente l'ensemble de tous les résultats possibles d'une expérience aléatoire. Un événement $$A$$ est un sous-ensemble de $$\\Omega$$.

La probabilité $$P$$ d'un événement possède les propriétés fondamentales suivantes:
- $$0 \\le P(A) \\le 1$$ pour tout événement $$A$$
- $$P(\\Omega) = 1$$
- Pour deux événements disjoints $$A$$ et $$B$$ (c'est-à-dire $$A \\cap B = \\emptyset$$), nous avons la relation d'union :
  $$P(A \\cup B) = P(A) + P(B)$$
  
Dans le cas général (disjoints ou non) :
  $$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$`,
          order: 1,
        },
        {
          id: "sect-proba-2",
          title: "Probabilités Conditionnelles",
          content: `### 2. Probabilités Conditionnelles

Soit $$A$$ et $$B$$ deux événements de $$\\Omega$$ avec $$P(A) \\neq 0$$. La probabilité conditionnelle de $$B$$ sachant $$A$$, notée $$P_A(B)$$, est la probabilité que $$B$$ se réalise sachant que l'événement $$A$$ est déjà réalisé. Elle se calcule par :

$$P_A(B) = \\frac{P(A \\cap B)}{P(A)} \\quad \\text{avec } P(A) \\neq 0$$

On en déduit la **formule des probabilités composées** :
$$P(A \\cap B) = P(A) \\times P_A(B)$$`,
          order: 2,
        },
        {
          id: "sect-proba-3",
          title: "Indépendance de deux événements",
          content: `### 3. Indépendance de deux événements

Deux événements $$A$$ et $$B$$ sont dits **indépendants** si et seulement si la réalisation de l'un n'affecte pas la réalisation de l'autre, ce qui mathématiquement s'écrit par :

$$P(A \\cap B) = P(A) \\times P(B)$$

Si $$P(A) \\neq 0$$, cela équivaut à dire que $$P_A(B) = P(B)$$.`,
          order: 3,
        },
      ],
      createdAt: "2026-05-12T10:00:00Z",
    },
    {
      id: "course-suites",
      chapterId: "chap-suites",
      title: "Suites Arithmético-Géométriques et Limites",
      content: `### 1. Rappels de Première

Une suite $$(u_n)_{n\\in\\mathbb{N}}$$ est arithmétique de raison $$r$$ si :
$$u_{n+1} = u_n + r$$ pour tout $$n \\in \\mathbb{N}$$

Une suite $$(v_n)_{n\\in\\mathbb{N}}$$ est géométrique de raison $$q$$ si :
$$v_{n+1} = q \\times v_n$$ pour tout $$n \\in \\mathbb{N}$$`,
      sections: [
        {
          id: "sect-suites-1",
          title: "Rappels sur les Suites (Arithmétiques & Géométriques)",
          content: `### 1. Rappels de Première

Une suite $$(u_n)_{n\\in\\mathbb{N}}$$ est arithmétique de raison $$r$$ si :
$$u_{n+1} = u_n + r$$ pour tout $$n \\in \\mathbb{N}$$

Une suite $$(v_n)_{n\\in\\mathbb{N}}$$ est géométrique de raison $$q$$ si :
$$v_{n+1} = q \\times v_n$$ pour tout $$n \\in \\mathbb{N}$$`,
          order: 1,
        },
        {
          id: "sect-suites-2",
          title: "Théorèmes Clés de Convergence",
          content: `### 2. Théorèmes de Convergence

- **Théorème de la Limite Monotone** :
  Toute suite numérique croissante et majorée converge vers une limite réelle $$L$$.
  De même, toute suite décroissante et minorée converge.

- **Théorème des Gendarmes** :
  Si pour tout $$n \\ge n_0$$ nous avons :
  $$v_n \\le u_n \\le w_n$$ et $$\\lim_{n \\to +\\infty} v_n = \\lim_{n \\to +\\infty} w_n = L$$,
  alors la suite $$(u_n)$$ converge également et sa limite est $$L$$:
  $$\\lim_{n \\to +\\infty} u_n = L$$`,
          order: 2,
        },
      ],
      createdAt: "2026-05-01T09:00:00Z",
    },
  ],
  exercises: [
    {
      id: "ex-proba-1",
      chapterId: "chap-probabilites",
      number: "1.1",
      title: "Lancer de Dé Équilibré",
      question:
        "Un dé équilibré à 6 faces est lancé. Soit $$A$$ l'événement « Obtenir un nombre pair » et $$B$$ l'événement « Obtenir un multiple de 3 ».\\nCalculer la probabilité d'intersection $$P(A \\cap B)$$ et vérifier s'ils sont indépendants.",
      hint: "Identifiez d'abord l'univers $$\\Omega = \\{1, 2, 3, 4, 5, 6\\}$$, puis dressez la liste des éléments des sous-ensembles $$A$$ et $$B$$. Examinez l'intersection $$A \\cap B$$.",
      solution:
        "1. L'univers comporte 6 issues équiprobables : $$\\Omega = \\{1, 2, 3, 4, 5, 6\\}$$.\\n2. Les événements sont :\\n   - $$A = \\{2, 4, 6\\}$$ donc $$P(A) = \\frac{3}{6} = 0,5$$\\n   - $$B = \\{3, 6\\}$$ donc $$P(B) = \\frac{2}{6} = \\frac{1}{3} \\approx 0.333$$\\n3. L'intersection est $$A \\cap B = \\{6\\}$$.\\n   La probabilité de l'intersection est ainsi : $$P(A \\cap B) = \\frac{1}{6}$$.\\n4. Test d'indépendance :\\n   Calculons $$P(A) \\times P(B) = 0,5 \\times \\frac{1}{3} = \\frac{1}{6}$$.\\n   Puisque $$P(A \\cap B) = P(A) \\times P(B)$$ (les deux valent $$\\frac{1}{6}$$), les événements $$A$$ et $$B$$ sont **strictement indépendants**.",
    },
    {
      id: "ex-proba-2",
      chapterId: "chap-probabilites",
      number: "1.2",
      title: "Urne de Lomé",
      question:
        "Une urne contient 4 boules rouges et 6 boules vertes. On tire successivement et sans remise deux boules de l'urne. Quelle est la probabilité de tirer deux boules de même couleur ?",
      hint: "Utilisez un arbre pondéré de probabilités conditionnelles. Les boules diminuent au deuxième tirage (sans remise).",
      solution:
        "Définissons les événements :\\n- $$R_1$$ : « Première boule rouge »\\n- $$R_2$$ : « Deuxième boule rouge »\\n- $$V_1$$ : « Première boule verte »\\n- $$V_2$$ : « Deuxième boule verte »\\n\\n1. Probabilités au premier tirage :\\n   - $$P(R_1) = \\frac{4}{10}$$\\n   - $$P(V_1) = \\frac{6}{10}$$\\n\\n2. Probabilités conditionnelles au second tirage :\\n   - Tirer une rouge sachant qu'on a déjà tiré une rouge : $$P_{R_1}(R_2) = \\frac{3}{9}$$\\n   - Tirer une verte sachant qu'on a tiré une rouge : $$P_{R_1}(V_2) = \\frac{6}{9}$$\\n   - Tirer une rouge sachant qu'on a tiré une verte : $$P_{V_1}(R_2) = \\frac{4}{9}$$\\n   - Tirer une verte sachant qu'on a tiré une verte : $$P_{V_1}(V_2) = \\frac{5}{9}$Ref\\n\\n3. Les deux boules sont de même couleur si on tire (Rouge puis Rouge) ou (Verte puis Verte) :\\n   - Probabilité (Rouge, Rouge) : $$P(R_1 \\cap R_2) = P(R_1) \\times P_{R_1}(R_2) = \\frac{4}{10} \\times \\frac{3}{9} = \\frac{12}{90}$$\\n   - Probabilité (Verte, Verte) : $$P(V_1 \\cap V_2) = P(V_1) \\times P_{V_1}(V_2) = \\frac{6}{10} \\times \\frac{5}{9} = \\frac{30}{90}$$\\n\\n4. D'où la probabilité finale recherchée :\\n   $$P(\\text{Même couleur}) = P(R_1 \\cap R_2) + P(V_1 \\cap V_2) = \\frac{12}{90} + \\frac{30}{90} = \\frac{42}{90} = \\frac{7}{15} \\approx 0,467$$",
    },
    {
      id: "ex-suites-1",
      chapterId: "chap-suites",
      number: "1.1",
      title: "Récurrence de convergence",
      question:
        "Soit $$(u_n)$$ la suite définie par $$u_0 = 1$$ et pour tout $$n \\in \\mathbb{N}$$, $$u_{n+1} = \\sqrt{2 + u_n}$$. \\nDémontrer par récurrence que pour tout $$n \\in \\mathbb{N}$$, $$0 < u_n < 2$$.",
      hint: "Initialisez au rang $$n=0$$. Pour l'hérédité, appliquez la fonction croissante de racine carrée à l'inégalité supposée.",
      solution:
        "Démontrons par récurrence la propriété $$P(n) : 0 < u_n < 2$$.\\n\\n1. **Initialisation** : Pou $$n = 0$$, we have $$u_0 = 1$$. Or, $$0 < 1 < 2$$ est vrai, donc $$P(0)$$ est établie.\\n\\n2. **Hérédité** : Supposons la propriété vraie à un rang $$n \\ge 0$$ quelconque, i.e. $$0 < u_n < 2$$.\\n   Montrons que $$0 < u_{n+1} < 2$$ :\\n   Puisque $$0 < u_n < 2$$, ajoutons 2 aux membres :\\n   $$2 < 2 + u_n < 4$$\\n   Comme la fonction racine carrée est strictement croissante sur $$\\mathbb{R}^+$$, on applique :\\n   $$\\sqrt{2} < \\sqrt{2 + u_n} < \\sqrt{4}$$\\n   Or, $$\\sqrt{2} > 0$$ et $$\\sqrt{4} = 2$$. Ainsi, on en déduit :\\n   $$0 < u_{n+1} < 2$$\\n   La propriété est donc héréditaire.\\n\\n3. **Conclusion** : d'après le principe de récurrence, pour tout entier $$n \\in \\mathbb{N}$$, $$0 < u_n < 2$$.",
    },
    {
      id: "ex-suites-2",
      chapterId: "chap-suites",
      number: "1.2",
      title: "Seuil du Lac de Grand-Popo",
      question:
        "Une station environnementale estime que la quantité de sel journalière d'une suite obéit de manière asymptotique à $$v_{n+1} = 0.8 v_n + 15$$. \\nRédigez l'algorithme sous forme récurrente pour évaluer le seuil limite où $$v_n$$ dépasse $$73$$.",
      hint: "Identifiez que le point de convergence fixe est solution de $$L = 0.8 L + 15$$.",
      solution: "",
    },
  ],
  quizzes: [
    {
      id: "q-proba-1",
      chapterId: "chap-probabilites",
      question:
        "Si deux événements A et B sont incompatibles (disjoints), le sont-ils pour autant indépendants en général (avec P(A) > 0 et P(B) > 0) ?",
      options: [
        "Oui, l'incompatibilité implique toujours l'indépendance",
        "Non, ils ne peuvent jamais être indépendants car si l'un se produit, la probabilité que l'autre se produise devient nulle !",
        "Cela dépend de la taille de l'univers d'étude",
        "Seulement si l'un des deux événements est l'univers Omega",
      ],
      correctIndex: 1,
      explanation:
        "Par définition, incompatibles signifie que $P(A \\cap B) = 0$. Si de plus $P(A) > 0$ et $P(B) > 0$, alors $P(A) \\times P(B) \\neq 0$. Ainsi, $P(A \\cap B) \\neq P(A) \\times P(B)$. Donc ils ne peuvent absolument pas être indépendants. Si l'un se produit, il exclut totalement l'autre !",
    },
    {
      id: "q-proba-2",
      chapterId: "chap-probabilites",
      question:
        "Soit P(A) = 0.6, P(B) = 0.3 et P_A(B) = 0.4. Quelle est la valeur exacte de l'intersection P(A ∩ B) ?",
      options: ["0.18", "0.24", "0.12", "0.72"],
      correctIndex: 1,
      explanation:
        "En appliquant la formule élémentaire des probabilités composées : $P(A \\cap B) = P(A) \\times P_A(B) = 0.6 \\times 0.4 = 0.24$.",
    },
    {
      id: "q-suites-1",
      chapterId: "chap-suites",
      question:
        "Soit la suite géométrique de terme général u_n = 5 * (1.2)^n . Quel est son comportement de convergence quand n tend vers +∞ ?",
      options: [
        "Elle converge vers 5",
        "Elle converge vers 0",
        "Elle diverge vers +∞ car sa raison 1.2 est supérieure à 1",
        "Elle oscille indéfiniment sans limite",
      ],
      correctIndex: 2,
      explanation:
        "Puisque la raison q = 1.2 est strictement supérieure à 1, la limite géométrique correspondante est divergente vers +∞.",
    },
    {
      id: "q-suites-2",
      chapterId: "chap-suites",
      question:
        "Si une suite numérique u_n est croissante et majorée par 4, que peut-on affirmer de sa limite L ?",
      options: [
        "Sa limite L est obligatoirement égale à 4",
        "Elle converge et sa limite L satisfait l'inégalité : L ≤ 4",
        "Elle diverge car elle est limitée",
        "Ses termes oscillent nécessairement",
      ],
      correctIndex: 1,
      explanation:
        "D'après le Théorème de la Limite Monotone, la suite converge vers une limite réelle L. Le fait qu'elle soit majorée par 4 garantit par passage à la limite que L ≤ 4 (mais pas nécessairement égale à 4).",
    },
  ],
  evaluations: [
    {
      id: "ds-1",
      levelId: "terminale",
      subjectId: "maths-terminale",
      title: "DS N°1 - Semestre 1",
      type: "DS",
      hasSubject: true,
      hasSolution: true,
    },
    {
      id: "ds-2",
      levelId: "terminale",
      subjectId: "maths-terminale",
      title: "DS N°2 - Semestre 1",
      type: "DS",
      hasSubject: true,
      hasSolution: true,
    },
    {
      id: "bac-2023",
      levelId: "terminale",
      subjectId: "maths-terminale",
      title: "Bac Togo - Session 2023",
      type: "Annale",
      year: "2023",
      hasSubject: true,
      hasSolution: true,
    },
    {
      id: "bac-2022",
      levelId: "terminale",
      subjectId: "maths-terminale",
      title: "Bac Togo - Session 2022",
      type: "Annale",
      year: "2022",
      hasSubject: true,
      hasSolution: false,
    },
    {
      id: "bac-2021",
      levelId: "terminale",
      subjectId: "maths-terminale",
      title: "Bac Togo - Session 2021",
      type: "Annale",
      year: "2021",
      hasSubject: true,
      hasSolution: true,
    },
  ],
};*/
