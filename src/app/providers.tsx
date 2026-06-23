"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseClient } from "../../lib/supabase";
import {
  deleteChapter,
  deleteCourse,
  deleteEvaluation,
  deleteExercise,
  deleteQuiz,
  deleteQuizGroup,
  deleteQuizQuestion,
  deleteSubject,
  fetchDatabaseState,
  fetchUserProfile,
  syncChapter,
  syncCourse,
  syncEvaluation,
  syncExercise,
  syncLevel,
  syncQuiz,
  syncQuizGroup,
  syncQuizQuestion,
  syncSubject,
  syncUserProfile,
} from "../../lib/supabaseFunctions";
import { DatabaseState, UserProfile } from "../../types";

interface AppContextProps {
  db: DatabaseState;
  setDb: (db: DatabaseState) => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  selectedLevelId: string;
  setSelectedLevelId: (val: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isSupabaseConnected: boolean;
  handleSelectLevel: (levelId: string) => void;
  handleUpdateDb: (updatedDb: DatabaseState) => void;
  handleUpdateUser: (updatedUser: UserProfile) => void;
  handleLogout: () => void;
  handleLogin: (customRole?: any) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// NOTE : aucune classe par défaut n'est imposée ici ("" et non "terminale").
// C'est la page de connexion / d'onboarding qui doit faire choisir sa classe
// à l'utilisateur. Si le type UserProfile.classLevel est une union stricte
// (ex: "seconde" | "premiere" | "terminale"), il faut l'élargir en `string`
// dans types.ts pour autoriser la valeur vide tant que l'utilisateur n'a pas choisi.
function createEmptyProfile(): UserProfile {
  return {
    fullName: "",
    role: "student",
    classLevel: "",
    email: "",
    preferences: { notifications: true, offlineMode: false },
  };
}

// Cookie helpers for robust middleware authentication sync
function setCookie(name: string, value: string, maxAgeInSeconds: number) {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAgeInSeconds}; SameSite=Lax;`;
  }
}

function deleteCookie(name: string) {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax;`;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [db, setDb] = useState<DatabaseState>({
    levels: [],
    subjects: [],
    chapters: [],
    courses: [],
    exercises: [],
    quizzes: [],
    evaluations: [],
  });
  const [user, setUser] = useState<UserProfile>(createEmptyProfile());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // Pas de niveau présélectionné : reste vide jusqu'à ce que l'utilisateur
  // choisisse sa classe (page de connexion ou clic sur une carte de niveau).
  const [selectedLevelId, setSelectedLevelId] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // 1. Theme Configuration
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Initial local state recovery from cookies
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedCookie = document.cookie.includes("edutogo-logged-in=true");
      if (isLoggedCookie) {
        setIsLoggedIn(true);
        // Try recovering some local profile fields from storage if present
        const savedUserStr = localStorage.getItem("edutogo-profile");
        if (savedUserStr) {
          try {
            const savedUser = JSON.parse(savedUserStr);
            setUser(savedUser);
            if (savedUser.classLevel) {
              setSelectedLevelId(savedUser.classLevel);
            }
          } catch (_) {}
        }
      }
    }
  }, []);

  // 2. Fetch App Global Database State (depuis Supabase uniquement)
  useEffect(() => {
    async function loadData() {
      const data = await fetchDatabaseState();
      setDb(data);
      const supabase = getSupabaseClient();
      if (supabase) {
        setIsSupabaseConnected(true);
      }
    }
    loadData();
  }, []);

  // 3. Supabase Auth state listener
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    // Recover session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setIsSupabaseConnected(true);

        fetchUserProfile(session.user.id).then((profile) => {
          const uProfile: UserProfile = profile || {
            fullName: session.user.user_metadata?.full_name || "Élève Togolais",
            role: (session.user.user_metadata?.role as "student" | "admin") || "student",
            // Pas de "terminale" par défaut : si aucune classe n'est encore
            // enregistrée côté profil, on laisse vide pour forcer le choix.
            classLevel: session.user.user_metadata?.class_level || "",
            email: session.user.email || "",
            preferences: { notifications: true, offlineMode: false },
          };

          setUser(uProfile);
          if (uProfile.classLevel) {
            setSelectedLevelId(uProfile.classLevel);
          }
          localStorage.setItem("edutogo-profile", JSON.stringify(uProfile));

          // Set cookies for robust routing middleware sync
          setCookie("edutogo-logged-in", "true", 86400 * 30);
          setCookie("edutogo-role", uProfile.role, 86400 * 30);
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        fetchUserProfile(session.user.id).then((profile) => {
          const uProfile: UserProfile = profile || {
            fullName: session.user.user_metadata?.full_name || "Élève Togolais",
            role: (session.user.user_metadata?.role as "student" | "admin") || "student",
            classLevel: session.user.user_metadata?.class_level || "",
            email: session.user.email || "",
            preferences: { notifications: true, offlineMode: false },
          };

          setUser(uProfile);
          if (uProfile.classLevel) {
            setSelectedLevelId(uProfile.classLevel);
          }
          localStorage.setItem("edutogo-profile", JSON.stringify(uProfile));

          // Set cookies
          setCookie("edutogo-logged-in", "true", 86400 * 30);
          setCookie("edutogo-role", uProfile.role, 86400 * 30);
        });
      } else {
        // Fallback checks - if logged in as guest/demo, keep that, otherwise clear
        const isLoggedCookie =
          typeof window !== "undefined" &&
          document.cookie.includes("edutogo-logged-in=true");
        if (!isLoggedCookie) {
          setIsLoggedIn(false);
          deleteCookie("edutogo-logged-in");
          deleteCookie("edutogo-role");
          localStorage.removeItem("edutogo-profile");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSelectLevel = (levelId: string) => {
    setSelectedLevelId(levelId);
    router.push("/student");
  };

  const handleUpdateDb = async (updatedDb: DatabaseState) => {
    // Fix: figer l'état précédent (sinon "db" peut être stale)
    const previousDb = db;

    // Optimistic update
    setDb(updatedDb);

    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      // 1. Levels Delta Sync
      for (const lvl of updatedDb.levels) {
        const prev = previousDb.levels.find((l) => l.id === lvl.id);
        if (!prev || JSON.stringify(prev) !== JSON.stringify(lvl)) {
          await syncLevel(lvl);
        }
      }

      // 2. Subjects Delta Sync & Del
      for (const sbj of updatedDb.subjects) {
        const prev = previousDb.subjects.find((s) => s.id === sbj.id);
        if (!prev || JSON.stringify(prev) !== JSON.stringify(sbj)) {
          await syncSubject(sbj);
        }
      }
      for (const sbj of previousDb.subjects) {
        if (!updatedDb.subjects.some((s) => s.id === sbj.id)) {
          await deleteSubject(sbj.id);
        }
      }

      // 3. Chapters Delta Sync & Del
      for (const chp of updatedDb.chapters) {
        const prev = previousDb.chapters.find((c) => c.id === chp.id);
        if (!prev || JSON.stringify(prev) !== JSON.stringify(chp)) {
          await syncChapter(chp);
        }
      }
      for (const chp of previousDb.chapters) {
        if (!updatedDb.chapters.some((c) => c.id === chp.id)) {
          await deleteChapter(chp.id);
        }
      }

      // 4. Courses Delta Sync & Del
      for (const crs of updatedDb.courses) {
        const prev = previousDb.courses.find((c) => c.id === crs.id);
        if (!prev || JSON.stringify(prev) !== JSON.stringify(crs)) {
          await syncCourse(crs);
        }
      }
      for (const crs of previousDb.courses) {
        if (!updatedDb.courses.some((c) => c.id === crs.id)) {
          await deleteCourse(crs.id);
        }
      }

      // 5. Exercises Delta Sync & Del
      for (const ex of updatedDb.exercises) {
        const prev = previousDb.exercises.find((e) => e.id === ex.id);
        if (!prev || JSON.stringify(prev) !== JSON.stringify(ex)) {
          await syncExercise(ex);
        }
      }
      for (const ex of previousDb.exercises) {
        if (!updatedDb.exercises.some((e) => e.id === ex.id)) {
          await deleteExercise(ex.id);
        }
      }

      // 6. Quizzes Delta Sync & Del
      // 6a. Quiz Groups + Questions (grouped model) — prefer syncing groups first
      if (updatedDb.quizGroups && updatedDb.quizGroups.length > 0) {
        for (const grp of updatedDb.quizGroups) {
          const prevGrp = previousDb.quizGroups?.find((g) => g.id === grp.id);
          if (!prevGrp || JSON.stringify(prevGrp) !== JSON.stringify(grp)) {
            await syncQuizGroup({ id: grp.id, chapterId: grp.chapterId, title: grp.title, metadata: (grp as any).metadata || {} });
          }

          // sync contained questions
          const prevQuestions = prevGrp?.questions || [];
          const nextQuestions = grp.questions || [];
          for (const q of nextQuestions) {
            const prevQ = prevQuestions.find((pq: any) => pq.id === q.id);
            if (!prevQ || JSON.stringify(prevQ) !== JSON.stringify(q)) {
              await syncQuizQuestion({
                id: q.id,
                chapterId: q.chapterId || grp.chapterId,
                quizGroupId: q.quizGroupId || grp.id,
                question: q.question,
                options: q.options || [],
                correctIndex: q.correctIndex ?? 0,
                explanation: q.explanation || "",
              } as any);
            }
          }

          // delete removed questions
          for (const prevQ of prevQuestions) {
            if (!nextQuestions.some((nq: any) => nq.id === prevQ.id)) {
              await deleteQuizQuestion(prevQ.id);
            }
          }
        }

        // delete removed groups
        for (const prevGrp of previousDb.quizGroups || []) {
          if (!updatedDb.quizGroups.some((g) => g.id === prevGrp.id)) {
            await deleteQuizGroup(prevGrp.id);
          }
        }
      }

      // 6b. Legacy flat quizzes (keep syncing for backward compatibility)
      for (const qz of updatedDb.quizzes) {
        const prev = previousDb.quizzes.find((q) => q.id === qz.id);
        if (!prev || JSON.stringify(prev) !== JSON.stringify(qz)) {
          await syncQuiz(qz);
        }
      }
      for (const qz of previousDb.quizzes) {
        if (!updatedDb.quizzes.some((q) => q.id === qz.id)) {
          await deleteQuiz(qz.id);
        }
      }

      // 7. Evaluations Delta Sync & Del
      for (const ev of updatedDb.evaluations) {
        const prev = previousDb.evaluations.find((e) => e.id === ev.id);
        if (!prev || JSON.stringify(prev) !== JSON.stringify(ev)) {
          await syncEvaluation(ev);
        }
      }
      for (const ev of previousDb.evaluations) {
        if (!updatedDb.evaluations.some((e) => e.id === ev.id)) {
          await deleteEvaluation(ev.id);
        }
      }
    } catch (err) {
      console.error("Delta Background sync to Supabase failed:", err);
    }
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    setUser(updatedUser);
    if (updatedUser.classLevel) {
      setSelectedLevelId(updatedUser.classLevel);
    }
    localStorage.setItem("edutogo-profile", JSON.stringify(updatedUser));
    setCookie("edutogo-role", updatedUser.role, 86400 * 30);

    // Sync to Supabase if logged in with Auth
    const supabase = getSupabaseClient();
    if (supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await syncUserProfile(updatedUser, session.user.id);
      }
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsLoggedIn(false);
    setUser(createEmptyProfile());
    setSelectedLevelId("");

    // Clear cookies & profile cache
    deleteCookie("edutogo-logged-in");
    deleteCookie("edutogo-role");
    localStorage.removeItem("edutogo-profile");

    router.push("/");
  };

  // customRole peut contenir { role, classLevel } choisis sur la page de
  // connexion. On ne force plus "terminale" par défaut : si aucune classe
  // n'est fournie, le profil reste vide jusqu'à sélection explicite.
  const handleLogin = (customRole?: { role?: "student" | "admin"; classLevel?: string }) => {
    setIsLoggedIn(true);
    const activeRole = customRole?.role || "student";
    const activeClassLevel = customRole?.classLevel || "";

    const profile: UserProfile = {
      fullName: activeRole === "admin" ? "Enseignant Togolais" : "Élève Togolais",
      role: activeRole,
      classLevel: activeClassLevel,
      email: activeRole === "admin" ? "enseignant@edutogo.tg" : "eleve@edutogo.tg",
      preferences: { notifications: true, offlineMode: false },
    };

    setUser(profile);
    if (activeClassLevel) {
      setSelectedLevelId(activeClassLevel);
    }
    localStorage.setItem("edutogo-profile", JSON.stringify(profile));

    // Save configuration to cookies for route middleware
    setCookie("edutogo-logged-in", "true", 86400 * 30);
    setCookie("edutogo-role", activeRole, 86400 * 30);

    if (activeRole === "admin") {
      router.push("/admin");
    } else {
      router.push("/student");
    }
  };

  return (
    <AppContext.Provider
      value={{
        db,
        setDb,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        selectedLevelId,
        setSelectedLevelId,
        isDarkMode,
        setIsDarkMode,
        isSupabaseConnected,
        handleSelectLevel,
        handleUpdateDb,
        handleUpdateUser,
        handleLogout,
        handleLogin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}