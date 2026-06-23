/**
 * Relational database schema simulation matching Supabase definitions
 * for EduTogo - Togolese Educational Platform
 */

export interface Level {
  id: string; // e.g. "seconde", "premiere", "terminale"
  name: string; // e.g. "Seconde", "Première", "Terminale"
  description: string;
}

export interface Subject {
  id: string; // e.g. "maths", "physique", "svt"
  levelId: string; // Relational foreign key -> Level.id
  name: string; // e.g. "Mathématiques", "Physique-Chimie"
  icon: string; // Lucide icon name
  color: string; // Tailwind hex or class color
  progress: number; // e.g. percentage of chapters completed
  assets?: Asset[]; // Media assets linked at the subject level
}

export interface Chapter {
  id: string;
  subjectId: string; // Relational foreign key -> Subject.id
  levelId: string; // Relational foreign key -> Level.id
  number: number; // e.g. 1, 2, 5
  title: string; // e.g. "Probabilités"
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
  assets?: Asset[]; // Media assets uploaded under this chapter
}

export interface CourseSection {
  id: string;
  title: string;
  content: string; // Markdown / KaTeX with injected media
  order: number; // sequential placement index
}

export interface Course {
  id: string;
  chapterId: string; // Relational foreign key -> Chapter.id
  title: string;
  content: string; // Rich markdown-like formatting with LaTeX equations
  createdAt: string;
  sections?: CourseSection[]; // Ordered course sections mapping chapters
}

export interface Asset {
  id: string;
  name: string;
  type: "image" | "audio" | "video";
  url: string;
  size?: string;
  createdAt: string;
  storagePath?: string;
}

export interface Exercise {
  id: string;
  chapterId: string; // Relational foreign key -> Chapter.id
  number: string; // e.g. "1.1" or "5.1"
  title: string;
  question: string; // Text containing KaTeX formulas
  hint: string;
  solution: string; // Full step-by-step corrigé with KaTeX formulas
  category?: "activité" | "exercice"; // 'activité' (apprentissage) or 'exercice' (général)
}

export interface QuizQuestion {
  id: string;
  chapterId: string; // Relational foreign key -> Chapter.id
  quizGroupId?: string; // Optional grouping key for grouped quiz models
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizGroup {
  id: string;
  chapterId: string;
  title: string;
  createdAt: string;
  questions?: QuizQuestion[];
}

export interface Evaluation {
  id: string;
  levelId: string; // Relational foreign key -> Level.id
  subjectId: string; // Relational foreign key -> Subject.id
  title: string; // e.g. "DS N°1 - Semestre 1"
  type: "DS" | "Annale"; // DS or Bac Annales
  year?: string; // e.g. "2023"
  hasSubject: boolean;
  hasSolution: boolean;
  subjectUrl?: string;
  solutionUrl?: string;
}

// User Profile state
export interface UserProfile {
  fullName: string;
  role: "student" | "admin";
  classLevel: string; // e.g., "terminale", "premiere", "seconde"
  email: string;
  avatarUrl?: string;
  preferences: {
    notifications: boolean;
    offlineMode: boolean;
  };
}

export interface FavoriteRow {
  resource_id: string;
  resource_type: string;
  created_at: string;
}

export interface UserFavorite {
  resourceId: string;
  resourceType: string;
  createdAt: string;
}

// For DB relational state mock management
export interface DatabaseState {
  levels: Level[];
  subjects: Subject[];
  chapters: Chapter[];
  courses: Course[];
  exercises: Exercise[];
  quizzes: QuizQuestion[];
  quizGroups?: QuizGroup[];
  evaluations: Evaluation[];
}
