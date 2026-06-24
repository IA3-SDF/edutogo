"use client";

import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Calculator,
  CheckCircle,
  ChevronRight,
  HelpCircle,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { parseCourseContent } from "../../../lib/utils";
import { Chapter, Course, DatabaseState, Exercise, Subject } from "../../../types";
import { MathRenderer } from "../admin/MathRenderer";
import { DynamicExerciseCanvas } from "../student/DynamicExerciseCanvas";
import { CourseMediaType, MediaCoursRender } from "../student/MediaCoursRender";

type LearnScreen = "levels" | "subjects" | "chapters" | "classroom";
type ClassroomTab = "cours" | "exercices" | "qcm" | "solutions";

type ContentChunk =
  | { kind: "text"; value: string }
  | { kind: "media"; url: string; mediaType: CourseMediaType };

const MEDIA_TAG_REGEX = /\[\[media:(.+?):(image|audio|video)\]\]/g;

function splitMediaTags(raw: string): ContentChunk[] {
  if (!raw) return [];
  const chunks: ContentChunk[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  MEDIA_TAG_REGEX.lastIndex = 0;
  while ((match = MEDIA_TAG_REGEX.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      chunks.push({ kind: "text", value: raw.slice(lastIndex, match.index) });
    }
    chunks.push({
      kind: "media",
      url: match[1].trim(),
      mediaType: match[2] as CourseMediaType,
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < raw.length) {
    chunks.push({ kind: "text", value: raw.slice(lastIndex) });
  }

  return chunks;
}

interface MobileLearnViewProps {
  db: DatabaseState;
  selectedLevelId: string;
  onSelectLevel: (levelId: string) => void;
  initialChapterId?: string | null;
}

const TABS: { id: ClassroomTab; label: string; icon: typeof BookOpen }[] = [
  { id: "cours", label: "Cours", icon: BookOpen },
  { id: "exercices", label: "Exercices", icon: Calculator },
  { id: "qcm", label: "Quiz", icon: HelpCircle },
  { id: "solutions", label: "Corrigés", icon: Bookmark },
];

export const MobileLearnView: React.FC<MobileLearnViewProps> = ({
  db,
  selectedLevelId,
  onSelectLevel,
  initialChapterId,
}) => {
  const router = useRouter();
  const [screen, setScreen] = useState<LearnScreen>(
    selectedLevelId ? "subjects" : "levels",
  );
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [classroomTab, setClassroomTab] = useState<ClassroomTab>("cours");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [qcmAnswers, setQcmAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    if (!initialChapterId) return;
    const chapter = db.chapters.find((c) => c.id === initialChapterId);
    if (!chapter) return;
    const subject = db.subjects.find((s) => s.id === chapter.subjectId);
    if (!subject) return;

    setSelectedSubject(subject);
    setSelectedChapter(chapter);
    setScreen("classroom");
    setClassroomTab("cours");
    setActiveSectionIndex(0);
    setSelectedCourseId(null);
    setQcmAnswers({});
    setQuizSubmitted(false);
  }, [initialChapterId, db.chapters, db.subjects]);

  // --- NIVEAUX ---
  if (screen === "levels") {
    return (
      <div className="space-y-4 pb-24 px-4 pt-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Choisis ton niveau
        </h1>
        {db.levels.map((level) => (
          <button
            key={level.id}
            onClick={() => {
              onSelectLevel(level.id);
              setScreen("subjects");
            }}
            className="w-full text-left bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {level.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  {level.description}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </button>
        ))}
      </div>
    );
  }

  // --- MATIÈRES ---
  if (screen === "subjects") {
    const subjects = db.subjects.filter(
      (s) => s.levelId === selectedLevelId,
    );
    return (
      <div className="space-y-4 pb-24 px-4 pt-4">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setScreen("levels")}
            className="p-2 -ml-2 text-gray-500"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Matières
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {subjects.map((subject) => {
            const chapterCount = db.chapters.filter(
              (c) => c.subjectId === subject.id && c.levelId === selectedLevelId,
            ).length;
            return (
              <button
                key={subject.id}
                onClick={() => {
                  setSelectedSubject(subject);
                  setScreen("chapters");
                }}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 text-left active:scale-[0.98] transition-transform"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-3">
                  <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  {subject.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  {chapterCount} chapitres
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- CHAPITRES ---
  if (screen === "chapters" && selectedSubject) {
    const chapters = db.chapters.filter(
      (c) =>
        c.subjectId === selectedSubject.id && c.levelId === selectedLevelId,
    );
    const completedCount = chapters.filter((c) => c.isCompleted).length;
    const progress =
      chapters.length > 0
        ? Math.round((completedCount / chapters.length) * 100)
        : 0;

    return (
      <div className="space-y-4 pb-24 px-4 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setScreen("subjects")}
            className="p-2 -ml-2 text-gray-500"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {selectedSubject.name}
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {progress}% complété
            </p>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-3 mt-4">
          {chapters.map((chapter, idx) => (
            <button
              key={chapter.id}
              onClick={() => {
                if (!chapter.isLocked) {
                  setSelectedChapter(chapter);
                  setClassroomTab("cours");
                  setActiveSectionIndex(0);
                  setSelectedCourseId(null);
                  setQcmAnswers({});
                  setQuizSubmitted(false);
                  setScreen("classroom");
                }
              }}
              disabled={chapter.isLocked}
              className={`w-full text-left bg-white dark:bg-slate-900 border rounded-2xl p-4 flex items-center gap-3 transition-all ${
                chapter.isLocked
                  ? "border-gray-100 dark:border-slate-800 opacity-60"
                  : "border-gray-200 dark:border-slate-800 active:scale-[0.98]"
              }`}
            >
              <div className="shrink-0">
                {chapter.isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : chapter.isLocked ? (
                  <Lock className="h-5 w-5 text-gray-300 dark:text-slate-600" />
                ) : (
                  <span className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-slate-600 flex items-center justify-center text-[10px] font-bold text-gray-500">
                    {idx + 1}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold truncate ${
                    chapter.isLocked
                      ? "text-gray-400 line-through"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {chapter.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                  {chapter.description}
                </p>
              </div>
              {!chapter.isLocked && (
                <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- CLASSROOM (Cours / Exercices / QCM / Solutions) ---
  if (screen === "classroom" && selectedChapter && selectedSubject) {
    const chapterCourses = db.courses.filter(
      (co) => co.chapterId === selectedChapter.id,
    );
    const currentCourse = selectedCourseId
      ? chapterCourses.find((co) => co.id === selectedCourseId) || null
      : chapterCourses.length === 1
      ? chapterCourses[0]
      : null;

    const chapterExercises = db.exercises.filter(
      (ex) => ex.chapterId === selectedChapter.id,
    );
    const chapterQuizzes = db.quizzes.filter(
      (qz) => qz.chapterId === selectedChapter.id,
    );
    const quizGroups = db.quizGroups?.filter(
      (g) => g.chapterId === selectedChapter.id,
    );

    return (
      <div className="pb-24">
        {/* Header du classroom */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-gray-200 dark:border-slate-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (selectedCourseId) {
                  setSelectedCourseId(null);
                } else {
                  setScreen("chapters");
                }
              }}
              className="p-2 -ml-2 text-gray-500"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {selectedSubject.name}
              </p>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {selectedChapter.title}
              </h2>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3 -mb-3 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = classroomTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setClassroomTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-emerald-500 text-white"
                      : "text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu */}
        <div className="px-4 pt-6 space-y-6">
          {/* === COURS === */}
          {classroomTab === "cours" && (
            <MobileCoursView
              chapterCourses={chapterCourses}
              currentCourse={currentCourse}
              onSelectCourse={setSelectedCourseId}
              activeSectionIndex={activeSectionIndex}
              onSectionChange={setActiveSectionIndex}
              exercises={db.exercises}
            />
          )}

          {/* === EXERCICES === */}
          {classroomTab === "exercices" && (
            <MobileExercicesView
              exercises={chapterExercises.filter(
                (ex) => ex.category !== "activité",
              )}
              onSelectExercise={setSelectedExercise}
            />
          )}

          {/* === QCM === */}
          {classroomTab === "qcm" && (
            <MobileQcmView
              quizzes={chapterQuizzes}
              quizGroups={quizGroups}
              qcmAnswers={qcmAnswers}
              quizSubmitted={quizSubmitted}
              onAnswer={(qid, idx) =>
                setQcmAnswers((prev) => ({ ...prev, [qid]: idx }))
              }
              onSubmit={() => setQuizSubmitted(true)}
              onRestart={() => {
                setQcmAnswers({});
                setQuizSubmitted(false);
              }}
            />
          )}

          {/* === SOLUTIONS === */}
          {classroomTab === "solutions" && (
            <MobileSolutionsView exercises={chapterExercises} />
          )}
        </div>

        {/* Drawer Exercice */}
        {selectedExercise && (
          <MobileExerciseDrawer
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
          />
        )}
      </div>
    );
  }

  return null;
};

// ============ SOUS-COMPOSANTS MOBILE ============

function MobileCoursView({
  chapterCourses,
  currentCourse,
  onSelectCourse,
  activeSectionIndex,
  onSectionChange,
  exercises,
}: {
  chapterCourses: Course[];
  currentCourse: Course | null;
  onSelectCourse: (id: string | null) => void;
  activeSectionIndex: number;
  onSectionChange: (i: number) => void;
  exercises: Exercise[];
}) {
  if (chapterCourses.length > 1 && !currentCourse) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Les grands titres du chapitre
        </p>
        {chapterCourses.map((course) => (
          <button
            key={course.id}
            onClick={() => onSelectCourse(course.id)}
            className="w-full text-left bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 active:scale-[0.98] transition-transform"
          >
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide">
              Cours
            </p>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-1">
              {course.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              {course.sections?.length || 0} section(s)
            </p>
          </button>
        ))}
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="text-center py-12 text-gray-400">
        <BookOpen className="mx-auto h-10 w-10 text-gray-300 dark:text-slate-700 mb-2" />
        <p className="text-sm">Cours en cours de rédaction.</p>
      </div>
    );
  }

  const sections = currentCourse.sections || [];
  const safeSectionIndex = Math.min(
    Math.max(0, activeSectionIndex),
    Math.max(0, sections.length - 1),
  );
  const section = sections.length > 0 ? sections[safeSectionIndex] : null;
  const contentToParse = sections.length > 0 ? section?.content ?? "" : currentCourse.content ?? "";
  const courseSegments = parseCourseContent(contentToParse);

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      {chapterCourses.length > 1 && (
        <button
          onClick={() => onSelectCourse(null)}
          className="text-xs text-emerald-600 font-bold"
        >
          ← Retour aux cours
        </button>
      )}

      {/* Section header */}
      {section && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-4">
          <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
            Section {activeSectionIndex + 1} / {sections.length}
          </span>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-2">
            {section.title}
          </h3>
        </div>
      )}

      {/* Content */}
      <article className="space-y-4 text-sm text-gray-800 dark:text-gray-200">
        {courseSegments.map((seg, sIdx) => {
          if (seg.type === "text") {
            const chunks = splitMediaTags(seg.value);
            if (chunks.length === 0) return null;

            return (
              <React.Fragment key={sIdx}>
                {chunks.map((chunk, cIdx) => {
                  if (chunk.kind === "text") {
                    if (!chunk.value.trim()) return null;
                    return (
                      <MathRenderer
                        key={`${sIdx}-${cIdx}`}
                        text={chunk.value}
                      />
                    );
                  }

                  return (
                    <MediaCoursRender
                      key={`${sIdx}-${cIdx}`}
                      url={chunk.url}
                      type={chunk.mediaType}
                    />
                  );
                })}
              </React.Fragment>
            );
          }
          const act = exercises.find((e) => e.id === seg.value);
          if (!act) return null;
          return (
            <DynamicExerciseCanvas
              key={sIdx}
              id={act.id}
              number={act.number}
              title={act.title}
              question={act.question}
              hint={act.hint}
              solution={act.solution}
              category="activité"
            />
          );
        })}
      </article>

      {/* Navigation sections */}
      {sections.length > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
          <button
            disabled={activeSectionIndex === 0}
            onClick={() => onSectionChange(activeSectionIndex - 1)}
            className="px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 disabled:opacity-40"
          >
            ← Précédent
          </button>
          <span className="text-xs font-mono text-gray-500">
            {activeSectionIndex + 1} / {sections.length}
          </span>
          <button
            disabled={activeSectionIndex === sections.length - 1}
            onClick={() => onSectionChange(activeSectionIndex + 1)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold disabled:opacity-40"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}

function MobileExercicesView({
  exercises,
  onSelectExercise,
}: {
  exercises: any[];
  onSelectExercise: (ex: Exercise) => void;
}) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Calculator className="mx-auto h-10 w-10 text-gray-300 dark:text-slate-700 mb-2" />
        <p className="text-sm">Aucun exercice disponible.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exercises.map((ex) => {
        const floatNum = parseFloat(ex.number) || 1.0;
        const difficultyStr =
          floatNum < 1.3
            ? "Facile"
            : floatNum < 1.6
            ? "Intermédiaire"
            : "Avancé";
        const difficultyColor =
          difficultyStr === "Facile"
            ? "bg-emerald-50 text-emerald-700"
            : difficultyStr === "Intermédiaire"
            ? "bg-amber-50 text-amber-700"
            : "bg-rose-50 text-rose-700";

        return (
          <button
            key={ex.id}
            onClick={() => onSelectExercise(ex)}
            className="w-full text-left bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-lg">
                Ex {ex.number}
              </span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${difficultyColor}`}
              >
                {difficultyStr}
              </span>
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              {ex.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">
              {ex.question
                .replace(/\$\$[\s\S]*?\$\$/g, " [Équation] ")
                .replace(/\$[\s\S]*?\$/g, " [Formule] ")
                .substring(0, 100)}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function MobileQcmView({
  quizzes,
  quizGroups,
  qcmAnswers,
  quizSubmitted,
  onAnswer,
  onSubmit,
  onRestart,
}: {
  quizzes: any[];
  quizGroups?: any[];
  qcmAnswers: Record<string, number>;
  quizSubmitted: boolean;
  onAnswer: (qid: string, idx: number) => void;
  onSubmit: () => void;
  onRestart: () => void;
}) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const activeQuestions =
    quizGroups && quizGroups.length > 0 && quizGroups[0]?.questions
      ? quizGroups[0].questions
      : quizzes;

  useEffect(() => {
    setQuizStarted(false);
    setCurrentQIndex(0);
  }, [quizzes.length, quizGroups?.length]);

  const estimatedMinutes = Math.max(1, Math.round(activeQuestions.length * 0.8));

  if (activeQuestions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <HelpCircle className="mx-auto h-10 w-10 text-gray-300 dark:text-slate-700 mb-2" />
        <p className="text-sm">Quiz en cours d'intégration.</p>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="space-y-6 text-center py-12 px-4">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-300">
          <HelpCircle className="h-7 w-7" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Quiz prêt à démarrer
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Il y a {activeQuestions.length} question{activeQuestions.length > 1 ? "s" : ""}.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Appuie sur le bouton pour commencer.
          </p>
        </div>
        <div className="space-y-3">
          <div className="rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 px-5 py-4 text-sm text-emerald-700 dark:text-emerald-200">
            Durée estimée : environ {estimatedMinutes} minute{estimatedMinutes > 1 ? "s" : ""}.
          </div>
          <button
            onClick={() => {
              setQuizStarted(true);
              setCurrentQIndex(0);
              onRestart();
            }}
            className="w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
          >
            Démarrer pour commencer
          </button>
        </div>
      </div>
    );
  }

  if (quizSubmitted) {
    const score = activeQuestions.reduce(
      (acc: number, q: any) =>
        acc + (qcmAnswers[q.id] === q.correctIndex ? 1 : 0),
      0,
    );
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-5 text-center">
          <h3 className="text-2xl font-black">{score} / {activeQuestions.length}</h3>
          <p className="text-sm text-emerald-100 mt-1">
            {score === activeQuestions.length
              ? "Parfait !"
              : "Analyse tes erreurs"}
          </p>
        </div>
        <button
          onClick={onRestart}
          className="w-full py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold"
        >
          Recommencer
        </button>
      </div>
    );
  }

  const question = activeQuestions[currentQIndex];
  const selectedOpt = qcmAnswers[question.id] ?? -1;
  const answeredCount = activeQuestions.filter(
    (q: any) => qcmAnswers[q.id] !== undefined,
  ).length;
  const allAnswered = answeredCount === activeQuestions.length;

  return (
    <div className="space-y-4">
      {/* Progress dots */}
      <div className="flex items-center gap-1.5 justify-center">
        {activeQuestions.map((q: any, idx: number) => (
          <div
            key={q.id}
            className={`h-2 w-2 rounded-full ${
              qcmAnswers[q.id] !== undefined
                ? "bg-emerald-500"
                : idx === currentQIndex
                ? "bg-emerald-300"
                : "bg-gray-200 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5">
        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide mb-2">
          Question {currentQIndex + 1} / {activeQuestions.length}
        </p>
        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          <MathRenderer text={question.question} />
        </div>

        <div className="space-y-2">
          {question.options.map((opt: string, oIdx: number) => {
            const isSelected = selectedOpt === oIdx;
            return (
              <button
                key={oIdx}
                onClick={() => onAnswer(question.id, oIdx)}
                className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100"
                    : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full border border-gray-300 dark:border-slate-600 flex items-center justify-center font-mono text-xs font-bold">
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <MathRenderer text={opt} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          disabled={currentQIndex === 0}
          onClick={() => setCurrentQIndex((p) => Math.max(0, p - 1))}
          className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-300 disabled:opacity-40"
        >
          Précédent
        </button>
        {currentQIndex < activeQuestions.length - 1 ? (
          <button
            onClick={() =>
              setCurrentQIndex((p) =>
                Math.min(activeQuestions.length - 1, p + 1),
              )
            }
            className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold"
          >
            Suivant
          </button>
        ) : (
          <button
            disabled={!allAnswered}
            onClick={onSubmit}
            className={`flex-1 py-3 rounded-2xl text-xs font-bold ${
              allAnswered
                ? "bg-emerald-600 text-white"
                : "bg-gray-300 dark:bg-slate-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            Terminer
          </button>
        )}
      </div>
    </div>
  );
}

function MobileSolutionsView({ exercises }: { exercises: any[] }) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Bookmark className="mx-auto h-10 w-10 text-gray-300 dark:text-slate-700 mb-2" />
        <p className="text-sm">Corrigés en cours d'indexation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((ex) => (
        <div
          key={ex.id}
          className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4"
        >
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
            Ex {ex.number} - {ex.title}
          </h4>
          <div className="bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl p-3 text-sm">
            <MathRenderer text={ex.solution} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileExerciseDrawer({
  exercise,
  onClose,
}: {
  exercise: Exercise;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-3xl overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 p-4 flex items-center justify-between z-10">
          <div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">
              Fiche officielle
            </span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Ex {exercise.number} - {exercise.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <DynamicExerciseCanvas
            id={exercise.id}
            number={exercise.number}
            title={exercise.title}
            question={exercise.question}
            hint={exercise.hint}
            solution={exercise.solution}
            category="exercice"
          />
        </div>
      </div>
    </div>
  );
}