"use client";

import { ArrowRight, Bookmark, BookOpen, CheckCircle2, ClipboardList, Heart, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useFavorites } from "../../../lib/useFavorites";
import { DatabaseState, Level, UserProfile } from "../../../types";

interface LoggedInLandingPageProps {
  levels: Level[];
  db: DatabaseState;
  user: UserProfile;
  selectedLevelId: string;
  onSelectLevel: (levelId: string) => void;
  onOpenStudentDashboard: () => void;
  isDarkMode: boolean;
}

function getChapterLabel(chapterId: string, chapters: DatabaseState["chapters"]) {
  return chapters.find((chapter) => chapter.id === chapterId)?.title || "Chapitre";
}

function getResourceLabel(resourceId: string, resourceType: string, db: DatabaseState) {
  switch (resourceType) {
    case "course": {
      const course = db.courses.find((item) => item.id === resourceId);
      return course ? course.title : "Cours favori";
    }
    case "exercise": {
      const exercise = db.exercises.find((item) => item.id === resourceId);
      return exercise ? `${exercise.number} - ${exercise.title}` : "Exercice favori";
    }
    case "quiz": {
      const group = db.quizGroups?.find((item) => item.id === resourceId);
      if (group) return group.title;
      const quiz = db.quizzes.find((item) => item.id === resourceId);
      return quiz ? quiz.question.slice(0, 40) + (quiz.question.length > 40 ? "..." : "") : "QCM favori";
    }
    case "evaluation": {
      const evaluation = db.evaluations.find((item) => item.id === resourceId);
      return evaluation ? evaluation.title : "Évaluation favorite";
    }
    default:
      return "Favori";
  }
}

function sortByDateDesc<T extends { createdAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bDate - aDate;
  });
}

