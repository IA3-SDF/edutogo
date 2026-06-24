"use client";

import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  Heart,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useFavorites } from "../../../lib/useFavorites";
import { DatabaseState, Level, UserProfile } from "../../../types";

interface MobileHomeViewProps {
  levels: Level[];
  db: DatabaseState;
  user: UserProfile;
  selectedLevelId: string;
  onSelectLevel: (levelId: string) => void;
}

function getResourceLabel(
  resourceId: string,
  resourceType: string,
  db: DatabaseState,
) {
  switch (resourceType) {
    case "course": {
      const course = db.courses.find((item) => item.id === resourceId);
      return course ? course.title : "Cours favori";
    }
    case "exercise": {
      const exercise = db.exercises.find((item) => item.id === resourceId);
      return exercise
        ? `${exercise.number} - ${exercise.title}`
        : "Exercice favori";
    }
    case "quiz": {
      const group = db.quizGroups?.find((item) => item.id === resourceId);
      if (group) return group.title;
      const quiz = db.quizzes.find((item) => item.id === resourceId);
      return quiz
        ? quiz.question.slice(0, 40) +
            (quiz.question.length > 40 ? "..." : "")
        : "QCM favori";
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

export const MobileHomeView: React.FC<MobileHomeViewProps> = ({
  levels,
  db,
  user,
  selectedLevelId,
  onSelectLevel,
}) => {
  const router = useRouter();
  const { favorites, isLoading: favoritesLoading } = useFavorites();

  const levelId = user.classLevel || selectedLevelId || levels[0]?.id || "";
  const levelName =
    levels.find((level) => level.id === levelId)?.name || "ton niveau";

  const levelChapters = useMemo(
    () => db.chapters.filter((chapter) => chapter.levelId === levelId),
    [db.chapters, levelId],
  );

  const levelCourses = useMemo(
    () =>
      db.courses.filter((course) =>
        levelChapters.some((chapter) => chapter.id === course.chapterId),
      ),
    [db.courses, levelChapters],
  );

  const levelExercises = useMemo(
    () =>
      db.exercises.filter((exercise) =>
        levelChapters.some((chapter) => chapter.id === exercise.chapterId),
      ),
    [db.exercises, levelChapters],
  );

  const recentChapters = useMemo(() => {
    const completed = levelChapters.filter((chapter) => chapter.isCompleted);
    return completed.length > 0
      ? completed.slice(0, 3)
      : levelChapters.slice(0, 3);
  }, [levelChapters]);

  const recentCourses = useMemo(
    () => sortByDateDesc(levelCourses).slice(0, 3),
    [levelCourses],
  );

  const favoriteItems = useMemo(
    () =>
      favorites.slice(0, 3).map((fav) => ({
        ...fav,
        label: getResourceLabel(fav.resourceId, fav.resourceType, db),
      })),
    [favorites, db],
  );

  const handleOpenActivity = (chapterId: string) => {
    router.push(`/student?chapterId=${chapterId}`);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* En-tête personnalisé */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Bonjour,
            </p>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {user.fullName || "cher élève"} 👋
            </h1>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-600 to-sky-500 text-white flex items-center justify-center font-bold text-sm">
            {user.fullName
              ? user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "ET"}
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Niveau : <span className="font-semibold text-emerald-600">{levelName}</span>
        </p>
      </div>

      {/* Stats rapides */}
      <div className="px-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {levelChapters.length}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide">
              Chapitres
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {levelCourses.length}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide">
              Cours
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {levelExercises.length}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide">
              Exercices
            </p>
          </div>
        </div>
      </div>

      {/* Continuer l'apprentissage */}
      {recentChapters.length > 0 && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              À reprendre
            </h2>
          </div>
          <div className="space-y-2">
            {recentChapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => handleOpenActivity(chapter.id)}
                className="w-full text-left bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {chapter.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                    {chapter.description || "Chapitre du programme"}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Derniers cours */}
      {recentCourses.length > 0 && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-sky-500" />
              Derniers cours
            </h2>
          </div>
          <div className="space-y-2">
            {recentCourses.map((course) => {
              const chapter = db.chapters.find(
                (item) => item.id === course.chapterId,
              );
              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {course.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    {chapter ? chapter.title : "Cours du chapitre"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Favoris */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500" />
            Tes favoris
          </h2>
          <span className="text-xs text-gray-500 dark:text-slate-400">
            {favorites.length} favori{favorites.length > 1 ? "s" : ""}
          </span>
        </div>
        {favoriteItems.length > 0 ? (
          <div className="space-y-2">
            {favoriteItems.map((favorite) => (
              <div
                key={`${favorite.resourceType}-${favorite.resourceId}`}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between"
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-2">
                  {favorite.label}
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-full shrink-0">
                  {favorite.resourceType}
                </span>
              </div>
            ))}
          </div>
        ) : favoritesLoading ? (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Chargement...
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-600 dark:text-slate-300">
              Tu n'as pas encore de favoris.
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Ajoute des exercices ou cours pour les retrouver ici.
            </p>
          </div>
        )}
      </div>

      {/* Choisir un niveau */}
      <div className="px-4">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          Ton niveau
        </h2>
        <div className="space-y-2">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
              className={`w-full text-left rounded-2xl border px-4 py-3.5 flex items-center justify-between transition-colors active:scale-[0.98] ${
                levelId === level.id
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                  : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {level.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {level.description}
                </p>
              </div>
              <ArrowRight
                className={`h-4 w-4 ${
                  levelId === level.id
                    ? "text-emerald-600"
                    : "text-gray-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};