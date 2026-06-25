"use client";

import {
  AlertCircle,
  Bell,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Loader2,
  LogOut,
  Mail,
  Monitor,
  Moon,
  Save,
  Settings,
  Shield,
  Smartphone,
  Sparkles,
  Sun,
  User,
  X
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { getSupabaseClient } from "../../../lib/supabase";
import {
  fetchUserProfile,
  syncUserProfile
} from "../../../lib/supabaseFunctions";
import { useProfileAvatar } from "../../../lib/useProfileAvatar";
import { useApp } from "../../app/providers";

/* ==========================================================================
   NOTIFICATION BANNER SYSTEM
   Replaces native alert() with premium inline banners
   ========================================================================== */
type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationBanner {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

function useNotification() {
  const [banners, setBanners] = useState<NotificationBanner[]>([]);

  const push = useCallback(
    (type: NotificationType, title: string, message: string, duration = 5000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const banner: NotificationBanner = { id, type, title, message };
      setBanners((prev) => [...prev, banner]);
      if (duration > 0) {
        setTimeout(() => {
          setBanners((prev) => prev.filter((b) => b.id !== id));
        }, duration);
      }
      return id;
    },
    [],
  );

  const dismiss = useCallback((id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return { banners, push, dismiss };
}

/* ==========================================================================
   PREMIUM TOGGLE SWITCH
   Accessible, animated, theme-aware
   ========================================================================== */
function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  icon: Icon,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  icon?: React.ElementType;
}) {
  return (
    <label className="flex items-start gap-4 cursor-pointer group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className="h-4 w-4 text-(--color-text-muted) shrink-0" />
          )}
          <span className="font-semibold text-sm text-(--color-text)">
            {label}
          </span>
        </div>
        {description && (
          <p className="text-[11px] text-(--color-text-faint) mt-0.5 leading-relaxed max-w-md">
            {description}
          </p>
        )}
      </div>
      <div className="relative inline-flex shrink-0 mt-0.5">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className="w-11 h-6 rounded-full bg-(--color-surface-alt) border border-(--color-border-strong)
                     peer-checked:bg-(--color-accent) peer-checked:border-(--color-accent)
                     transition-all duration-300 ease-in-out
                     peer-focus-visible:ring-2 peer-focus-visible:ring-(--color-accent-soft)"
        />
        <div
          className="absolute top-[3px] left-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm
                     transition-transform duration-300 ease-in-out
                     peer-checked:translate-x-5"
        />
      </div>
    </label>
  );
}

/* ==========================================================================
   SECTION CARD
   Premium container using Æther design tokens
   ========================================================================== */
