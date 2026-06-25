import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { bucketFromStoragePath, getSignedUrl, trackChapterView } from "../../../lib/supabaseFunctions";
import { useFavorites } from "../../../lib/useFavorites";
import {
  Chapter,
  DatabaseState,
  Exercise,
  Subject,
} from "../../../types";
import { ChapterClassroomSidebar } from "./ChapterClassroomSidebar";
import { ChapterList } from "./ChapterList";
import { CoursTab } from "./CoursTab";
import { EvaluationSidebar } from "./EvaluationSidebar";
import { ExercicesTab } from "./ExercicesTab";
import { ExerciseDetailDrawer } from "./ExerciseDetailDrawer";
import { QcmTab } from "./QcmTab";
import { SolutionsTab } from "./SolutionsTab";
import { SubjectSidebar } from "./SubjectSidebar";

type ClassroomTab = "cours" | "exercices" | "qcm" | "solutions";

interface StudentDashboardProps {
  db: DatabaseState;
  selectedLevelId: string;
  onBackToHome: () => void;
  isDarkMode: boolean;
  initialChapterId?: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  db,
  selectedLevelId,
  onBackToHome,
  isDarkMode,
  initialChapterId,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Hook pour gérer les favoris
  const {
    favorites,
    isFavorite,
    toggleFavoriteState,
  } = useFavorites();

  // Show premium loader while Supabase or initial data isn't ready
  const isDataAvailable = db && Array.isArray(db.subjects) && db.subjects.length > 0 && Array.isArray(db.chapters);

  // Get subjects related to current level
  const filteredSubjects = db.subjects.filter(
    (sub) => sub.levelId === selectedLevelId,
  );
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Set default subject if changed
  useEffect(() => {
    if (filteredSubjects.length > 0) {
      // Prioritize Maths if available
      const maths = filteredSubjects.find((s) =>
        s.id.toLowerCase().includes("math"),
      );
      setSelectedSubject(maths || filteredSubjects[0]);
    } else {
      setSelectedSubject(null);
    }
  }, [selectedLevelId, db.subjects]);

