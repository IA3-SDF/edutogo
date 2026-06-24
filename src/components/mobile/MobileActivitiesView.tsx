"use client";

import {
  Bell,
  BookOpen,
  CheckCircle,
  Clock,
  Flame,
  Trophy,
} from "lucide-react";
import React from "react";
import { DatabaseState, UserProfile } from "../../../types";

interface MobileActivitiesViewProps {
  db: DatabaseState;
  user: UserProfile;
  selectedLevelId: string;
}

export const MobileActivitiesView: React.FC<MobileActivitiesViewProps> = ({
  db,
  user,
  selectedLevelId,
}) => {
  const levelId = user.classLevel || selectedLevelId || db.levels[0]?.id || "";

  const levelChapters = db.chapters.filter(
    (chapter) => chapter.levelId === levelId,
  );
  const completedCount = levelChapters.filter((c) => c.isCompleted).length;
  const progress =
    levelChapters.length > 0
      ? Math.round((completedCount / levelChapters.length) * 100)
      : 0;

  const levelSubjects = db.subjects.filter(
    (subject) => subject.levelId === levelId,
  );

  const stats = [
    {
      label: "Chapitres lus",
      value: completedCount,
      icon: BookOpen,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      label: "Jours consécutifs",
      value: 3,
      icon: Flame,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      label: "Quiz réussis",
      value: 12,
      icon: CheckCircle,
      color: "text-sky-600",
      bg: "bg-sky-50 dark:bg-sky-950/20",
    },
    {
      label: "Heures d'étude",
      value: 24,
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/20",
    },
  ];

  return (
    <div className="space-y-6 pb-24 px-4 pt-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Activités
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Ton suivi pédagogique
        </p>
      </div>

      {/* Progression globale */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Progression globale
          </h2>
          <span className="text-lg font-black text-emerald-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
          {completedCount} sur {levelChapters.length} chapitres complétés
        </p>
      </div>

      {/* Progression par matière */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
          Par matière
        </h2>
        <div className="space-y-3">
          {levelSubjects.map((subject) => {
            const subjectChapters = db.chapters.filter(
              (c) => c.subjectId === subject.id && c.levelId === levelId,
            );
            const subjectCompleted = subjectChapters.filter(
              (c) => c.isCompleted,
            ).length;
            const subjectProgress =
              subjectChapters.length > 0
                ? Math.round(
                    (subjectCompleted / subjectChapters.length) * 100,
                  )
                : 0;

            return (
              <div key={subject.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {subject.name}
                  </span>
                  <span className="text-xs font-mono text-gray-500">
                    {subjectProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${subjectProgress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4"
            >
              <div
                className={`h-9 w-9 rounded-xl ${stat.bg} flex items-center justify-center mb-2`}
              >
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-xl font-black text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide font-semibold">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-amber-500" />
          Notifications
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                Nouveau chapitre disponible
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Probabilités - Terminale
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-slate-600 mt-1.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                Rappel de révision
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Tu as 2 exercices en attente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};