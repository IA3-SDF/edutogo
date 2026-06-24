import { Heart, HelpCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { QuizGroup, QuizQuestion } from "../../../types";
import { MathRenderer } from "../admin/MathRenderer";

interface QcmTabProps {
  quizzes: QuizQuestion[];
  quizGroups?: QuizGroup[];
  qcmAnswers: Record<string, number>;
  quizSubmitted: boolean;
  onAnswer: (questionId: string, selectedIndex: number) => void;
  onSubmit: () => void;
  onRestart: () => void;
  favoriteQuizGroupIds?: Set<string>;
  onToggleFavorite?: (quizGroupId: string) => Promise<void>;
}

export const QcmTab: React.FC<QcmTabProps> = ({
  quizzes,
  quizGroups,
  qcmAnswers,
  quizSubmitted,
  onAnswer,
  onSubmit,
  onRestart,
  favoriteQuizGroupIds = new Set(),
  onToggleFavorite,
}) => {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [screen, setScreen] = useState<"landing" | "question" | "results">("landing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const groupedQuizzes = quizGroups && quizGroups.length > 0 ? quizGroups : undefined;
  const selectedGroup = groupedQuizzes?.find((group) => group.id === activeGroupId);
  const activeQuestions = selectedGroup?.questions && selectedGroup.questions.length > 0
    ? selectedGroup.questions
    : quizzes;
  const questionCount = activeQuestions.length;
  const answeredCount = activeQuestions.filter((q) => qcmAnswers[q.id] !== undefined).length;
  const allAnswered = questionCount > 0 && answeredCount === questionCount;
  const currentQuestion = activeQuestions[currentQuestionIndex];
  const estimatedMinutes = Math.max(1, Math.round(questionCount * 0.8));

  useEffect(() => {
    if (!groupedQuizzes) {
      setActiveGroupId(null);
    }
  }, [groupedQuizzes]);

  useEffect(() => {
    if (quizSubmitted) {
      setScreen("results");
    }
  }, [quizSubmitted]);

  useEffect(() => {
    if (!quizSubmitted && screen === "results") {
      setScreen("question");
    }
  }, [quizSubmitted, screen]);

  useEffect(() => {
    if (currentQuestionIndex >= questionCount) {
      setCurrentQuestionIndex(Math.max(0, questionCount - 1));
    }
  }, [currentQuestionIndex, questionCount]);

  const progressDots = useMemo(
    () => activeQuestions.map((q) => ({
      id: q.id,
      answered: qcmAnswers[q.id] !== undefined,
    })),
    [activeQuestions, qcmAnswers],
  );

  const handleStartQuiz = (groupId?: string) => {
    setActiveGroupId(groupId || null);
    setCurrentQuestionIndex(0);
    setScreen("question");
    onRestart();
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScreen("question");
    onRestart();
  };

  const handleReturnToSelection = () => {
    setActiveGroupId(null);
    setScreen("landing");
    onRestart();
  };

  if (quizzes.length === 0 && !groupedQuizzes) {
    return (
      <div className="text-center py-16 text-gray-400">
        <HelpCircle className="mx-auto h-12 w-12 text-gray-300 dark:text-slate-700 mb-3" />
        <p>Quiz d'auto-évaluation en cours d'intégration pour ce chapitre.</p>
      </div>
    );
  }

  if (groupedQuizzes && groupedQuizzes.length > 1 && !activeGroupId) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Plusieurs parcours de quiz sont disponibles pour ce chapitre.
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Choisissez un quiz puis lancez le parcours en conditions réelles : une seule tentative, question par question.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {groupedQuizzes.map((group) => {
            const isFavorite = favoriteQuizGroupIds.has(group.id);

            const handleFavoriteClick = async (e: React.MouseEvent) => {
              e.stopPropagation();
              if (onToggleFavorite) {
                try {
                  await onToggleFavorite(group.id);
                } catch (err) {
                  console.error("[EduTogo] Erreur lors de la modification du favori:", err);
                }
              }
            };

            return (
              <div
                key={group.id}
                className="rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:border-emerald-500"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-xs uppercase tracking-[0.24em] font-bold text-emerald-600">
                    Quiz
                  </div>
                  <button
                    onClick={handleFavoriteClick}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
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
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {group.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                  {group.questions?.length ?? 0} question(s) · environ {Math.max(1, Math.round((group.questions?.length ?? 1) * 0.8))} min
                </p>
                <button
                  onClick={() => handleStartQuiz(group.id)}
                  className="w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  Commencer ce quiz
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (screen === "landing") {
    const landingTitle = groupedQuizzes
      ? groupedQuizzes.length === 1
        ? groupedQuizzes[0].title
        : "Quiz du chapitre"
      : "Quiz du chapitre";
    const landingCount = groupedQuizzes
      ? groupedQuizzes.length === 1
        ? groupedQuizzes[0].questions?.length ?? 0
        : quizzes.length
      : quizzes.length;

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm">
          <div className="text-xs uppercase tracking-[0.26em] font-bold text-emerald-600 mb-4">
            {groupedQuizzes ? "Parcours de quiz" : "Évaluation QCM"}
          </div>
          <h2 className="font-display text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
            {landingTitle}
          </h2>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
            <p>Il y a {landingCount} question{landingCount > 1 ? "s" : ""}.</p>
            <p>Appuie sur le bouton pour commencer.</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200 mb-6">
            Durée estimée : ~{estimatedMinutes} min.
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
            Conditions réelles du Bac : réponds à chaque question, puis valide ton quiz pour accéder au score et aux explications détaillées.
          </p>
          <button
            onClick={() => handleStartQuiz(groupedQuizzes?.length === 1 ? groupedQuizzes[0].id : undefined)}
            className="mt-8 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Démarrer pour commencer
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>Aucune question disponible pour ce quiz.</p>
      </div>
    );
  }

  const score = activeQuestions.reduce(
    (acc, qz) => acc + (qcmAnswers[qz.id] === qz.correctIndex ? 1 : 0),
    0,
  );

  const selectedOpt = qcmAnswers[currentQuestion.id] ?? -1;

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {screen === "question" && (
        <div className="rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="text-xs uppercase tracking-[0.26em] font-bold text-emerald-600 mb-2">
                {selectedGroup ? selectedGroup.title : "Quiz en cours"}
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                Question {currentQuestionIndex + 1} / {questionCount}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {progressDots.map((dot) => (
                <div
                  key={dot.id}
                  className={`h-3 w-3 rounded-full ${dot.answered ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`}
                />
              ))}
            </div>
          </div>

          <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white leading-relaxed mb-6">
            <MathRenderer text={currentQuestion.question} />
          </div>

          <div className="grid gap-3">
            {currentQuestion.options.map((opt, oIdx) => {
              const isSelected = selectedOpt === oIdx;
              return (
                <button
                  key={oIdx}
                  onClick={() => onAnswer(currentQuestion.id, oIdx)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left text-sm sm:text-base transition ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100"
                      : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center font-mono text-xs font-bold">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <MathRenderer text={opt} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-500 dark:text-slate-400">
              {selectedOpt !== -1 ? "Réponse enregistrée." : "Choisissez une option avant de passer à la suite."}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentQuestionIndex === 0}
                className="rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 disabled:opacity-40"
              >
                Précédent
              </button>
              {currentQuestionIndex < questionCount - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, questionCount - 1))}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Suivant
                </button>
              ) : (
                <button
                  disabled={!allAnswered}
                  onClick={() => onSubmit()}
                  className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
                    allAnswered
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-300 dark:bg-slate-700 cursor-not-allowed"
                  }`}
                >
                  Terminer le quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {screen === "results" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.24em] font-bold text-emerald-100">
                  Résultats du quiz
                </span>
                <h3 className="font-display text-2xl font-black mt-3">
                  {score} / {questionCount}
                </h3>
                <p className="mt-2 text-sm text-emerald-100">
                  {score === questionCount
                    ? "Parfait ! Tu as bien ciblé ta préparation."
                    : "Analyse tes erreurs et reviens travailler les points clés."}
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 border border-white/20 px-5 py-4 text-center">
                <div className="text-3xl font-mono font-black">{Math.round((score / questionCount) * 100)}%</div>
                <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-emerald-100 mt-1">
                  Taux de réussite
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {activeQuestions.map((question, idx) => {
              const selectedOpt = qcmAnswers[question.id] ?? -1;
              const correctOpt = question.correctIndex;
              const answeredCorrectly = selectedOpt === correctOpt;
              return (
                <div key={question.id} className="rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-4 mb-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-gray-500 dark:text-slate-400">
                        Question {idx + 1}
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mt-2">{answeredCorrectly ? "Correct" : "À revoir"}</h4>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${answeredCorrectly ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {answeredCorrectly ? "Bonne réponse" : "Mauvaise réponse"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700 dark:text-gray-200 mb-4">
                    <MathRenderer text={question.question} />
                  </div>

                  <div className="space-y-3 mb-4">
                    {question.options.map((opt, oIdx) => {
                      const isSelected = selectedOpt === oIdx;
                      const isCorrectOpt = correctOpt === oIdx;
                      const baseStyle = "rounded-2xl border px-4 py-3 text-sm";
                      const optionStyle = isCorrectOpt
                        ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                        : isSelected
                        ? "border-rose-400 bg-rose-50 text-rose-900"
                        : "border-gray-200 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300";
                      return (
                        <div key={oIdx} className={`${baseStyle} ${optionStyle}`}>
                          <div className="font-mono text-xs uppercase tracking-[0.2em] mb-1">{String.fromCharCode(65 + oIdx)}</div>
                          <MathRenderer text={opt} />
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 p-4 text-sm text-gray-700 dark:text-gray-200">
                    <div className="font-bold text-sm mb-2">Explication :</div>
                    <MathRenderer text={question.explanation} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={handleRestartQuiz}
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Recommencer ce quiz
            </button>
            {groupedQuizzes && groupedQuizzes.length > 1 && (
              <button
                onClick={handleReturnToSelection}
                className="rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-bold text-gray-800 dark:text-gray-100 hover:bg-gray-50"
              >
                Retour aux quiz
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
