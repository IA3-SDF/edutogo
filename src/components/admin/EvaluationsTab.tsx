import React from "react";
import { Edit3, Trash, FileCheck } from "lucide-react";
import { DatabaseState } from "../../../types";
import { ModalState } from "./adminTypes";
import { EditableField } from "./EditableField";

interface EvaluationsTabProps {
  db: DatabaseState;
  selectedSubjectId: string;
  currentSubjectName: string | undefined;
  onUpdateDb: (updatedDb: DatabaseState) => void;
  setModal: (modal: ModalState | null) => void;
  showToast: (msg: string) => void;
}

export const EvaluationsTab: React.FC<EvaluationsTabProps> = ({
  db,
  selectedSubjectId,
  currentSubjectName,
  onUpdateDb,
  setModal,
  showToast,
}) => {
  const subjectEvaluations = db.evaluations.filter(
    (e) => e.subjectId === selectedSubjectId,
  );

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="section-head flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-(--color-text) uppercase">
            Évaluations, Devoirs Surveillés &amp; Annales du Bac
          </h2>
          <p className="sub text-xs text-(--color-text-muted) mt-0.5">
            Rattachés globalement à la matière {currentSubjectName}. Ils
            peuvent couvrir plusieurs chapitres.
          </p>
        </div>
        <button
          onClick={() =>
            setModal({
              type: "addEvaluation",
              draftTitle: "",
              draftEvalType: "DS",
              draftEvalYear: "2026",
              draftSubjectUrl: "",
              draftSolutionUrl: "",
            })
          }
          className="btn btn-primary px-3.5 py-2 text-xs font-bold"
        >
          + Créer une épreuve
        </button>
      </div>

      {subjectEvaluations.length === 0 ? (
        <div className="card border-2 border-dashed border-(--color-border) rounded-2xl p-11 text-center text-(--color-text-muted)">
          <p className="text-xs">
            Aucune épreuve nationale ni devoir surveillé configuré pour cette
            matière.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {subjectEvaluations.map((ev) => {
            const hasSolution = ev.hasSolution && ev.solutionUrl?.trim();

            return (
              <div
                key={ev.id}
                className="card group p-4.5 rounded-2xl space-y-3 border border-(--color-border) bg-(--color-surface) shadow-[var(--shadow-elevation-xs)] hover:shadow-[var(--shadow-elevation-sm)] hover:border-(--color-accent) hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="card-head flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="shrink-0 mt-0.5 h-7 w-7 rounded-xl bg-(--color-accent-soft) text-(--color-accent) flex items-center justify-center">
                      <FileCheck className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[12.5px] font-bold text-(--color-text) leading-snug truncate">
                        <EditableField
                          value={ev.title}
                          onSave={(v) => {
                            onUpdateDb({
                              ...db,
                              evaluations: db.evaluations.map((item) =>
                                item.id === ev.id
                                  ? { ...item, title: v }
                                  : item,
                              ),
                            });
                            showToast("Épreuve renommée.");
                          }}
                        />
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="badge badge-info font-bold text-[8.5px] px-1.5 py-0.5 rounded-full uppercase tracking-wider leading-none">
                          {ev.type}
                        </span>
                        {ev.year && (
                          <span className="text-[9px] text-(--color-text-faint) font-mono">
                            session {ev.year}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card-tag-row flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        setModal({
                          type: "addEvaluation",
                          draftId: ev.id,
                          draftTitle: ev.title,
                          draftEvalType: ev.type,
                          draftEvalYear: ev.year,
                          draftSubjectUrl: ev.subjectUrl,
                          draftSolutionUrl: ev.solutionUrl || "",
                        })
                      }
                      className="p-1.5 hover:bg-(--color-accent-soft) text-(--color-accent) rounded-lg transition cursor-pointer"
                      title="Modifier l'épreuve"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setModal({
                          type: "deleteEvaluation",
                          draftId: ev.id,
                          draftTitle: ev.title,
                        })
                      }
                      className="p-1.5 hover:bg-(--color-danger-soft) text-(--color-danger) rounded-lg transition cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="excerpt text-[11px] text-(--color-text-muted) leading-relaxed truncate">
                  Sujet :{" "}
                  <code className="bg-(--color-surface-alt) px-1.5 py-0.5 rounded text-(--color-text) font-mono text-[10px]">
                    {ev.subjectUrl || "sujet.pdf"}
                  </code>
                </p>

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
                    {hasSolution ? "Corrigé dispo" : "Corrigé manquant"}
                  </span>

                  <button
                    onClick={() =>
                      setModal({
                        type: "addEvaluation",
                        draftId: ev.id,
                        draftTitle: ev.title,
                        draftEvalType: ev.type,
                        draftEvalYear: ev.year,
                        draftSubjectUrl: ev.subjectUrl,
                        draftSolutionUrl: ev.solutionUrl || "",
                      })
                    }
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