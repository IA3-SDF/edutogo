import React from "react";
import { Sun, Moon } from "lucide-react";
import { Chapter, Subject, Level } from "../../../types";

interface AdminWorkspaceHeaderProps {
  currentChapter: Chapter | undefined;
  currentSubject: Subject | undefined;
  currentLevel: Level | undefined;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onExitAdmin: () => void;
}

export const AdminWorkspaceHeader: React.FC<AdminWorkspaceHeaderProps> = ({
  currentChapter,
  currentSubject,
  currentLevel,
  isDarkMode,
  setIsDarkMode,
  onExitAdmin,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-(--color-border) pb-4 mb-2">
      {/* Permanent Breadcrumb Trail */}
      <div className="breadcrumb flex items-center flex-wrap gap-2 text-xs text-(--color-text-muted) font-mono">
        <span className="uppercase tracking-wider font-bold">Backoffice</span>
        <span className="sep text-(--color-border-strong)">/</span>
        <span>{currentLevel?.name || "Classe"}</span>
        <span className="sep text-(--color-border-strong)">/</span>
        <span>{currentSubject?.name || "Matière"}</span>
        <span className="sep text-(--color-border-strong)">/</span>
        {currentChapter && (
          <span className="current text-(--color-text) font-bold">
            Chapitre {String(currentChapter.number).padStart(2, "0")}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Dark mode switcher icon */}
        <button
          id="admin-theme-toggle"
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) hover:bg-(--color-surface-alt) text-(--color-text-muted) cursor-pointer transition-colors"
          title="Basculer le thème"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 text-(--color-warning)" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={onExitAdmin}
          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) hover:bg-(--color-surface-alt) text-(--color-text-muted) cursor-pointer"
        >
          Retour Élève
        </button>
      </div>
    </div>
  );
};