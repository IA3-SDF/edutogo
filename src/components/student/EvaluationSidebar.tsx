import {
    Bookmark,
    CheckCircle,
    Download,
    ExternalLink,
    FileText,
    Heart,
    Send,
} from "lucide-react";
import React from "react";
import { Evaluation } from "../../../types";

interface EvaluationSidebarProps {
  assessmentsDS: Evaluation[];
  assessmentsAnnales: Evaluation[];
  downloadTracker: Record<string, boolean>;
  onDownload: (evalId: string, type: "sujet" | "corrigé") => void;
  favoriteEvaluationIds?: Set<string>;
  onToggleFavorite?: (evaluationId: string) => Promise<void>;
}

export const EvaluationSidebar: React.FC<EvaluationSidebarProps> = ({
  assessmentsDS,
  assessmentsAnnales,
  downloadTracker,
  onDownload,
  favoriteEvaluationIds = new Set(),
  onToggleFavorite,
}) => {
  return (
    <div className="lg:col-span-3 space-y-6">
      {/* Evaluations & global DS Section */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="font-display font-bold text-sm text-gray-800 dark:text-slate-100 border-b border-gray-100 dark:border-slate-700 pb-2 flex items-center gap-2">
          <FileText className="h-4.5 w-4.5 text-blue-500" />
          Évaluations &amp; DS
        </h3>

        {assessmentsDS.length > 0 ? (
          <div className="space-y-3">
            {assessmentsDS.map((ds) => {
              const isSujetD = downloadTracker[`${ds.id}-sujet`];
              const isSolD = downloadTracker[`${ds.id}-corrigé`];
              const isFavorite = favoriteEvaluationIds.has(ds.id);

              const handleFavoriteClick = async (e: React.MouseEvent) => {
                e.stopPropagation();
                if (onToggleFavorite) {
                  try {
                    await onToggleFavorite(ds.id);
                  } catch (err) {
                    console.error("[EduTogo] Erreur lors de la modification du favori:", err);
                  }
                }
              };

              return (
                <div
                  key={ds.id}
                  className="p-3 bg-gray-50 dark:bg-slate-900/60 rounded-xl space-y-2 border border-gray-100 dark:border-slate-850 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-800 dark:text-gray-100">
                      {ds.title}
                    </div>
                    <button
                      onClick={handleFavoriteClick}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
                      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Heart
                        size={14}
                        className={`${
                          isFavorite
                            ? "fill-rose-500 text-rose-500"
                            : "text-gray-300 dark:text-slate-600 hover:text-rose-400"
                        } transition-colors`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDownload(ds.id, "sujet")}
                      disabled={isSujetD}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-750 rounded font-semibold text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600"
                    >
                      <Download className="h-3 w-3" />{" "}
                      {isSujetD ? "..." : "Sujet"}
                    </button>
                    <button
                      onClick={() => onDownload(ds.id, "corrigé")}
                      disabled={isSolD}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-750 rounded font-semibold text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600"
                    >
                      <FileText className="h-3 w-3" />{" "}
                      {isSolD ? "..." : "Corrigé"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400">
            Aucun devoir surveillé archivé.
          </p>
        )}
      </div>

      {/* Annales du BAC Togo */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="font-display font-bold text-sm text-gray-800 dark:text-slate-100 border-b border-gray-100 dark:border-slate-700 pb-2 flex items-center gap-2">
          <Bookmark className="h-4.5 w-4.5 text-yellow-500" />
          Annales du Bac
        </h3>

        {assessmentsAnnales.length > 0 ? (
          <div className="space-y-3">
            {assessmentsAnnales.map((ann) => {
              const isSujetD = downloadTracker[`${ann.id}-sujet`];
              const isSolD = downloadTracker[`${ann.id}-corrigé`];
              const isFavorite = favoriteEvaluationIds.has(ann.id);

              const handleFavoriteClick = async (e: React.MouseEvent) => {
                e.stopPropagation();
                if (onToggleFavorite) {
                  try {
                    await onToggleFavorite(ann.id);
                  } catch (err) {
                    console.error("[EduTogo] Erreur lors de la modification du favori:", err);
                  }
                }
              };

              return (
                <div
                  key={ann.id}
                  className="p-3 bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-850 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-850 dark:text-gray-100">
                      {ann.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 px-1.5 py-0.2 rounded">
                        BAC II {ann.year}
                      </span>
                      <button
                        onClick={handleFavoriteClick}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
                        title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        <Heart
                          size={14}
                          className={`${
                            isFavorite
                              ? "fill-rose-500 text-rose-500"
                              : "text-gray-300 dark:text-slate-600 hover:text-rose-400"
                          } transition-colors`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onDownload(ann.id, "sujet")}
                      disabled={isSujetD}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-750 text-[10px] rounded font-semibold text-gray-600 dark:text-gray-300 hover:text-emerald-600"
                    >
                      <ExternalLink className="h-3 w-3" /> Sujet
                    </button>
                    {ann.hasSolution ? (
                      <button
                        onClick={() => onDownload(ann.id, "corrigé")}
                        disabled={isSolD}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-750 text-[10px] rounded font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600"
                      >
                        <CheckCircle className="h-3 w-3" /> Corrigé
                      </button>
                    ) : (
                      <span className="flex-1 py-1 bg-gray-100 dark:bg-slate-800 text-gray-400 text-center rounded text-[9px] border border-transparent font-medium">
                        En rédaction
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400">
            Aucune annale disponible pour cette matière.
          </p>
        )}
      </div>

      {/* Telegram Community links help card as shown in screenshots */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex h-10 w-10 items-center justify-center bg-[#24A1DE]/10 text-[#24A1DE] rounded-xl">
          <Send className="h-5 w-5 fill-[#24A1DE]" />
        </div>
        <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white">
          Besoin d'aide ?
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Rejoins le groupe de révision Telegram officiel pour poser tes
          questions à d'autres élèves et à des professeurs certifiés.
        </p>
        <a
          href="https://t.me/edutogobac"
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#24A1DE] hover:bg-[#1a8bbd] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
        >
          Rejoindre la communauté @EduTogo
        </a>
      </div>
    </div>
  );
};