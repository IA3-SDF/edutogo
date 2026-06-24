import { X } from "lucide-react";
import React from "react";
import { Exercise } from "../../../types";
import { DynamicExerciseCanvas } from "./DynamicExerciseCanvas";

interface ExerciseDetailDrawerProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export const ExerciseDetailDrawer: React.FC<ExerciseDetailDrawerProps> = ({
  exercise,
  onClose,
}) => {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl h-screen bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-slide-in-right border-l border-gray-200 dark:border-slate-800">
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] font-mono tracking-wider font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full uppercase">
              Fiche de résolution officielle
            </span>
            <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white mt-1">
              Exercice {exercise.number} - {exercise.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl transition cursor-pointer"
            title="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer contents */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin text-left">
          <DynamicExerciseCanvas
            id={exercise.id}
            number={exercise.number}
            title={exercise.title}
            question={exercise.question}
            hint={exercise.hint}
            solution={exercise.solution}
            category="exercice"
          />
        </div>

        {/* Drawer footer action */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer transition-colors"
          >
            Retour à la liste des exercices
          </button>
        </div>
      </div>
    </div>
  );
};