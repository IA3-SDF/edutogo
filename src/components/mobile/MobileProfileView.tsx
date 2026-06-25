"use client";

import {
  Bell,
  BookOpen,
  Camera,
  ChevronRight,
  LogOut,
  Mail,
  Moon,
  Shield,
  Smartphone,
  Sun,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  fetchUserNotifications,
  markNotificationRead,
} from "../../../lib/supabaseFunctions";
import { useProfileAvatar } from "../../../lib/useProfileAvatar";
import {
  DatabaseState,
  UserNotification,
  UserProfile,
} from "../../../types";
import { useApp } from "../../app/providers";

interface MobileProfileViewProps {
  user: UserProfile;
  db: DatabaseState;
  onLogout: () => void;
}

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
};

export const MobileProfileView: React.FC<MobileProfileViewProps> = ({
  user,
  db,
  onLogout,
}) => {
  const { isDarkMode, setIsDarkMode, handleUpdateUser } = useApp();
  const levelName =
    db.levels.find((l) => l.id === user.classLevel)?.name || "Non défini";

  const [pendingInstallPrompt, setPendingInstallPrompt] = useState<
    InstallPromptEvent | null
  >(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user.preferences?.notifications ?? true,
  );
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && typeof Notification !== "undefined"
      ? Notification.permission
      : "default",
  );
  const [latestNotifications, setLatestNotifications] = useState<
    UserNotification[]
  >([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [draftFullName, setDraftFullName] = useState(user.fullName || "");
  const [draftClassLevel, setDraftClassLevel] = useState(user.classLevel || "");

  useEffect(() => {
    setDraftFullName(user.fullName || "");
    setDraftClassLevel(user.classLevel || "");
  }, [user.fullName, user.classLevel]);

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
    },
    onUploadSuccess: (_updatedUser, url) => {
      setNotificationMessage("Avatar téléversé avec succès.");
      if (url) {
        // Optional: we already display the loaded avatar from hook state
      }
    },
    onUploadError: (message) => {
      setNotificationMessage(message);
    },
  });

  // Show loader while notifications or minimal profile data are still loading
  const PremiumLoader = require("../shared/PremiumLoader").default;
  // Only show loader when a user is present but data (notifications) are still loading.
  const shouldShowLoader = !!user && notificationsLoading && latestNotifications.length === 0;

  const router = useRouter();

  // If no user detected, show a guest view with a clear login CTA.
  if (!user || !user.id) {
    return (
      <div className="space-y-6 pb-24 px-4 pt-8">
        <div className="card card-elevated p-6 text-center">
          <h3 className="text-lg font-bold mb-2">Bienvenue sur EduTogo</h3>
          <p className="text-sm text-gray-500 mb-4">Connectez-vous pour accéder à votre espace, vos favoris et notifications.</p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/auth")}
              className="px-5 py-2 bg-emerald-600 text-white rounded-md font-semibold"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = useMemo(
    () => latestNotifications.filter((notification) => !notification.isRead).length,
    [latestNotifications],
  );

  useEffect(() => {
    setNotificationsEnabled(user.preferences?.notifications ?? true);
  }, [user.preferences]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setPushPermission(
      typeof Notification !== "undefined" ? Notification.permission : "default",
    );

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPendingInstallPrompt(event as InstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setPendingInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsAppInstalled(true);
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          setIsServiceWorkerReady(true);
        })
        .catch(() => {
          setIsServiceWorkerReady(false);
        });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (!user.id) return;
    let canceled = false;
    setNotificationsLoading(true);

    fetchUserNotifications(user.id)
      .then((items) => {
        if (!canceled) {
          setLatestNotifications(items);
        }
      })
      .catch((error) => {
        console.error("Erreur chargement notifications", error);
      })
      .finally(() => {
        if (!canceled) {
          setNotificationsLoading(false);
        }
      });

    return () => {
      canceled = true;
    };
  }, [user.id]);

  const handlePromptInstall = useCallback(async () => {
    if (!pendingInstallPrompt) return;
    await pendingInstallPrompt.prompt();
    const choice = await pendingInstallPrompt.userChoice;
    setIsAppInstalled(choice.outcome === "accepted");
    setPendingInstallPrompt(null);
  }, [pendingInstallPrompt]);

  const handlePushToggle = useCallback(async () => {
    const nextValue = !notificationsEnabled;

    if (nextValue && typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);

      if (permission !== "granted") {
        setNotificationMessage(
          "Autorisation de notifications refusée. Réessaie dans les réglages du navigateur.",
        );
        return;
      }
    }

    const updatedProfile: UserProfile = {
      ...user,
      preferences: {
        ...user.preferences,
        notifications: nextValue,
      },
    };

    setNotificationsEnabled(nextValue);
    handleUpdateUser(updatedProfile);
  }, [handleUpdateUser, notificationsEnabled, user]);

  const handleOfflineToggle = useCallback(() => {
    const updatedProfile: UserProfile = {
      ...user,
      preferences: {
        ...user.preferences,
        offlineMode: !user.preferences.offlineMode,
      },
    };

    handleUpdateUser(updatedProfile);
  }, [handleUpdateUser, user]);

  const handleMarkRead = useCallback(async (notificationId: number) => {
    const success = await markNotificationRead(notificationId);
    if (!success) {
      setNotificationMessage("Impossible de marquer cette notification comme lue.");
      return;
    }
    setLatestNotifications((items) =>
      items.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item,
      ),
    );
  }, []);

  const handleSaveProfile = useCallback(async () => {
    const trimmedFullName = draftFullName.trim();
    const updatedProfile: UserProfile = {
      ...user,
      fullName: trimmedFullName || user.fullName,
      classLevel: draftClassLevel || user.classLevel,
    };

    await handleUpdateUser(updatedProfile);
    setIsEditModalOpen(false);
    setNotificationMessage("Informations personnelles mises à jour.");
  }, [draftClassLevel, draftFullName, handleUpdateUser, user]);

  const menuItems = [
    {
      icon: User,
      label: "Informations personnelles",
      value: user.fullName || "Non renseigné",
      action: () => setIsEditModalOpen(true),
    },
    {
      icon: Mail,
      label: "Email",
      value: user.email || "Non renseigné",
      action: () => {},
    },
    {
      icon: BookOpen,
      label: "Classe",
      value: levelName,
      action: () => setIsEditModalOpen(true),
    },
    {
      icon: Bell,
      label: "Notifications",
      value: notificationsEnabled ? "Activées" : "Désactivées",
      action: handlePushToggle,
    },
    {
      icon: Smartphone,
      label: "Mode hors-ligne",
      value: user.preferences?.offlineMode ? "Activé" : "Désactivé",
      action: handleOfflineToggle,
    },
    {
      icon: Shield,
      label: "Sécurité",
      value: "Modifier le mot de passe",
      action: () => {},
    },
  ];

  if (shouldShowLoader) {
    return <PremiumLoader message={"Chargement de votre espace mobile..."} />;
  }

  return (
    <div className="space-y-6 pb-24 px-4 pt-4">
      {/* Header profil */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-600 to-sky-500 text-white flex items-center justify-center text-xl font-bold overflow-hidden">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span>
                {user.fullName
                  ? user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "ET"}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAvatarUpload}
            disabled={isUploadingAvatar}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-emerald-600 border border-emerald-200 shadow-sm hover:bg-emerald-50 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
            title="Changer l'avatar"
          >
            {isUploadingAvatar ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarFile}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {user.fullName || "Étudiant"}
            </h1>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-full border border-gray-200 dark:border-slate-700 px-2 py-1 text-[11px] font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              Modifier
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {user.role === "admin" ? "Enseignant" : "Élève"} · {levelName}
          </p>
        </div>
      </div>

      {/* Thème */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isDarkMode ? (
            <Moon className="h-5 w-5 text-indigo-400" />
          ) : (
            <Sun className="h-5 w-5 text-amber-500" />
          )}
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {isDarkMode ? "Mode sombre" : "Mode clair"}
          </span>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`relative w-12 h-7 rounded-full transition-colors ${
            isDarkMode ? "bg-emerald-500" : "bg-gray-300 dark:bg-slate-600"
          }`}
        >
          <div
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              isDarkMode ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Installation + notifications */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Installation & notifications
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Ajoute l'application à ton écran d'accueil et active les alertes.
            </p>
          </div>
          <div className="text-right text-xs text-gray-500 dark:text-slate-400">
            <p>{isServiceWorkerReady ? "SW prêt" : "SW indisponible"}</p>
            <p>
              {pushPermission === "granted"
                ? "Permission accordée"
                : pushPermission === "denied"
                ? "Notifications bloquées"
                : "Permission non définie"}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={handlePromptInstall}
            disabled={!pendingInstallPrompt || isAppInstalled}
            className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {isAppInstalled
              ? "Application installée"
              : pendingInstallPrompt
              ? "Installer l'application"
              : "Installation non disponible"}
          </button>
          <button
            onClick={handlePushToggle}
            className={`rounded-2xl px-4 py-3 text-sm font-bold text-white ${
              notificationsEnabled
                ? "bg-slate-700 hover:bg-slate-800"
                : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            {notificationsEnabled
              ? "Désactiver les notifications"
              : "Activer les notifications"}
          </button>
        </div>

        {notificationMessage ? (
          <div className="rounded-2xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/40 px-3 py-2 text-xs text-yellow-700 dark:text-yellow-200">
            {notificationMessage}
          </div>
        ) : null}
      </div>

      {/* Menu */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-4 py-4 text-left active:bg-gray-50 dark:active:bg-slate-800 transition-colors ${
                idx !== menuItems.length - 1
                  ? "border-b border-gray-100 dark:border-slate-800"
                  : ""
              }`}
            >
              <Icon className="h-5 w-5 text-gray-400 dark:text-slate-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                  {item.value}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Notifications history */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Dernières notifications
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
            </p>
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400">
            {notificationsLoading
              ? "Chargement..."
              : `${latestNotifications.length} reçues`}
          </span>
        </div>

        {latestNotifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 p-4 text-sm text-gray-500 dark:text-slate-400">
            Aucune notification pour le moment.
          </div>
        ) : (
          <div className="space-y-3">
            {latestNotifications.slice(0, 3).map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleMarkRead(notification.id)}
                className={`w-full text-left rounded-3xl border px-4 py-3 transition-colors ${
                  notification.isRead
                    ? "border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-950/40"
                    : "border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {notification.title}
                  </p>
                  {!notification.isRead ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Nouveau
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {notification.message}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-slate-600 mt-2">
                  {formatDate(notification.createdAt)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Déconnexion */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 font-semibold text-sm active:scale-[0.98] transition-transform"
      >
        <LogOut className="h-4 w-4" />
        Déconnexion
      </button>

      {/* Edit profile modal */}
      {isEditModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Modifier le profil</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">Mets à jour ton nom et ta classe.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                Nom complet
              </label>
              <input
                value={draftFullName}
                onChange={(event) => setDraftFullName(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ton nom complet"
              />

              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                Classe
              </label>
              <select
                value={draftClassLevel}
                onChange={(event) => setDraftClassLevel(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Sélectionne ta classe</option>
                {db.levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-2xl border border-gray-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-slate-200"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-xs text-gray-400 dark:text-slate-600">
          EduTogo · Plateforme Éducative Togolaise
        </p>
        <p className="text-[10px] text-gray-300 dark:text-slate-700 mt-1">
          v1.0.0 · Conforme MEPST
        </p>
      </div>
    </div>
  );
};