import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";

interface MathRendererProps {
  text: string;
  className?: string;
  block?: boolean;
}

// ============================================================
// MACROS SCIENTIFIQUES COMPLÈTES
// ============================================================

const SCIENTIFIC_MACROS: Record<string, string> = {
  // ─── CHIMIE (mhchem) ───
  "\\ce": "\\mathrm{#1}",
  "\\pu": "\\mathrm{#1}",
  "\\xrightarrow": "\\stackrel{#2}{\\longrightarrow}",
  "\\xleftarrow": "\\stackrel{#2}{\\longleftarrow}",
  "\\xleftrightarrow": "\\stackrel{#2}{\\longleftrightarrow}",
  "\\xRightarrow": "\\stackrel{#2}{\\Longrightarrow}",
  "\\xLeftarrow": "\\stackrel{#2}{\\Longleftarrow}",
  "\\xLeftrightarrow": "\\stackrel{#2}{\\Longleftrightarrow}",
  "\\bond": "{-}",
  "\\sbond": "{-}",
  "\\dbond": "{=}",
  "\\tbond": "{\\equiv}",

  // ─── PHYSIQUE QUANTIQUE (braket) ───
  "\\bra": "\\langle{#1}|",
  "\\ket": "|{#1}\\rangle",
  "\\braket": "\\langle{#1}\\vert{#2}\\rangle",
  "\\ketbra": "|{#1}\\rangle\\langle{#2}|",
  "\\expectation": "\\langle{#1}\\rangle",
  "\\matrixelement": "\\langle{#1}|{#2}|{#3}\\rangle",
  "\\innerproduct": "\\langle{#1}|{#2}\\rangle",
  "\\outerproduct": "|{#1}\\rangle\\langle{#2}|",
  "\\dyad": "|{#1}\\rangle\\langle{#2}|",

  // ─── MATHÉMATIQUES AVANCÉES ───
  "\\Tr": "\\operatorname{Tr}",
  "\\tr": "\\operatorname{tr}",
  "\\rank": "\\operatorname{rank}",
  "\\diag": "\\operatorname{diag}",
  "\\sgn": "\\operatorname{sgn}",
  "\\argmax": "\\operatorname*{arg\\,max}",
  "\\argmin": "\\operatorname*{arg\\,min}",
  "\\limsup": "\\operatorname*{lim\\,sup}",
  "\\liminf": "\\operatorname*{lim\\,inf}",
  "\\Var": "\\operatorname{Var}",
  "\\Cov": "\\operatorname{Cov}",
  "\\E": "\\mathbb{E}",
  "\\P": "\\mathbb{P}",
  "\\R": "\\mathbb{R}",
  "\\N": "\\mathbb{N}",
  "\\Z": "\\mathbb{Z}",
  "\\Q": "\\mathbb{Q}",
  "\\C": "\\mathbb{C}",
  "\\H": "\\mathbb{H}",

  // ─── VECTEURS ET NOTATIONS PHYSIQUES ───
  "\\vectorarrow": "\\vec{#1}",
  "\\vv": "\\vec{#1}",
  "\\vu": "\\hat{#1}",
  "\\vdot": "\\dot{#1}",
  "\\vddot": "\\ddot{#1}",
  "\\vdddot": "\\dddot{#1}",

  // ─── NOTATIONS GÉOMÉTRIQUES ───
  "\\overarc": "\\overset{\\frown}{#1}",
  "\\widearc": "\\overset{\\frown}{#1}",
  "\\segment": "\\overline{#1}",

  // ─── ENSEMBLES ET LOGIQUE ───
  "\\set": "\\{#1\\}",
  "\\card": "\\operatorname{card}",
  "\\dom": "\\operatorname{dom}",
  "\\cod": "\\operatorname{cod}",
  "\\im": "\\operatorname{Im}",
  "\\ker": "\\operatorname{Ker}",

  // ─── ANALYSE ET CALCUL ───
  "\\diff": "\\mathrm{d}",
  "\\pdiff": "\\partial",
  "\\derivative": "\\frac{\\mathrm{d}{#1}}{\\mathrm{d}{#2}}",
  "\\partialderivative": "\\frac{\\partial{#1}}{\\partial{#2}}",
  "\\gradient": "\\nabla",
  "\\divergence": "\\nabla\\cdot",
  "\\curl": "\\nabla\\times",
  "\\laplacian": "\\nabla^2",

  // ─── PROBABILITÉS ET STATISTIQUES ───
  "\\Binomial": "\\operatorname{Binomial}",
  "\\Poisson": "\\operatorname{Poisson}",
  "\\Normal": "\\operatorname{Normal}",
  "\\Uniform": "\\operatorname{Uniform}",
  "\\Exp": "\\operatorname{Exp}",
  "\\Geom": "\\operatorname{Geom}",
  "\\Bernoulli": "\\operatorname{Bernoulli}",

  // ─── NOTATIONS MUSICALES (basique) ───
  "\\flat": "\\mathit{\\flat}",
  "\\sharp": "\\mathit{\\sharp}",
  "\\natural": "\\mathit{\\natural}",
};

