"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "../providers";
import { BookOpen, FileText, Search, ArrowLeft } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { db, selectedLevelId, isDarkMode } = useApp();

  const query = (searchParams.get("q") || "").trim();
  const lowerQuery = query.toLowerCase();

  const levelCourses = db.courses.filter((course) => {
    const chapter = db.chapters.find((ch) => ch.id === course.chapterId);
    return (
      chapter?.levelId === selectedLevelId &&
      (course.title.toLowerCase().includes(lowerQuery) ||
        course.content.toLowerCase().includes(lowerQuery))
    );
  });

  const levelExercises = db.exercises.filter((exercise) => {
    const chapter = db.chapters.find((ch) => ch.id === exercise.chapterId);
    return (
      chapter?.levelId === selectedLevelId &&
      (exercise.title.toLowerCase().includes(lowerQuery) ||
        exercise.question.toLowerCase().includes(lowerQuery))
    );
  });

  const noResults = query && levelCourses.length === 0 && levelExercises.length === 0;

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-gray-50 text-slate-900"} py-12`}> 
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-100"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </button>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300 font-semibold">
                Recherche
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight">
                Résultats pour « {query || "..."} »
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Niveau actif : {selectedLevelId || "(aucun niveau sélectionné)"}
              </p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3">
              <Search className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {query ? `${levelCourses.length + levelExercises.length} résultat(s)` : "Entrez une recherche"}
              </span>
            </div>
          </div>

          {query ? (
            <div className="mt-10 space-y-10">
              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Cours</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Titres ou contenus correspondant à votre recherche.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-3 py-1 text-xs font-semibold">
                    {levelCourses.length}
                  </span>
                </div>

                <div className="grid gap-4">
                  {levelCourses.map((course) => {
                    const chapter = db.chapters.find((ch) => ch.id === course.chapterId);
                    const subject = chapter ? db.subjects.find((s) => s.id === chapter.subjectId) : null;
                    return (
                      <button
                        key={course.id}
                        onClick={() => router.push(`/student?chapterId=${course.chapterId}`)}
                        className="text-left rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 hover:border-emerald-400 hover:bg-emerald-50/60 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase font-semibold tracking-[0.22em] text-emerald-600">
                              Cours
                            </p>
                            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {course.title}
                            </h3>
                          </div>
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 dark:bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                            <BookOpen className="h-4 w-4" />
                            {subject?.name || "Chapitre"}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                          {course.content}
                        </p>
                      </button>
                    );
                  })}
                  {levelCourses.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 p-8 text-center text-slate-600 dark:text-slate-400">
                      Aucun cours trouvé pour cette recherche.
                    </div>
                  )}
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Exercices</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Titres ou questions correspondant à votre recherche.
                    </p>
                  </div>
                  <span className="rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 px-3 py-1 text-xs font-semibold">
                    {levelExercises.length}
                  </span>
                </div>

                <div className="grid gap-4">
                  {levelExercises.map((exercise) => {
                    const chapter = db.chapters.find((ch) => ch.id === exercise.chapterId);
                    const subject = chapter ? db.subjects.find((s) => s.id === chapter.subjectId) : null;
                    return (
                      <button
                        key={exercise.id}
                        onClick={() => router.push(`/student?chapterId=${exercise.chapterId}`)}
                        className="text-left rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 hover:border-sky-400 hover:bg-sky-50/70 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase font-semibold tracking-[0.22em] text-sky-600">
                              Exercice
                            </p>
                            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {exercise.title}
                            </h3>
                          </div>
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 dark:bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                            <FileText className="h-4 w-4" />
                            {subject?.name || "Chapitre"}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                          {exercise.question}
                        </p>
                      </button>
                    );
                  })}
                  {levelExercises.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 p-8 text-center text-slate-600 dark:text-slate-400">
                      Aucun exercice trouvé pour cette recherche.
                    </div>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-12 text-center text-slate-600 dark:text-slate-400">
              Entrez un terme de recherche pour trouver des cours ou des exercices liés à votre niveau.
            </div>
          )}

          {noResults && (
            <div className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200 p-5">
              <p className="font-semibold">Aucun résultat trouvé.</p>
              <p className="mt-1 text-sm text-rose-600 dark:text-rose-300">
                Essayez un autre mot-clé ou vérifiez que votre niveau est correctement sélectionné.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
