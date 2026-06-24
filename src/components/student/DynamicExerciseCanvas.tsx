import {
  CheckCircle2,
  ChevronRight,
  FileText,
  HelpCircle,
  Pencil,
  BookOpen,
  Lightbulb,
  ArrowLeft
} from "lucide-react";
import React, { useState } from "react";
import { MathRenderer } from "../admin/MathRenderer";

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
      className="group relative"
    >
      {/* ── BACKDROP: profondeur d'arrière-plan ── */}
      {/* En clair : un léger halo coloré derrière. En sombre : un gradient subtil. */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-slate-200/60 via-slate-100/40 to-slate-300/50 dark:from-slate-800/40 dark:via-slate-900/20 dark:to-slate-800/30 blur-sm transition-all duration-500 group-hover:blur-md group-hover:from-slate-200/80 dark:group-hover:from-slate-800/60" />

      {/* ── CANVAS PRINCIPAL ── */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_4px_16px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3),0_4px_16px_-4px_rgba(0,0,0,0.2)] transition-all duration-300 group-hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08),0_8px_24px_-4px_rgba(0,0,0,0.06)] dark:group-hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.4),0_8px_24px_-4px_rgba(0,0,0,0.3)]">
        
        {/* ── HEADER: barre supérieure avec profondeur ── */}
        <div className="relative flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-sm px-4 sm:px-6 py-3.5">
          
          {/* Badge + Titre */}
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm ${
                category === "activité"
                  ? "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40"
              }`}
            >
              {category === "activité" ? (
                <Lightbulb className="h-3 w-3" />
              ) : (
                <Pencil className="h-3 w-3" />
              )}
              {category} {number ? `#${number}` : ""}
            </span>
            <h4 className="font-display font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 truncate">
              {title}
            </h4>
          </div>

          {/* ── ONGLETS: contraste fort actif vs inactif ── */}
          <div className="flex items-center bg-slate-200/60 dark:bg-slate-700/40 p-1 rounded-xl border border-slate-200/50 dark:border-slate-600/30">
            {/* Onglet Énoncé */}
            <button
              id={`tab-statement-${id}`}
              onClick={() => setActiveTab("statement")}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "statement"
                  ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] ring-1 ring-slate-200/80 dark:ring-slate-500/50"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Énoncé</span>
            </button>

            {/* Onglet Corrigé */}
            <button
              id={`tab-solution-${id}`}
              onClick={() => setActiveTab("solution")}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "solution"
                  ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] ring-1 ring-slate-200/80 dark:ring-slate-500/50"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Corrigé</span>
            </button>
          </div>
        </div>

        {/* ── CORPS DU CANVAS ── */}
        <div className="relative p-5 sm:p-7 bg-white dark:bg-slate-900">
          
          {/* Indicateur visuel de l'onglet actif : bande colorée subtile en haut du contenu */}
          <div className={`absolute top-0 left-0 right-0 h-[2px] transition-colors duration-300 ${
            activeTab === "statement" 
              ? "bg-gradient-to-r from-indigo-500/40 via-indigo-500/20 to-transparent dark:from-indigo-400/30 dark:via-indigo-400/10" 
              : "bg-gradient-to-r from-emerald-500/40 via-emerald-500/20 to-transparent dark:from-emerald-400/30 dark:via-emerald-400/10"
          }`} />

          {activeTab === "statement" ? (
            <div className="space-y-5 animate-fade-in">
              {/* ── Zone Énoncé avec surface intérieure ── */}
              <div className="relative rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-5 sm:p-6">
                {/* Liseré décoratif latéral */}
                <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b from-indigo-400 to-indigo-200 dark:from-indigo-500 dark:to-indigo-800/50" />
                
                <div className="pl-4 text-slate-700 dark:text-slate-200 text-sm sm:text-[15px] leading-[1.75]">
                  <MathRenderer text={question} />
                </div>
              </div>

              {/* ── Bloc Indice ── */}
              {hint && (
                <div className="pt-1">
                  <button
                    id={`btn-hint-${id}`}
                    onClick={() => setShowHint(!showHint)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 cursor-pointer transition-colors"
                  >
                    <div className={`p-1 rounded-md transition-colors ${showHint ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-amber-50 dark:bg-amber-950/20'}`}>
                      <HelpCircle className="h-3.5 w-3.5" />
                    </div>
                    {showHint
                      ? "Masquer l'indice"
                      : "Besoin d'aide ? Afficher l'indice"}
                  </button>
                  
                  {showHint && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-amber-200/60 dark:border-amber-800/30 bg-gradient-to-br from-amber-50 to-amber-50/50 dark:from-amber-950/30 dark:to-amber-900/10 p-4">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                          {hint}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Footer incitatif ── */}
              <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 dark:bg-indigo-500" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500 dark:bg-indigo-400" />
                </span>
                <span>
                  Prenez un stylo et cherchez d'abord au brouillon avant de déplier le corrigé !
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in">
              {solution ? (
                <div className="space-y-4">
                  {/* ── En-tête du corrigé ── */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/30">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Démarché de résolution & Corrigé détaillé
                    </span>
                  </div>

                  {/* ── Zone Corrigé avec surface intérieure ── */}
                  <div className="relative rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-gradient-to-br from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-slate-900 p-5 sm:p-6">
                    {/* Liseré décoratif latéral */}
                    <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b from-emerald-400 to-emerald-200 dark:from-emerald-500 dark:to-emerald-800/50" />
                    
                    <div className="pl-4 text-slate-700 dark:text-slate-200 text-sm sm:text-[15px] leading-[1.75]">
                      <MathRenderer text={solution} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 py-10 px-6 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-100/50 to-transparent dark:from-slate-800/20 dark:to-transparent" />
                  <div className="relative space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Corrigé officiel en cours de préparation
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Par l'inspecteur académique
                    </p>
                  </div>
                </div>
              )}

              {/* ── Bouton retour ── */}
              <div className="flex justify-start pt-2">
                <button
                  onClick={() => setActiveTab("statement")}
                  className="group/btn inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                >
                  <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 group-hover/btn:bg-indigo-50 dark:group-hover/btn:bg-indigo-950/30 transition-colors">
                    <ArrowLeft className="h-3 w-3" />
                  </div>
                  Retourner à l'énoncé
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};