function SectionCard({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`card card-elevated ${className}`}
    >
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-(--color-border)">
        <div className="p-2 rounded-lg bg-(--color-accent-soft)">
          <Icon className="h-5 w-5 text-(--color-accent)" />
        </div>
        <h3 className="font-display font-bold text-base text-(--color-text)">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

/* ==========================================================================
   SETTINGS VIEW — PREMIUM EDITION
   ========================================================================== */
export function SettingsView() {
  const {
    user,
    setUser,
    db,
    handleUpdateUser,
    handleLogout,
    isDarkMode,
    setIsDarkMode,
    isSupabaseConnected,
    isLoggedIn,
  } = useApp();

  const { banners, push, dismiss } = useNotification();

  /* ── Local form state ─────────────────────────────────────────────── */
  const [fullName, setFullName] = useState(user.fullName || "");
  const [email, setEmail] = useState(user.email || "");
  const [classLevel, setClassLevel] = useState(user.classLevel || "");
  const [notifState, setNotifState] = useState(
    user.preferences?.notifications ?? true,
  );
  const [offlineState, setOfflineState] = useState(
    user.preferences?.offlineMode ?? false,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const {
    avatarSrc,
    isUploadingAvatar,
    avatarInputRef,
    handleAvatarUpload,
    handleAvatarFile,
  } = useProfileAvatar({
    user,
    handleUpdateUser: async (updatedUser) => {
      await handleUpdateUser(updatedUser);
      setUser(updatedUser);
    },
    onUploadError: (message) => push("error", "Échec du téléversement", message),
    onUploadSuccess: (updatedUser) => {
      setUser(updatedUser);
      push("success", "Avatar enregistré", "Votre nouvelle photo de profil a bien été téléversée.");
    },
  });

  /* ── Sync local state when context user changes ───────────────────── */
  useEffect(() => {
    setFullName(user.fullName || "");
    setEmail(user.email || "");
    setClassLevel(user.classLevel || "");
    setNotifState(user.preferences?.notifications ?? true);
    setOfflineState(user.preferences?.offlineMode ?? false);
  }, [user]);

  /* ── Detect unsaved changes ───────────────────────────────────────── */
  useEffect(() => {
    const changed =
      fullName !== (user.fullName || "") ||
      email !== (user.email || "") ||
      classLevel !== (user.classLevel || "") ||
      notifState !== (user.preferences?.notifications ?? true) ||
      offlineState !== (user.preferences?.offlineMode ?? false);
    setHasChanges(changed);
  }, [fullName, email, classLevel, notifState, offlineState, user]);

  /* ── Fetch real profile from Supabase on mount ────────────────────── */
  useEffect(() => {
    async function loadProfile() {
      if (!isSupabaseConnected || !isLoggedIn) return;
      const supabase = getSupabaseClient();
      if (!supabase) return;

      setIsLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setUser(profile);
            setFullName(profile.fullName || "");
            setEmail(profile.email || "");
            setClassLevel(profile.classLevel || "");
            setNotifState(profile.preferences?.notifications ?? true);
            setOfflineState(profile.preferences?.offlineMode ?? false);
          }
        }
      } catch (err) {
        console.error("[SettingsView] Failed to load profile:", err);
        push("error", "Erreur de chargement", "Impossible de récupérer votre profil depuis le serveur.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [isSupabaseConnected, isLoggedIn, setUser, push]);

  /* ── Avatar initials ──────────────────────────────────────────────── */
  const initials = fullName
    ? fullName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "ET";

  /* ── Handle save ──────────────────────────────────────────────────── */
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;

    setIsSaving(true);

    const updatedUser = {
      ...user,
      fullName: fullName.trim(),
      email: email.trim(),
      classLevel,
      preferences: {
        notifications: notifState,
        offlineMode: offlineState,
      },
    };

    try {
      // 1. Update local context (optimistic)
      handleUpdateUser(updatedUser);

      // 2. Sync to Supabase if connected
      if (isSupabaseConnected) {
        const supabase = getSupabaseClient();
        if (supabase) {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.user?.id) {
            const ok = await syncUserProfile(updatedUser, session.user.id);
            if (!ok) {
              throw new Error("syncUserProfile returned false");
            }
          }
        }
      }

      push(
        "success",
        "Profil sauvegardé",
        "Vos préférences et données scolaires ont été enregistrées avec succès.",
      );
      setHasChanges(false);
    } catch (err) {
      console.error("[SettingsView] Save failed:", err);
      push(
        "error",
        "Échec de la sauvegarde",
        "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.",
      );
    } finally {
      setIsSaving(false);
    }
  };


  /* ── Handle logout with confirmation ─────────────────────────────── */
  const handleConfirmLogout = () => {
    push("warning", "Déconnexion", "Vous allez être déconnecté de votre session.");
    setTimeout(() => handleLogout(), 1200);
  };

  // Avatar is handled by `useProfileAvatar`; no local avatar loading needed here.

  /* ── Determine role label ─────────────────────────────────────────── */
  const roleLabel =
    user.role === "admin" ? "Enseignant / Inspecteur" : "Étudiant Lycéen";
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="skeleton h-10 w-64 mb-2" />
        <div className="skeleton h-4 w-96 mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <div className="skeleton h-80 rounded-xl" />
          </div>
          <div className="md:col-span-8 space-y-6">
            <div className="skeleton h-48 rounded-xl" />
            <div className="skeleton h-48 rounded-xl" />
            <div className="skeleton h-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* ═══════════════════════════════════════════════════════════════
          NOTIFICATION BANNERS (fixed top, dismissible)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {banners.map((b) => (
          <div
            key={b.id}
            className={`pointer-events-auto toast toast-${b.type} animate-in slide-in-from-right duration-300`}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {b.type === "success" && (
                <CheckCircle2 className="h-5 w-5 text-(--color-success) shrink-0 mt-0.5" />
              )}
              {b.type === "error" && (
                <AlertCircle className="h-5 w-5 text-(--color-danger) shrink-0 mt-0.5" />
              )}
              {b.type === "warning" && (
                <AlertCircle className="h-5 w-5 text-(--color-warning) shrink-0 mt-0.5" />
              )}
              {b.type === "info" && (
                <Sparkles className="h-5 w-5 text-(--color-info) shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-(--color-text)">
                  {b.title}
                </p>
                <p className="text-xs text-(--color-text-muted) leading-relaxed mt-0.5">
                  {b.message}
                </p>
              </div>
              <button
                onClick={() => dismiss(b.id)}
                className="shrink-0 p-1 rounded-md hover:bg-(--color-surface-alt) text-(--color-text-faint) transition-colors"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-(--color-accent-soft)">
            <Settings className="h-6 w-6 text-(--color-accent)" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-(--color-text)">
            Mon Espace Élève
          </h1>
        </div>
        <p className="text-sm text-(--color-text-muted) max-w-xl leading-relaxed">
          Gérez vos données personnelles, configurez votre série du Bac et
          personnalisez votre expérience de révision.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              LEFT COLUMN — Profile Card (4 cols)
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="lg:col-span-4 space-y-6">
            {/* Avatar Card */}
            <div className="card card-elevated text-center space-y-5 p-6 sm:p-8">
              <div
                className="relative inline-block mx-auto"
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
              >
                <div
                  className="h-28 w-28 rounded-full overflow-hidden relative border-4 border-(--color-surface) shadow-lg transition-transform duration-300"
                  style={{
                    transform: avatarHover ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-3xl font-bold bg-linear-to-tr from-(--color-accent) to-(--color-blue-400) text-white">
                      {initials}
                    </div>
                  )}
                </div>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFile}
                />
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-0 right-0 p-2 bg-(--color-accent) hover:bg-(--color-accent-hover)
                             text-white rounded-full shadow-lg border-2 border-(--color-surface)
                             transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  title="Changer de photo"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-(--color-text) capitalize">
                  {fullName.trim() || "Étudiant Anonyme"}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-(--color-accent) tracking-wide uppercase">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {roleLabel}
                </span>
              </div>

              <div className="pt-3 border-t border-(--color-border)">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-(--color-text-faint)">Inscrit depuis</span>
                  <span className="font-mono font-medium text-(--color-text-muted)">
                    mai 2026
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-(--color-text-faint)">Préparation</span>
                  <span className="font-medium text-(--color-text-muted)">
                    BAC Togolais
                  </span>
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="pt-3 border-t border-(--color-border)">
                <button
                  type="button"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-full flex items-center justify-between gap-3 p-3 rounded-xl
                             bg-(--color-surface-alt) hover:bg-(--color-border) transition-colors
                             text-sm font-medium text-(--color-text-muted) cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    {isDarkMode ? (
                      <Moon className="h-4 w-4 text-(--color-accent)" />
                    ) : (
                      <Sun className="h-4 w-4 text-(--color-amber-400)" />
                    )}
                    {isDarkMode ? "Mode Sombre" : "Mode Clair"}
                  </span>
                  <div
                    className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-(--color-accent)"
                        : "bg-(--color-border-strong)"
                    }`}
                  >
                    <div
                      className={`absolute top-[2px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                        isDarkMode ? "translate-x-4.5 left-[2px]" : "translate-x-0 left-[2px]"
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-full btn btn-danger justify-center gap-2 text-xs"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>

            {/* Quick Stats */}
            <div className="card space-y-4 p-5">
              <h4 className="font-display font-bold text-sm text-(--color-text)">
                Résumé rapide
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-(--color-surface-alt) text-center">
                  <BookOpen className="h-5 w-5 text-(--color-accent) mx-auto mb-1" />
                  <div className="text-lg font-bold font-display text-(--color-text)">
                    {db.levels.find((l) => l.id === classLevel)?.name || "—"}
                  </div>
                  <div className="text-[10px] text-(--color-text-faint) uppercase tracking-wide">
                    Classe
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-(--color-surface-alt) text-center">
                  <Clock className="h-5 w-5 text-(--color-green-600) mx-auto mb-1" />
                  <div className="text-lg font-bold font-display text-(--color-text)">
                    Actif
                  </div>
                  <div className="text-[10px] text-(--color-text-faint) uppercase tracking-wide">
                    Statut
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              RIGHT COLUMN — Settings Sections (8 cols)
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="lg:col-span-8 space-y-6">
            {/* ── A. Scolarité ───────────────────────────────────────── */}
            <SectionCard title="Ma Scolarité" icon={BookOpen}>
              <div className="space-y-3">
                <label className="block text-xs font-bold text-(--color-text-muted) uppercase tracking-wide">
                  Sélectionner ma classe
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {db.levels.map((lvl) => {
                    const isSelected = classLevel === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setClassLevel(lvl.id)}
                        className={`relative px-4 py-3.5 rounded-xl border-2 font-semibold text-xs text-center
                          transition-all duration-200 cursor-pointer
                          ${
                            isSelected
                              ? "border-(--color-accent) bg-(--color-accent-soft) text-(--color-accent)"
                              : "border-(--color-border) bg-(--color-surface) text-(--color-text-muted) hover:border-(--color-border-strong) hover:bg-(--color-surface-alt)"
                          }`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="absolute top-2 right-2 h-3.5 w-3.5 text-(--color-accent)" />
                        )}
                        <span className="block truncate">{lvl.name}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-(--color-text-faint) leading-relaxed">
                  Cela configurera votre tableau de bord académique de manière à
                  n'afficher que le programme officiel de ce niveau lors du
                  lancement de vos séances de révisions.
                </p>
              </div>
            </SectionCard>

            {/* ── B. Informations Personnelles ───────────────────────── */}
            <SectionCard title="Informations Personnelles" icon={User}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-(--color-text-muted)">
                    Nom Complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--color-text-faint)" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="ex: Koffi Amen"
                      required
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-(--color-text-muted)">
                    Adresse Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--color-text-faint)" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ex: mail@domain.tg"
                      required
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ── C. Préférences de Révision ─────────────────────────── */}
            <SectionCard title="Préférences de Révision" icon={Bell}>
              <div className="space-y-5">
                <ToggleSwitch
                  checked={notifState}
                  onChange={setNotifState}
                  label="Conseils par Telegram"
                  description="Recevez des rappels quotidiens de révision méthodologiques et d'actualités du BAC directement sur votre téléphone."
                  icon={Smartphone}
                />

                <div className="border-t border-(--color-border) pt-5">
                  <ToggleSwitch
                    checked={offlineState}
                    onChange={setOfflineState}
                    label="Stockage Hors-Ligne"
                    description="Mise en cache automatique des cours et épreuves (DS/BAC) téléchargés pour réviser sans connexion internet."
                    icon={Monitor}
                  />
                </div>
              </div>
            </SectionCard>

            {/* ── D. Sécurité du Compte ──────────────────────────────── */}
            <SectionCard title="Sécurité du Compte" icon={Shield}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-(--color-text)">
                    Mot de passe
                  </p>
                  <p className="text-[11px] text-(--color-text-faint) mt-0.5">
                    Dernière modification il y a 3 mois
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    push(
                      "info",
                      "Fonctionnalité à venir",
                      "La modification du mot de passe sera disponible prochainement.",
                    )
                  }
                  className="btn btn-secondary text-xs"
                >
                  Modifier
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </SectionCard>

            {/* ── Save Bar ───────────────────────────────────────────── */}
            <div
              className={`flex items-center justify-end gap-4 pt-2 transition-opacity duration-300 ${
                hasChanges ? "opacity-100" : "opacity-50 pointer-events-none"
              }`}
            >
              {hasChanges && (
                <span className="text-xs text-(--color-text-faint)">
                  Modifications non sauvegardées
                </span>
              )}
              <button
                type="submit"
                disabled={!hasChanges || isSaving}
                className="btn btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sauvegarde…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Sauvegarder mon compte
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}