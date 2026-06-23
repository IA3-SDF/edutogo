import React from "react";
import {
  Plus,
  Edit3,
  Trash,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { DatabaseState, Chapter } from "../../../types";
import { ModalState } from "./adminTypes";

interface AdminSidebarProps {
  db: DatabaseState;
  selectedLevelId: string;
  selectedSubjectId: string;
  selectedChapterId: string;
  openLevels: Record<string, boolean>;
  openSubjects: Record<string, boolean>;
  showProfileMenu: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onLogout: () => void;
  setShowProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenLevels: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setOpenSubjects: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setSelectedLevelId: (id: string) => void;
  setSelectedSubjectId: (id: string) => void;
  setSelectedChapterId: (id: string) => void;
  setActiveTab: (tab: string) => void;
  setModal: (modal: ModalState | null) => void;
  getChapterStatus: (ch: Chapter) => "ok" | "warn" | "bad";
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  db,
  selectedSubjectId,
  selectedChapterId,
  openLevels,
  openSubjects,
  showProfileMenu,
  isDarkMode,
  setIsDarkMode,
  onLogout,
  setShowProfileMenu,
  setOpenLevels,
  setOpenSubjects,
  setSelectedLevelId,
  setSelectedSubjectId,
  setSelectedChapterId,
  setActiveTab,
  setModal,
  getChapterStatus,
}) => {
  return (
    <aside className="sidebar border-r border-(--color-border) bg-(--color-surface) flex flex-col justify-between h-screen sticky top-0 z-20">
      <div>
        {/* Logo Brand Frame */}
        <div className="sidebar-head p-5 border-b border-(--color-border)">
          <div className="logo font-bold text-(--color-text) flex items-center gap-2">
            <span className="mark w-6.5 h-6.5 bg-(--color-accent) text-(--color-text-on-accent) rounded-lg flex items-center justify-center font-black text-xs">
              ET
            </span>
            <span className="text-base font-extrabold tracking-tight font-display">
              EduTogo
            </span>
          </div>
          <div className="role text-[10px] uppercase font-bold text-(--color-text-faint) mt-1.5 tracking-wider">
            Console Inspecteur
          </div>
        </div>

        {/* Tree Navigation Directory */}
        <nav className="sidebar-nav flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-140px)] select-none">
          {/* Quick Add Level Button */}
          <button
            onClick={() =>
              setModal({ type: "addLevel", draftTitle: "", draftContent: "" })
            }
            className="w-full flex items-center justify-center gap-1.5 py-2 mb-3 border border-dashed border-(--color-accent-border) hover:bg-(--color-accent-soft) rounded-xl text-xs font-bold text-(--color-accent) transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>+ Créer un Niveau</span>
          </button>

          {db.levels.map((lvl) => {
            const isLevelOpen = !!openLevels[lvl.id];
            const levelSubjects = db.subjects.filter(
              (s) => s.levelId === lvl.id,
            );

            return (
              <div
                key={lvl.id}
                className={`nav-group ${isLevelOpen ? "open" : ""}`}
              >
                <div className="level-header flex items-center justify-between group hover:bg-(--color-surface-alt) rounded-lg px-2.5">
                  <button
                    onClick={() =>
                      setOpenLevels((o) => ({ ...o, [lvl.id]: !o[lvl.id] }))
                    }
                    className="level-toggle flex-1 text-left py-2 text-xs font-bold text-(--color-text)"
                  >
                    <span>{lvl.name}</span>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="hidden group-hover:flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModal({
                            type: "editLevel",
                            draftId: lvl.id,
                            draftTitle: lvl.name,
                            draftContent: lvl.description || "",
                          });
                        }}
                        title="Modifier le Niveau"
                        className="p-1 hover:text-(--color-accent) transition-colors rounded hover:bg-(--color-surface-alt) cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModal({
                            type: "deleteLevel",
                            draftId: lvl.id,
                            draftTitle: lvl.name,
                          });
                        }}
                        title="Supprimer le Niveau"
                        className="p-1 hover:text-(--color-danger) transition-colors rounded hover:bg-(--color-danger-soft) cursor-pointer"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                    </div>

                    <ChevronDown
                      className={`h-3 w-3 text-(--color-text-faint) transition-transform duration-200 ${isLevelOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {isLevelOpen && (
                  <div className="subjects pl-3 mt-1 space-y-1">
                    {levelSubjects.map((subj) => {
                      const isSubjOpen = !!openSubjects[subj.id];
                      const isSubjectActive = selectedSubjectId === subj.id;
                      const subjectChapters = db.chapters.filter(
                        (c) => c.subjectId === subj.id,
                      );

                      return (
                        <div
                          key={subj.id}
                          className={`subject-block ${isSubjOpen ? "open" : ""}`}
                        >
                          <div
                            className={`subject-header flex items-center justify-between group rounded-lg px-2.5 transition-colors ${
                              isSubjectActive
                                ? "bg-(--color-accent-soft) text-(--color-accent) font-bold"
                                : "text-(--color-text) hover:bg-(--color-surface-alt)"
                            }`}
                          >
                            <button
                              onClick={() => {
                                setOpenSubjects((o) => ({
                                  ...o,
                                  [subj.id]: !o[subj.id],
                                }));
                                setSelectedLevelId(lvl.id);
                                setSelectedSubjectId(subj.id);
                                if (subjectChapters.length > 0) {
                                  setSelectedChapterId(subjectChapters[0].id);
                                }
                              }}
                              className="subject-toggle flex-1 text-left py-1.5 text-xs truncate"
                            >
                              <span className="truncate">{subj.name}</span>
                            </button>

                            {/* Visual Edit and Delete buttons for Subject */}
                            <div className="hidden group-hover:flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModal({
                                    type: "editSubject",
                                    draftId: subj.id,
                                    draftTitle: subj.name,
                                    draftContent: subj.icon || "BookOpen",
                                    draftNum: subj.color || "blue",
                                  });
                                }}
                                title="Modifier la matière"
                                className="p-1 hover:text-(--color-accent) transition-colors rounded hover:bg-(--color-surface-alt) cursor-pointer"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModal({
                                    type: "deleteSubject",
                                    draftId: subj.id,
                                    draftTitle: subj.name,
                                  });
                                }}
                                title="Supprimer la matière"
                                className="p-1 hover:text-(--color-danger) transition-colors rounded hover:bg-(--color-danger-soft) cursor-pointer"
                              >
                                <Trash className="h-3 w-3" />
                              </button>
                              <ChevronDown
                                className={`h-2.5 w-2.5 text-(--color-text-faint) transition-transform duration-200 ${isSubjOpen ? "rotate-180" : ""}`}
                              />
                            </div>

                            {!isSubjOpen && (
                              <ChevronDown className="group-hover:hidden h-2.5 w-2.5 text-(--color-text-faint)" />
                            )}
                            {isSubjOpen && (
                              <ChevronDown className="group-hover:hidden h-2.5 w-2.5 text-(--color-text-faint) rotate-180" />
                            )}
                          </div>

                          {isSubjOpen && (
                            <div className="chapters border-l border-(--color-border) pl-3.5 ml-3 mt-1 space-y-0.5">
                              {subjectChapters.map((ch) => {
                                const isActiveChap =
                                  ch.id === selectedChapterId;
                                const status = getChapterStatus(ch);

                                return (
                                  <div
                                    key={ch.id}
                                    className={`chapter-row flex items-center justify-between group rounded px-2 text-xs transition-colors ${
                                      isActiveChap
                                        ? "bg-(--color-accent-soft) text-(--color-accent) font-bold"
                                        : "text-(--color-text-muted) hover:text-(--color-text) hover:bg-(--color-surface-alt)"
                                    }`}
                                  >
                                    <button
                                      onClick={() => {
                                        setSelectedLevelId(lvl.id);
                                        setSelectedSubjectId(subj.id);
                                        setSelectedChapterId(ch.id);
                                        setActiveTab("overview");
                                      }}
                                      className="chapter-link flex-1 flex items-center gap-2 py-1 text-left min-w-0"
                                    >
                                      <span className="num font-mono text-[10px] opacity-60 shrink-0">
                                        {String(ch.number).padStart(2, "0")}
                                      </span>
                                      <span className="truncate flex-1">
                                        {ch.title}
                                      </span>
                                    </button>

                                    <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setModal({
                                            type: "editChapter",
                                            draftId: ch.id,
                                            draftTitle: ch.title,
                                            draftNum: String(ch.number),
                                            draftContent: ch.description || "",
                                          });
                                        }}
                                        title="Modifier le chapitre"
                                        className="p-[3px] hover:text-(--color-accent) transition-colors rounded hover:bg-(--color-surface-alt) cursor-pointer"
                                      >
                                        <Edit3 className="h-2.5 w-2.5" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedChapterId(ch.id);
                                          setModal({
                                            type: "deleteChapter",
                                            draftId: ch.id,
                                            draftTitle: ch.title,
                                          });
                                        }}
                                        title="Supprimer le chapitre"
                                        className="p-[3px] hover:text-(--color-danger) transition-colors rounded hover:bg-(--color-danger-soft) cursor-pointer"
                                      >
                                        <Trash className="h-2.5 w-2.5" />
                                      </button>

                                      <span
                                        className={`status w-1.5 h-1.5 rounded-full shrink-0 ${
                                          status === "ok"
                                            ? "bg-(--color-success)"
                                            : status === "warn"
                                              ? "bg-(--color-warning)"
                                              : "bg-(--color-danger)"
                                        }`}
                                      />
                                    </div>

                                    <span
                                      className={`status group-hover:hidden w-1.5 h-1.5 rounded-full shrink-0 ${
                                        status === "ok"
                                          ? "bg-(--color-success)"
                                          : status === "warn"
                                            ? "bg-(--color-warning)"
                                            : "bg-(--color-danger)"
                                      }`}
                                      title={
                                        status === "ok"
                                          ? "Totalement rédigé"
                                          : status === "warn"
                                            ? "En cours de rédaction"
                                            : "Coquille vide"
                                      }
                                    />
                                  </div>
                                );
                              })}

                              {/* Quick Add Chapter in sidebar tree */}
                              <button
                                onClick={() => {
                                  setSelectedLevelId(lvl.id);
                                  setSelectedSubjectId(subj.id);
                                  setModal({
                                    type: "addChapter",
                                    draftTitle: "",
                                    draftContent: "",
                                  });
                                }}
                                className="chapter-link text-(--color-accent) hover:underline hover:bg-transparent font-bold text-[11px] py-1 px-2 flex items-center gap-1 cursor-pointer"
                              >
                                <span>+ Ajouter un chapitre</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Quick Add Subject inside Level subsection */}
                    <button
                      onClick={() => {
                        setSelectedLevelId(lvl.id);
                        setModal({
                          type: "addSubject",
                          draftId: lvl.id,
                          draftTitle: "",
                        });
                      }}
                      className="w-full text-left py-1.5 px-2.5 text-(--color-accent) hover:underline hover:bg-(--color-surface-alt) rounded-lg font-bold text-[10.5px] flex items-center gap-1 cursor-pointer mt-1"
                    >
                      <Plus className="h-3 w-3 shrink-0" />
                      <span>+ Ajouter une matière</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* User info inside Foot Panel */}
      <div className="sidebar-foot p-4 px-4.5 border-t border-(--color-border) bg-(--color-surface-alt) relative text-left select-none">
        {/* Custom Popover/Dropdown Menu just above */}
        {showProfileMenu && (
          <div className="absolute bottom-16 left-4 right-4 z-50 bg-(--color-surface) border border-(--color-border) rounded-2xl p-4 shadow-[var(--shadow-elevation-lg)] space-y-4 animate-scale-up">
            {/* Appearance Mode toggles */}
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider block">
                Mode d'apparence
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setIsDarkMode(false)}
                  className={`py-2 px-2 border rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    !isDarkMode
                      ? "bg-(--color-accent-soft) border-(--color-accent) text-(--color-accent)"
                      : "bg-(--color-bg) border-(--color-border) text-(--color-text-muted) hover:bg-(--color-surface-alt)"
                  }`}
                >
                  <Sun className="h-3.5 w-3.5 shrink-0" />
                  <span>Clair</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDarkMode(true)}
                  className={`py-2 px-2 border rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    isDarkMode
                      ? "bg-(--color-accent-soft) border-(--color-accent) text-(--color-accent)"
                      : "bg-(--color-bg) border-(--color-border) text-(--color-text-muted) hover:bg-(--color-surface-alt)"
                  }`}
                >
                  <Moon className="h-3.5 w-3.5 shrink-0" />
                  <span>Sombre</span>
                </button>
              </div>
            </div>

            {/* Logout Red button */}
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(false);
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-(--color-danger-soft) text-(--color-danger) text-xs font-bold rounded-xl border border-(--color-danger-border) hover:bg-(--color-danger-soft) transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span>Déconnexion</span>
            </button>
          </div>
        )}

        <div
          onClick={() => setShowProfileMenu((prev) => !prev)}
          className="user flex items-center justify-between gap-1 border border-transparent hover:border-(--color-border) p-1.5 rounded-xl cursor-pointer transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="avatar w-7.5 h-7.5 rounded-full bg-(--color-accent) text-(--color-text-on-accent) flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              KM
            </div>
            <div>
              <p className="leading-none text-xs text-(--color-text)">
                Koffi Mensah
              </p>
              <span className="text-[10px] text-(--color-text-faint) font-medium block mt-1">
                Inspecteur Général
              </span>
            </div>
          </div>
          <ChevronDown
            className={`h-3 w-3 text-(--color-text-faint) transition-all ${showProfileMenu ? "rotate-180" : ""}`}
          />
        </div>
      </div>
    </aside>
  );
};