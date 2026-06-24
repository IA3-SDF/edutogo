import { Calculator, Heart } from "lucide-react";
import React from "react";
import { Exercise } from "../../../types";

interface ExercicesTabProps {
  exercises: Exercise[];
  onSelectExercise: (exercise: Exercise) => void;
  favoriteExerciseIds?: Set<string>;
  onToggleFavorite?: (exerciseId: string) => Promise<void>;
}

export const ExercicesTab: React.FC<ExercicesTabProps> = ({
  exercises,
  onSelectExercise,
  favoriteExerciseIds = new Set(),
  onToggleFavorite,
}) => {
  return (
    <div className="space-y-6">
      {exercises.length > 0 ? (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Sélectionnez une carte d'étude ci-dessous pour ouvrir l'exercice
            correspondant de manière isolée et accéder à son corrigé de
            l'Inspection académique.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exercises.map((ex) => {
              const floatNum = parseFloat(ex.number) || 1.0;
              const difficultyStr =
                floatNum < 1.3
                  ? "Facile"
                  : floatNum < 1.6
                    ? "Intermédiaire"
                    : "Avancé";
              const difficultyColor =
                difficultyStr === "Facile"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-100/50 dark:border-emerald-900/30"
                  : difficultyStr === "Intermédiaire"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border border-amber-100/50 dark:border-amber-900/30"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 border border-rose-100/50 dark:border-rose-900/30";

              const hasSolution = !!ex.solution && ex.solution.trim().length > 0;
              const isFavorite = favoriteExerciseIds.has(ex.id);

              const handleFavoriteClick = async (e: React.MouseEvent) => {
                e.stopPropagation();
                if (onToggleFavorite) {
                  try {
                    await onToggleFavorite(ex.id);
                  } catch (err) {
                    console.error("[EduTogo] Erreur lors de la modification du favori:", err);
                  }
                }
              };

return (
  <div
    key={ex.id}
    onClick={() => onSelectExercise(ex)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelectExercise(ex);
      }
    }}
    className="text-left w-full cursor-pointer group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 hover:border-[#3B6E8F] dark:hover:border-indigo-500 hover:shadow-md dark:hover:shadow-indigo-950/10 transition-all duration-300 flex flex-col justify-between min-h-[148px]"
  >
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="text-[10px] font-mono tracking-wider font-bold text-[#3B6E8F] dark:text-indigo-400 bg-[#3B6E8F]/5 dark:bg-indigo-500/10 px-2.5 py-0.5 rounded-lg uppercase">
          Exercice {ex.number}
        </span>

        <button
          type="button"
          onClick={handleFavoriteClick}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          title={
            isFavorite
              ? "Retirer des favoris"
              : "Ajouter aux favoris"
          }
        >
          <Heart
            size={16}
            className={`${
              isFavorite
                ? "fill-rose-500 text-rose-500"
                : "text-gray-300 dark:text-slate-600 hover:text-rose-400"
            } transition-colors`}
          />
        </button>

        <span
          className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md ${difficultyColor}`}
        >
          {difficultyStr}
        </span>
      </div>

      <h4 className="font-display font-bold text-sm text-gray-800 dark:text-gray-100 group-hover:text-[#3B6E8F] dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
        {ex.title}
      </h4>

      <p className="text-[11px] text-[#7C8590] dark:text-[#94A3B8] mt-1.5 line-clamp-2 leading-relaxed">
        {ex.question
          .replace(/\$\$[\s\S]*?\$\$/g, " [Équation] ")
          .replace(/\$[\s\S]*?\$/g, " [Formule] ")
          .substring(0, 110)}
      </p>
    </div>

    <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/60 w-full">
      <div className="flex items-center gap-1.5 text-[10.5px]">
        <span
          className={`h-2 w-2 rounded-full ${
            hasSolution ? "bg-emerald-500" : "bg-amber-400"
          }`}
        />
        <span className="text-gray-500 dark:text-slate-400 font-medium">
          {hasSolution ? "Corrigé rédigé" : "Recherche libre"}
        </span>
      </div>

      <span className="text-[11px] font-bold text-[#3B6E8F] dark:text-indigo-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
        Consulter ➔
      </span>
    </div>
  </div>
);            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Calculator className="mx-auto h-12 w-12 text-gray-300 dark:text-slate-700 mb-3" />
          <p>Aucun exercice d'entraînement général disponible pour ce chapitre.</p>
        </div>
      )}
    </div>
  );
};