import { CheckCircle, Plus, Sparkles, UploadCloud, X } from "lucide-react";
import React, { useRef } from "react";
import { uploadStorageFile } from "../../../lib/supabaseFunctions";
import { parseCourseContent } from "../../../lib/utils";
import { DatabaseState, Evaluation, Exercise, QuizQuestion } from "../../../types";
import { ModalState } from "./adminTypes";
import { KatexEditorField } from "./KatexEditorField";
import { MathRenderer } from "./MathRenderer";

interface AdminModalsProps {
  modal: ModalState | null;
  setModal: (modal: ModalState | null) => void;
  db: DatabaseState;
  onUpdateDb: (updatedDb: DatabaseState) => void;
  selectedChapterId: string;
  selectedSubjectId: string;
  selectedLevelId: string;
  currentChapterTitle: string | undefined;
  currentSubjectName: string | undefined;
  showToast: (msg: string) => void;
  handleAddLevel: (name: string, desc: string) => void;
  handleEditLevel: (id: string, name: string, desc: string) => void;
  handleDeleteLevel: (id: string) => void;
  handleAddSubject: (name: string, levelId: string) => void;
  handleEditSubject: (id: string, name: string, icon: string, color: string) => void;
  handleDeleteSubject: (id: string) => void;
  handleAddChapter: (title: string, desc: string) => void;
  handleEditChapter: (id: string, title: string, num: number, desc: string) => void;
  handleDeleteChapter: () => void;
  handleDeleteSection: (id: string) => void;
  handleSaveCourse: (title: string, content: string, courseId?: string) => Promise<void>;
  handleSaveSection: (sectId: string | undefined, title: string, content: string) => Promise<void>;
  handleSaveExercise: (ex: Partial<Exercise>) => void;
  handleDeleteExercise: (id: string) => void;
  handleSaveQuiz: (quiz: Partial<QuizQuestion>) => void;
  handleDeleteQuiz: (id: string) => void;
  handleSaveQuizGroup: (group: Partial<any>) => void;
  handleDeleteQuizGroup: (id: string) => void;
  handleSaveQuizQuestion: (question: Partial<QuizQuestion>) => void;
  handleDeleteQuizQuestion: (id: string) => void;
  handleSaveEvaluation: (evalObj: Partial<Evaluation>) => void;
  handleDeleteEvaluation: (id: string) => void;
}

const normalizeFileName = (name: string): string =>
  name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_.]/g, "").toLowerCase();