// ============================================================
// PRÉ-TRAITEMENT DES BRA-KETS
// ============================================================

/**
 * Pré-traitement des bra-kets : convertit \braket{a|b} en notation explicite
 * et gère les parenthèses dans les arguments.
 */
const preprocessBraket = (text: string): string => {
  let result = text;

  // 3 arguments : \braket{a|b|c} → \langle a | b | c \rangle
  result = result.replace(
    /\\braket\{([^{}]*)\|([^{}]*)\|([^{}]*)\}/g,
    "\\langle{$1}|{$2}|{$3}\\rangle"
  );

  // 2 arguments : \braket{a|b} → \langle a | b \rangle
  // Gère les parenthèses dans les arguments
  result = result.replace(
    /\\braket\{([^{}]*)\|([^{}]*)\}/g,
    (match, bra, ket) => {
      const safeBra = bra.replace(/\(/g, "\\left(").replace(/\)/g, "\\right)");
      const safeKet = ket.replace(/\(/g, "\\left(").replace(/\)/g, "\\right)");
      return `\\langle{${safeBra}}|${safeKet}\\rangle`;
    }
  );

  return result;
};

// ============================================================
// PRÉ-TRAITEMENT DU LATEX
// ============================================================

/**
 * Pré-traitement du texte LaTeX pour gérer les cas spéciaux
 * avant le rendu KaTeX.
 */
const preprocessLatex = (latex: string): string => {
  let processed = preprocessBraket(latex);

  // ─── CHIMIE : Convertit \ce{...} en notation mathématique ───
  processed = processed.replace(
    /\\ce\{([^}]+)\}/g,
    (match, content) => {
      let chem = content
        .replace(/(\D)(\d+)/g, "$1_{$2}")
        .replace(/->/g, "\\longrightarrow ")
        .replace(/<-/g, "\\longleftarrow ")
        .replace(/<=>/g, "\\longleftrightarrow ")
        .replace(/\+/g, " + ")
        .replace(/\^/g, "^");
      return `\\mathrm{${chem}}`;
    }
  );

  // ─── CHIMIE : Isotopes ^A_ZX ───
  processed = processed.replace(
    /\\ce\{\^(\d+)_(\d+)([A-Za-z]+)\}/g,
    "\\ce{^{$1}_{$2}$3}"
  );

  // ─── BRA-KET : Simplifie les notations compactes ───
  processed = processed.replace(
    /\|([^|]+)\\rangle/g,
    "\\ket{$1}"
  );
  processed = processed.replace(
    /\\langle([^|]+)\|/g,
    "\\bra{$1}"
  );

  // ─── FONCTIONS SPÉCIALES : Normalisation ───
  processed = processed.replace(
    /\\operatorname\*\{([^}]+)\}/g,
    "\\operatorname{$1}"
  );

  return processed;
};

// ============================================================
// RENDU LATEX SÉCURISÉ
// ============================================================

/**
 * Rendu sécurisé du LaTeX avec support complet des macros scientifiques.
 */
const renderLaTeX = (latex: string, isBlock: boolean): string => {
  try {
    const processedLatex = preprocessLatex(latex);

    return katex.renderToString(processedLatex, {
      displayMode: isBlock,
      throwOnError: false,
      trust: true,
      strict: false,
      macros: SCIENTIFIC_MACROS,
      colorIsTextColor: true,
    });
  } catch (e) {
    console.error("KaTeX Parsing Error: ", e);
    return `<span style="color:var(--color-danger);font-family:monospace;font-size:0.75rem">[LaTeX Error: ${latex.substring(0, 50)}...]</span>`;
  }
};

// ============================================================
// REGEX DE PARSING AMÉLIORÉ
// ============================================================

/**
 * Regex amélioré qui gère correctement :
 * - $$...$$ (blocs math, multi-lignes)
 * - $...$ (inline math, évite les conflits avec les $ dans le texte)
 * - [[media:URL:type]] (médias intégrés)
 */
const MATH_AND_MEDIA_REGEX = /(\$\$[\s\S]*?\$\$)|(\$(?:\\.|[^\$\\])*?\$)|(\[\[media:[^\]]+?\]\])/g;

