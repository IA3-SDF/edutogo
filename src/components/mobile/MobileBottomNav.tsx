"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Home,
  Library,
  Trophy,
  User,
} from "lucide-react";
import React, { useState, useEffect } from "react"; // 1. Ajout de useState et useEffect
//version de production
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
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false); // 2. État pour suivre le rendu client

  // 3. Déclenché uniquement après une hydratation réussie sur le client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 4. On applique les réductions d'animation seulement si on est sur le client
  const shouldReduceMotion = isMounted && prefersReducedMotion;

  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 38, mass: 0.9 };

  const tapTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.15, ease: "easeOut" as const };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      role="navigation"
      aria-label="Navigation principale"
    >
      <div className="pointer-events-none absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-white/60 dark:from-slate-950/60 to-transparent" />

      <div className="px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div
          className="relative mx-auto flex max-w-md items-stretch gap-0.5 rounded-[28px] border border-black/[0.06] dark:border-white/[0.08]
                     bg-white/90 dark:bg-slate-900/85 backdrop-blur-xl px-1.5 py-1.5
                     shadow-[0_12px_32px_-8px_rgba(15,23,42,0.18),0_2px_8px_-2px_rgba(15,23,42,0.08)]
                     dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)]"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
                className="relative flex-1 select-none touch-manipulation rounded-[22px] outline-none
                           focus-visible:ring-2 focus-visible:ring-emerald-500/40"
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTabBackground"
                    className="absolute inset-0 rounded-[22px] bg-emerald-500/10 dark:bg-emerald-400/[0.14]"
                    transition={springTransition}
                  />
                )}

                <motion.span
                  className="relative z-10 flex flex-col items-center justify-center gap-1 py-2"
                  whileTap={shouldReduceMotion ? {} : { scale: 0.92 }} // 5. Désactivation propre du tap
                  transition={tapTransition}
                >
                  <Icon
                    className={`h-[21px] w-[21px] shrink-0 transition-colors duration-200 ${
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-gray-400 dark:text-slate-500"
                    }`}
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                  <span
                    className={`whitespace-nowrap text-[10.5px] font-semibold tracking-tight transition-colors duration-200 ${
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-gray-400 dark:text-slate-500"
                    }`}
                  >
                    {tab.label}
                  </span>
                </motion.span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
