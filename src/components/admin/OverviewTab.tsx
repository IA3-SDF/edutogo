import React from "react";
import { PriorityItems, ModalState } from "./adminTypes";

interface OverviewTabProps {
  priorityItems: PriorityItems;
  setActiveTab: (tab: string) => void;
  setModal: (modal: ModalState | null) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  priorityItems,
  setActiveTab,
  setModal,
}) => {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Statistics Cards Grid */}
      <div className="stat-grid grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div
          className={`stat-card card p-5 rounded-2xl ${
            priorityItems.stats.missingCount > 0
              ? "border-(--color-danger-border) text-(--color-danger)"
              : "border-(--color-success-border) text-(--color-success)"
          }`}
        >
          <div className="num text-3xl font-black font-mono leading-none">
            {priorityItems.stats.missingCount}
          </div>
          <div className="lbl text-xs text-(--color-text-muted) mt-2 font-semibold">
            Corrigés manquants — exercices
          </div>
        </div>

        <div
          className={`stat-card card p-5 rounded-2xl ${
            priorityItems.stats.missingEvalCount > 0
              ? "border-(--color-danger-border) text-(--color-danger)"
              : "border-(--color-success-border) text-(--color-success)"
          }`}
        >
          <div className="num text-3xl font-black font-mono leading-none">
            {priorityItems.stats.missingEvalCount}
          </div>
          <div className="lbl text-xs text-(--color-text-muted) mt-2 font-semibold">
            Corrigés manquants — évaluations (matière)
          </div>
        </div>

        <div
          className={`stat-card card p-5 rounded-2xl ${
            priorityItems.stats.courseOk > 0
              ? "border-(--color-success-border) text-(--color-success)"
              : "border-(--color-border) text-(--color-text)"
          }`}
        >
          <div className="num text-3xl font-black font-mono leading-none">
            {priorityItems.stats.courseOk}
          </div>
          <div className="lbl text-xs text-(--color-text-muted) mt-2 font-semibold">
            Cours rédigé pour ce chapitre
          </div>
        </div>
      </div>

      {/* Priority queue task list */}
      <div className="space-y-3">
        <span className="section-title text-[10px] font-bold uppercase tracking-wider text-(--color-text-faint) block mb-1">
          À traiter en priorité
        </span>
        {priorityItems.missingExercises.length === 0 &&
        priorityItems.missingEvaluations.length === 0 ? (
          <div className="list-card card rounded-2xl overflow-hidden shadow-[var(--shadow-elevation-sm)]">
            <div className="empty-state py-11 text-center text-(--color-text-muted) italic">
              Aucun corrigé manquant. Tout l'état de ce chapitre est à jour !
            </div>
          </div>
        ) : (
          <div className="list-card card rounded-xl overflow-hidden shadow-[var(--shadow-elevation-sm)] divide-y divide-(--color-border) p-0">
            {priorityItems.missingExercises.map((ex) => (
              <div
                key={ex.id}
                onClick={() => setActiveTab("exercices")}
                className="list-row flex items-center justify-between gap-4 p-4 hover:bg-(--color-surface-alt) cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="dot w-2 h-2 rounded-full bg-(--color-danger)" />
                  <div className="ltxt">
                    <span className="font-bold text-xs text-(--color-text)">
                      {ex.title}
                    </span>
                    <span className="text-[10px] text-(--color-text-faint) block mt-0.5">
                      exerciseId: {ex.id} · solution vide (corrigé requis)
                    </span>
                  </div>
                </div>
                <span className="lpath text-[11px] text-(--color-text-faint) font-mono font-medium">
                  Onglet Exercices ➔
                </span>
              </div>
            ))}

            {priorityItems.missingEvaluations.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setActiveTab("evaluations")}
                className="list-row flex items-center justify-between gap-4 p-4 hover:bg-(--color-surface-alt) cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="dot w-2 h-2 rounded-full bg-(--color-danger)" />
                  <div className="ltxt">
                    <span className="font-bold text-xs text-(--color-text)">
                      {ev.title}
                    </span>
                    <span className="text-[10px] text-(--color-text-faint) block mt-0.5">
                      evalId: {ev.id} · corrigé manquant (PDF requis)
                    </span>
                  </div>
                </div>
                <span className="lpath text-[11px] text-(--color-text-faint) font-mono font-medium">
                  Onglet Évaluations ➔
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};