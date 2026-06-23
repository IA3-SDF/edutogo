"use client";

import {
  LogIn,
  Moon,
  Search,
  Settings as SettingsIcon,
  Sun
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { bucketFromStoragePath, getSignedUrl } from "../../lib/supabaseFunctions";
import { AuthModal } from "../components/AuthModal";
import { useApp } from "./providers";

export function HeaderFooterWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [avatarSrc, setAvatarSrc] = React.useState<string | null>(null);
  const {
    db,
    user,
    isLoggedIn,
    selectedLevelId,
    isDarkMode,
    setIsDarkMode,
    isSupabaseConnected,
    handleSelectLevel,
    handleLogin,
    handleLogout,
  } = useApp();

  React.useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, [searchParams]);

  React.useEffect(() => {
    let active = true;
    async function loadAvatar() {
      if (!user.avatarUrl || !isSupabaseConnected) {
        setAvatarSrc(null);
        return;
      }
      try {
        const bucket = bucketFromStoragePath(user.avatarUrl || "");
        // getSignedUrl handles all logic: returns publicUrl for avatars, signedUrl for others
        const url = await getSignedUrl(bucket, user.avatarUrl || "");
        if (active) setAvatarSrc(url);
      } catch (err) {
        console.error("[HeaderFooterWrapper] loadAvatar", err);
        setAvatarSrc(null);
      }
    }
    loadAvatar();
    return () => {
      active = false;
    };
  }, [user.avatarUrl, isSupabaseConnected]);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const isAdmin = pathname === "/admin";

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
        isDarkMode ? "bg-slate-950 text-slate-100" : "bg-gray-50 text-slate-800"
      }`}
    >
      {/* Dynamic Global Top Header (does not show or alters configuration when in nested Admin full view) */}
      {!isAdmin && (
        <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 transition-colors duration-200">
          {/* Decorative National Togo Ribbon */}
          <div className="h-1 w-full bg-linear-to-r from-emerald-600 via-yellow-400 to-red-600" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Left Brand Area */}
            <div className="flex items-center gap-8">
              <button
                id="header-brand-logo"
                onClick={() => router.push("/")}
                className="flex items-center gap-1.5 focus:outline-hidden cursor-pointer"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center bg-emerald-50 dark:bg-emerald-950 rounded-xl border border-emerald-250 dark:border-emerald-800 shadow-xs">
                  <span className="font-display font-black text-emerald-600 dark:text-emerald-400 text-lg">
                    E
                  </span>
                  <span className="font-display font-black text-yellow-500 text-lg">
                    T
                  </span>
                </div>
                <div className="text-left leading-none font-display text-lg font-bold tracking-tight text-gray-950 dark:text-white">
                  Edu
                  <span className="text-emerald-600 dark:text-emerald-500">
                    Togo
                  </span>
                </div>
              </button>

              {/* Central Level selections indicators */}
              <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
                {db.levels.map((lvl) => {
                  const isActive =
                    pathname === "/student" && selectedLevelId === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      id={`nav-${lvl.id}`}
                      onClick={() => handleSelectLevel(lvl.id)}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? "bg-emerald-500 text-white font-bold"
                          : "text-gray-650 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {lvl.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right Control actions panel */}
            <div className="flex items-center gap-3">
              {/* Supabase Connection Status Badge */}
              {isSupabaseConnected ? (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-800"
                  title="Connecté à la base de données Supabase Live"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live BD
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-150 dark:border-amber-800"
                  title="Aucune information Supabase trouvée dans les variables d'environnement. Mode de démonstration de haute fidélité."
                >
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Offline Demo
                </span>
              )}

              <div className="hidden md:inline-flex items-center rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 transition-colors focus-within:ring-2 focus-within:ring-emerald-500">
                <Search className="h-4 w-4 mr-2 text-gray-500 dark:text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleSearch()}
                  placeholder="Rechercher un cours..."
                  className="min-w-0 bg-transparent focus:outline-none"
                />
              </div>
              <button
                className="md:hidden p-2 bg-gray-50 dark:bg-slate-800 border border-gray-150 dark:border-slate-700 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 dark:text-gray-300 cursor-pointer"
                title="Rechercher un cours"
                onClick={handleSearch}
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Dark mode switcher using customized Sun / Moon icons */}
              <button
                id="btn-mode-toggle"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 bg-gray-50 dark:bg-slate-800 border border-gray-150 dark:border-slate-700 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 dark:text-gray-300 cursor-pointer"
                title="Basculer le thème"
              >
                {isDarkMode ? (
                  <Sun className="h-4.5 w-4.5 text-yellow-400" />
                ) : (
                  <Moon className="h-4.5 w-4.5" />
                )}
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    id="btn-goto-settings"
                    onClick={() => router.push("/settings")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-transparent transition-colors text-xs font-bold cursor-pointer ${
                      pathname === "/settings"
                        ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 text-emerald-700"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <SettingsIcon className="h-4 w-4 text-gray-400" />
                    <span className="hidden md:inline">Profil</span>
                  </button>

                  {/* Miniature Circle Initials badge linking to setting */}
                  <button
                    onClick={() => router.push("/settings")}
                    className="h-8.5 w-8.5 rounded-full overflow-hidden bg-linear-to-tr from-emerald-600 to-sky-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/10 cursor-pointer"
                  >
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span>
                        {user.fullName
                          ? user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "KA"}
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  id="btn-login-trigger"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  Connexion
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main View Page Controller Router component */}
      <main className="flex-1 w-full bg-linear-to-b from-transparent to-gray-50/20 dark:to-slate-950/20">
        {children}
      </main>

      {/* Static Togo Footer - shown only when outside of standard fullscreen Admin Dashboards & Landing page */}
      {!isAdmin && pathname !== "/" && (
        <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs py-8 text-gray-400 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800 dark:text-gray-300">
                EduTogo
              </span>
              <span>· Conforme aux directives MEPST du Togo</span>
            </div>
            <p>
              © 2026 EduTogo. Plateforme Éducative Togolaise. Réussite garantie
              au Baccalauréat.
            </p>
          </div>
        </footer>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(role) => handleLogin(role)}
      />
    </div>
  );
}
