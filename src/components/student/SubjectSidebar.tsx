import React from "react";
import {
  Calculator,
  Flame,
  Leaf,
  BookOpen,
  PenTool,
  Globe,
  Languages,
} from "lucide-react";
import { Subject } from "../../../types";

interface SubjectSidebarProps {
  subjects: Subject[];
  selectedSubject: Subject;
  levelId: string;
  onSelectSubject: (subject: Subject) => void;
}

// Mappe le nom d'icône stocké en base vers le composant lucide correspondant
const renderSubjectIcon = (iconName: string, colorClass: string) => {
  const iconProps = { className: `h-5 w-5 ${colorClass}` };
  switch (iconName) {
    case "Calculator":
      return <Calculator {...iconProps} />;
    case "Flame":
      return <Flame {...iconProps} />;
    case "Leaf":
      return <Leaf {...iconProps} />;
    case "BookOpen":
      return <BookOpen {...iconProps} />;
    case "PenTool":
      return <PenTool {...iconProps} />;
    case "Globe":
      return <Globe {...iconProps} />;
    case "Languages":
      return <Languages {...iconProps} />;
    default:
      return <BookOpen {...iconProps} />;
  }
};

export const SubjectSidebar: React.FC<SubjectSidebarProps> = ({
  subjects,
  selectedSubject,
  levelId,
  onSelectSubject,
}) => {
  return (
    <div className="lg:col-span-3 space-y-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
        Mes Matières ({levelId.toUpperCase()})
      </h3>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 shadow-xs space-y-1">
        {subjects.map((sub) => {
          const isSelected = selectedSubject.id === sub.id;

          const activeStyle =
            "bg-primary-50 text-primary-700 dark:bg-slate-700/40 dark:text-white border-l-4 border-primary-600";
          const inactiveStyle =
            "text-gray-700 dark:text-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-slate-700/30 dark:hover:text-white";

          return (
            <button
              key={sub.id}
              onClick={() => onSelectSubject(sub)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all ${
                isSelected ? activeStyle : inactiveStyle
              }`}
            >
              <span className="flex items-center gap-3">
                {renderSubjectIcon(
                  sub.icon,
                  isSelected
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-400 dark:text-slate-500",
                )}
                {sub.name}
              </span>
              <span className="font-mono text-[10px] font-bold text-gray-400 dark:text-slate-500">
                {sub.progress}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Information National Exams Card */}
      <div className="bg-linear-to-br from-emerald-600 to-sky-700 text-white rounded-2xl p-5 shadow-lg space-y-3">
        <h4 className="font-display font-bold text-sm">Baccalauréats Togo</h4>
        <p className="text-[11px] text-emerald-100 leading-relaxed">
          Toutes les épreuves disponibles de la session 2021 à 2023
          respectent strictement la réforme éducative du Togo (U.E - Unité
          d'Enseignement).
        </p>
      </div>
    </div>
  );
};