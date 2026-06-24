import React from "react";
import { MathRenderer } from "./MathRenderer";

interface KatexEditorFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export const KatexEditorField: React.FC<KatexEditorFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 8,
  textareaRef,
}) => {
  return (
    <div className="space-y-1.5 text-left">
      <label className="text-xs font-bold uppercase tracking-wider text-(--color-text-faint) block">
        {label}{" "}
        <span className="font-normal text-[10px] text-(--color-text-faint) lowercase">
          — utilisez $...$ pour les formules mathématiques
        </span>
      </label>
      <div className="border border-(--color-border) rounded-xl overflow-hidden bg-(--color-surface) shadow-[var(--shadow-elevation-sm)]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full p-4.5 text-xs font-mono bg-(--color-bg) border-b border-(--color-border) focus:outline-none focus:bg-(--color-surface) text-(--color-text) placeholder:text-(--color-text-faint) resize-y"
        />
        <div className="p-3 bg-(--color-surface)">
          <span className="text-[10px] font-black tracking-wider uppercase text-(--color-text-faint) block mb-1">
            Aperçu du rendu KaTeX
          </span>
          {value.trim() ? (
            <div className="p-3 rounded-lg bg-(--color-bg) border border-(--color-border)">
              <MathRenderer
                text={value}
                className="text-xs text-(--color-text)"
              />
            </div>
          ) : (
            <p className="text-[11px] text-(--color-text-faint) italic">
              Le texte formaté en LaTeX s'affichera ici en direct.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};