export const LoggedInLandingPage: React.FC<LoggedInLandingPageProps> = ({
  levels,
  db,
  user,
  selectedLevelId,
  onSelectLevel,
  onOpenStudentDashboard,
  isDarkMode,
}) => {
  const router = useRouter();
  const { favorites, isLoading: favoritesLoading } = useFavorites();

  const levelId = user.classLevel || selectedLevelId || levels[0]?.id || "";
  const levelName = levels.find((level) => level.id === levelId)?.name || "ton niveau";

  const levelChapters = useMemo(
    () => db.chapters.filter((chapter) => chapter.levelId === levelId),
    [db.chapters, levelId],
  );

  const levelCourses = useMemo(
    () => db.courses.filter((course) => levelChapters.some((chapter) => chapter.id === course.chapterId)),
    [db.courses, levelChapters],
  );

  const levelExercises = useMemo(
    () => db.exercises.filter((exercise) => levelChapters.some((chapter) => chapter.id === exercise.chapterId)),
    [db.exercises, levelChapters],
  );

  const levelQuizzes = useMemo(() => {
    if (db.quizGroups && db.quizGroups.length > 0) {
      return db.quizGroups.filter((quiz) => levelChapters.some((chapter) => chapter.id === quiz.chapterId));
    }
    return [];
  }, [db.quizGroups, db.quizzes, levelChapters]);

  const recentChapters = useMemo(() => {
    const completed = levelChapters.filter((chapter) => chapter.isCompleted);
    return completed.length > 0 ? completed.slice(0, 4) : levelChapters.slice(0, 4);
  }, [levelChapters]);

  const recentCourses = useMemo(
    () => sortByDateDesc(levelCourses).slice(0, 4),
    [levelCourses],
  );

  const recentExercises = useMemo(
    () => levelExercises.slice(0, 4),
    [levelExercises],
  );

  const recentQuizzes = useMemo(
    () => sortByDateDesc(levelQuizzes).slice(0, 4),
    [levelQuizzes],
  );

  const favoriteItems = useMemo(
    () => favorites.slice(0, 4).map((fav) => ({
      ...fav,
      label: getResourceLabel(fav.resourceId, fav.resourceType, db),
    })),
    [favorites, db],
  );

  const favoriteCount = favorites.length;
  const chaptersCount = levelChapters.length;
  const courseCount = levelCourses.length;
  const exerciseCount = levelExercises.length;
  const quizCount = levelQuizzes.length;

  const handleOpenActivity = (chapterId: string) => {
    router.push(`/student?chapterId=${chapterId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b17] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr] items-start">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-950/80 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.24em] font-bold text-emerald-600 dark:text-emerald-400">Tableau de bord</p>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
                    Bonjour, {user.fullName || "cher élève"} 👋
                  </h1>
                  <p className="max-w-2xl text-slate-600 dark:text-slate-300 leading-relaxed">
                    Ici, tu retrouves ton espace de reprise rapide avec ton niveau {levelName} et tes favoris.
                    L’onglet Accueil est ton tableau de bord principal pour reprendre ton apprentissage.
                  </p>
                </div>

                <button
                  onClick={onOpenStudentDashboard}
                  className="inline-flex items-center gap-2 rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                >
                  Reprendre mon apprentissage
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] font-semibold text-slate-500 dark:text-slate-400">Chapitres</p>
                  <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{chaptersCount}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">dans ton niveau</p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] font-semibold text-slate-500 dark:text-slate-400">Cours</p>
                  <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{courseCount}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">à explorer</p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] font-semibold text-slate-500 dark:text-slate-400">Exercices</p>
                  <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{exerciseCount}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">tests disponibles</p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] font-semibold text-slate-500 dark:text-slate-400">Favoris</p>
                  <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{favoriteCount}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">éléments enregistrés</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <section className="rounded-[2rem] border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="flex items-center gap-3 text-emerald-600">
                  <Sparkles className="h-5 w-5" />
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-white">À reprendre</h2>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  Tes dernières ressources recommandées pour bien reprendre ton travail.
                </p>
                <div className="mt-5 space-y-3">
                  {recentChapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => handleOpenActivity(chapter.id)}
                      className="w-full text-left rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80 p-4 transition hover:border-emerald-400/80 hover:bg-emerald-50/80 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{chapter.title}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{chapter.description || getChapterLabel(chapter.id, db.chapters)}</p>
                        </div>
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="flex items-center gap-3 text-sky-600">
                  <BookOpen className="h-5 w-5" />
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Derniers cours</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {recentCourses.length > 0 ? (
                    recentCourses.map((course) => {
                      const chapter = db.chapters.find((item) => item.id === course.chapterId);
                      return (
                        <div key={course.id} className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80 p-4">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{course.title}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{chapter ? chapter.title : "Cours du chapitre"}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Aucun cours récent pour ton niveau.</p>
                  )}
                </div>
              </section>

              <section className="rounded-[2rem] border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="flex items-center gap-3 text-violet-600">
                  <ClipboardList className="h-5 w-5" />
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Exercices récents</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {recentExercises.length > 0 ? (
                    recentExercises.map((exercise) => {
                      const chapter = db.chapters.find((item) => item.id === exercise.chapterId);
                      return (
                        <div key={exercise.id} className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80 p-4">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{exercise.number} · {exercise.title}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{chapter ? chapter.title : "Exercice de chapitre"}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Aucun exercice récent pour ton niveau.</p>
                  )}
                </div>
              </section>
            </div>

            <section className="rounded-[2rem] border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-amber-600">
                  <Heart className="h-5 w-5" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Tes favoris</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Retrouve rapidement les ressources que tu as marquées.</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold dark:bg-emerald-700/10 dark:text-emerald-200">{favoriteCount} favori{favoriteCount > 1 ? "s" : ""}</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {favoriteItems.length > 0 ? (
                  favoriteItems.map((favorite) => (
                    <div key={`${favorite.resourceType}-${favorite.resourceId}`} className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{favorite.label}</p>
                        <span className="rounded-full bg-slate-200/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {favorite.resourceType}
                        </span>
                      </div>
                    </div>
                  ))
                ) : favoritesLoading ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Chargement de tes favoris...</p>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-300/80 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/80 p-6 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tu n’as pas encore de favoris.</p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Ajoute des exercices ou des cours pour les retrouver ici.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200/70 dark:border-slate-800/70 bg-white/95 dark:bg-slate-950/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="flex items-center gap-3 text-indigo-600">
                <Bookmark className="h-5 w-5" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Résumé de ton niveau</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{levelName}</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Matières</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{db.subjects.filter((subject) => subject.levelId === levelId).length}</p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">QCM disponibles</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{quizCount}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/70 dark:border-slate-800/70 bg-white/95 dark:bg-slate-950/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <div>
                  <h2 className="text-lg font-semibold">Ton prochain objectif</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Choisis une matière et commence une nouvelle séquence.</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => onSelectLevel(level.id)}
                    className="w-full rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80 px-4 py-3 text-left transition hover:border-emerald-400/80 hover:bg-emerald-50/80"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{level.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{level.description}</p>
                      </div>
                      <span className="rounded-full bg-slate-200/80 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">Sélectionner</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