export const AdminModals: React.FC<AdminModalsProps> = ({
  modal,
  setModal,
  db,
  onUpdateDb,
  selectedChapterId,
  selectedSubjectId,
  selectedLevelId,
  currentChapterTitle,
  currentSubjectName,
  showToast,
  handleAddLevel,
  handleEditLevel,
  handleDeleteLevel,
  handleAddSubject,
  handleEditSubject,
  handleDeleteSubject,
  handleAddChapter,
  handleEditChapter,
  handleDeleteChapter,
  handleDeleteSection,
  handleSaveCourse,
  handleSaveSection,
  handleSaveExercise,
  handleDeleteExercise,
  handleSaveQuiz,
  handleDeleteQuiz,
  handleSaveQuizGroup,
  handleSaveEvaluation,
  handleDeleteEvaluation,
}) => {
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  // PDF upload states for evaluation modal
  const [uploadProgressSubject, setUploadProgressSubject] = React.useState(0);
  const [uploadProgressSolution, setUploadProgressSolution] = React.useState(0);
  const [isUploadingSubject, setIsUploadingSubject] = React.useState(false);
  const [isUploadingSolution, setIsUploadingSolution] = React.useState(false);

  const insertAtCursor = (textToInsert: string) => {
    if (!editorRef.current) {
      setModal(modal ? { ...modal, draftContent: (modal.draftContent || "") + textToInsert } : null);
      return;
    }
    const textarea = editorRef.current;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const textValue = textarea.value || "";
    const newValue =
      textValue.substring(0, startPos) +
      textToInsert +
      textValue.substring(endPos);
    setModal(modal ? { ...modal, draftContent: newValue } : null);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = startPos + textToInsert.length;
      textarea.selectionEnd = startPos + textToInsert.length;
    }, 0);
  };

  const uploadEvaluationFile = async (file: File, type: "subject" | "solution") => {
    if (!file) return null;
    const sanitized = normalizeFileName(file.name);
    const path = `evaluations/${selectedSubjectId || "unknown"}/${Date.now()}-${sanitized}`;
    return await uploadStorageFile("evaluations", path, file);
  };

  if (!modal) return null;

  const isWideModal = [
    "editCourseContent",
    "addCourse",
    "addExercise",
    "addQuiz",
    "addEvaluation",
    "addSection",
    "editSection",
  ].includes(modal.type || "");

  const currentChapterAssets =
    db.chapters.find((c) => c.id === selectedChapterId)?.assets || [];
  const chapterActivities = db.exercises.filter(
    (e) => e.chapterId === selectedChapterId && e.category === "activité",
  );

  const currentSubject = db.subjects.find((s) => s.id === selectedSubjectId);

  return (
    <div className="modal-overlay fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-fade-in animate-duration-150">
      <div
        className={`modal bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-[var(--shadow-elevation-lg)] text-left overflow-hidden flex flex-col ${
          isWideModal
            ? "w-full max-w-6xl h-[90vh]"
            : "w-full max-w-lg max-h-[90vh] p-6.5 space-y-4 overflow-y-auto"
        }`}
      >
        {isWideModal ? (
          /* Wide layout with dual split panels */
          <div className="flex flex-col h-full">
            {/* Modal Header bar */}
            <div className="p-4.5 border-b border-(--color-border) flex items-center justify-between shrink-0 bg-(--color-surface-alt)">
              <div>
                <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-(--color-accent)" />
                  {(modal.type === "editCourseContent" || modal.type === "editSection") &&
                    (modal.type === "editSection"
                      ? "Mise à jour de la section"
                      : "Rédaction & mise à jour du cours")}
                  {(modal.type === "addCourse" || modal.type === "addSection") &&
                    (modal.type === "addSection"
                      ? "Créer une nouvelle section"
                      : "Création de la leçon de cours")}
                  {modal.type === "addExercise" && "Configuration de l'exercice d'études"}
                  {modal.type === "addQuiz" && "Configuration de la question QCM"}
                  {modal.type === "addEvaluation" && "Déposer une épreuve d'évaluation"}
                </h3>
                <p className="text-[10.5px] text-(--color-text-muted) mt-0.5">
                  {(modal.type === "editCourseContent" || modal.type === "editSection") &&
                    (modal.type === "editSection"
                      ? `Modifications apportées à la section : ${modal.draftTitle || "sans nom"}`
                      : `Modifications apportées au chapitre : ${currentChapterTitle}`)}
                  {(modal.type === "addCourse" || modal.type === "addSection") &&
                    (modal.type === "addSection"
                      ? `Ajout d'un segment chapitré au cours : ${currentChapterTitle}`
                      : `Nouveau cours pour le chapitre : ${currentChapterTitle}`)}
                  {modal.type === "addExercise" &&
                    `Correction rétroactive reliée au thème : ${modal.draftTitle || "sans nom"}`}
                  {modal.type === "addQuiz" && `Fiche de validation interactive du chapitre`}
                  {modal.type === "addEvaluation" &&
                    `Envoi d'une épreuve d'évaluation et de son corrigé officiel`}
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="p-1 text-(--color-text-faint) hover:text-(--color-text) bg-(--color-surface) border border-(--color-border) rounded-lg h-7 w-7 flex items-center justify-center cursor-pointer hover:bg-(--color-surface-alt)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body Grid Splits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 min-h-0">
              {/* Left Pane: Scrolling Inputs */}
              <div className="p-6 overflow-y-auto space-y-4 border-r border-(--color-border) h-full text-left">

                {/* Course / Section Edit form */}
                {(modal.type === "editCourseContent" || modal.type === "editSection") && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">
                        {modal.type === "editSection" ? "Titre de la section" : "Titre de la leçon"}
                      </label>
                      <input
                        type="text"
                        value={modal.draftTitle || ""}
                        onChange={(e) => setModal({ ...modal, draftTitle: e.target.value })}
                        className="input font-bold"
                      />
                    </div>

                    {/* Media Assets Inserter Toolbar */}
                    <div className="space-y-1.5 my-1.5 text-left bg-(--color-surface-alt) p-2.5 rounded-xl border border-(--color-border)">
                      <label className="text-[9px] font-bold text-(--color-text-faint) uppercase tracking-wider flex items-center gap-1">
                        <UploadCloud className="h-3.5 w-3.5 text-(--color-accent)" />
                        <span>Insérer un média lié :</span>
                      </label>
                      {currentChapterAssets.length === 0 ? (
                        <p className="text-[9px] text-(--color-text-faint) italic">
                          Aucun média importé sur ce chapitre. Importez-en d'abord un sur la barre latérale du Cours.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {currentChapterAssets.map((asset) => (
                            <button
                              key={asset.id}
                              type="button"
                              onClick={() => insertAtCursor(` [[media:${asset.url}:${asset.type}]] `)}
                              className="px-2 py-1 bg-(--color-surface) hover:bg-(--color-surface-alt) border border-(--color-border) rounded-lg text-[9.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Plus className="h-2.5 w-2.5 text-(--color-accent)" />
                              <span>{asset.name} ({asset.type})</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Interactive Activity inserter toolbar */}
                    <div className="space-y-1.5 my-1.5 text-left">
                      <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider block">
                        Insérer une Activité d'Apprentissage (En-cours) :
                      </label>
                      {chapterActivities.length === 0 ? (
                        <p className="text-[10.5px] text-(--color-text-muted) italic bg-(--color-warning-soft) border border-(--color-warning-border) p-2.5 rounded-xl">
                          Aucune activité enregistrée. Pour en insérer une, créez d'abord un exercice de catégorie "activité" dans l'onglet Exercices.
                        </p>
                      ) : (
                        <div className="p-2 bg-(--color-warning-soft) rounded-xl border border-(--color-warning-border) flex flex-wrap gap-1">
                          {chapterActivities.map((act) => (
                            <button
                              key={act.id}
                              type="button"
                              onClick={() => insertAtCursor(`\n[[activite:${act.id}]]\n`)}
                              className="px-2 py-1 bg-(--color-surface) hover:bg-(--color-warning-soft) border border-(--color-warning-border) text-(--color-warning) rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Insérer Act {act.number || "act"} : {act.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* LaTeX helpers */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider block">
                        Insérer des Éléments LaTeX communs :
                      </label>
                      <div className="flex flex-wrap gap-1.5 p-2 bg-(--color-surface-alt) rounded-xl border border-(--color-border) text-[10px]">
                        {[
                          { label: "$Suite$", snippet: " $u_{n+1} = q \\times u_n$ " },
                          { label: "$Probabilité$", snippet: " $P_A(B) = \\frac{P(A \\cap B)}{P(A)}$ " },
                          { label: "$$Limite$$", snippet: " $\\lim_{x \\to +\\infty} f(x) = L$ " },
                          { label: "$Somme$", snippet: " $\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}$ " },
                        ].map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => insertAtCursor(item.snippet)}
                            className="px-2 py-1 bg-(--color-surface) hover:bg-(--color-surface-alt) border border-(--color-border) rounded cursor-pointer font-mono text-(--color-text-muted)"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <KatexEditorField
                      label="Rédaction du contenu"
                      value={modal.draftContent || ""}
                      onChange={(v) => setModal({ ...modal, draftContent: v })}
                      placeholder="Saisissez les équations et explications..."
                      rows={10}
                      textareaRef={editorRef}
                    />

                    <div className="modal-actions flex justify-end gap-2 pt-3 border-t border-(--color-border)">
                      <button
                        onClick={() => setModal(null)}
                        className="btn btn-secondary px-4 py-2 text-xs font-bold"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => {
                          if (modal.type === "editSection") {
                            handleSaveSection(modal.draftId, modal.draftTitle || "", modal.draftContent || "");
                          } else {
                            handleSaveCourse(modal.draftTitle || "", modal.draftContent || "", modal.draftId);
                          }
                        }}
                        className="btn btn-primary px-4 py-2 text-xs font-bold"
                      >
                        {modal.type === "editSection" ? "Mettre à jour la section" : "Mettre à jour la leçon"}
                      </button>
                    </div>
                  </>
                )}

                {/* Course Create form */}
                {modal.type === "addCourse" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">
                        Titre du cours
                      </label>
                      <input
                        type="text"
                        value={modal.draftTitle || ""}
                        onChange={(e) => setModal({ ...modal, draftTitle: e.target.value })}
                        className="input font-bold"
                        placeholder="Ex : Chapitre 1 — Les suites numériques"
                        autoFocus
                      />
                    </div>
                    <p className="text-[10px] text-(--color-text-faint) leading-relaxed">
                      Vous pouvez compléter le contenu du cours plus tard depuis la fiche de cours et les sections.
                    </p>
                    <div className="modal-actions flex justify-end gap-2 pt-3 border-t border-(--color-border)">
                      <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">
                        Annuler
                      </button>
                      <button
                        onClick={() => handleSaveCourse(modal.draftTitle || "Nouvelle leçon", "", undefined)}
                        disabled={!modal.draftTitle?.trim()}
                        className="btn btn-primary px-4 py-2 text-xs font-bold disabled:opacity-45"
                      >
                        Créer le cours
                      </button>
                    </div>
                  </>
                )}

                {/* Section Create form */}
                {modal.type === "addSection" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">
                        Titre de la section
                      </label>
                      <input
                        type="text"
                        value={modal.draftTitle || ""}
                        onChange={(e) => setModal({ ...modal, draftTitle: e.target.value })}
                        className="input font-bold"
                      />
                    </div>
                    <KatexEditorField
                      label="Texte de la section"
                      value={modal.draftContent || ""}
                      onChange={(v) => setModal({ ...modal, draftContent: v })}
                      placeholder="Rédigez le contenu de la section..."
                      rows={10}
                      textareaRef={editorRef}
                    />
                    <div className="modal-actions flex justify-end gap-2 pt-3 border-t border-(--color-border)">
                      <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">
                        Annuler
                      </button>
                      <button
                        onClick={() => handleSaveSection(undefined, modal.draftTitle || "Nouvelle section", modal.draftContent || "")}
                        disabled={!modal.draftTitle?.trim()}
                        className="btn btn-primary px-4 py-2 text-xs font-bold disabled:opacity-45"
                      >
                        Créer la section
                      </button>
                    </div>
                  </>
                )}

                {/* Exercise Edit form */}
                {modal.type === "addExercise" && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">
                          N° exercice
                        </label>
                        <input
                          type="text"
                          value={modal.draftNum || ""}
                          onChange={(e) => setModal({ ...modal, draftNum: e.target.value })}
                          className="input"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">
                          Titre / Thème de l'exercice
                        </label>
                        <input
                          type="text"
                          value={modal.draftTitle || ""}
                          onChange={(e) => setModal({ ...modal, draftTitle: e.target.value })}
                          placeholder="Ex: Étude de limite par encadrement"
                          className="input"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider block">
                        Configuration de l'accès / Catégorie
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setModal({ ...modal, draftCategory: "exercice" })}
                          className={`p-3 text-left border rounded-xl cursor-pointer transition-all ${
                            (modal.draftCategory || "exercice") === "exercice"
                              ? "bg-(--color-accent-soft) border-(--color-accent) ring-1 ring-(--color-accent)"
                              : "bg-(--color-surface-alt) border-(--color-border) hover:bg-(--color-surface)"
                          }`}
                        >
                          <span className={`text-xs font-bold block ${(modal.draftCategory || "exercice") === "exercice" ? "text-(--color-accent)" : "text-(--color-text)"}`}>
                            Exercice d'entraînement autonome
                          </span>
                          <span className="text-[10px] text-(--color-text-muted) block mt-0.5 leading-normal">
                            Apparaît indépendamment dans l'onglet Exercices récapitulatifs pour réviser de manière autonome.
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setModal({ ...modal, draftCategory: "activité" })}
                          className={`p-3 text-left border rounded-xl cursor-pointer transition-all ${
                            modal.draftCategory === "activité"
                              ? "bg-(--color-warning-soft) border-(--color-warning) ring-1 ring-(--color-warning)"
                              : "bg-(--color-surface-alt) border-(--color-border) hover:bg-(--color-surface)"
                          }`}
                        >
                          <span className={`text-xs font-bold block ${modal.draftCategory === "activité" ? "text-(--color-warning)" : "text-(--color-text)"}`}>
                            Activité intégrée au cours
                          </span>
                          <span className="text-[10px] text-(--color-text-muted) block mt-0.5 leading-normal">
                            Masqué dans l'onglet Exercices. Intégré directement au cours via sa balise{" "}
                            <code className="font-mono bg-(--color-surface-alt) px-1 py-0.2 rounded text-[9.5px]">[[activite:ID]]</code>.
                          </span>
                        </button>
                      </div>
                    </div>

                    <KatexEditorField
                      label="Énoncé de la question (KaTeX)"
                      value={modal.draftQuestion || ""}
                      onChange={(v) => setModal({ ...modal, draftQuestion: v })}
                      placeholder="Rédigez l'énoncé de l'exercice..."
                      rows={4}
                    />

                    <KatexEditorField
                      label="Corrigé mathématique complet / Égaux et de solution (KaTeX)"
                      value={modal.draftSolution || ""}
                      onChange={(v) => setModal({ ...modal, draftSolution: v })}
                      placeholder="Saisissez la méthode de calcul et la solution..."
                      rows={4}
                    />

                    <div className="modal-actions flex justify-end gap-2 pt-3 border-t border-(--color-border)">
                      <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">
                        Annuler
                      </button>
                      <button
                        onClick={() =>
                          handleSaveExercise({
                            id: modal.draftId,
                            number: modal.draftNum,
                            title: modal.draftTitle,
                            category: modal.draftCategory,
                            question: modal.draftQuestion,
                            hint: modal.draftHint,
                            solution: modal.draftSolution,
                          })
                        }
                        disabled={!modal.draftTitle?.trim() || !modal.draftQuestion?.trim()}
                        className="btn btn-primary px-4 py-2 text-xs font-bold disabled:opacity-45"
                      >
                        Publier l'exercice
                      </button>
                    </div>
                  </>
                )}

                {/* Quiz Edit form */}
                {modal.type === "addQuiz" && (
                  <>
                    <KatexEditorField
                      label="Intitulé de la question QCM (KaTeX)"
                      value={modal.draftQuestion || ""}
                      onChange={(v) => setModal({ ...modal, draftQuestion: v })}
                      placeholder="Rédigez votre question à choix multiples..."
                      rows={3}
                    />

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Parcours de quiz (groupe)</label>
                          <select
                            value={modal.draftQuizGroupId || ""}
                            onChange={(e) => setModal({ ...modal, draftQuizGroupId: e.target.value })}
                            className="input"
                          >
                            <option value="">(Aucun / Legacy)</option>
                            {(db.quizGroups || []).filter((g) => g.chapterId === selectedChapterId).map((g) => (
                              <option key={g.id} value={g.id}>{g.title || `Group ${g.id}`}</option>
                            ))}
                          </select>
                        </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider block">
                        Propositions de Réponses QCM :
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[0, 1, 2, 3].map((ind) => (
                          <div key={ind} className="flex items-center gap-1.5">
                            <span className="font-mono text-xs opacity-65 text-(--color-text-muted)">
                              {String.fromCharCode(65 + ind)})
                            </span>
                            <input
                              type="text"
                              value={modal.draftOptions?.[ind] || ""}
                              onChange={(e) => {
                                const opts = [...(modal.draftOptions || ["", "", "", ""])];
                                opts[ind] = e.target.value;
                                setModal({ ...modal, draftOptions: opts });
                              }}
                              placeholder={`Option ${ind + 1}`}
                              className="input font-medium"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">
                          Proposition correcte
                        </label>
                        <select
                          value={modal.draftCorrectIndex || 0}
                          onChange={(e) => setModal({ ...modal, draftCorrectIndex: parseInt(e.target.value) })}
                          className="input font-bold"
                        >
                          <option value={0}>Option A (Correcte)</option>
                          <option value={1}>Option B (Correcte)</option>
                          <option value={2}>Option C (Correcte)</option>
                          <option value={3}>Option D (Correcte)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">
                          Justification didactique (KaTeX)
                        </label>
                        <input
                          type="text"
                          value={modal.draftExplanation || ""}
                          onChange={(e) => setModal({ ...modal, draftExplanation: e.target.value })}
                          placeholder="Justifiez brièvement l'option..."
                          className="input"
                        />
                      </div>
                    </div>

                    <div className="modal-actions flex justify-end gap-2 pt-3 border-t border-(--color-border)">
                      <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">
                        Annuler
                      </button>
                      <button
                        onClick={() =>
                          handleSaveQuiz({
                            id: modal.draftId,
                            question: modal.draftQuestion,
                            options: modal.draftOptions,
                            correctIndex: modal.draftCorrectIndex,
                            explanation: modal.draftExplanation,
                            quizGroupId: modal.draftQuizGroupId,
                          })
                        }
                        disabled={!modal.draftQuestion?.trim()}
                        className="btn btn-primary px-4 py-2 text-xs font-bold disabled:opacity-45"
                      >
                        Enregistrer la question
                      </button>
                    </div>
                  </>
                )}

                {/* Evaluation Edit form */}
                {modal.type === "addEvaluation" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">
                        Libellé / Titre de l'épreuve nationale
                      </label>
                      <input
                        type="text"
                        value={modal.draftTitle || ""}
                        onChange={(e) => setModal({ ...modal, draftTitle: e.target.value })}
                        placeholder="Ex: Devoir de Mathématiques N°1 - Semestre 1"
                        className="input font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">
                          Type d'épreuve
                        </label>
                        <select
                          value={modal.draftEvalType || "DS"}
                          onChange={(e) => setModal({ ...modal, draftEvalType: e.target.value as "DS" | "Annale" })}
                          className="input"
                        >
                          <option value="DS">Devoir Surveillé (DS)</option>
                          <option value="Annale">Annales Nationales (Bac)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">
                          Année ou Session
                        </label>
                        <input
                          type="text"
                          value={modal.draftEvalYear || "2026"}
                          onChange={(e) => setModal({ ...modal, draftEvalYear: e.target.value })}
                          className="input font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Subject PDF uploader */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider block">
                          Sujet PDF (.pdf)
                        </label>
                        {isUploadingSubject ? (
                          <div className="w-full px-3 py-2 border border-(--color-border) bg-(--color-surface-alt) rounded-xl text-xs space-y-1.5">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-(--color-text-faint) italic">Téléversement...</span>
                              <span className="font-bold text-(--color-text)">{uploadProgressSubject}%</span>
                            </div>
                            <div className="w-full bg-(--color-border) h-1.5 rounded-full overflow-hidden">
                              <div className="bg-(--color-accent) h-full transition-all duration-150" style={{ width: `${uploadProgressSubject}%` }} />
                            </div>
                          </div>
                        ) : modal.draftSubjectUrl ? (
                          <div className="flex items-center justify-between px-3 py-2 border border-(--color-success-border) bg-(--color-success-soft) rounded-xl text-xs">
                            <span className="font-mono text-(--color-success) font-semibold truncate max-w-[120px]">
                              {modal.draftSubjectUrl}
                            </span>
                            <button
                              onClick={() => setModal({ ...modal, draftSubjectUrl: "" })}
                              className="text-[9px] font-bold text-(--color-danger) hover:underline cursor-pointer"
                            >
                              Effacer
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-(--color-border) hover:border-(--color-accent) hover:bg-(--color-surface-alt) bg-(--color-surface-alt) rounded-xl p-3 cursor-pointer transition-all text-center">
                            <UploadCloud className="h-5 w-5 text-(--color-text-faint) mb-1" />
                            <span className="text-[10px] font-bold text-(--color-text-muted)">Choisir le Sujet (.pdf)</span>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploadingSubject(true);
                                setUploadProgressSubject(10);
                                const iv = window.setInterval(() => {
                                  setUploadProgressSubject((p) => {
                                    if (p >= 95) { window.clearInterval(iv); return 100; }
                                    return p + Math.floor(Math.random() * 20) + 5;
                                  });
                                }, 150);
                                try {
                                  const result = await uploadEvaluationFile(file, "subject");
                                  if (!result?.path) throw new Error("Upload failed");
                                  setModal({ ...modal, draftSubjectUrl: result.path });
                                  showToast(`Sujet "${file.name}" chargé`);
                                } catch {
                                  showToast("Échec du téléversement du sujet.");
                                } finally {
                                  window.clearInterval(iv);
                                  setUploadProgressSubject(100);
                                  setTimeout(() => setIsUploadingSubject(false), 250);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Solution PDF uploader */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider block">
                          Corrigé PDF (.pdf)
                        </label>
                        {isUploadingSolution ? (
                          <div className="w-full px-3 py-2 border border-(--color-border) bg-(--color-surface-alt) rounded-xl text-xs space-y-1.5">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-(--color-text-faint) italic">Téléversement...</span>
                              <span className="font-bold text-(--color-text)">{uploadProgressSolution}%</span>
                            </div>
                            <div className="w-full bg-(--color-border) h-1.5 rounded-full overflow-hidden">
                              <div className="bg-(--color-accent) h-full transition-all duration-150" style={{ width: `${uploadProgressSolution}%` }} />
                            </div>
                          </div>
                        ) : modal.draftSolutionUrl ? (
                          <div className="flex items-center justify-between px-3 py-2 border border-(--color-success-border) bg-(--color-success-soft) rounded-xl text-xs">
                            <span className="font-mono text-(--color-success) font-semibold truncate max-w-[120px]">
                              {modal.draftSolutionUrl}
                            </span>
                            <button
                              onClick={() => setModal({ ...modal, draftSolutionUrl: "" })}
                              className="text-[9px] font-bold text-(--color-danger) hover:underline cursor-pointer"
                            >
                              Effacer
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-(--color-border) hover:border-(--color-accent) hover:bg-(--color-surface-alt) bg-(--color-surface-alt) rounded-xl p-3 cursor-pointer transition-all text-center">
                            <UploadCloud className="h-5 w-5 text-(--color-text-faint) mb-1" />
                            <span className="text-[10px] font-bold text-(--color-text-muted)">Choisir le Corrigé (.pdf)</span>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploadingSolution(true);
                                setUploadProgressSolution(10);
                                const iv = window.setInterval(() => {
                                  setUploadProgressSolution((p) => {
                                    if (p >= 95) { window.clearInterval(iv); return 100; }
                                    return p + Math.floor(Math.random() * 20) + 5;
                                  });
                                }, 150);
                                try {
                                  const result = await uploadEvaluationFile(file, "solution");
                                  if (!result?.path) throw new Error("Upload failed");
                                  setModal({ ...modal, draftSolutionUrl: result.path });
                                  showToast(`Corrigé "${file.name}" chargé`);
                                } catch {
                                  showToast("Échec du téléversement du corrigé.");
                                } finally {
                                  window.clearInterval(iv);
                                  setUploadProgressSolution(100);
                                  setTimeout(() => setIsUploadingSolution(false), 250);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="modal-actions flex justify-end gap-2 pt-3 border-t border-(--color-border)">
                      <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">
                        Annuler
                      </button>
                      <button
                        onClick={() =>
                          handleSaveEvaluation({
                            id: modal.draftId,
                            title: modal.draftTitle,
                            type: modal.draftEvalType,
                            year: modal.draftEvalYear,
                            subjectUrl: modal.draftSubjectUrl,
                            solutionUrl: modal.draftSolutionUrl,
                          })
                        }
                        disabled={!modal.draftTitle?.trim()}
                        className="btn btn-primary px-4 py-2 text-xs font-bold disabled:opacity-45"
                      >
                        Enregistrer l'épreuve
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Right Pane: Page Mockup Preview Sheet */}
              <div className="hidden lg:block bg-(--color-surface-alt) p-6 overflow-y-auto h-full text-left">
                <div className="bg-(--color-surface) border border-(--color-border) rounded-xl shadow-[var(--shadow-elevation-md)] p-6 max-w-xl mx-auto min-h-full font-serif flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-(--color-success) border-b border-(--color-border) pb-2 mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-(--color-success) animate-pulse" />
                      <span>Aperçu de Rendu Académique</span>
                    </div>

                    {/* Course/Section preview */}
                    {(modal.type === "editCourseContent" || modal.type === "addCourse" || modal.type === "editSection" || modal.type === "addSection") && (
                      <div className="space-y-4 font-sans text-(--color-text)">
                        <h1 className="text-lg font-bold tracking-tight text-(--color-text) font-serif pb-2 border-b border-(--color-border)">
                          {modal.draftTitle || "Sans titre"}
                        </h1>
                        <div className="prose text-xs leading-relaxed text-(--color-text-muted) space-y-3 font-serif">
                          {(() => {
                            const segments = parseCourseContent(modal.draftContent || "");
                            if (segments.length === 0) {
                              return (
                                <p className="italic text-(--color-text-faint) font-sans text-[11px]">
                                  Saisissez du contenu LaTeX pour initier la composition...
                                </p>
                              );
                            }
                            return segments.map((seg, sIdx) => {
                              if (seg.type === "text") {
                                return <MathRenderer key={sIdx} text={seg.value} className="text-xs" />;
                              } else {
                                const act = db.exercises.find((e) => e.id === seg.value);
                                return (
                                  <div key={sIdx} className="my-4 p-3 bg-(--color-warning-soft) border border-(--color-warning-border) rounded-xl font-sans">
                                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-(--color-warning) mb-1">
                                      <span>[Activité Activée]</span>
                                      <span>{act?.number ? `Act ${act.number}` : ""} {act?.title}</span>
                                    </div>
                                    <p className="text-[11px] text-(--color-text-muted) line-clamp-2 leading-relaxed">
                                      {act?.question || "Vide."}
                                    </p>
                                  </div>
                                );
                              }
                            });
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Exercise preview */}
                    {modal.type === "addExercise" && (
                      <div className="space-y-4 font-sans text-xs">
                        <div className="flex justify-between items-center border-b border-(--color-border) pb-1.5 font-sans">
                          <span className="text-[10px] font-mono font-black uppercase text-(--color-accent) bg-(--color-accent-soft) border border-(--color-accent-border) px-2 py-0.5 rounded">
                            {modal.draftCategory || "exercice"} {modal.draftNum ? `N°${modal.draftNum}` : ""}
                          </span>
                          <span className="text-[10px] opacity-60 font-sans font-semibold text-(--color-text-faint)">
                            Aperçu fiche élève
                          </span>
                        </div>
                        <h3 className="font-extrabold text-sm text-(--color-text) leading-tight">
                          {modal.draftTitle || "Titre de l'exercice"}
                        </h3>
                        <div className="p-3.5 bg-(--color-surface-alt) rounded-xl border border-(--color-border) space-y-1.5">
                          <span className="text-[9px] font-bold text-(--color-text-faint) block uppercase font-mono">CONSIGNE EXPRIMÉE :</span>
                          <MathRenderer text={modal.draftQuestion || "Saisissez de l'énoncé..."} className="text-xs text-(--color-text)" />
                        </div>
                        <div className="p-3.5 bg-(--color-success-soft) rounded-xl border border-(--color-success-border) space-y-1.5">
                          <span className="text-[9px] font-bold text-(--color-success) block uppercase font-mono">SOLUTION DIRECTE (CLIC SUR SOLUTION) :</span>
                          <MathRenderer
                            text={modal.draftSolution || "Aucun corrigé fourni — la fiche sera publiée sans corrigé pour chercher (encouragé)."}
                            className="text-xs text-(--color-text)"
                          />
                        </div>
                      </div>
                    )}

                    {/* Quiz preview */}
                    {modal.type === "addQuiz" && (
                      <div className="space-y-3 font-sans text-xs">
                        <span className="text-[10px] font-bold text-(--color-accent) uppercase tracking-wider block border-b border-(--color-border) pb-1">
                          COMPOSITION DU QCM
                        </span>
                        <div className="p-3 bg-(--color-surface-alt) rounded-lg border border-(--color-border)">
                          <MathRenderer text={modal.draftQuestion || "Énoncé de la question ?"} className="text-xs font-bold text-(--color-text)" />
                        </div>
                        <div className="space-y-1.5">
                          {[0, 1, 2, 3].map((ind) => {
                            const isCorrect = modal.draftCorrectIndex === ind;
                            const label = String.fromCharCode(65 + ind);
                            return (
                              <div
                                key={ind}
                                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                                  isCorrect
                                    ? "bg-(--color-success-soft) border-(--color-success-border) text-(--color-success) font-bold"
                                    : "bg-(--color-surface) border-(--color-border) text-(--color-text-muted)"
                                }`}
                              >
                                <span>{label}) {modal.draftOptions?.[ind] || `Proposition ${label}`}</span>
                                {isCorrect && <CheckCircle className="h-4 w-4 text-(--color-success) shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                        {modal.draftExplanation && (
                          <div className="alert alert-info text-[11px]">
                            <strong className="text-[10px] uppercase block tracking-wider">EXPLICATION INSTRUCTIVE :</strong>
                            <p className="italic text-(--color-text-muted) mt-0.5">{modal.draftExplanation}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Evaluation preview */}
                    {modal.type === "addEvaluation" && (
                      <div className="space-y-4 text-center font-serif text-(--color-text)">
                        <div className="text-[9px] font-bold uppercase tracking-wider border-b border-(--color-border) pb-2">
                          <p>OFFICE EXAMEN TOGO</p>
                          <p className="font-normal font-sans text-[7px] tracking-normal lowercase italic mt-0.5 text-(--color-text-faint)">
                            evaluation_system_v2.0
                          </p>
                        </div>
                        <div className="space-y-1.5 my-3">
                          <span className="text-[9px] font-mono font-bold bg-(--color-surface-alt) text-(--color-text-muted) px-2.5 py-0.5 rounded">
                            {modal.draftEvalType || "DS"} - {modal.draftEvalYear || "2026"}
                          </span>
                          <h3 className="text-sm font-extrabold uppercase font-serif tracking-tight pt-1 text-(--color-text)">
                            {modal.draftTitle || "Sujet optionnel"}
                          </h3>
                          <p className="text-[10px] font-sans text-(--color-text-muted) capitalize">
                            Matière : {currentSubject?.name}
                          </p>
                        </div>
                        <div className="border border-(--color-border) rounded-xl p-3 bg-(--color-surface-alt) text-left font-sans text-[11px] space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold text-(--color-text)">
                            <span>FICHIER SUJET :</span>
                            <span className="font-mono text-(--color-text-faint) font-normal">{modal.draftSubjectUrl || "ds_sujet.pdf"}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-(--color-text)">
                            <span>FICHIER CORRIGÉ :</span>
                            <span className={`font-mono font-normal ${modal.draftSolutionUrl ? "text-(--color-success)" : "text-(--color-warning) italic"}`}>
                              {modal.draftSolutionUrl || "en cours de correction"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Paper Footer */}
                  <div className="pt-4 border-t border-dashed border-(--color-border) mt-6 text-center text-[10px] text-(--color-text-faint) font-sans shrink-0">
                    Inspecteur National • Dispositif Numérique EduTogo
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Small Modals */
          <>
            {/* addLevel Modal */}
            {modal.type === "addLevel" && (
              <>
                <h3 className="text-sm font-bold text-(--color-text)">Créer un nouveau Niveau scolaire</h3>
                <div className="modal-sub text-xs text-(--color-text-muted) mt-0.5 leading-relaxed">
                  Configurez une racine académique indépendante (Ex: Sixième, Première, Seconde, etc.).
                </div>
                <div className="space-y-3.5 my-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Nom du Niveau</label>
                    <input type="text" value={modal.draftTitle || ""} onChange={(e) => setModal({ ...modal, draftTitle: e.target.value })} placeholder="Ex: Classe de Troisième" className="input font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Description (facultative)</label>
                    <textarea value={modal.draftContent || ""} onChange={(e) => setModal({ ...modal, draftContent: e.target.value })} placeholder="Ex: Niveau d'initiation aux examens nationaux Togo..." rows={3} className="input resize-y" />
                  </div>
                </div>
                <div className="modal-actions flex justify-end gap-2 pt-2 border-t border-(--color-border)">
                  <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">Annuler</button>
                  <button onClick={() => handleAddLevel(modal.draftTitle || "", modal.draftContent || "")} disabled={!modal.draftTitle?.trim()} className="btn btn-primary px-4 py-2 text-xs font-bold disabled:opacity-45">Créer le niveau</button>
                </div>
              </>
            )}

            {/* addSubject Modal */}
            {modal.type === "addSubject" && (
              <>
                <h3 className="text-sm font-bold text-(--color-text)">Ajouter une Matière d'enseignement</h3>
                <div className="modal-sub text-xs text-(--color-text-muted) mt-0.5">
                  Rattachez une nouvelle matière au niveau{" "}
                  <b className="text-(--color-text)">{db.levels.find((l) => l.id === modal.draftId)?.name || "sélectionné"}</b>.
                </div>
                <div className="space-y-3.5 my-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Nom de la Matière</label>
                    <input type="text" value={modal.draftTitle || ""} onChange={(e) => setModal({ ...modal, draftTitle: e.target.value })} placeholder="Ex: SVT, Sciences Physiques..." className="input font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Niveau parent</label>
                    <select value={modal.draftId || selectedLevelId} onChange={(e) => setModal({ ...modal, draftId: e.target.value })} className="input font-bold">
                      {db.levels.map((l) => (<option key={l.id} value={l.id}>{l.name}</option>))}
                    </select>
                  </div>
                </div>
                <div className="modal-actions flex justify-end gap-2 pt-2 border-t border-(--color-border)">
                  <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">Annuler</button>
                  <button onClick={() => handleAddSubject(modal.draftTitle || "", modal.draftId || selectedLevelId)} disabled={!modal.draftTitle?.trim()} className="btn btn-primary px-4 py-2 text-xs font-bold disabled:opacity-45">Créer la matière</button>
                </div>
              </>
            )}

            {/* editLevel Modal */}
            {modal.type === "editLevel" && (
              <>
                <h3 className="text-sm font-bold text-(--color-text)">Modifier le Niveau scolaire</h3>
                <div className="space-y-3.5 my-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Nom du Niveau</label>
                    <input type="text" value={modal.draftTitle || ""} onChange={(e) => setModal({ ...modal, draftTitle: e.target.value })} className="input font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Description</label>
                    <textarea value={modal.draftContent || ""} onChange={(e) => setModal({ ...modal, draftContent: e.target.value })} rows={3} className="input resize-y" />
                  </div>
                </div>
                <div className="modal-actions flex justify-end gap-2 pt-2 border-t border-(--color-border)">
                  <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">Annuler</button>
                  <button onClick={() => handleEditLevel(modal.draftId || "", modal.draftTitle || "", modal.draftContent || "")} disabled={!modal.draftTitle?.trim()} className="btn btn-primary px-4 py-2 text-xs font-bold disabled:opacity-45">Enregistrer</button>
                </div>
              </>
            )}

            {/* deleteLevel Modal */}
            {modal.type === "deleteLevel" && (
              <>
                <h3 className="text-sm font-bold text-(--color-danger)">Supprimer le Niveau scolaire</h3>
                <div className="alert alert-danger my-4 text-left space-y-2">
                  <p>Vous allez supprimer le niveau <strong className="text-(--color-danger) font-extrabold">"{modal.draftTitle}"</strong> et toutes ses matières rattachées, chapitres, sections, exercices et fiches d'évaluation.</p>
                  <p className="font-bold text-(--color-danger)">Cette action est irréversible.</p>
                </div>
                <div className="modal-actions flex justify-end gap-2 pt-2 border-t border-(--color-border)">
                  <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">Annuler</button>
                  <button onClick={() => handleDeleteLevel(modal.draftId || "")} className="btn btn-danger px-4 py-2 text-xs font-bold">Supprimer définitivement</button>
                </div>
              </>
            )}

            {/* editSubject Modal */}
            {modal.type === "editSubject" && (
              <>
                <h3 className="text-sm font-bold text-(--color-text)">Modifier la Matière d'enseignement</h3>
                <div className="space-y-3.5 my-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Nom de la Matière</label>
                    <input type="text" value={modal.draftTitle || ""} onChange={(e) => setModal({ ...modal, draftTitle: e.target.value })} className="input font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Icône (Lucide)</label>
                      <input type="text" value={modal.draftContent || "BookOpen"} onChange={(e) => setModal({ ...modal, draftContent: e.target.value })} className="input" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Couleur (Tailwind)</label>
                      <input type="text" value={modal.draftNum || "blue"} onChange={(e) => setModal({ ...modal, draftNum: e.target.value })} className="input" />
                    </div>
                  </div>
                </div>
                <div className="modal-actions flex justify-end gap-2 pt-2 border-t border-(--color-border)">
                  <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">Annuler</button>
                  <button onClick={() => handleEditSubject(modal.draftId || "", modal.draftTitle || "", modal.draftContent || "BookOpen", modal.draftNum || "blue")} disabled={!modal.draftTitle?.trim()} className="btn btn-primary px-4 py-2 text-xs font-bold disabled:opacity-45">Enregistrer</button>
                </div>
              </>
            )}

            {/* deleteSubject Modal */}
            {modal.type === "deleteSubject" && (
              <>
                <h3 className="text-sm font-bold text-(--color-danger)">Supprimer la Matière</h3>
                <div className="alert alert-danger my-4 text-left space-y-2">
                  <p>Vous allez supprimer la matière rattachée <strong className="text-(--color-danger) font-extrabold">"{modal.draftTitle}"</strong> et tous ses chapitres, cours associés, exercices et évaluations.</p>
                  <p className="font-bold text-(--color-danger)">Cette action est irréversible.</p>
                </div>
                <div className="modal-actions flex justify-end gap-2 pt-2 border-t border-(--color-border)">
                  <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">Annuler</button>
                  <button onClick={() => handleDeleteSubject(modal.draftId || "")} className="btn btn-danger px-4 py-2 text-xs font-bold">Supprimer définitivement</button>
                </div>
              </>
            )}

            {/* editChapter Modal */}
            {modal.type === "editChapter" && (
              <>
                <h3 className="text-sm font-bold text-(--color-text)">Modifier le chapitre</h3>
                <div className="space-y-3.5 my-4 text-left">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Titre du chapitre</label>
                      <input type="text" value={modal.draftTitle || ""} onChange={(e) => setModal({ ...modal, draftTitle: e.target.value })} className="input" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Numéro</label>
                      <input type="number" value={modal.draftNum || "1"} onChange={(e) => setModal({ ...modal, draftNum: e.target.value })} className="input" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Description sommaire</label>
                    <textarea value={modal.draftContent || ""} onChange={(e) => setModal({ ...modal, draftContent: e.target.value })} rows={3} className="input resize-y" />
                  </div>
                </div>
                <div className="modal-actions flex justify-end gap-2 pt-2 border-t border-(--color-border)">
                  <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">Annuler</button>
                  <button onClick={() => handleEditChapter(modal.draftId || "", modal.draftTitle || "", parseInt(modal.draftNum || "1", 10), modal.draftContent || "")} disabled={!modal.draftTitle?.trim()} className="btn btn-primary px-4 py-2 text-xs font-bold disabled:opacity-45">Enregistrer</button>
                </div>
              </>
            )}

            {/* addChapter Modal */}
            {modal.type === "addChapter" && (
              <>
                <h3 className="text-sm font-bold text-(--color-text)">Ajouter un chapitre</h3>
                <div className="modal-sub text-xs text-(--color-text-muted) leading-relaxed">
                  Séquençage ordonné rattaché à{" "}
                  <code className="bg-(--color-surface-alt) px-1 rounded">{currentSubjectName}</code>.
                </div>
                <div className="space-y-3.5 my-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Titre du chapitre</label>
                    <input type="text" value={modal.draftTitle || ""} onChange={(e) => setModal({ ...modal, draftTitle: e.target.value })} placeholder="Ex: Chapitre 6 : Nombres Complexes" className="input" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Description sommaire</label>
                    <textarea value={modal.draftContent || ""} onChange={(e) => setModal({ ...modal, draftContent: e.target.value })} placeholder="Ex: Propriétés algébriques, interprétation géométrique..." rows={3} className="input resize-y" />
                  </div>
                </div>
                <div className="modal-actions flex justify-end gap-2 pt-2 border-t border-(--color-border)">
                  <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">Annuler</button>
                  <button onClick={() => handleAddChapter(modal.draftTitle || "", modal.draftContent || "")} disabled={!modal.draftTitle?.trim()} className="btn btn-primary px-4 py-2 text-xs font-bold disabled:opacity-45">Créer le chapitre</button>
                </div>
              </>
            )}

                {/* addQuizGroup Modal */}
                {modal.type === "addQuizGroup" && (
                  <>
                    <h3 className="text-sm font-bold text-(--color-text)">Créer un parcours de quiz (groupe)</h3>
                    <div className="modal-sub text-xs text-(--color-text-muted) mt-0.5">Regroupez plusieurs questions en un parcours pédagogique (ex: Parcours Révision Bac).</div>
                    <div className="space-y-3.5 my-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">Titre du parcours</label>
                        <input type="text" value={modal.draftTitle || ""} onChange={(e) => setModal({ ...modal, draftTitle: e.target.value })} placeholder="Ex: Parcours Révision Chapitre 1" className="input font-bold" />
                      </div>
                    </div>
                    <div className="modal-actions flex justify-end gap-2 pt-2 border-t border-(--color-border)">
                      <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">Annuler</button>
                      <button onClick={() => { handleSaveQuizGroup({ title: modal.draftTitle, chapterId: selectedChapterId }); setModal(null); }} disabled={!modal.draftTitle?.trim()} className="btn btn-primary px-4 py-2 text-xs font-bold disabled:opacity-45">Créer le parcours</button>
                    </div>
                  </>
                )}

            {/* Delete confirmation Dialog */}
            {(modal.type === "deleteChapter" || modal.type === "deleteExercise" || modal.type === "deleteQuiz" || modal.type === "deleteEvaluation" || modal.type === "deleteSection" || modal.type === "deleteCourse") && (
              <>
                <h3 className="text-sm font-bold text-(--color-danger)">Détruire l'élément</h3>
                <div className="alert alert-danger my-4 text-left space-y-2">
                  <p>
                    Vous êtes sur le point de supprimer :{" "}
                    <strong className="text-(--color-danger) font-extrabold">
                      {modal.draftTitle || "cet élément"}
                    </strong>.
                  </p>
                  <p>
                    Cette action est irrémédiable et entraînera également la destruction définitive de tous les corrigés, liaisons ou sections associés de manière transparente.
                  </p>
                </div>
                <div className="modal-actions flex justify-end gap-2 pt-3 border-t border-(--color-border)">
                  <button onClick={() => setModal(null)} className="btn btn-secondary px-4 py-2 text-xs font-bold">Annuler</button>
                  <button
                    onClick={() => {
                      if (modal.type === "deleteChapter") handleDeleteChapter();
                      else if (modal.type === "deleteExercise") handleDeleteExercise(modal.draftId || "");
                      else if (modal.type === "deleteQuiz") handleDeleteQuiz(modal.draftId || "");
                      else if (modal.type === "deleteEvaluation") handleDeleteEvaluation(modal.draftId || "");
                      else if (modal.type === "deleteSection") {
                        handleDeleteSection(modal.draftId || "");
                      } else if (modal.type === "deleteCourse") {
                        onUpdateDb({ ...db, courses: db.courses.filter((c) => c.id !== modal.draftId) });
                        setModal(null);
                        showToast("Cours définitivement supprimé.");
                      }
                    }}
                    className="btn btn-danger px-4 py-2 text-xs font-bold"
                  >
                    Supprimer définitivement
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

