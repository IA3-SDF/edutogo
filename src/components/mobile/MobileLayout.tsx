"use client";

import React, { useState } from "react";
import { useApp } from "../../app/providers";
import { MobileActivitiesView } from "./MobileActivitiesView";
import { MobileBottomNav, MobileTab } from "./MobileBottomNav";
import { MobileHomeView } from "./MobileHomeView";
import { MobileLearnView } from "./MobileLearnView";
import { MobileLibraryView } from "./MobileLibraryView";
import { MobileProfileView } from "./MobileProfileView";

export const MobileLayout: React.FC<{
  initialChapterId?: string | null;
  initialTab?: MobileTab;
}> = ({
  initialChapterId,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>(
    initialTab || (initialChapterId ? "learn" : "home"),
  );
  const { db, user, selectedLevelId, handleSelectLevel, handleLogout } =
    useApp();

  React.useEffect(() => {
    if (!initialTab) return;
    setActiveTab(initialTab);
  }, [initialTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <MobileHomeView
            levels={db.levels}
            db={db}
            user={user}
            selectedLevelId={selectedLevelId}
            onSelectLevel={(levelId) => {
              handleSelectLevel(levelId);
              setActiveTab("learn");
            }}
          />
        );
      case "learn":
        return (
          <MobileLearnView
            db={db}
            selectedLevelId={selectedLevelId}
            onSelectLevel={handleSelectLevel}
            initialChapterId={initialChapterId}
          />
        );
      case "library":
        return <MobileLibraryView db={db} />;
      case "activities":
        return (
          <MobileActivitiesView
            db={db}
            user={user}
            selectedLevelId={selectedLevelId}
          />
        );
      case "profile":
        return (
          <MobileProfileView
            user={user}
            db={db}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080b17] text-slate-900 dark:text-slate-100">
      {/* Contenu scrollable */}
      <main className="pt-2">
        {renderContent()}
      </main>

      {/* Bottom Navigation fixe */}
      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};