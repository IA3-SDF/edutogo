import React from "react";
import {
  BookOpenText,
  Calculator,
  HelpCircle,
  Bookmark,
  ChevronRight,
  CheckCircle,
  Lock,
} from "lucide-react";
import { Subject, Chapter } from "../../../types";

type ClassroomTab = "cours" | "exercices" | "qcm" | "solutions";

interface ChapterClassroomSidebarProps {
  subject: Subject;
  activeChapter: Chapter;
  chapters: Chapter[];
  progressPercentage: number;
  classroomTab: ClassroomTab;
  onTabChange: (tab: ClassroomTab) => void;
  onSelectChapter: (chapter: Chapter) => void;
}

const TABS: { id: ClassroomTab; label: string; icon: typeof BookOpenText }[] = [
  { id: "cours", label: "Cours & Notions", icon: BookOpenText },
  { id: "exercices", label: "Exercices d'application", icon: Calculator },
  { id: "qcm", label: "Quiz QCM (Interactif)", icon: HelpCircle },
  { id: "solutions", label: "Feuille des Corrigés", icon: Bookmark },
];

export const ChapterClassroomSidebar: React.FC<
  ChapterClassroomSidebarProps
> = ({
  subject,
  activeChapter,
  chapters,
  progressPercentage,
  classroomTab,
  onTabChange,
  onSelectChapter,
}) => {
  return (
    <div className="lg:col-span-3 space-y-6">
      {/* Subject/Level Context Card */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-xs">
        <h3 className="font-display font-medium text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
          {subject.name}
        </h3>
        <h2 className="font-display lg:text-lg font-bold text-gray-900 dark:text-white leading-tight mb-4">
          {activeChapter.title}
        </h2>

        {/* Progress gauge inside the course study tool */}
        <div className="pt-3 border-t border-gray-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>Progression générale</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Content Toggle Actions */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 shadow-xs space-y-1">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          const isSelected = classroomTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl text-left transition-all ${
                isSelected
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <span className="flex items-center gap-3">
                <TabIcon
                  className={`h-4.5 w-4.5 ${isSelected ? "text-white" : "text-gray-400 dark:text-slate-500"}`}
                />
                {tab.label}
              </span>
              {!isSelected && (
                <ChevronRight className="h-4 w-4 text-gray-300 dark:text-slate-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Chapters Navigator within subject */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
          Programme du Semestre
        </h4>
        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {chapters.map((ch) => {
            const isChActive = activeChapter.id === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => onSelectChapter(ch)}
                className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left text-xs transition-colors ${
                  isChActive
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 font-bold"
                    : ch.isLocked
                      ? "text-gray-400 line-through cursor-not-allowed"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/30"
                }`}
                disabled={ch.isLocked}
              >
                {ch.isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : ch.isLocked ? (
                  <Lock className="h-4 w-4 text-gray-300 dark:text-slate-600 shrink-0 mt-0.5" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-gray-300 dark:border-slate-600 shrink-0 mt-0.5 flex items-center justify-center font-mono text-[9px]">
                    {ch.number}
                  </div>
                )}
                <span className="line-clamp-2">{ch.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};