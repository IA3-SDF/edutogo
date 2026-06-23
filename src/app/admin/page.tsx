"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../providers";
import { AdminDashboard } from "../../components/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  const { db, handleUpdateDb, isDarkMode, setIsDarkMode, handleLogout } =
    useApp();

  return (
    <AdminDashboard
      db={db}
      onUpdateDb={handleUpdateDb}
      onExitAdmin={() => router.push("/student")}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      onLogout={handleLogout}
    />
  );
}
