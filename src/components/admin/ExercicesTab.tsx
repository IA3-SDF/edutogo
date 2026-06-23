import React from "react";
import { Edit3, Trash } from "lucide-react";
import { DatabaseState, Exercise } from "../../../types";
import { ModalState } from "./adminTypes";
import { EditableField } from "./EditableField";
import { MathRenderer } from "../MathRenderer";

interface ExercicesTabProps {
  db: DatabaseState;
  selectedChapterId: string;
  onUpdateDb: (updatedDb: DatabaseState) => void;
  setModal: (modal: ModalState | null) => void;
  showToast: (msg: string) => void;
}

export const ExercicesTab: React.FC<ExercicesTabProps> = ({
  db,
  selectedChapterId,
  onUpdateDb,
  setModal,
  showToast,
}) => {
  const chapterExercises = db.exercises.filter(
    (e) => e.chapterId === selectedChapterId,
  );

  const openAddExercise = () => {
    setModal({
      type: "addExercise",
      draftTitle: "Exercice — d'application directe",
      draftNum: String(chapterExercises.length + 1),
      draftCategory: "exercice",
      draftQuestion: "",
      draftHint: "",
      draftSolution: "",
    });
  };

  const openEditExercise = (ex: Exercise) => {
    setModal({
      type: "addExercise",
      draftId: ex.id,
      draftTitle: ex.title,
      draftNum: ex.number,
      draftCategory: ex.category || "exercice",
      draftQuestion: ex.question,
      draftHint: ex.hint,
      draftSolution: ex.solution,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="section-head flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-(--color-text) uppercase">
            Corrigés d'exercices d'entraînement
          </h2>
          <p className="sub text-xs text-(--color-text-muted) mt-0.5">
            Activités d'apprentissage intégrées au cours, exercices généraux
            regroupés sous forme de fiches d'études.
          </p>
        </div>
        <button
          onClick={openAddExercise}
          className="btn btn-primary px-3.5 py-2 text-xs font-bold"
        >
          + Créer un exercice
        </button>
      </div>

      {chapterExercises.length === 0 ? (
        <div className="card border-2 border-dashed border-(--color-border) rounded-2xl p-11 text-center text-(--color-text-muted)">
          <p className="text-xs">
            Aucun énoncé d'exercice n'est rattaché à ce chapitre actuellement.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {chapterExercises.map((ex, idx) => {
            const hasSolution = ex.solution && ex.solution.trim() !== "";

            return (
              <div
                key={ex.id}
                className="card group p-4.5 rounded-2xl space-y-3 border border-(--color-border) bg-(--color-surface) shadow-[var(--shadow-elevation-xs)] hover:shadow-[var(--shadow-elevation-sm)] hover:border-(--color-accent) hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="card-head flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="shrink-0 mt-0.5 h-7 w-7 rounded-xl bg-(--color-accent-soft) text-(--color-accent) font-mono font-black text-[11px] flex items-center justify-center">
                      {ex.number || `${idx + 1}`}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[12.5px] font-bold text-(--color-text) leading-snug truncate">
                        <EditableField
                          value={ex.title}
                          onSave={(v) => {
                            onUpdateDb({
                              ...db,
                              exercises: db.exercises.map((item) =>
                                item.id === ex.id
                                  ? { ...item, title: v }
                                  : item,
                              ),
                            });
                            showToast("Titre d'exercice mis à jour.");
                          }}
                        />
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`badge text-[8.5px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider leading-none ${
                            ex.category === "activité"
                              ? "badge-success"
                              : "badge-info"
                          }`}
                        >
                          {ex.category || "exercice"}
                        </span>
                        <span className="text-[9px] text-(--color-text-faint) font-mono truncate">
                          {ex.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-tag-row flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditExercise(ex)}
                      className="p-1.5 hover:bg-(--color-accent-soft) text-(--color-accent) rounded-lg transition cursor-pointer"
                      title="Modifier l'exercice"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setModal({
                          type: "deleteExercise",
                          draftId: ex.id,
                          draftTitle: ex.title,
                        })
                      }
                      className="p-1.5 hover:bg-(--color-danger-soft) text-(--color-danger) rounded-lg transition cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Statement Preview with KaTeX */}
                <div className="p-3 bg-(--color-surface-alt) rounded-xl">
                  <MathRenderer
                    text={ex.question}
                    className="text-[11.5px] text-(--color-text) italic font-serif line-clamp-3"
                  />
                </div>

                {/* Compact status pill + action */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      hasSolution
                        ? "bg-(--color-success-soft) text-(--color-success)"
                        : "bg-(--color-danger-soft) text-(--color-danger)"
                    }`}
                  >
                    <span>{hasSolution ? "✓" : "!"}</span>
                    {hasSolution ? "Corrigé actif" : "Corrigé manquant"}
                  </span>

                  <button
                    onClick={() => openEditExercise(ex)}
                    className="px-2.5 py-1 rounded-lg border border-(--color-border) hover:bg-(--color-surface-alt) text-(--color-text-muted) hover:text-(--color-text) text-[10px] font-bold transition cursor-pointer whitespace-nowrap"
                  >
                    {hasSolution ? "Corrigé PDF" : "+ Corrigé"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};