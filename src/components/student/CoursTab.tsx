import { BookOpenText, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { parseCourseContent } from "../../../lib/utils";
import { Course, Exercise } from "../../../types";
import { DynamicExerciseCanvas } from "../DynamicExerciseCanvas";
import { MathRenderer } from "../MathRenderer";
import { MediaCoursRender, CourseMediaType } from "../MediaCoursRender";

interface CoursTabProps {
  chapterCourses: Course[];
  currentCourse: Course | null;
  onSelectCourse: (courseId: string | null) => void;
  activeSectionIndex: number;
  onSectionChange: (index: number) => void;
  exercises: Exercise[];
  chapterExercises: Exercise[];
}

/**
 * Un fragment de contenu textuel découpé en sous-segments :
 * du texte brut (à passer à MathRenderer) ou un média
 * (à passer à MediaCoursRender), dans l'ordre d'apparition.
 */
type ContentChunk =
  | { kind: "text"; value: string }
  | { kind: "media"; url: string; mediaType: CourseMediaType };

// Capture [[media:URL:TYPE]] — l'URL peut contenir des ":" (ex: https://...),
// le quantificateur paresseux s'arrête au premier ":image]]" / ":audio]]" / ":video]]" valide.
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
}) => {
  const referencedActivityIds: string[] = [];
  let courseSegments: ReturnType<typeof parseCourseContent> = [];

  const hasSections = !!(
    currentCourse?.sections && currentCourse.sections.length > 0
  );
  const sectionsList = currentCourse?.sections || [];

  // bound-guard activeSectionIndex
  const safeSectionIndex = Math.min(
    Math.max(0, activeSectionIndex),
    Math.max(0, sectionsList.length - 1),
  );
  const currentSection = hasSections ? sectionsList[safeSectionIndex] : null;

  if (currentCourse) {
    const contentToParse = currentSection
      ? currentSection.content
      : currentCourse.content;
    courseSegments = parseCourseContent(contentToParse);
    courseSegments.forEach((seg) => {
      if (seg.type === "activity") {
        referencedActivityIds.push(seg.value);
      }
    });
  }

  const unreferencedActivities = chapterExercises.filter(
    (ex) => ex.category === "activité" && !referencedActivityIds.includes(ex.id),
  );

  return (
    <div className="space-y-6">
      {chapterCourses.length > 1 && !currentCourse ? (
        <div className="space-y-6">
          <div className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            Ce chapitre contient plusieurs cours. Sélectionnez-en un pour
            continuer.
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {chapterCourses.map((course) => (
              <div
                key={course.id}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-emerald-500"
              >
                <div className="space-y-3">
                  <div className="text-xs uppercase tracking-[0.24em] font-bold text-emerald-600">
                    Cours
                  </div>
                  <h3 className="font-display text-base font-bold text-gray-900 dark:text-white">
                    {course.title}
                  </h3>
                  <p className="text-[10.5px] text-gray-500 dark:text-slate-400">
                    {course.sections?.length || 0} section(s)
                  </p>
                </div>

                <button
                  onClick={() => onSelectCourse(course.id)}
                  className="mt-6 w-full rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Accéder
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : currentCourse ? (
        <div className="space-y-6">
          {/* Breadcrumb: visible when there are multiple courses in the chapter */}
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
                    <span className="ml-2 text-xs font-mono text-gray-500">(Section {safeSectionIndex + 1}/{sectionsList.length})</span>
                  )}
                </span>
              </div>

              {/* Section jump dropdown */}
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
          {/* Custom Sections Navigation Bar */}
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

              // seg.type === "activity"
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

          {/* Sequential/Paginated section navigations buttons */}
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
            Cours en cours de rédaction par l'équipe administrative
            académique.
          </p>
        </div>
      )}

      {/* Fallback for unreferenced Learning Activities */}
      {unreferencedActivities.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-150 dark:border-slate-700/80 space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="font-display font-bold text-base text-gray-950 dark:text-white">
              Activités complémentaires du chapitre
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {unreferencedActivities.map((act) => (
              <DynamicExerciseCanvas
                key={act.id}
                id={act.id}
                number={act.number}
                title={act.title}
                question={act.question}
                hint={act.hint}
                solution={act.solution}
                category="activité"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};