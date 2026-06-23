import React from "react";
import {
  Plus,
  BookOpen,
  Edit3,
  Trash,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Chapter, Course } from "../../../types";
import { ModalState } from "./adminTypes";
import { EditableField } from "./EditableField";

interface CoursTabProps {
  currentChapter: Chapter;
  currentChapterCourses: Course[];
  activeCourse: Course | null;
  activeCourseSectionsVisible: boolean;
  setActiveCourseSectionsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCourseId: (id: string | null) => void;
  setModal: (modal: ModalState | null) => void;
  handleEditCourseTitle: (newTitle: string) => void;
  handleSaveSection: (sectId: string | undefined, title: string, content: string) => Promise<void>;
  handleUpdateSectionOrder: (sectId: string, direction: "up" | "down") => void;
}

export const CoursTab: React.FC<CoursTabProps> = ({
  currentChapter,
  currentChapterCourses,
  activeCourse,
  activeCourseSectionsVisible,
  setActiveCourseSectionsVisible,
  setSelectedCourseId,
  setModal,
  handleEditCourseTitle,
  handleSaveSection,
  handleUpdateSectionOrder,
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in text-left">
      {/* Left Area (Main): Course contents and sections list */}
      <div className="xl:col-span-2 space-y-5">
        <div className="section-head flex justify-between items-center card p-4.5 rounded-2xl">
          <div>
            <h2 className="text-xs font-bold text-(--color-text) uppercase">
              Contenu et Chapitrage de la Leçon
            </h2>
            <p className="sub text-[11px] text-(--color-text-muted) mt-0.5">
              Structurez votre cours en chapitres et sections pour activer la
              pagination élève.
            </p>
          </div>
          <button
            onClick={() =>
              setModal({
                type: "addCourse",
                draftTitle: `Cours — ${currentChapter.title}`,
                draftContent: "",
              })
            }
            className="btn btn-primary px-3.5 py-2 text-[11px] font-bold flex items-center gap-1.5"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Ajouter un cours</span>
          </button>
        </div>

        {currentChapterCourses.length === 0 ? (
          <div className="card border-2 border-dashed border-(--color-border) rounded-2xl p-11 text-center text-(--color-text-muted) shadow-[var(--shadow-elevation-sm)]">
            <BookOpen className="mx-auto h-10 w-10 text-(--color-border-strong) mb-3" />
            <p className="text-xs">
              Aucun cours n'est configuré pour ce chapitre.
            </p>
            <button
              onClick={() =>
                setModal({
                  type: "addCourse",
                  draftTitle: `Cours — ${currentChapter.title}`,
                  draftContent: "",
                })
              }
              className="mt-3.5 text-xs font-bold text-(--color-accent) hover:underline"
            >
              + Initialiser un cours maintenant
            </button>
          </div>
        ) : !activeCourse ? (
          <div className="grid gap-4">
            <div className="text-sm font-bold text-(--color-text) uppercase tracking-wide">
              Sélectionnez un cours à modifier
            </div>
            <div className="grid md:grid-cols-2 gap-3.5">
              {currentChapterCourses.map((course) => (
                <div
                  key={course.id}
                  className="card group p-4 rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-[var(--shadow-elevation-xs)] hover:shadow-[var(--shadow-elevation-sm)] hover:border-(--color-accent) hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="shrink-0 h-9 w-9 rounded-xl bg-(--color-accent-soft) text-(--color-accent) flex items-center justify-center">
                        <BookOpen className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[12.5px] font-bold text-(--color-text) leading-snug truncate">
                          {course.title}
                        </h3>
                        <span className="text-[9.5px] text-(--color-text-faint) font-mono">
                          {course.sections?.length || 0} section(s)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          setModal({
                            type: "addCourse",
                            draftId: course.id,
                            draftTitle: course.title,
                            draftContent: course.content,
                          })
                        }
                        className="p-1.5 hover:bg-(--color-accent-soft) text-(--color-accent) rounded-lg transition-transform cursor-pointer"
                        title="Modifier le cours"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setModal({
                            type: "deleteCourse",
                            draftId: course.id,
                            draftTitle: course.title,
                          })
                        }
                        className="p-1.5 hover:bg-(--color-danger-soft) text-(--color-danger) rounded-lg transition-transform cursor-pointer"
                        title="Supprimer le cours"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCourseId(course.id)}
                    className="mt-3 w-full px-3 py-1.5 bg-(--color-surface-alt) border border-(--color-border) rounded-xl text-[10.5px] font-bold text-(--color-accent) hover:bg-(--color-border) transition-colors cursor-pointer"
                  >
                    Accéder au cours
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="card p-6 rounded-2xl space-y-5 shadow-[var(--shadow-elevation-sm)] relative hover:border-(--color-accent) transition-all">
              <div className="card-head flex items-start justify-between gap-5 border-b border-(--color-border) pb-4">
                <div>
                  <h3 className="text-sm font-bold text-(--color-text)">
                    <EditableField
                      value={activeCourse.title}
                      onSave={handleEditCourseTitle}
                    />
                  </h3>
                  <div className="id text-[9px] text-(--color-text-faint) font-mono mt-1">
                    courseId: {activeCourse.id} · mode structuré activé
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setActiveCourseSectionsVisible((prev) => !prev)
                    }
                    className="px-3 py-1.5 bg-(--color-surface-alt) border border-(--color-border) rounded-xl text-[10.5px] font-bold text-(--color-text) hover:bg-(--color-border) transition-colors flex items-center gap-1"
                    title={
                      activeCourseSectionsVisible
                        ? "Masquer les sections"
                        : "Afficher les sections"
                    }
                  >
                    {activeCourseSectionsVisible ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span>
                      {activeCourseSectionsVisible
                        ? "Cacher sections"
                        : "Afficher sections"}
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      setModal({
                        type: "deleteCourse",
                        draftId: activeCourse.id,
                        draftTitle: activeCourse.title,
                      })
                    }
                    className="p-1 hover:bg-(--color-danger-soft) text-(--color-danger) rounded transition-transform cursor-pointer"
                    title="Supprimer la totalité du cours"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {activeCourseSectionsVisible && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-(--color-text) uppercase tracking-wide flex items-center gap-1">
                      <span>
                        Séquençage des Sections (
                        {activeCourse.sections?.length || 0})
                      </span>
                    </h4>
                    <button
                      onClick={() =>
                        setModal({
                          type: "addSection",
                          draftTitle: "",
                          draftContent: "",
                        })
                      }
                      className="px-3 py-1.5 bg-(--color-surface-alt) hover:bg-(--color-border) border border-(--color-border) text-(--color-accent) rounded-xl text-[10.5px] font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Ajouter une Section</span>
                    </button>
                  </div>

                  {!activeCourse.sections ||
                  activeCourse.sections.length === 0 ? (
                    <div className="p-5 bg-(--color-surface-alt) border border-dashed border-(--color-border) rounded-2xl text-center">
                      <p className="text-[11.5px] text-(--color-text-muted)">
                        Ce cours est pour le moment rédigé sur une seule page
                        monolithique.
                      </p>
                      {activeCourse.content ? (
                        <button
                          onClick={() => {
                            handleSaveSection(
                              undefined,
                              "Introduction",
                              activeCourse.content,
                            );
                          }}
                          className="mt-2.5 px-3.5 py-1.5 btn btn-primary text-[11px] font-bold"
                        >
                          Découper proprement en sections
                        </button>
                      ) : (
                        <p className="text-[10px] text-(--color-text-faint) mt-1 italic">
                          Rédigez d'abord du contenu ou ajoutez une section
                          pour commencer.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {[...activeCourse.sections]
                        .sort((a, b) => a.order - b.order)
                        .map((sect, sIdx, arr) => (
                          <div
                            key={sect.id}
                            className="p-3.5 bg-(--color-surface-alt) border border-(--color-border) rounded-xl hover:border-(--color-border-strong) transition-colors flex items-center justify-between gap-4"
                          >
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[9px] font-extrabold px-1.5 py-0.5 bg-(--color-border) text-(--color-text-muted) rounded-md">
                                  {sect.order}
                                </span>
                                <span className="text-xs font-bold text-(--color-text) truncate block">
                                  {sect.title}
                                </span>
                              </div>
                              <p className="text-[10px] text-(--color-text-faint) font-serif truncate">
                                {sect.content
                                  .replace(/\[\[media:[^\]]+\]\]/g, "[Média]")
                                  .substring(0, 100) ||
                                  "Sans contenu pour le moment..."}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                disabled={sect.order === 1}
                                onClick={() =>
                                  handleUpdateSectionOrder(sect.id, "up")
                                }
                                className="p-1 text-(--color-text-muted) hover:text-(--color-text) disabled:opacity-30 cursor-pointer"
                                title="Monter d'un cran"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                              <button
                                disabled={sect.order === arr.length}
                                onClick={() =>
                                  handleUpdateSectionOrder(sect.id, "down")
                                }
                                className="p-1 text-(--color-text-muted) hover:text-(--color-text) disabled:opacity-30 cursor-pointer"
                                title="Descendre d'un cran"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() =>
                                  setModal({
                                    type: "editSection",
                                    draftId: sect.id,
                                    draftTitle: sect.title,
                                    draftContent: sect.content,
                                  })
                                }
                                className="p-1.5 hover:bg-(--color-accent-soft) text-(--color-accent) rounded cursor-pointer"
                                title="Modifier le contenu KaTeX"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>

                              <button
                                onClick={() =>
                                  setModal({
                                    type: "deleteSection",
                                    draftId: sect.id,
                                    draftTitle: sect.title,
                                  })
                                }
                                className="p-1.5 hover:bg-(--color-danger-soft) text-(--color-danger) rounded cursor-pointer"
                                title="Retirer cette section"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Course preview option */}
              <div className="pt-4 border-t border-(--color-border) flex justify-between items-center text-xs text-(--color-text-muted)">
                <span>
                  Dernière mise à jour :{" "}
                  {new Date(activeCourse.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() =>
                    setModal({
                      type: "editCourseContent",
                      draftTitle: activeCourse.title,
                      draftContent: activeCourse.content,
                      draftId: activeCourse.id,
                    })
                  }
                  className="px-3.5 py-1.5 bg-(--color-surface-alt) border border-(--color-border) hover:bg-(--color-border) rounded-xl text-[10.5px] font-bold text-(--color-text-muted) cursor-pointer"
                >
                  Mode édition brute (Équations globales)
                </button>
              </div>
              <div className="card-tag-row flex items-center gap-2">
                <span className="badge badge-info uppercase tracking-wider">
                  Relation 1:1 Cours
                </span>
              </div>
            </div>

            {!activeCourseSectionsVisible &&
              currentChapterCourses.length > 1 && (
                <div className="pt-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-(--color-border)" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-(--color-text-faint)">
                      Autres cours de ce chapitre
                    </span>
                    <div className="h-px flex-1 bg-(--color-border)" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3.5">
                    {currentChapterCourses
                      .filter((course) => course.id !== activeCourse.id)
                      .map((course) => (
                        <div
                          key={course.id}
                          className="card group p-4 rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-[var(--shadow-elevation-xs)] hover:shadow-[var(--shadow-elevation-sm)] hover:border-(--color-accent) hover:-translate-y-0.5 transition-all duration-200"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span className="shrink-0 h-9 w-9 rounded-xl bg-(--color-accent-soft) text-(--color-accent) flex items-center justify-center">
                                <BookOpen className="h-4 w-4" />
                              </span>
                              <div className="min-w-0">
                                <h3 className="text-[12.5px] font-bold text-(--color-text) leading-snug truncate">
                                  {course.title}
                                </h3>
                                <span className="text-[9.5px] text-(--color-text-faint) font-mono">
                                  {course.sections?.length || 0} section(s)
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  setModal({
                                    type: "addCourse",
                                    draftId: course.id,
                                    draftTitle: course.title,
                                    draftContent: course.content,
                                  })
                                }
                                className="p-1.5 hover:bg-(--color-accent-soft) text-(--color-accent) rounded-lg transition-transform cursor-pointer"
                                title="Modifier le cours"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  setModal({
                                    type: "deleteCourse",
                                    draftId: course.id,
                                    draftTitle: course.title,
                                  })
                                }
                                className="p-1.5 hover:bg-(--color-danger-soft) text-(--color-danger) rounded-lg transition-transform cursor-pointer"
                                title="Supprimer le cours"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedCourseId(course.id)}
                            className="mt-3 w-full px-3 py-1.5 bg-(--color-surface-alt) border border-(--color-border) rounded-xl text-[10.5px] font-bold text-(--color-accent) hover:bg-(--color-border) transition-colors cursor-pointer"
                          >
                            Accéder au cours
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};