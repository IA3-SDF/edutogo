"use client";

import { useRouter } from "next/navigation";
import { AdminDashboard } from "../../components/admin/AdminDashboard";
import { useApp } from "../providers";

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