  useEffect(() => {
    // Simule un temps de chargement de 1.5 seconde
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer); // Nettoyage du timer
  }, [selectedSubject]);

  // Selected State variables
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [classroomTab, setClassroomTab] = useState<ClassroomTab>("cours");
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [selectedExerciseForDetail, setSelectedExerciseForDetail] =
    useState<Exercise | null>(null);

  // Support popular chapter click redirection on mount
  useEffect(() => {
    if (initialChapterId && db.chapters.length > 0) {
      const chapter = db.chapters.find(
        (ch) => String(ch.id) === String(initialChapterId),
      );
      if (chapter) {
        const subject = db.subjects.find(
          (s) => String(s.id) === String(chapter.subjectId),
        );
        if (subject) {
          setSelectedSubject(subject);
          setActiveChapter(chapter);
          setClassroomTab("cours");
          setActiveSectionIndex(0);
        }
      }
    }
  }, [initialChapterId, db.chapters, db.subjects]);

  // Interactive student scores & reveals
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>(
    {},
  );
  const [revealedSolutions, setRevealedSolutions] = useState<
    Record<string, boolean>
  >({});
  const [qcmAnswers, setQcmAnswers] = useState<Record<string, number>>({}); // questionId -> selectedIndex
  const [qcmAnswered, setQcmAnswered] = useState<Record<string, boolean>>({}); // questionId -> submitted
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false); // whole quiz submitted flag
  const [downloadTracker, setDownloadTracker] = useState<
    Record<string, boolean>
  >({});

  // Chapters of the current subject & level
  const activeChapters = selectedSubject
    ? db.chapters.filter(
        (ch) =>
          ch.subjectId === selectedSubject.id && ch.levelId === selectedLevelId,
      )
    : [];

  // Filter evaluations (DS vs Annales)
  const activeEvaluations = selectedSubject
    ? db.evaluations.filter(
        (ev) =>
          ev.levelId === selectedLevelId && ev.subjectId === selectedSubject.id,
      )
    : [];
  const assessmentsDS = activeEvaluations.filter((e) => e.type === "DS");
  const assessmentsAnnales = activeEvaluations.filter(
    (e) => e.type === "Annale",
  );

  // Load classroom files dynamically based on activeChapter
  const chapterCourses = db.courses.filter(
    (co) => co.chapterId === activeChapter?.id,
  );

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!activeChapter) {
      setSelectedCourseId(null);
      return;
    }

    if (chapterCourses.length === 1) {
      setSelectedCourseId(chapterCourses[0].id);
      return;
    }

    if (
      selectedCourseId &&
      !chapterCourses.some((course) => course.id === selectedCourseId)
    ) {
      setSelectedCourseId(null);
    }
  }, [activeChapter, chapterCourses, selectedCourseId]);

  if (!selectedSubject) {
    // If data not yet available, show premium loader
    if (!isDataAvailable || isLoading) {
      const PremiumLoader = require("../shared/PremiumLoader").default;
      return <PremiumLoader message={"Préparation de votre espace..."} />;
    }

    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl shadow-xs">
        <p className="text-gray-500">Aucune matière disponible pour ce niveau.</p>
        <button onClick={onBackToHome} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const currentCourse = selectedCourseId
    ? chapterCourses.find((co) => co.id === selectedCourseId) || null
    : chapterCourses.length === 1
    ? chapterCourses[0]
    : null;

  const currentExercises = db.exercises.filter(
    (ex) => ex.chapterId === activeChapter?.id,
  );
  const currentQuizzes = db.quizzes.filter(
    (qz) => qz.chapterId === activeChapter?.id,
  );

  const currentQuizGroups = db.quizGroups?.filter(
    (group) => group.chapterId === activeChapter?.id,
  );

  // Build Sets of favorite IDs for efficient lookup
  const favoriteExerciseIds = new Set(
    favorites
      .filter((fav) => fav.resourceType === "exercise")
      .map((fav) => fav.resourceId),
  );
  const favoriteQuizGroupIds = new Set(
    favorites
      .filter((fav) => fav.resourceType === "quiz")
      .map((fav) => fav.resourceId),
  );
  const favoriteCourseIds = new Set(
    favorites
      .filter((fav) => fav.resourceType === "course")
      .map((fav) => fav.resourceId),
  );
  const favoriteEvaluationIds = new Set(
    favorites
      .filter((fav) => fav.resourceType === "evaluation")
      .map((fav) => fav.resourceId),
  );

  // Stats
  const completedChaptersCount = activeChapters.filter(
    (c) => c.isCompleted,
  ).length;
  const totalChaptersCount = activeChapters.length;
  const progressPercentage =
    totalChaptersCount > 0
      ? Math.round((completedChaptersCount / totalChaptersCount) * 100)
      : 0;

  // Toggle active chapter to enter classroom
  const handleChapterAccess = (
    chapter: Chapter,
    initialTab: ClassroomTab = "cours",
  ) => {
    if (chapter.isLocked) return; // locked chapters
    setActiveChapter(chapter);
    setClassroomTab(initialTab);
    setActiveSectionIndex(0);
    // resets
    setRevealedHints({});
    setRevealedSolutions({});
    setQcmAnswers({});
    setQuizSubmitted(false);
    // Track chapter view in Supabase (silencieux, ne bloque pas l'UX)
    trackChapterView(chapter.id);
  };

  const handleDownload = async (evalId: string, type: "sujet" | "corrigé") => {
    setDownloadTracker((prev) => ({ ...prev, [`${evalId}-${type}`]: true }));

    const evaluation = db.evaluations.find((ev) => ev.id === evalId);
    const path =
      type === "sujet" ? evaluation?.subjectUrl : evaluation?.solutionUrl;

    if (!path) {
      alert("Fichier introuvable pour cette épreuve.");
      setDownloadTracker((prev) => ({ ...prev, [`${evalId}-${type}`]: false }));
      return;
    }

    try {
      const signedUrl = await getSignedUrl(bucketFromStoragePath(path || ""), path);
      if (!signedUrl) {
        throw new Error("Impossible de générer l'URL de téléchargement.");
      }
      window.open(signedUrl, "_blank");
    } catch (err) {
      console.error("Download failed:", err);
      alert("Erreur lors du téléchargement. Veuillez réessayer.");
    } finally {
      setDownloadTracker((prev) => ({ ...prev, [`${evalId}-${type}`]: false }));
    }
  };

  const classroomTabTitles: Record<ClassroomTab, string> = {
    cours: "Cours & Exercices Résolus",
    exercices: "Exercices d'Application Pratique",
    qcm: "Entraînement QCM Interactif",
    solutions: "Grandes Clés de Résolution & Corrigés",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
      {/* 1. Header Navigation Back Link */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="btn-back"
          onClick={() => {
            if (activeChapter) {
              setActiveChapter(null); // return to dashboard
            } else {
              onBackToHome(); // return to lander
            }
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {activeChapter
            ? "Retour au programme de la matière"
            : "Choisir un autre niveau"}
        </button>

        <div className="flex items-center gap-2 text-xs font-mono font-bold px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-slate-500">
          NIVEAU ACTIF : {selectedLevelId.toUpperCase()}
        </div>
      </div>

      {/* ======================= TWO-PANEL INTERACTIVE CLASSROOM VIEW======================= */}
      {activeChapter ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          <ChapterClassroomSidebar
            subject={selectedSubject}
            activeChapter={activeChapter}
            chapters={activeChapters}
            progressPercentage={progressPercentage}
            classroomTab={classroomTab}
            onTabChange={setClassroomTab}
            onSelectChapter={(ch) => handleChapterAccess(ch, "cours")}
          />

          {/* Classroom Main content panel (9 cols on desktop) */}
          <div className="lg:col-span-9 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xs overflow-hidden">
            {/* Header tab detail */}
            <div className="border-b border-gray-100 dark:border-slate-700/60 bg-gray-50/50 dark:bg-slate-800/40 px-6 sm:px-8 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  {classroomTab.toUpperCase()}
                </span>
                <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mt-1">
                  {classroomTabTitles[classroomTab]}
                </h2>
              </div>
            </div>

            {/* Content Rendering Switcher */}
            <div className="p-6 sm:p-8 space-y-6">
              {classroomTab === "cours" && (
                <CoursTab
                  chapterCourses={chapterCourses}
                  currentCourse={currentCourse}
                  onSelectCourse={(courseId) => {
                    setSelectedCourseId(courseId);
                    setActiveSectionIndex(0);
                  }}
                  activeSectionIndex={activeSectionIndex}
                  onSectionChange={setActiveSectionIndex}
                  exercises={db.exercises}
                  chapterExercises={currentExercises}
                  favoriteCourseIds={favoriteCourseIds}
                  onToggleFavorite={async (courseId) => {
                    await toggleFavoriteState(courseId, "course");
                  }}
                />
              )}

              {classroomTab === "exercices" && (
                <ExercicesTab
                  exercises={currentExercises.filter(
                    (ex) => ex.category !== "activité",
                  )}
                  onSelectExercise={setSelectedExerciseForDetail}
                  favoriteExerciseIds={favoriteExerciseIds}
                  onToggleFavorite={async (exerciseId) => {
                    await toggleFavoriteState(exerciseId, "exercise");
                  }}
                />
              )}

              {classroomTab === "qcm" && (
                <QcmTab
                  quizzes={currentQuizzes}
                  quizGroups={currentQuizGroups}
                  qcmAnswers={qcmAnswers}
                  quizSubmitted={quizSubmitted}
                  onAnswer={(questionId, selectedIndex) =>
                    setQcmAnswers((prev) => ({
                      ...prev,
                      [questionId]: selectedIndex,
                    }))
                  }
                  onSubmit={() => setQuizSubmitted(true)}
                  onRestart={() => {
                    setQcmAnswers({});
                    setQuizSubmitted(false);
                  }}
                  favoriteQuizGroupIds={favoriteQuizGroupIds}
                  onToggleFavorite={async (quizGroupId) => {
                    await toggleFavoriteState(quizGroupId, "quiz");
                  }}
                />
              )}

              {classroomTab === "solutions" && (
                <SolutionsTab exercises={currentExercises} />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ======================= MAIN SUBJECT REVISION DASHBOARD VIEW ======================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          <SubjectSidebar
            subjects={filteredSubjects}
            selectedSubject={selectedSubject}
            levelId={selectedLevelId}
            onSelectSubject={setSelectedSubject}
          />

          <ChapterList
            subject={selectedSubject}
            levelId={selectedLevelId}
            chapters={activeChapters}
            completedChaptersCount={completedChaptersCount}
            totalChaptersCount={totalChaptersCount}
            progressPercentage={progressPercentage}
            onAccessChapter={handleChapterAccess}
          />

          <EvaluationSidebar
            assessmentsDS={assessmentsDS}
            assessmentsAnnales={assessmentsAnnales}
            downloadTracker={downloadTracker}
            onDownload={handleDownload}
            favoriteEvaluationIds={favoriteEvaluationIds}
            onToggleFavorite={async (evaluationId) => {
              await toggleFavoriteState(evaluationId, "evaluation");
            }}
          />
        </div>
      )}

      {/* Detailed Slide-Over Drawer for Selected Exercise */}
      <ExerciseDetailDrawer
        exercise={selectedExerciseForDetail}
        onClose={() => setSelectedExerciseForDetail(null)}
      />
    </div>
  );
};