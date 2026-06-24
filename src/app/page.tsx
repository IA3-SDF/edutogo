"use client";

import { useRouter } from "next/navigation";
import { LoggedInLandingPage } from "../components/student/LoggedInLandingPage";
import { LandingPage } from "../components/student/LandingPage";
import { MobileLayout } from "../components/mobile/MobileLayout";
import './globals.css';
import { useApp } from "./providers";

export default function Home() {
  const router = useRouter();
  const {
    db,
    user,
    isLoggedIn,
    selectedLevelId,
    handleSelectLevel,
    setSelectedLevelId,
    isDarkMode,
  } = useApp();

  const handleSelectChapter = (chapterId: string, levelSlug: string) => {
    setSelectedLevelId(levelSlug);
    router.push(`/student?chapterId=${chapterId}`);
  };

  if (isLoggedIn) {
    return (
      <>
        {/* MOBILE */}
        <div className="lg:hidden">
          <MobileLayout />
        </div>
        
        {/* DESKTOP */}
        <div className="hidden lg:block">
          <LoggedInLandingPage
            levels={db.levels}
            db={db}
            user={user}
            selectedLevelId={selectedLevelId}
            onSelectLevel={handleSelectLevel}
            onOpenStudentDashboard={() => router.push("/student")}
            isDarkMode={isDarkMode}
          />
        </div>
      </>
    );
  }

  return (
    <LandingPage
      levels={db.levels}
      subjects={db.subjects}
      onSelectLevel={handleSelectLevel}
      onSelectChapter={handleSelectChapter}
      onEnterAdmin={() => router.push("/admin")}
      isDarkMode={isDarkMode}
    />
  );
}