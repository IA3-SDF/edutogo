export interface ContentSegment {
  type: "text" | "activity";
  value: string;
}

/**
 * Parses course content to split regular text from special educational activity markers
 * such as [[activite:ex_xxxx]] so they can be rendered inline.
 */
export function parseCourseContent(content: string): ContentSegment[] {
  if (!content) return [];
  const segments: ContentSegment[] = [];
  const regex = /\[\[activite:([a-zA-Z0-9_-]+)\]\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore.trim() || textBefore.length > 0) {
      segments.push({ type: "text", value: textBefore });
    }
    segments.push({ type: "activity", value: match[1] });
    lastIndex = regex.lastIndex;
  }

  const remainingText = content.substring(lastIndex);
  if (remainingText.trim() || remainingText.length > 0) {
    segments.push({ type: "text", value: remainingText });
  }

  return segments;
}
