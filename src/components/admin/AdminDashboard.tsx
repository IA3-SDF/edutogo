import {
  AlertCircle,
  BookOpen,
  FileCheck,
  FileEdit,
  Layout,
  HelpCircle as QuizIcon
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { deleteChapterMediaAsset, fetchDatabaseState, syncChapterMedia, syncCourse } from "../../../lib/supabaseFunctions";
import {
  Asset,
  Chapter,
  Course,
  DatabaseState,
  Evaluation,
  Exercise,
  Level,
  QuizQuestion,
  Subject,
} from "../../../types";

import { AdminModals } from "./AdminModals";
import { AdminSidebar } from "./AdminSidebar";
import { ModalState, PriorityItems } from "./adminTypes";
import { AdminWorkspaceHeader } from "./AdminWorkspaceHeader";
import { CoursTab } from "./CoursTab";
import { EditableField } from "./EditableField";
import { EvaluationsTab } from "./EvaluationsTab";
import { ExercicesTab } from "./ExercicesTab";
import { MediaAssetUploader } from "./MediaAssetUploader";
import { OverviewTab } from "./OverviewTab";
import { QcmTab } from "./QcmTab";

interface AdminDashboardProps {
  db: DatabaseState;
  onUpdateDb: (updatedDb: DatabaseState) => void;
  onExitAdmin: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  db,
  onUpdateDb,
  onExitAdmin,
  isDarkMode,
  setIsDarkMode,
  onLogout,
}) => {
  // Main Routing Tabs: overview | cours | exercices | qcm | evaluations
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  // Selected Entities States
  const [selectedLevelId, setSelectedLevelId] = useState<string>("terminale");
  const [selectedSubjectId, setSelectedSubjectId] =
    useState<string>("maths-terminale");
  const [selectedChapterId, setSelectedChapterId] =
    useState<string>("chap-suites");

  // Navigation tree states
  const [openLevels, setOpenLevels] = useState<Record<string, boolean>>({
    terminale: true,
    premiere: true,
    seconde: false,
  });
  const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({
    "maths-terminale": true,
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [expandedCourseIds, setExpandedCourseIds] = useState<Record<string, boolean>>({});
  const [activeCourseSectionsVisible, setActiveCourseSectionsVisible] = useState(true);

  // Floating Modals Context Tracking
  const [modal, setModal] = useState<ModalState | null>(null);

  // Toast System State
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  // Safe fetch entities based on state
  const currentChapter = db.chapters.find((c) => c.id === selectedChapterId);
  const currentSubject = db.subjects.find(
    (s) =>
      s.id === selectedSubjectId ||
      (currentChapter && s.id === currentChapter.subjectId),
  );
  const currentLevel = db.levels.find(
    (l) =>
      l.id === selectedLevelId ||
      (currentSubject && l.id === currentSubject.levelId),
  );

  const currentChapterCourses = React.useMemo(
    () => db.courses.filter((c) => c.chapterId === selectedChapterId),
    [selectedChapterId, db.courses],
  );

  const activeCourse = React.useMemo(() => {
    if (selectedCourseId) {
      return currentChapterCourses.find((c) => c.id === selectedCourseId) || null;
    }
    return currentChapterCourses.length === 1
      ? currentChapterCourses[0]
      : null;
  }, [currentChapterCourses, selectedCourseId]);

  useEffect(() => {
    if (!selectedChapterId) {
      setSelectedCourseId(null);
      return;
    }

    if (currentChapterCourses.length === 1) {
      setSelectedCourseId(currentChapterCourses[0].id);
      return;
    }

    if (
      currentChapterCourses.length > 1 &&
      selectedCourseId &&
      !currentChapterCourses.some((course) => course.id === selectedCourseId)
    ) {
      setSelectedCourseId(null);
    }
  }, [selectedChapterId, currentChapterCourses, selectedCourseId]);

  useEffect(() => {
    if (activeCourse) {
      setActiveCourseSectionsVisible(true);
    }
  }, [activeCourse?.id]);

  // If hierarchy state collapses, pick the first available matching entity
  useEffect(() => {
    if (selectedSubjectId) {
      const activeChapters = db.chapters.filter(
        (ch) => ch.subjectId === selectedSubjectId,
      );
      if (activeChapters.length > 0) {
        const isCurrentMatching = activeChapters.some(
          (c) => c.id === selectedChapterId,
        );
        if (!isCurrentMatching) {
          setSelectedChapterId(activeChapters[0].id);
        }
      } else {
        setSelectedChapterId("");
      }
    }
  }, [selectedSubjectId, db.chapters]);

  // Helper validation status indicator logic for chapter
  const getChapterStatus = (ch: Chapter): "ok" | "warn" | "bad" => {
    const chapterExercises = db.exercises.filter((e) => e.chapterId === ch.id);
    const missingSolutionsCount = chapterExercises.filter(
      (e) => !e.solution || e.solution.trim() === "",
    ).length;
    const hasCourse = db.courses.some((c) => c.chapterId === ch.id);

    if (
      hasCourse &&
      missingSolutionsCount === 0 &&
      chapterExercises.length > 0
    ) {
      return "ok";
    }
    if (!hasCourse && chapterExercises.length === 0) {
      return "bad";
    }
    return "warn";
  };

  // Priority queue metrics & priority tasks finder
  const priorityItems: PriorityItems = useMemo(() => {
    if (!selectedChapterId)
      return {
        missingExercises: [],
        missingEvaluations: [],
        stats: { missingCount: 0, missingEvalCount: 0, courseOk: 0 },
      };

    const missingExercises = db.exercises.filter(
      (ex) =>
        ex.chapterId === selectedChapterId &&
        (!ex.solution || ex.solution.trim() === ""),
    );

    const missingEvaluations = db.evaluations.filter(
      (ev) =>
        ev.subjectId === selectedSubjectId &&
        (!ev.hasSolution || !ev.solutionUrl?.trim()),
    );

    return {
      missingExercises,
      missingEvaluations,
      stats: {
        missingCount: missingExercises.length,
        missingEvalCount: missingEvaluations.length,
        courseOk: activeCourse ? 1 : 0,
      },
    };
  }, [
    selectedChapterId,
    selectedSubjectId,
    db.exercises,
    db.evaluations,
    activeCourse,
  ]);

  /* ============================================================
     MUTATION FUNCTIONS
     ============================================================ */

  const handleEditChapterTitleGlobal = (newTitle: string) => {
    onUpdateDb({
      ...db,
      chapters: db.chapters.map((ch) =>
        ch.id === selectedChapterId ? { ...ch, title: newTitle } : ch,
      ),
    });
    showToast("Titre du chapitre mis à jour.");
  };

  const handleEditCourseTitle = (newCourseTitle: string) => {
    const courseId = selectedCourseId || currentChapterCourses[0]?.id;
    if (!courseId) {
      showToast("Aucun cours sélectionné pour la mise à jour.");
      return;
    }

    onUpdateDb({
      ...db,
      courses: db.courses.map((crs) =>
        crs.id === courseId ? { ...crs, title: newCourseTitle } : crs,
      ),
    });
    showToast("Titre de la leçon renommé.");
  };

  const handleAddLevel = (name: string, description: string) => {
    const raw = name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let id = raw.replace(/[^a-z0-9]/g, "-");
    if (!/^[a-z]/.test(id)) id = `lvl-${id}`;
    id = id.replace(/-+/g, "-").replace(/^-+|-+$/g, "");
    if (db.levels.some((l) => l.id === id)) {
      id = `${id}-${Date.now()}`;
    }

    const newLvl: Level = {
      id,
      name: name.trim(),
      description: description.trim() || `Classe de ${name}`,
    };

    onUpdateDb({
      ...db,
      levels: [...db.levels, newLvl],
    });

    setOpenLevels((prev) => ({ ...prev, [id]: true }));
    setSelectedLevelId(id);
    setModal(null);
    showToast(`Niveau "${name}" configuré.`);
  };

  const handleAddSubject = (name: string, levelId: string) => {
    let slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-");
    slug = slug.replace(/-+/g, "-").replace(/^-+|-+$/g, "");
    let id = `${slug}-${levelId}`;
    if (db.subjects.some((s) => s.id === id)) {
      id = `${slug}-${Date.now()}`;
    }

    const newSubj: Subject = {
      id,
      levelId,
      name: name.trim(),
      icon: "BookOpen",
      color: "blue",
      progress: 0,
    };
    onUpdateDb({
      ...db,
      subjects: [...db.subjects, newSubj],
    });
    setOpenSubjects((prev) => ({ ...prev, [id]: true }));
    setSelectedLevelId(levelId);
    setSelectedSubjectId(id);
    setModal(null);
    showToast(`Matière "${name}" créée.`);
  };

  const handleAddChapter = (title: string, desc: string) => {
    const parentSubj = db.subjects.find((s) => s.id === selectedSubjectId);
    if (!parentSubj) return;

    const siblingCount = db.chapters.filter(
      (c) => c.subjectId === selectedSubjectId,
    ).length;
    const newCh: Chapter = {
      id: `chap-${Date.now()}`,
      subjectId: selectedSubjectId,
      levelId: parentSubj.levelId,
      number: siblingCount + 1,
      title: title.trim(),
      description: desc.trim() || "Aucune description fournie.",
      isCompleted: false,
      isLocked: false,
    };

    onUpdateDb({
      ...db,
      chapters: [...db.chapters, newCh],
    });
    setSelectedChapterId(newCh.id);
    setModal(null);
    showToast("Nouveau chapitre configuré.");
  };

  const handleDeleteChapter = () => {
    const filteredChapters = db.chapters.filter(
      (c) => c.id !== selectedChapterId,
    );
    const filteredCourses = db.courses.filter(
      (c) => c.chapterId !== selectedChapterId,
    );
    const filteredExercises = db.exercises.filter(
      (e) => e.chapterId !== selectedChapterId,
    );
    const filteredQuizzes = db.quizzes.filter(
      (q) => q.chapterId !== selectedChapterId,
    );

    onUpdateDb({
      ...db,
      chapters: filteredChapters,
      courses: filteredCourses,
      exercises: filteredExercises,
      quizzes: filteredQuizzes,
    });

    const siblings = filteredChapters.filter(
      (c) => c.subjectId === selectedSubjectId,
    );
    setSelectedChapterId(siblings.length > 0 ? siblings[0].id : "");
    setModal(null);
    showToast("Chapitre et dépendances purgés.");
  };

  const handleEditLevel = (
    levelId: string,
    name: string,
    description: string,
  ) => {
    onUpdateDb({
      ...db,
      levels: db.levels.map((l) =>
        l.id === levelId
          ? { ...l, name: name.trim(), description: description.trim() }
          : l,
      ),
    });
    setModal(null);
    showToast(`Niveau scolaire "${name}" mis à jour.`);
  };

  const handleDeleteLevel = (levelId: string) => {
    onUpdateDb({
      ...db,
      levels: db.levels.filter((l) => l.id !== levelId),
      subjects: db.subjects.filter((s) => s.levelId !== levelId),
      chapters: db.chapters.filter((c) => c.levelId !== levelId),
      evaluations: db.evaluations.filter((e) => e.levelId !== levelId),
    });
    setModal(null);
    showToast(`Niveau et dépendances purgés.`);
  };

  const handleEditSubject = (
    subjId: string,
    name: string,
    icon: string,
    color: string,
  ) => {
    onUpdateDb({
      ...db,
      subjects: db.subjects.map((s) =>
        s.id === subjId ? { ...s, name: name.trim(), icon, color } : s,
      ),
    });
    setModal(null);
    showToast(`Matière "${name}" mise à jour.`);
  };

  const handleDeleteSubject = (subjId: string) => {
    onUpdateDb({
      ...db,
      subjects: db.subjects.filter((s) => s.id !== subjId),
      chapters: db.chapters.filter((c) => c.subjectId !== subjId),
      evaluations: db.evaluations.filter((e) => e.subjectId !== subjId),
    });
    setModal(null);
    showToast(`Matière supprimée.`);
  };

  const handleEditChapter = (
    chapterId: string,
    title: string,
    num: number,
    description: string,
  ) => {
    onUpdateDb({
      ...db,
      chapters: db.chapters.map((c) =>
        c.id === chapterId
          ? {
              ...c,
              title: title.trim(),
              number: num,
              description: description.trim(),
            }
          : c,
      ),
    });
    setModal(null);
    showToast(`Chapitre mis à jour.`);
  };

  const moveChapterSequence = (direction: "up" | "down") => {
    const activeChapters = db.chapters.filter(
      (ch) => ch.subjectId === selectedSubjectId,
    );
    const idx = activeChapters.findIndex((c) => c.id === selectedChapterId);
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;

    if (targetIdx < 0 || targetIdx >= activeChapters.length) return;

    const chapterA = activeChapters[idx];
    const chapterB = activeChapters[targetIdx];

    onUpdateDb({
      ...db,
      chapters: db.chapters
        .map((ch) => {
          if (ch.id === chapterA.id) return { ...ch, number: chapterB.number };
          if (ch.id === chapterB.id) return { ...ch, number: chapterA.number };
          return ch;
        })
        .sort((a, b) => a.number - b.number),
    });
    showToast("Séquence numérique des chapitres intervertie.");
  };

  /* ---- Handlers: Courses ---- */
  const handleSaveCourse = async (
  title: string,
  content: string,
  courseId?: string,
) => {
  const trimmedTitle = title.trim();
  
  // ✅ CRÉATION : aucun courseId fourni → on construit sans id
  if (!courseId) {
    const newCourse: Course = {
      id: undefined as any,
      chapterId: selectedChapterId,
      title: trimmedTitle,
      content: content || "",
      createdAt: new Date().toISOString(),
      sections: [],
    };

    try {
      const ok = await syncCourse(newCourse);
      if (!ok) throw new Error("sync failed");

      const fresh = await fetchDatabaseState();
      onUpdateDb(fresh);

      // Après rechargement, sélectionner le nouveau cours
      // (son id a été assigné par Supabase dans syncCourse)
      if (newCourse.id) setSelectedCourseId(String(newCourse.id));

      setModal(null);
      showToast("Nouveau cours créé avec succès.");
    } catch (err) {
      console.error("Erreur création cours:", err);
      showToast("Échec de la création du cours.");
    }
    return; // ← IMPORTANT : on sort ici
  }

  // ✅ MISE À JOUR : courseId fourni → on met à jour le cours existant
  const existing = db.courses.find((c) => c.id === courseId) || null;

  const courseObj: Course = {
    id: courseId as any,
    chapterId: selectedChapterId,
    title: trimmedTitle,
    content,
    createdAt: existing?.createdAt || new Date().toISOString(),
    sections: existing?.sections ? [...existing.sections] : undefined,
  };

  try {
    const ok = await syncCourse(courseObj);
    if (!ok) throw new Error("sync failed");

    const fresh = await fetchDatabaseState();
    onUpdateDb(fresh);

    setSelectedCourseId(String(courseId));
    setModal(null);
    showToast("Cours mis à jour avec succès.");
  } catch (err) {
    console.error("Erreur mise à jour cours:", err);
    showToast("Échec de la mise à jour du cours.");
  }
};
  const handleSaveSection = async (
    sectId: string | undefined,
    title: string,
    content: string,
  ) => {
    const course = selectedCourseId
      ? db.courses.find((c) => c.id === selectedCourseId) || null
      : db.courses.find((c) => c.chapterId === selectedChapterId) || null;

    try {
      if (!course) {
        const newCourse: Course = {
          id: undefined as any,
          chapterId: selectedChapterId,
          title: `Cours — ${currentChapter?.title || ""}`,
          content: content,
          createdAt: new Date().toISOString(),
          sections: [
            {
              id: sectId || undefined,
              title: title.trim(),
              content: content,
              order: 1,
            },
          ],
        } as Course;

        const ok = await syncCourse(newCourse);
        if (!ok) throw new Error("sync failed");

        const fresh = await fetchDatabaseState();
        onUpdateDb(fresh);
        if (newCourse.id) setSelectedCourseId(String(newCourse.id));
        setModal(null);
        showToast("Section créée et cours initialisé dans Supabase.");
        return;
      }

      let currentSections = course.sections ? [...course.sections] : [];

      if (currentSections.length === 0 && course.content && course.content.trim()) {
        currentSections.push({
          id: `sect-auto-${Date.now()}`,
          title: "Introduction",
          content: course.content,
          order: 1,
        });
      }

      if (sectId) {
        const idx = currentSections.findIndex((s) => s.id === sectId);
        if (idx >= 0) {
          currentSections[idx] = {
            ...currentSections[idx],
            title: title.trim(),
            content: content,
          };
        }
      } else {
        currentSections.push({
          id: undefined as any,
          title: title.trim(),
          content: content,
          order: currentSections.length + 1,
        });
      }

      currentSections = currentSections
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((s, idx) => ({
          ...s,
          order: idx + 1,
        }));

      const courseObj: Course = {
        id: course.id,
        chapterId: course.chapterId,
        title: course.title,
        content: currentSections.map((s) => s.content).join("\n\n---\n\n"),
        createdAt: course.createdAt,
        sections: currentSections,
      } as Course;

      const ok = await syncCourse(courseObj);
      if (!ok) throw new Error("sync failed");

      const fresh = await fetchDatabaseState();
      onUpdateDb(fresh);
      setSelectedCourseId(String(courseObj.id));
      setModal(null);
      showToast(sectId ? "Section mise à jour dans Supabase." : "Nouvelle section ajoutée dans Supabase.");
    } catch (err) {
      console.error("Erreur sauvegarde section:", err);
      showToast("Échec de la sauvegarde de la section vers Supabase.");
    }
  };

  const handleUpdateSectionOrder = (
    sectId: string,
    direction: "up" | "down",
  ) => {
    const courseIdx = selectedCourseId
      ? db.courses.findIndex((c) => c.id === selectedCourseId)
      : db.courses.findIndex((c) => c.chapterId === selectedChapterId);
    if (courseIdx < 0) return;
    const activeCourse = db.courses[courseIdx];
    if (!activeCourse.sections) return;

    let sectionsList = [...activeCourse.sections].sort(
      (a, b) => a.order - b.order,
    );
    const idx = sectionsList.findIndex((s) => s.id === sectId);
    if (idx < 0) return;

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sectionsList.length) return;

    const temp = sectionsList[idx].order;
    sectionsList[idx].order = sectionsList[targetIdx].order;
    sectionsList[targetIdx].order = temp;

    sectionsList.sort((a, b) => a.order - b.order);
    sectionsList = sectionsList.map((s, index) => ({ ...s, order: index + 1 }));

    const concatenatedContent = sectionsList
      .map((s) => s.content)
      .join("\n\n---\n\n");

    const updatedCourses = [...db.courses];
    updatedCourses[courseIdx] = {
      ...activeCourse,
      content: concatenatedContent,
      sections: sectionsList,
    };

    onUpdateDb({ ...db, courses: updatedCourses });
    showToast("Ordre de la section mis à jour.");
  };

  const handleDeleteSection = (sectId: string) => {
    const courseIdx = selectedCourseId
      ? db.courses.findIndex((c) => c.id === selectedCourseId)
      : db.courses.findIndex((c) => c.chapterId === selectedChapterId);
    if (courseIdx < 0) return;
    const activeCourse = db.courses[courseIdx];
    if (!activeCourse.sections) return;

    let remainingSections = activeCourse.sections.filter(
      (s) => s.id !== sectId,
    );
    remainingSections = remainingSections
      .sort((a, b) => a.order - b.order)
      .map((s, idx) => ({ ...s, order: idx + 1 }));

    const concatenatedContent = remainingSections
      .map((s) => s.content)
      .join("\n\n---\n\n");

    const updatedCourses = [...db.courses];
    updatedCourses[courseIdx] = {
      ...activeCourse,
      content: concatenatedContent,
      sections: remainingSections,
    };

    onUpdateDb({ ...db, courses: updatedCourses });
    setModal(null);
    showToast("Section supprimée.");
  };

  const handleAddChapterAsset = async (
    chapterId: string,
    assetName: string,
    assetType: "image" | "audio" | "video",
    assetUrl: string,
    assetSize?: string,
    assetStoragePath?: string,
  ) => {
    const newAssetId = `asset-${Date.now()}`;
    const newAsset: Asset = {
      id: newAssetId,
      name: assetName.trim() || "Fichier sans titre",
      type: assetType,
      url: assetUrl,
      size: assetSize,
      storagePath: assetStoragePath,
      createdAt: new Date().toISOString(),
    };

    const updatedChapters = db.chapters.map((ch) => {
      if (ch.id === chapterId) {
        const currentAssets = ch.assets ? [...ch.assets] : [];
        return {
          ...ch,
          assets: [...currentAssets, newAsset],
        };
      }
      return ch;
    });

    onUpdateDb({
      ...db,
      chapters: updatedChapters,
    });

    const saved = await syncChapterMedia(chapterId, {
      ...newAsset,
    });

    if (!saved) {
      showToast(
        "Le média a été ajouté en local, mais la sauvegarde Supabase a échoué.",
      );
      return false;
    }

    showToast(`Média "${assetName}" ajouté au chapitre.`);
    return true;
  };

  const handleDeleteChapterAsset = async (
    chapterId: string,
    assetId: string,
  ) => {
    const updatedChapters = db.chapters.map((ch) => {
      if (ch.id === chapterId && ch.assets) {
        return {
          ...ch,
          assets: ch.assets.filter((a) => a.id !== assetId),
        };
      }
      return ch;
    });

    onUpdateDb({
      ...db,
      chapters: updatedChapters,
    });

    const deleted = await deleteChapterMediaAsset(assetId);
    if (!deleted) {
      showToast(
        "Le média a été retiré localement, mais la suppression Supabase a échoué.",
      );
      return;
    }

    showToast("Média retiré du chapitre.");
  };

  /* ---- Handlers: Exercises ---- */
  const handleSaveExercise = (ex: Partial<Exercise>) => {
    const existingIndex = db.exercises.findIndex((e) => e.id === ex.id);
    const updatedExercises = [...db.exercises];

    const finalizedEx: Exercise = {
      id: ex.id || `ex-${Date.now()}`,
      chapterId: selectedChapterId,
      number: ex.number || "1",
      title: ex.title || "Exercice d'application",
      question: ex.question || "",
      hint: ex.hint || "",
      solution: ex.solution || "",
      category: ex.category || "exercice",
    };

    if (existingIndex >= 0) {
      updatedExercises[existingIndex] = finalizedEx;
    } else {
      updatedExercises.push(finalizedEx);
    }

    onUpdateDb({ ...db, exercises: updatedExercises });
    setModal(null);
    showToast("Fiche d'exercice enregistrée.");
  };

  const handleDeleteExercise = (exId: string) => {
    onUpdateDb({
      ...db,
      exercises: db.exercises.filter((e) => e.id !== exId),
    });
    setModal(null);
    showToast("Exercice retiré.");
  };

  /* ---- Handlers: QCM Quizzes ---- */
  const handleSaveQuiz = (quiz: Partial<QuizQuestion>) => {
    const existingIndex = db.quizzes.findIndex((q) => q.id === quiz.id);
    const updatedQuizzes = [...db.quizzes];

    const finalizedQuiz: QuizQuestion = {
      id: quiz.id || `q-${Date.now()}`,
      chapterId: selectedChapterId,
      question: quiz.question || "Énoncé de la question ?",
      options: quiz.options || [
        "Proposition A",
        "Proposition B",
        "Proposition C",
        "Proposition D",
      ],
      correctIndex: quiz.correctIndex !== undefined ? quiz.correctIndex : 0,
      explanation: quiz.explanation || "",
    };

    // carry optional grouping metadata
    if ((quiz as any).quizGroupId) {
      (finalizedQuiz as any).quizGroupId = (quiz as any).quizGroupId;
    }

    if (existingIndex >= 0) {
      updatedQuizzes[existingIndex] = finalizedQuiz;
    } else {
      updatedQuizzes.push(finalizedQuiz);
    }

    onUpdateDb({ ...db, quizzes: updatedQuizzes });
    setModal(null);
    showToast("Question QCM validée.");
  };

  /* ---- Handlers: Quiz Groups & Group Questions ---- */
  const handleSaveQuizGroup = (group: Partial<any>) => {
    const existingIndex = (db.quizGroups || []).findIndex((g) => g.id === group.id);
    const updatedGroups = db.quizGroups ? [...db.quizGroups] : [];

    const finalizedGroup = {
      id: group.id || `g-${Date.now()}`,
      chapterId: selectedChapterId,
      title: group.title || "Parcours",
      createdAt: new Date().toISOString(),
      questions: (group.questions as any[]) || [],
    };

    if (existingIndex >= 0) {
      updatedGroups[existingIndex] = finalizedGroup;
    } else {
      updatedGroups.push(finalizedGroup);
    }

    onUpdateDb({ ...db, quizGroups: updatedGroups });
    setModal(null);
    showToast("Parcours de quiz enregistré.");
  };

  const handleDeleteQuizGroup = (gId: string) => {
    onUpdateDb({ ...db, quizGroups: (db.quizGroups || []).filter((g) => g.id !== gId) });
    setModal(null);
    showToast("Parcours supprimé.");
  };

  const handleSaveQuizQuestion = (question: Partial<QuizQuestion>) => {
    // If group provided, insert/update within group.questions, otherwise fallback to db.quizzes
    const groupId = (question as any).quizGroupId;
    if (groupId && db.quizGroups) {
      const updatedGroups = db.quizGroups.map((g) => {
        if (g.id !== groupId) return g;
        const existingIndex = (g.questions || []).findIndex((q) => q.id === question.id);
        const updatedQs = g.questions ? [...g.questions] : [];
        const finalizedQ = {
          id: question.id || `q-${Date.now()}`,
          chapterId: question.chapterId || g.chapterId,
          quizGroupId: groupId,
          question: question.question || "",
          options: question.options || ["", "", "", ""],
          correctIndex: question.correctIndex ?? 0,
          explanation: question.explanation || "",
        } as any;
        if (existingIndex >= 0) updatedQs[existingIndex] = finalizedQ;
        else updatedQs.push(finalizedQ);
        return { ...g, questions: updatedQs };
      });
      onUpdateDb({ ...db, quizGroups: updatedGroups });
    } else {
      handleSaveQuiz(question as any);
    }
    setModal(null);
    showToast("Question enregistrée.");
  };

  const handleDeleteQuizQuestion = (qId: string) => {
    // remove from groups if present
    if (db.quizGroups && db.quizGroups.some((g) => (g.questions || []).some((q) => q.id === qId))) {
      const updatedGroups = db.quizGroups.map((g) => ({ ...g, questions: (g.questions || []).filter((q) => q.id !== qId) }));
      onUpdateDb({ ...db, quizGroups: updatedGroups });
    } else {
      onUpdateDb({ ...db, quizzes: db.quizzes.filter((q) => q.id !== qId) });
    }
    setModal(null);
    showToast("Question supprimée.");
  };

  const handleDeleteQuiz = (qId: string) => {
    onUpdateDb({
      ...db,
      quizzes: db.quizzes.filter((q) => q.id !== qId),
    });
    setModal(null);
    showToast("Question QCM supprimée.");
  };

  /* ---- Handlers: Subject-level Evaluations ---- */
  const handleSaveEvaluation = (evalObj: Partial<Evaluation>) => {
    const existingIndex = db.evaluations.findIndex((e) => e.id === evalObj.id);
    const updatedEvaluations = [...db.evaluations];

    const finalizedEval: Evaluation = {
      id: evalObj.id || `ev-${Date.now()}`,
      levelId: selectedLevelId,
      subjectId: selectedSubjectId,
      title: evalObj.title || "Nouvelle épreuve",
      type: evalObj.type || "DS",
      year: evalObj.year || "2026",
      hasSubject: !!evalObj.subjectUrl,
      hasSolution: !!evalObj.solutionUrl,
      subjectUrl: evalObj.subjectUrl || undefined,
      solutionUrl: evalObj.solutionUrl || undefined,
    };

    if (existingIndex >= 0) {
      updatedEvaluations[existingIndex] = finalizedEval;
    } else {
      updatedEvaluations.push(finalizedEval);
    }

    onUpdateDb({ ...db, evaluations: updatedEvaluations });
    setModal(null);
    showToast("Support d'évaluation synchronisé.");
  };

  const handleDeleteEvaluation = (evalId: string) => {
    onUpdateDb({
      ...db,
      evaluations: db.evaluations.filter((e) => e.id !== evalId),
    });
    setModal(null);
    showToast("Évaluation supprimée.");
  };

  return (
    <div className="app grid grid-cols-1 md:grid-cols-[248px_1fr] min-h-screen bg-(--color-bg) text-(--color-text) font-sans antialiased text-[13px]">
      {/* ============================================================
         LEFT SIDEBAR
         ============================================================ */}
      <AdminSidebar
        db={db}
        selectedLevelId={selectedLevelId}
        selectedSubjectId={selectedSubjectId}
        selectedChapterId={selectedChapterId}
        openLevels={openLevels}
        openSubjects={openSubjects}
        showProfileMenu={showProfileMenu}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onLogout={onLogout}
        setShowProfileMenu={setShowProfileMenu}
        setOpenLevels={setOpenLevels}
        setOpenSubjects={setOpenSubjects}
        setSelectedLevelId={setSelectedLevelId}
        setSelectedSubjectId={setSelectedSubjectId}
        setSelectedChapterId={setSelectedChapterId}
        setActiveTab={setActiveTab}
        setModal={setModal}
        getChapterStatus={getChapterStatus}
      />

      {/* ============================================================
         RIGHT MAIN WORKSPACE PANELS
         ============================================================ */}
      <main className="main p-8 md:p-11 max-w-[1040px] w-full mx-auto space-y-6">
        <AdminWorkspaceHeader
          currentChapter={currentChapter}
          currentSubject={currentSubject}
          currentLevel={currentLevel}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onExitAdmin={onExitAdmin}
        />

        {/* Dynamic header row containing inline editor */}
        {!currentChapter ? (
          <div className="card bg-(--color-surface) border border-(--color-border) rounded-2xl p-12 text-center text-(--color-text-muted) space-y-4 shadow-[var(--shadow-elevation-sm)]">
            <AlertCircle className="h-10 w-10 text-(--color-warning) mx-auto" />
            <h3 className="font-extrabold text-sm text-(--color-text)">
              Aucun chapitre n'est sélectionné ou configuré
            </h3>
            <p className="text-xs">
              Pour commencer à rédiger vos contenus, cliquez sur "Ajouter un
              chapitre" dans le menu de gauche.
            </p>
            <button
              onClick={() =>
                setModal({
                  type: "addChapter",
                  draftTitle: "",
                  draftContent: "",
                })
              }
              className="btn btn-primary px-4 py-2 text-xs font-bold"
            >
              + Créer un chapitre maintenant
            </button>
          </div>
        ) : (
          <>
            <div className="page-head flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-(--color-border) pb-6">
              <div className="text-left space-y-1">
                <h1 className="text-2xl font-extrabold tracking-tight text-(--color-text) leading-snug font-display">
                  <EditableField
                    value={currentChapter.title}
                    onSave={handleEditChapterTitleGlobal}
                    className="font-sans"
                  />
                </h1>
                <div className="meta font-mono text-[10px] text-(--color-text-faint) flex items-center gap-2">
                  <span>
                    chapterId:{" "}
                    <b className="text-(--color-text-muted)">{currentChapter.id}</b>
                  </span>
                  <span>·</span>
                  <span>
                    subjectId:{" "}
                    <b className="text-(--color-text-muted)">{currentSubject?.id}</b>
                  </span>
                </div>
                <p className="text-xs text-(--color-text-faint) italic">
                  Double-cliquez sur le titre du chapitre pour le modifier
                  directement.
                </p>
              </div>

              {/* Sibling sequence and delete actions */}
              <div className="order-controls flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                <button
                  onClick={() => moveChapterSequence("up")}
                  disabled={currentChapter.number <= 1}
                  className="w-8 h-8 rounded-lg border border-(--color-border) hover:bg-(--color-surface-alt) flex items-center justify-center font-bold text-xs disabled:opacity-40 text-(--color-text-muted)"
                  title="Déplacer vers le haut"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveChapterSequence("down")}
                  disabled={
                    currentChapter.number >=
                    db.chapters.filter((c) => c.subjectId === selectedSubjectId)
                      .length
                  }
                  className="w-8 h-8 rounded-lg border border-(--color-border) hover:bg-(--color-surface-alt) flex items-center justify-center font-bold text-xs disabled:opacity-40 text-(--color-text-muted)"
                  title="Déplacer vers le bas"
                >
                  ↓
                </button>
                <button
                  onClick={() => setModal({ type: "deleteChapter" })}
                  className="w-8 h-8 rounded-lg border border-(--color-danger-border) hover:bg-(--color-danger-soft) text-(--color-danger) flex items-center justify-center text-xs"
                  title="Détruire le chapitre"
                >
                  🗑
                </button>
              </div>
            </div>

            {/* Navigation Tab selection toolbar — segmented pill style */}
            <div className="tabs flex gap-1 p-1.5 bg-(--color-surface-alt) border border-(--color-border) rounded-2xl overflow-x-auto select-none w-fit max-w-full">
              {[
                { id: "overview", name: "Vue d'ensemble", icon: Layout, badge: null },
                { id: "cours", name: "Cours", icon: BookOpen, badge: null },
                {
                  id: "exercices",
                  name: "Exercices",
                  icon: FileEdit,
                  badge:
                    priorityItems.stats.missingCount > 0
                      ? { val: priorityItems.stats.missingCount, alert: true }
                      : null,
                },
                {
                  id: "qcm",
                  name: "QCM",
                  icon: QuizIcon,
                  badge: {
                    val: db.quizzes.filter(
                      (q) => q.chapterId === selectedChapterId,
                    ).length,
                    alert: false,
                  },
                },
                {
                  id: "evaluations",
                  name: "Évaluations",
                  icon: FileCheck,
                  badge:
                    priorityItems.stats.missingEvalCount > 0
                      ? {
                          val: priorityItems.stats.missingEvalCount,
                          alert: true,
                        }
                      : null,
                },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab relative rounded-xl px-3.5 py-2 text-[11.5px] font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-(--color-surface) text-(--color-accent) shadow-[var(--shadow-elevation-xs)]"
                        : "text-(--color-text-muted) hover:text-(--color-text) hover:bg-(--color-surface)/60"
                    }`}
                  >
                    <TabIcon
                      className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-(--color-accent)" : "text-(--color-text-faint)"}`}
                    />
                    <span>{tab.name}</span>
                    {tab.badge && (
                      <span
                        className={`badge text-[9px] font-mono px-1.5 py-0.5 rounded-full leading-none ${
                          tab.badge.alert
                            ? "badge-danger font-black"
                            : "badge-neutral"
                        }`}
                      >
                        {tab.badge.val}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ============================================================
               TAB VIEW CONTENT
               ============================================================ */}
            {activeTab === "overview" && (
              <OverviewTab
                priorityItems={priorityItems}
                setActiveTab={setActiveTab}
                setModal={setModal}
              />
            )}

            {activeTab === "cours" && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in text-left">
                <CoursTab
                  currentChapter={currentChapter}
                  currentChapterCourses={currentChapterCourses}
                  activeCourse={activeCourse}
                  activeCourseSectionsVisible={activeCourseSectionsVisible}
                  setActiveCourseSectionsVisible={setActiveCourseSectionsVisible}
                  setSelectedCourseId={setSelectedCourseId}
                  setModal={setModal}
                  handleEditCourseTitle={handleEditCourseTitle}
                  handleSaveSection={handleSaveSection}
                  handleUpdateSectionOrder={handleUpdateSectionOrder}
                />
                <div className="space-y-5">
                  <MediaAssetUploader
                    currentChapter={currentChapter}
                    selectedChapterId={selectedChapterId}
                    onAddAsset={handleAddChapterAsset}
                    onDeleteAsset={handleDeleteChapterAsset}
                    showToast={showToast}
                  />
                </div>
              </div>
            )}

            {activeTab === "exercices" && (
              <ExercicesTab
                db={db}
                selectedChapterId={selectedChapterId}
                onUpdateDb={onUpdateDb}
                setModal={setModal}
                showToast={showToast}
              />
            )}

            {activeTab === "qcm" && (
              <QcmTab
                db={db}
                selectedChapterId={selectedChapterId}
                setModal={setModal}
              />
            )}

            {activeTab === "evaluations" && (
              <EvaluationsTab
                db={db}
                selectedSubjectId={selectedSubjectId}
                currentSubjectName={currentSubject?.name}
                onUpdateDb={onUpdateDb}
                setModal={setModal}
                showToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* Footer copyright */}
      <footer className="col-span-1 md:col-span-2 bg-(--color-surface) border-t border-(--color-border) py-6 text-center text-[10px] text-(--color-text-faint)">
        © 2026 EduTogo Backoffice — Toutes les mutations d'états sont réactives,
        synchronisées et validées de manière relationnelle.
      </footer>

      {/* Toast popup */}
      {toast && (
        <div className="toast toast-info fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-(--color-graphite-900) text-(--color-graphite-50) px-4.5 py-2.5 rounded-lg font-bold text-xs shadow-[var(--shadow-elevation-md)] animate-fade-in">
          {toast}
        </div>
      )}

      {/* Modal overlays */}
      <AdminModals
        modal={modal}
        setModal={setModal}
        db={db}
        onUpdateDb={onUpdateDb}
        selectedChapterId={selectedChapterId}
        selectedSubjectId={selectedSubjectId}
        selectedLevelId={selectedLevelId}
        currentChapterTitle={currentChapter?.title}
        currentSubjectName={currentSubject?.name}
        showToast={showToast}
        handleAddLevel={handleAddLevel}
        handleEditLevel={handleEditLevel}
        handleDeleteLevel={handleDeleteLevel}
        handleAddSubject={handleAddSubject}
        handleEditSubject={handleEditSubject}
        handleDeleteSubject={handleDeleteSubject}
        handleAddChapter={handleAddChapter}
        handleEditChapter={handleEditChapter}
        handleDeleteChapter={handleDeleteChapter}
        handleSaveCourse={handleSaveCourse}
        handleSaveSection={handleSaveSection}
        handleDeleteSection={handleDeleteSection}
        handleSaveExercise={handleSaveExercise}
        handleDeleteExercise={handleDeleteExercise}
        handleSaveQuiz={handleSaveQuiz}
        handleDeleteQuiz={handleDeleteQuiz}
        handleSaveQuizGroup={handleSaveQuizGroup}
        handleDeleteQuizGroup={handleDeleteQuizGroup}
        handleSaveQuizQuestion={handleSaveQuizQuestion}
        handleDeleteQuizQuestion={handleDeleteQuizQuestion}
        handleSaveEvaluation={handleSaveEvaluation}
        handleDeleteEvaluation={handleDeleteEvaluation}
      />
    </div>
  );
};