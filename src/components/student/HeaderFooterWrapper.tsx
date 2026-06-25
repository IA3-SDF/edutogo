"use client";

import {
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useProfileAvatar } from "../../../lib/useProfileAvatar";
import { useApp } from "../../app/providers";
import { AuthModal } from "./AuthModal";

// Champ de recherche réutilisé en version desktop (toujours visible)
// et en version mobile (deuxième ligne dépliable, pour ne jamais
// chevaucher les boutons thème/compte).
function HeaderSearchField({
  value,
  onChange,
  onSubmit,
  autoFocus,
  onClose,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  autoFocus?: boolean;
  onClose?: () => void;
  className?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div
      className={`flex w-full items-center gap-2 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors ${className}`}
    >
      <Search className="h-4 w-4 text-gray-500 dark:text-slate-400 shrink-0" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && onSubmit()}
        placeholder="Rechercher un cours..."
        suppressHydrationWarning
        className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
      />
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la recherche"
          className="shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      <button
        type="button"
        onClick={onSubmit}
        aria-label="Rechercher"
        className="shrink-0 rounded-full bg-emerald-600 p-2 text-white transition-colors hover:bg-emerald-700"
      >
        <Search className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

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
  const [isMobile, setIsMobile] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
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

  const { avatarSrc } = useProfileAvatar({ user });

  React.useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, [searchParams]);

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const updateIsMobile = () => setIsMobile(media.matches);
    updateIsMobile();
    media.addEventListener("change", updateIsMobile);
    return () => media.removeEventListener("change", updateIsMobile);
  }, []);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setIsMobileSearchOpen(false);
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
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors duration-200">
          {/* Decorative National Togo Ribbon */}
          <div className="h-1 w-full bg-linear-to-r from-emerald-600 via-yellow-400 to-red-600" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Ligne principale : une seule rangée sur tous les écrans, jamais de chevauchement */}
            <div className="flex h-16 items-center justify-between gap-2">
              {/* Marque + navigation par niveau (desktop) */}
              <div className="flex items-center gap-6 min-w-0">
                <button
                  id="header-brand-logo"
                  onClick={() => router.push("/")}
                  className="flex items-center gap-2 shrink-0 focus:outline-hidden cursor-pointer"
                >
                  <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center bg-emerald-50 dark:bg-emerald-950 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-xs">
                    <span className="font-display font-black text-[13px] tracking-tighter text-emerald-600 dark:text-emerald-400">
                      ET
                    </span>
                  </div>
                  {/* Le wordmark se cache uniquement sur les très petits écrans (ex. iPhone SE) pour garder le monogramme seul, sans jamais déborder */}
                  <span className="hidden min-[380px]:inline whitespace-nowrap text-left leading-none font-display text-lg font-bold tracking-tight text-gray-950 dark:text-white">
                    Edu
                    <span className="text-emerald-600 dark:text-emerald-500">
                      Togo
                    </span>
                  </span>
                </button>

                <nav className="hidden md:flex items-center gap-1 overflow-x-auto text-xs font-semibold">
                  {db.levels.map((lvl) => {
                    const isActive = pathname === "/student" && selectedLevelId === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        id={`nav-${lvl.id}`}
                        onClick={() => handleSelectLevel(lvl.id)}
                        className={`shrink-0 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          isActive
                            ? "bg-emerald-500 text-white font-bold"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {lvl.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Actions : recherche, thème, compte */}
              <div className="flex shrink-0 items-center gap-1.5">
                {/* Recherche desktop : toujours visible, largeur stable */}
                <div className="hidden sm:block w-56 focus-within:w-72 transition-[width] duration-300 ease-out">
                  <HeaderSearchField
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSubmit={handleSearch}
                  />
                </div>

                {/* Déclencheur de recherche mobile : icône seule, jamais en conflit avec les autres boutons */}
                <button
                  type="button"
                  onClick={() => setIsMobileSearchOpen((open) => !open)}
                  aria-label={isMobileSearchOpen ? "Fermer la recherche" : "Rechercher"}
                  aria-expanded={isMobileSearchOpen}
                  className={`sm:hidden rounded-lg border p-2 transition-colors cursor-pointer ${
                    isMobileSearchOpen
                      ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                      : "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <Search className="h-4.5 w-4.5" />
                </button>

                {/* Thème */}
                <button
                  id="btn-mode-toggle"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-2 text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                  title="Basculer le thème"
                  aria-label="Basculer le thème"
                >
                  {isDarkMode ? (
                    <Sun className="h-4.5 w-4.5 text-yellow-400" />
                  ) : (
                    <Moon className="h-4.5 w-4.5" />
                  )}
                </button>

                {/* Compte : avatar si connecté, bouton de connexion sinon — jamais les deux, jamais aucun */}
                {isLoggedIn ? (
                  <button
                    onClick={() => router.push(isMobile ? "/student?tab=profile" : "/settings")}
                    className="h-9 w-9 shrink-0 rounded-full overflow-hidden bg-linear-to-tr from-emerald-600 to-sky-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/10 cursor-pointer"
                    title={isMobile ? "Ouvrir le profil mobile" : "Ouvrir les paramètres"}
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
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="shrink-0 whitespace-nowrap rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 cursor-pointer"
                  >
                    Connexion
                  </button>
                )}
              </div>
            </div>

            {/* Recherche mobile : deuxième ligne dépliable, jamais superposée à la première */}
            <div
              className={`sm:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                isMobileSearchOpen ? "max-h-16 opacity-100 pb-3" : "max-h-0 opacity-0"
              }`}
              aria-hidden={!isMobileSearchOpen}
            >
              <HeaderSearchField
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleSearch}
                autoFocus={isMobileSearchOpen}
                onClose={() => setIsMobileSearchOpen(false)}
              />
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
        <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs py-8 text-gray-400 transition-colors hidden lg:block">
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