// ============================================================
// INTERFACE DES SEGMENTS
// ============================================================

interface Segment {
  type: "text" | "math-inline" | "math-block" | "media";
  value: string;
  mediaType?: string;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export const MathRenderer: React.FC<MathRendererProps> = ({
  text,
  className = "",
  block = false,
}) => {
  const segments = useMemo<Segment[]>(() => {
    if (!text) return [];

    // Mode bloc pur : tout le texte est une équation
    if (block) {
      return [{ type: "math-block", value: text }];
    }

    const parts: Segment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = MATH_AND_MEDIA_REGEX.exec(text)) !== null) {
      const matchIndex = match.index;
      const textBefore = text.substring(lastIndex, matchIndex);

      // Texte avant le match
      if (textBefore) {
        parts.push({ type: "text", value: textBefore });
      }

      const matchStr = match[0];

      // ─── BLOC MATH ($$...$$) ───
      if (matchStr.startsWith("$$")) {
        const latex = matchStr.substring(2, matchStr.length - 2).trim();
        parts.push({ type: "math-block", value: latex });
      }
      // ─── INLINE MATH ($...$) ───
      else if (matchStr.startsWith("$")) {
        const latex = matchStr.substring(1, matchStr.length - 1).trim();
        parts.push({ type: "math-inline", value: latex });
      }
      // ─── MÉDIA ([[media:URL:type]]) ───
      else if (matchStr.startsWith("[[media:")) {
        const content = matchStr.substring(8, matchStr.length - 2);
        const tokens = content.split(":");
        const url = tokens[0] || "";
        const type = tokens[1] || "image";
        parts.push({
          type: "media",
          value: url.trim(),
          mediaType: type.trim(),
        });
      }

      lastIndex = MATH_AND_MEDIA_REGEX.lastIndex;
    }

    // Texte restant après le dernier match
    const textAfter = text.substring(lastIndex);
    if (textAfter) {
      parts.push({ type: "text", value: textAfter });
    }

    return parts;
  }, [text, block]);

  return (
    <div
      className={`math-renderer prose max-w-none transition-colors duration-200 ${className} space-y-1.5`}
    >
      {segments.map((seg, idx) => {
        // ─── MATH BLOC ───
        if (seg.type === "math-block") {
          return (
            <div
              key={`block-${idx}`}
              className="my-4 overflow-x-auto w-full flex justify-center"
              dangerouslySetInnerHTML={{ __html: renderLaTeX(seg.value, true) }}
            />
          );
        }

        // ─── MATH INLINE ───
        else if (seg.type === "math-inline") {
          return (
            <span
              key={`inline-${idx}`}
              className="inline-block px-0.5 align-middle"
              dangerouslySetInnerHTML={{
                __html: renderLaTeX(seg.value, false),
              }}
            />
          );
        }

        // ─── MÉDIA ───
        else if (seg.type === "media") {
          const cleanUrl = seg.value;
          const type = seg.mediaType;

          // Image
          if (type === "image") {
            return (
              <div key={`media-${idx}`} className="my-5 text-center transition-all">
                <img
                  src={cleanUrl}
                  className="mx-auto rounded-xl max-h-80 border border-gray-150 dark:border-slate-800 shadow-md hover:scale-[1.01] transition-all duration-300"
                  referrerPolicy="no-referrer"
                  alt="Illustration de cours"
                  loading="lazy"
                />
              </div>
            );
          }

          // Audio
          else if (type === "audio") {
            return (
              <div
                key={`media-${idx}`}
                className="my-5 p-4 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-150 dark:border-emerald-900/40 rounded-2xl max-w-md mx-auto text-center shadow-xs"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                    Lecture Audio d'Accompagnement
                  </span>
                </div>
                <audio
                  src={cleanUrl}
                  controls
                  className="w-full focus:outline-none"
                  preload="metadata"
                ></audio>
              </div>
            );
          }

          // Vidéo
          else if (type === "video") {
            return (
              <div key={`media-${idx}`} className="my-5 text-center">
                <video
                  src={cleanUrl}
                  controls
                  className="mx-auto rounded-xl border border-gray-250 dark:border-slate-800 max-h-96 w-full max-w-2xl shadow-lg focus:outline-none"
                  preload="metadata"
                ></video>
              </div>
            );
          }

          return null;
        }

        // ─── TEXTE MARKDOWN ───
        else {
          return (
            <div key={`text-${idx}`} className="markdown-body inline">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <span className="inline">{children}</span>,
                }}
              >
                {seg.value}
              </ReactMarkdown>
            </div>
          );
        }
      })}
    </div>
  );
};