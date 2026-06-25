"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { MobileLayout } from "../../components/mobile/MobileLayout";
import { StudentDashboard } from "../../components/student/StudentDashboard";
import { useApp } from "../providers";

function StudentDashboardWithParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapterId") || undefined;
  const { db, selectedLevelId, isDarkMode } = useApp();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const query = "(max-width: 1023px)";
    const media = window.matchMedia(query);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (isMobile === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400 animate-pulse font-medium">
          Chargement du tableau de bord...
        </div>
      </div>
    );
  }

  const tab = searchParams.get("tab") as "home" | "learn" | "library" | "activities" | "profile" | null;
  const mobileInitialTab = tab || (chapterId ? "learn" : "home");

  if (isMobile) {
    return <MobileLayout initialChapterId={chapterId} initialTab={mobileInitialTab} />;
  }

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
