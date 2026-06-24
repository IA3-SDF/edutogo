"use client";

import {
    Download,
    Heart,
    History,
    Trash2,
    WifiOff
} from "lucide-react";
import React, { useState } from "react";
import { useFavorites } from "../../../lib/useFavorites";
import { DatabaseState } from "../../../types";

type LibraryTab = "favorites" | "history" | "offline" | "downloads";

interface MobileLibraryViewProps {
  db: DatabaseState;
}

export const MobileLibraryView: React.FC<MobileLibraryViewProps> = ({ db }) => {
  const [activeTab, setActiveTab] = useState<LibraryTab>("favorites");
  const { favorites, isLoading: favoritesLoading } = useFavorites();

  const tabs: { id: LibraryTab; label: string; icon: typeof Heart }[] = [
    { id: "favorites", label: "Favoris", icon: Heart },
    { id: "history", label: "Historique", icon: History },
    { id: "offline", label: "Hors-ligne", icon: WifiOff },
    { id: "downloads", label: "Téléchargés", icon: Download },
  ];

  const getResourceLabel = (resourceId: string, resourceType: string) => {
    switch (resourceType) {
      case "course": {
        const course = db.courses.find((item) => item.id === resourceId);
        return course ? course.title : "Cours";
      }
      case "exercise": {
        const exercise = db.exercises.find((item) => item.id === resourceId);
        return exercise
          ? `${exercise.number} - ${exercise.title}`
          : "Exercice";
      }
      case "quiz": {
        const group = db.quizGroups?.find((item) => item.id === resourceId);
        if (group) return group.title;
        const quiz = db.quizzes.find((item) => item.id === resourceId);
        return quiz
          ? quiz.question.slice(0, 40) +
              (quiz.question.length > 40 ? "..." : "")
          : "QCM";
      }
      case "evaluation": {
        const evaluation = db.evaluations.find(
          (item) => item.id === resourceId,
        );
        return evaluation ? evaluation.title : "Évaluation";
      }
      default:
        return "Ressource";
    }
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Bibliothèque
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Tes ressources sauvegardées
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mt-4 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="px-4 pt-4 space-y-3">
        {/* === FAVORIS === */}
        {activeTab === "favorites" && (
          <>
            {favoritesLoading ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">Chargement...</p>
              </div>
            ) : favorites.length > 0 ? (
              favorites.map((fav) => (
                <div
                  key={`${fav.resourceType}-${fav.resourceId}`}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {getResourceLabel(fav.resourceId, fav.resourceType)}
                      </p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {fav.resourceType}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Heart className="mx-auto h-10 w-10 text-gray-300 dark:text-slate-700 mb-2" />
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Aucun favori pour le moment
                </p>
              </div>
            )}
          </>
        )}

        {/* === HISTORIQUE === */}
        {activeTab === "history" && (
          <div className="text-center py-12">
            <History className="mx-auto h-10 w-10 text-gray-300 dark:text-slate-700 mb-2" />
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Historique bientôt disponible
            </p>
          </div>
        )}

        {/* === HORS-LIGNE === */}
        {activeTab === "offline" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Stockage utilisé
                </span>
                <span className="text-xs font-mono text-gray-500">0 MB</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-0" />
              </div>
            </div>
            <div className="text-center py-8">
              <WifiOff className="mx-auto h-10 w-10 text-gray-300 dark:text-slate-700 mb-2" />
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Aucun contenu hors-ligne
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                Télécharge des cours pour les consulter sans connexion
              </p>
            </div>
          </div>
        )}

        {/* === TÉLÉCHARGEMENTS === */}
        {activeTab === "downloads" && (
          <div className="text-center py-12">
            <Download className="mx-auto h-10 w-10 text-gray-300 dark:text-slate-700 mb-2" />
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Aucun téléchargement
            </p>
          </div>
        )}
      </div>
    </div>
  );
};