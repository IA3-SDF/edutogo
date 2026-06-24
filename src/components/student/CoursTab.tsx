import { BookOpenText, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import React from "react";
import { parseCourseContent } from "../../../lib/utils";
import { Course, Exercise } from "../../../types";
import { MathRenderer } from "../admin/MathRenderer";
import { DynamicExerciseCanvas } from "./DynamicExerciseCanvas";
import { CourseMediaType, MediaCoursRender } from "./MediaCoursRender";

interface CoursTabProps {
  chapterCourses: Course[];
  currentCourse: Course | null;
  onSelectCourse: (courseId: string | null) => void;
  activeSectionIndex: number;
  onSectionChange: (index: number) => void;
  exercises: Exercise[];
  chapterExercises: Exercise[];
  favoriteCourseIds?: Set<string>;
  onToggleFavorite?: (courseId: string) => Promise<void>;
}

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

export const CoursTab: React.FC<CoursTabProps> = ({
  chapterCourses,
  currentCourse,
  onSelectCourse,
  activeSectionIndex,
  onSectionChange,
  exercises,
  chapterExercises,
  favoriteCourseIds = new Set(),
  onToggleFavorite,
}) => {
  const hasSections = !!(
    currentCourse?.sections && currentCourse.sections.length > 0
  );
  const sectionsList = currentCourse?.sections || [];

  const safeSectionIndex = Math.min(
    Math.max(0, activeSectionIndex),
    Math.max(0, sectionsList.length - 1),
  );
  const currentSection = hasSections ? sectionsList[safeSectionIndex] : null;

  // 🔑 SEUL le contenu de la section active est parsé — plus de fuite entre sections
  const contentToParse = currentSection
    ? currentSection.content
    : currentCourse?.content || "";

  // Les segments sont maintenant strictement liés à la section active
  const courseSegments = React.useMemo(
    () => parseCourseContent(contentToParse),
    [contentToParse],
  );

  return (
    <div className="space-y-6">
      {chapterCourses.length > 1 && !currentCourse ? (
        <div className="space-y-6">
          <div className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            Les grands titres du chapitre
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {chapterCourses.map((course) => {
              const isFavorite = favoriteCourseIds.has(course.id);

              const handleFavoriteClick = async (e: React.MouseEvent) => {
                e.stopPropagation();
                if (onToggleFavorite) {
                  try {
                    await onToggleFavorite(course.id);
                  } catch (err) {
                    console.error(
                      "[EduTogo] Erreur lors de la modification du favori:",
                      err,
                    );
                  }
                }
              };

              return (
                <div
                  key={course.id}
                  className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-emerald-500"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="text-xs uppercase tracking-[0.24em] font-bold text-emerald-600">
                      Cours
                    </div>
                    <button
                      onClick={handleFavoriteClick}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                      title={
                        isFavorite
                          ? "Retirer des favoris"
                          : "Ajouter aux favoris"
                      }
                    >
                      <Heart
                        size={16}
                        className={`${
                          isFavorite
                            ? "fill-rose-500 text-rose-500"
                            : "text-gray-300 dark:text-slate-600 hover:text-rose-400"
                        } transition-colors`}
                      />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-display text-base font-bold text-gray-900 dark:text-white">
                      {course.title}
                    </h3>
                    <p className="text-[10.5px] text-gray-500 dark:text-slate-400">
                      {course.sections?.length || 0} section(s)
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectCourse(course.id)}
                    className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <span>Accéder</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : currentCourse ? (
        <div className="space-y-6">
          {chapterCourses.length > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <button
                  onClick={() => onSelectCourse(null)}
                  className="text-emerald-600 hover:underline font-bold mr-2"
                >
                  Cours du chapitre
                </button>
                <span className="text-gray-400">›</span>
                <span className="ml-2 font-semibold">
                  {currentCourse.title}
                  {hasSections && currentCourse.sections && (
                    <span className="ml-2 text-xs font-mono text-gray-500">
                      (Section {safeSectionIndex + 1}/{sectionsList.length})
                    </span>
                  )}
                </span>
              </div>

              {hasSections && (
                <div>
                  <label className="sr-only">Aller à la section</label>
                  <select
                    value={safeSectionIndex}
                    onChange={(e) => onSectionChange(Number(e.target.value))}
                    className="text-xs font-mono bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-1"
                  >
                    {sectionsList.map((sec, idx) => (
                      <option key={sec.id || idx} value={idx}>
                        {idx + 1} — {sec.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {hasSections && currentSection && (
            <div className="p-4 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-950/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5 text-left">
                <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Section {safeSectionIndex + 1} sur {sectionsList.length}
                </span>
                <h3 className="font-display font-extrabold text-sm text-gray-900 dark:text-white mt-1.5">
                  {currentSection.title}
                </h3>
              </div>
              <div className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl border border-gray-100 dark:border-slate-750/80 shadow-2xs">
                Progression :{" "}
                {Math.round(
                  ((safeSectionIndex + 1) / sectionsList.length) * 100,
                )}
                %
              </div>
            </div>
          )}

          <article className="prose dark:prose-invert max-w-none space-y-4">
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

              // seg.type === "activity" — rendu uniquement pour la section active
              const actId = seg.value;
              const act = exercises.find((e) => e.id === actId);
              if (!act) {
                return (
                  <div
                    key={sIdx}
                    className="my-4 p-3 bg-red-50 dark:bg-rose-950/20 border border-red-200 text-red-700 dark:text-red-300 rounded-xl text-xs font-mono"
                  >
                    [Activité introuvable : {actId}]
                  </div>
                );
              }
              return (
                <div key={sIdx} className="my-6">
                  <DynamicExerciseCanvas
                    id={act.id}
                    number={act.number}
                    title={act.title}
                    question={act.question}
                    hint={act.hint}
                    solution={act.solution}
                    category="activité"
                  />
                </div>
              );
            })}
          </article>

          {hasSections && (
            <div className="flex items-center justify-between pt-5 border-t border-gray-150 dark:border-slate-855 mt-8">
              <button
                disabled={safeSectionIndex === 0}
                onClick={() => {
                  onSectionChange(safeSectionIndex - 1);
                  window.scrollTo({ top: 120, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-750 disabled:opacity-45 transition-colors cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="h-4 w-4" /> Précédent
              </button>

              <div className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400">
                Page {safeSectionIndex + 1} / {sectionsList.length}
              </div>

              <button
                disabled={safeSectionIndex === sectionsList.length - 1}
                onClick={() => {
                  onSectionChange(safeSectionIndex + 1);
                  window.scrollTo({ top: 120, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl disabled:opacity-45 transition-colors cursor-pointer shadow-md shadow-emerald-500/15"
              >
                Suivant <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 dark:text-slate-500">
          <BookOpenText className="mx-auto h-12 w-12 text-gray-300 dark:text-slate-700 mb-3" />
          <p>
            Cours en cours de rédaction par l'équipe administrative académique.
          </p>
        </div>
      )}

      {/* 
        SUPPRESSION DU BLOC unreferencedActivities
        ==========================================
        Avant : ce bloc s'affichait TOUJOURS (même quand currentCourse === null)
        et montrait toutes les activités du chapitre non référencées.
        
        Maintenant : SUPPRIMÉ COMPLÈTEMENT.
        
        Règle d'or : une activité qui n'est pas injectée via [[activity:ID]]
        dans une section de cours n'est tout simplement pas affichée.
        L'admin DOIT la placer explicitement dans le contenu d'une section.
      */}
    </div>
  );
};