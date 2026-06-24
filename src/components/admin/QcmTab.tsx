import { Check, Edit3, Trash } from "lucide-react";
import React from "react";
import { DatabaseState } from "../../../types";
import { ModalState } from "./adminTypes";
import { MathRenderer } from "./MathRenderer";

interface QcmTabProps {
  db: DatabaseState;
  selectedChapterId: string;
  setModal: (modal: ModalState | null) => void;
}

export const QcmTab: React.FC<QcmTabProps> = ({
  db,
  selectedChapterId,
  setModal,
}) => {
  const chapterQuizzes = db.quizzes.filter(
    (q) => q.chapterId === selectedChapterId,
  );

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="section-head flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-(--color-text) uppercase">
            Questionnaire de Validation Rapide
          </h2>
          <p className="sub text-xs text-(--color-text-muted) mt-0.5">
            Séquence interactive de questions-réponses. Le verdict pédagogique
            et les justifications s'affichent en fin de quiz.
          </p>
        </div>
        <button
          onClick={() =>
            setModal({
              type: "addQuiz",
              draftQuestion: "",
              draftOptions: ["", "", "", ""],
              draftCorrectIndex: 0,
              draftExplanation: "",
            })
          }
          className="btn btn-primary px-3.5 py-2 text-xs font-bold"
        >
          + Ajouter une question
        </button>
      </div>

      {chapterQuizzes.length === 0 ? (
        <div className="card border-2 border-dashed border-(--color-border) rounded-2xl p-11 text-center text-(--color-text-muted)">
          <p className="text-xs">
            Aucun QCM d'auto-évaluation n'est configuré pour ce chapitre.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="badge badge-warning font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Série de validation
            </span>
            <span className="text-[10px] text-(--color-text-faint) font-mono">
              {chapterQuizzes.length} question(s) · chapterId:{" "}
              {selectedChapterId}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {chapterQuizzes.map((qcm, idx) => (
              <div
                key={qcm.id}
                className="card group p-4.5 rounded-2xl space-y-3 border border-(--color-border) bg-(--color-surface) shadow-[var(--shadow-elevation-xs)] hover:shadow-[var(--shadow-elevation-sm)] hover:border-(--color-accent) hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="shrink-0 mt-0.5 h-7 w-7 rounded-xl bg-(--color-warning-soft) text-(--color-warning) font-mono font-black text-[11px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div className="text-[12px] font-semibold text-(--color-text) leading-snug">
                      <MathRenderer
                        text={qcm.question}
                        className="text-[12px] text-(--color-text)"
                      />
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        setModal({
                          type: "addQuiz",
                          draftId: qcm.id,
                          draftQuestion: qcm.question,
                          draftOptions: qcm.options,
                          draftCorrectIndex: qcm.correctIndex,
                          draftExplanation: qcm.explanation,
                        })
                      }
                      className="p-1.5 hover:bg-(--color-accent-soft) text-(--color-accent) rounded-lg shrink-0 transition cursor-pointer"
                      title="Modifier la question"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setModal({
                          type: "deleteQuiz",
                          draftId: qcm.id,
                          draftTitle: qcm.question,
                        })
                      }
                      className="p-1.5 hover:bg-(--color-danger-soft) text-(--color-danger) rounded-lg shrink-0 transition cursor-pointer"
                      title="Retirer"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Choices Options Grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {qcm.options.map((opt, oIdx) => {
                    const isThisCorrect = qcm.correctIndex === oIdx;

                    return (
                      <div
                        key={oIdx}
                        className={`p-2.5 border rounded-lg flex items-center justify-between text-[11px] transition-all ${
                          isThisCorrect
                            ? "border-(--color-success-border) bg-(--color-success-soft) text-(--color-success) font-bold"
                            : "border-(--color-border) bg-(--color-surface-alt) text-(--color-text-muted)"
                        }`}
                      >
                        <MathRenderer
                          text={opt}
                          className="text-[11px] shrink-0"
                        />
                        {isThisCorrect && (
                          <Check className="h-3.5 w-3.5 text-(--color-success) shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation and justification alert box */}
                {qcm.explanation && (
                  <div className="alert alert-info text-[10.5px] leading-normal italic px-3 py-2 rounded-lg">
                    <strong>Explication :</strong>{" "}
                    <MathRenderer text={qcm.explanation} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};