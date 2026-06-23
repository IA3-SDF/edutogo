import React, { useState, useEffect, useRef } from "react";

interface EditableFieldProps {
  value: string;
  onSave: (val: string) => void;
  as?: React.ElementType;
  className?: string;
  multiline?: boolean;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  as: Tag = "span",
  className = "",
  multiline = false,
}) => {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      try {
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        range.collapse(false);
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } catch {
        // fail-silent
      }
    }
  }, [editing]);

  const commit = () => {
    const newVal = ref.current?.innerText.trim() || "";
    setEditing(false);
    if (newVal && newVal !== value) {
      onSave(newVal);
    }
  };

  if (editing) {
    return (
      <Tag
        ref={ref}
        className={`${className} outline-2 outline-dashed outline-(--color-accent) bg-(--color-accent-soft) rounded px-1.5 cursor-text`}
        contentEditable
        suppressContentEditableWarning
        onBlur={commit}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" && !multiline) {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") {
            setEditing(false);
          }
        }}
      >
        {value}
      </Tag>
    );
  }

  return (
    <Tag
      className={`${className} cursor-pointer border-b border-dashed border-transparent hover:border-(--color-accent) hover:text-(--color-accent) transition-all`}
      onDoubleClick={() => setEditing(true)}
      title="Double-cliquer pour renommer"
    >
      {value || <span className="text-(--color-text-faint) italic">Saisir un nom</span>}
    </Tag>
  );
};