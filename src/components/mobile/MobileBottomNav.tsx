"use client";

import {
    BookOpen,
    Home,
    Library,
    Trophy,
    User,
} from "lucide-react";
import React from "react";

export type MobileTab = "home" | "learn" | "library" | "activities" | "profile";

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

const TABS: { id: MobileTab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "learn", label: "Apprendre", icon: BookOpen },
  { id: "library", label: "Bibliothèque", icon: Library },
  { id: "activities", label: "Activités", icon: Trophy },
  { id: "profile", label: "Profil", icon: User },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Halo supérieur pour la profondeur */}
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-white/80 dark:from-slate-900/80 to-transparent pointer-events-none" />
      
      {/* Container principal avec glassmorphism avancé */}
      <div className="relative bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border-t border-white/20 dark:border-slate-700/30 shadow-[0_-8px_32px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_32px_-4px_rgba(0,0,0,0.3)]">
        {/* Ligne d'accent subtile en haut */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-200/50 dark:via-emerald-800/30 to-transparent" />
        
        <div className="flex items-end justify-around h-[72px] pb-2 px-2 safe-area-pb">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="group relative flex flex-col items-center justify-end gap-1 w-16 h-full"
                aria-label={tab.label}
              >
                {/* Background glow actif */}
                {isActive && (
                  <div className="absolute inset-x-1 -top-1 bottom-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl transition-all duration-300 ease-out" />
                )}
                
                {/* Container icône avec badge/scale */}
                <div className="relative flex items-center justify-center">
                  {/* Cercle indicateur actif (petit point) */}
                  {isActive && (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] animate-pulse" />
                  )}
                  
                  <Icon
                    className={`h-[22px] w-[22px] transition-all duration-300 ease-out ${
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400 scale-110 drop-shadow-[0_2px_4px_rgba(16,185,129,0.25)]"
                        : "text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300 group-hover:scale-105"
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </div>

                {/* Label avec animation */}
                <span
                  className={`text-[10px] font-bold tracking-wide transition-all duration-300 ease-out ${
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400 translate-y-0 opacity-100"
                      : "text-gray-400 dark:text-slate-500 group-hover:text-gray-500 dark:group-hover:text-slate-400 translate-y-0.5 opacity-80"
                  }`}
                >
                  {tab.label}
                </span>

                {/* Barre de sélection active (style iOS 18) */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};