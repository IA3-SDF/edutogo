import React from "react";
import { CheckCircle2, ChevronRight, Lock } from "lucide-react";
import { Subject, Chapter } from "../../../types";

type ClassroomTab = "cours" | "exercices" | "qcm" | "solutions";

interface ChapterListProps {
  subject: Subject;
  levelId: string;
  chapters: Chapter[];
  completedChaptersCount: number;
  totalChaptersCount: number;
  progressPercentage: number;
  onAccessChapter: (chapter: Chapter, initialTab?: ClassroomTab) => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({
  subject,
  levelId,
  chapters,
  completedChaptersCount,
  totalChaptersCount,
  progressPercentage,
  onAccessChapter,
}) => {
  return (
    <div className="lg:col-span-6 space-y-6">
      {/* Subject Indicator banner */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
              Syllabus Officiel
            </span>
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {subject.name} - {levelId.toUpperCase()}
            </h1>
          </div>

          {/* Score Circular equivalent or inline status */}
          <div className="font-sans">
            <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
              {progressPercentage}%
            </div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase">
              Programme Complété
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Maîtrisez les concepts fondamentaux de la matière de manière
          progressive et passez vos évaluations en toute sérénité.
        </p>

        {/* Progress bar matching */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
            <span>
              {completedChaptersCount} sur {totalChaptersCount} Chapitres
              complétés
            </span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
              id="dash-progress-fill"
            />
          </div>
        </div>
      </div>

      {/* List of Chapters "Programme Annuel" */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
          Programme Annuel : {chapters.length} Chapitres
        </h3>

        <div id="chapters-grid" className="space-y-3">
          {chapters.map((ch, idx) => {
            return (
              <div
                key={ch.id}
                className={`group relative bg-white dark:bg-slate-800 border rounded-xl p-5 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left ${
                  ch.isLocked
                    ? "border-gray-200/60 dark:border-slate-800/60 opacity-70"
                    : "border-gray-200 dark:border-slate-700 hover:border-emerald-500/40 dark:hover:border-emerald-500/40"
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    {/* sequence number badge */}
                    <span className="font-mono text-xs font-bold text-gray-400 bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 h-5 w-5 rounded flex items-center justify-center">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>

                    <h4
                      className={`font-display text-base font-bold ${
                        ch.isLocked
                          ? "text-gray-400 line-through"
                          : "text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                      } transition-colors`}
                    >
                      {ch.title}
                    </h4>

                    {ch.isCompleted && (
                      <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Complété
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xl">
                    {ch.description}
                  </p>

                  {/* Relational Indicators (Badges that show cours, exercices, qcm and solutions) */}
                  {!ch.isLocked && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => onAccessChapter(ch, "cours")}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-[10px] font-bold rounded"
                      >
                        Cours
                      </button>
                      <button
                        onClick={() => onAccessChapter(ch, "exercices")}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-[10px] font-bold rounded"
                      >
                        Exercices
                      </button>
                      <button
                        onClick={() => onAccessChapter(ch, "qcm")}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-[10px] font-bold rounded"
                      >
                        Quiz
                      </button>
                      <button
                        onClick={() => onAccessChapter(ch, "solutions")}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-[10px] font-bold rounded"
                      >
                        Solutions
                      </button>
                    </div>
                  )}
                </div>

                {/* Side Actions buttons */}
                <div className="flex items-center justify-end">
                  {ch.isLocked ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 text-gray-400 rounded-xl text-xs font-semibold">
                      <Lock className="h-3.5 w-3.5" /> Verrouillé
                    </div>
                  ) : (
                    <button
                      id={`btn-chapter-${ch.id}`}
                      onClick={() => onAccessChapter(ch, "cours")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs hover:shadow-md hover:shadow-emerald-600/10 cursor-pointer active:scale-95 transition-all text-center"
                    >
                      Accéder <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};