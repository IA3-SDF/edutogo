import React, { useState } from "react";
import { MathRenderer } from "./MathRenderer";
import {
  Eye,
  CheckCircle2,
  FileText,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

interface DynamicExerciseCanvasProps {
  id: string;
  number?: string;
  title: string;
  question: string;
  hint?: string;
  solution: string;
  category?: "activité" | "exercice";
}

export const DynamicExerciseCanvas: React.FC<DynamicExerciseCanvasProps> = ({
  id,
  number,
  title,
  question,
  hint,
  solution,
  category = "exercice",
}) => {
  const [activeTab, setActiveTab] = useState<"statement" | "solution">(
    "statement",
  );
  const [showHint, setShowHint] = useState<boolean>(false);

  return (
    <div
      id={`canvas-${id}`}
      className="auralis-glass-panel overflow-hidden transition-all duration-300 hover:shadow-md hover:border-auralis-primary/25"
    >
      {/* State-controlling Double-tab Header */}
      <div className="flex items-center justify-between border-b border-auralis-outline-variant/30 bg-auralis-surface-container px-4 sm:px-5 py-3">
        {/* Dynamic Left Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
              category === "activité"
                ? "bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40"
                : "bg-indigo-50 text-indigo-700 border border-indigo-200/50 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-900/40"
            }`}
          >
            {category} {number ? `${number}` : ""}
          </span>
          <h4 className="font-display font-bold text-xs sm:text-sm text-auralis-on-surface truncate max-w-[200px] sm:max-w-xs">
            {title}
          </h4>
        </div>

        {/* Dual Tab Buttons */}
        <div className="flex bg-auralis-surface-container-high p-1 rounded-xl">
          <button
            id={`tab-statement-${id}`}
            onClick={() => setActiveTab("statement")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "statement"
                ? "bg-auralis-surface text-auralis-primary shadow-xs"
                : "text-auralis-on-surface-variant hover:text-auralis-on-surface"
            }`}
          >
            Énoncé
          </button>
          <button
            id={`tab-solution-${id}`}
            onClick={() => setActiveTab("solution")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "solution"
                ? "bg-auralis-surface text-auralis-primary shadow-xs"
                : "text-auralis-on-surface-variant hover:text-auralis-on-surface"
            }`}
          >
            Solution
          </button>
        </div>
      </div>

      {/* Card Content body */}
      <div className="p-5 sm:p-6 space-y-4">
        {activeTab === "statement" ? (
          <div className="space-y-4 animate-fade-in">
            {/* The Exercise statement using math rendering */}
            <div className="text-auralis-on-surface text-sm sm:text-base leading-relaxed">
              <MathRenderer text={question} />
            </div>

            {/* Optional Hint block */}
            {hint && (
              <div className="pt-2">
                <button
                  id={`btn-hint-${id}`}
                  onClick={() => setShowHint(!showHint)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 cursor-pointer"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  {showHint
                    ? "Masquer l'indice de recherche"
                    : "Besoin de conseils ? Afficher l'indice"}
                </button>
                {showHint && (
                  <div className="mt-2 bg-amber-50/50 dark:bg-amber-950/15 border-l-3 border-amber-500 p-3.5 rounded text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                    {hint}
                  </div>
                )}
              </div>
            )}

            {/* Hint incentive to grab paper */}
            <div className="flex items-center gap-2 text-[11px] text-auralis-on-surface-variant font-mono mt-4 pt-4 border-t border-auralis-outline-variant/30">
              <span className="h-1.5 w-1.5 rounded-full bg-auralis-primary animate-pulse" />
              Prenez un stylo et cherchez d'abord au brouillon avant de déplier
              le corrigé !
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {solution ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-auralis-primary">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    DÉMARCHE DE RÉSOLUTION PROPOSÉE ET CORRIGÉ DÉTAILLÉ :
                  </span>
                </div>
                <div className="bg-auralis-surface-container border border-auralis-outline-variant/30 rounded-xl p-4 sm:p-5 text-auralis-on-surface">
                  <MathRenderer text={solution} />
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-auralis-on-surface-variant space-y-2">
                <FileText className="mx-auto h-8 w-8 text-auralis-on-surface-variant/40" />
                <p className="text-xs">
                  Corrigé officiel en cours de préparation par l'inspecteur
                  académique.
                </p>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setActiveTab("statement")}
                className="text-xs font-semibold text-auralis-on-surface-variant hover:text-auralis-primary font-mono flex items-center gap-1 cursor-pointer"
              >
                Retourner à l'énoncé de la question{" "}
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
