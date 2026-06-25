"use client";

import { Bell, BookOpen, CheckCircle, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  fetchUserNotifications,
  markNotificationRead,
} from "../../../lib/supabaseFunctions";
import {
  DatabaseState,
  UserNotification,
  UserProfile,
} from "../../../types";

interface MobileActivitiesViewProps {
  db: DatabaseState;
  user: UserProfile;
  selectedLevelId: string;
}

const notificationLabel = (
  notification: UserNotification,
  db: DatabaseState,
) => {
  if (notification.resourceType && notification.resourceId) {
    switch (notification.resourceType) {
      case "course": {
        const course = db.courses.find((item) => item.id === notification.resourceId);
        return course ? course.title : notification.title;
      }
      case "exercise": {
        const exercise = db.exercises.find((item) => item.id === notification.resourceId);
        return exercise ? `${exercise.number} – ${exercise.title}` : notification.title;
      }
      case "quiz": {
        const quizGroup = db.quizGroups?.find((item) => item.id === notification.resourceId);
        if (quizGroup) return quizGroup.title;
        const quiz = db.quizzes.find((item) => item.id === notification.resourceId);
        return quiz ? quiz.question.slice(0, 40) : notification.title;
      }
      case "evaluation": {
        const evaluation = db.evaluations.find((item) => item.id === notification.resourceId);
        return evaluation ? evaluation.title : notification.title;
      }
      default:
        return notification.title;
    }
  }
  return notification.title;
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
};

export const MobileActivitiesView: React.FC<MobileActivitiesViewProps> = ({
  db,
  user,
  selectedLevelId,
}) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const levelId = user.classLevel || selectedLevelId || db.levels[0]?.id || "";

  const levelChapters = useMemo(
    () => db.chapters.filter((chapter) => chapter.levelId === levelId),
    [db.chapters, levelId],
  );
  const completedCount = useMemo(
    () => levelChapters.filter((c) => c.isCompleted).length,
    [levelChapters],
  );
  const progress = useMemo(
    () => (levelChapters.length > 0 ? Math.round((completedCount / levelChapters.length) * 100) : 0),
    [completedCount, levelChapters.length],
  );

  const levelSubjects = useMemo(
    () => db.subjects.filter((subject) => subject.levelId === levelId),
    [db.subjects, levelId],
  );

  useEffect(() => {
    if (!user.id) return;
    let canceled = false;
    setNotificationsLoading(true);

    fetchUserNotifications(user.id)
      .then((items) => {
        if (!canceled) setNotifications(items);
      })
      .catch((error) => {
        console.error("Erreur chargement notifications mobile:", error);
      })
      .finally(() => {
        if (!canceled) setNotificationsLoading(false);
      });

    return () => {
      canceled = true;
    };
  }, [user.id]);

  const stats = [
    {
      label: "Chapitres lus",
      value: completedCount,
      icon: BookOpen,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      label: "Chapitre(s) total(s)",
      value: levelChapters.length,
      icon: Trophy,
      color: "text-slate-700",
      bg: "bg-slate-50 dark:bg-slate-950/20",
    },
    {
      label: "Progression",
      value: `${progress}%`,
      icon: CheckCircle,
      color: "text-sky-600",
      bg: "bg-sky-50 dark:bg-sky-950/20",
    },
    {
      label: "Matières",
      value: levelSubjects.length,
      icon: BookOpen,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/20",
    },
  ];

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const handleNotificationClick = async (notification: UserNotification) => {
    if (notification.id) {
      await markNotificationRead(notification.id);
      setNotifications((items) =>
        items.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item,
        ),
      );
    }

    if (notification.resourceId && notification.resourceType) {
      if (notification.resourceType === "course" || notification.resourceType === "exercise" || notification.resourceType === "quiz" || notification.resourceType === "evaluation") {
        const chapterId = db.courses.find((item) => item.id === notification.resourceId)?.chapterId
          || db.exercises.find((item) => item.id === notification.resourceId)?.chapterId
          || db.quizzes.find((item) => item.id === notification.resourceId)?.chapterId
          || db.quizGroups?.find((item) => item.id === notification.resourceId)?.chapterId;
        if (chapterId) {
          router.push(`/student?chapterId=${chapterId}`);
          return;
        }
      }
    }

    if (notification.resourceId) {
      router.push(`/student?chapterId=${notification.resourceId}`);
      return;
    }
  };

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
          {notificationsLoading ? (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 p-4 text-sm text-gray-500 dark:text-slate-400">
              Chargement des notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 p-4 text-sm text-gray-500 dark:text-slate-400">
              Aucune notification pour le moment.
            </div>
          ) : (
            notifications.slice(0, 3).map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full text-left rounded-3xl border px-4 py-3 transition-colors ${
                  notification.isRead
                    ? "border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-950/40"
                    : "border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {notificationLabel(notification, db)}
                  </p>
                  {!notification.isRead ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Nouveau
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {notification.message}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-slate-600 mt-2">
                  {formatDate(notification.createdAt)}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};