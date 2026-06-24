import { Bookmark } from "lucide-react";
import React from "react";
import { Exercise } from "../../../types";
import { MathRenderer } from "../admin/MathRenderer";

interface SolutionsTabProps {
  exercises: Exercise[];
}

export const SolutionsTab: React.FC<SolutionsTabProps> = ({ exercises }) => {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Bookmark className="mx-auto h-12 w-12 text-gray-300 dark:text-slate-700 mb-3" />
        <p>Syllabus de corrigés en cours d'indexation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <p className="text-sm text-gray-500 mb-4">
        Retrouve ici les fiches de corrections officielles rédigées pour ce
        chapitre par l'inspection générale des mathématiques.
      </p>
      {exercises.map((ex) => (
        <div
          key={ex.id}
          className="border-b border-gray-100 dark:border-slate-700/60 pb-5 mb-5 last:border-0"
        >
          <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white mb-2">
            Corrigé officiel de l'exercice {ex.number} - {ex.title}
          </h4>
          <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-xl">
            <MathRenderer text={ex.solution} />
          </div>
        </div>
      ))}
    </div>
  );
};