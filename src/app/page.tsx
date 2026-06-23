"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "./providers";
import { LandingPage } from "../components/LandingPage";
import './globals.css';
export default function Home() {
  const router = useRouter();
  const { db, handleSelectLevel, setSelectedLevelId, isDarkMode } = useApp();

  const handleSelectChapter = (chapterId: string, levelSlug: string) => {
    setSelectedLevelId(levelSlug);
    router.push(`/student?chapterId=${chapterId}`);
  };

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
/*      const maths = filteredSubjects.find((s) =>
        s.name.toLowerCase().includes("math"),
      );
*/
