// Types partagés du dashboard
import { Evaluation, Exercise, QuizQuestion } from "../../../types";

export type ModalType =
  | "addLevel"
  | "editLevel"
  | "deleteLevel"
  | "addSubject"
  | "editSubject"
  | "deleteSubject"
  | "addChapter"
  | "editChapter"
  | "deleteChapter"
  | "addCourse"
  | "editCourseContent"
  | "deleteCourse"
  | "addSection"
  | "editSection"
  | "deleteSection"
  | "addExercise"
  | "deleteExercise"
  | "addQuiz"
  | "deleteQuiz"
  | "addQuizGroup"
  | "addEvaluation"
  | "deleteEvaluation"
  | null;

export interface ModalState {
  type: ModalType;
  draftTitle?: string;
  draftContent?: string;
  draftId?: string;
  draftNum?: string;
  draftCategory?: "activité" | "exercice";
  draftQuestion?: string;
  draftHint?: string;
  draftSolution?: string;
  draftExplanation?: string;
  draftCorrectIndex?: number;
  draftOptions?: string[];
  draftQuizGroupId?: string;
  draftEvalType?: "DS" | "Annale";
  draftEvalYear?: string;
  draftSubjectUrl?: string;
  draftSolutionUrl?: string;
  chapterId?: string;
  exercise?: Exercise;
  quiz?: QuizQuestion;
  evaluation?: Evaluation;
}

export interface PriorityItems {
  missingExercises: Exercise[];
  missingEvaluations: Evaluation[];
  stats: {
    missingCount: number;
    missingEvalCount: number;
    courseOk: number;
  };
}