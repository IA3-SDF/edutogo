"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "../providers";
import { StudentDashboard } from "../../components/StudentDashboard";

function StudentDashboardWithParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapterId") || undefined;
  const { db, selectedLevelId, isDarkMode } = useApp();

  return (
    <StudentDashboard
      db={db}
      selectedLevelId={selectedLevelId}
      onBackToHome={() => router.push("/")}
      isDarkMode={isDarkMode}
      initialChapterId={chapterId}
    />
  );
}

export default function StudentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 animate-pulse font-medium">
            Chargement du tableau de bord...
          </div>
        </div>
      }
    >
      <StudentDashboardWithParams />
    </Suspense>
  );
}
