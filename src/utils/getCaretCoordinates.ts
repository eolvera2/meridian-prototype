export interface CaretCoordinates {
  left: number;
  top: number;
  height: number;
}

export type TextFieldElement = HTMLTextAreaElement | HTMLInputElement;

// Cached canvas for input text measurement - reused to avoid recreation on every call
let cachedCanvas: HTMLCanvasElement | null = null;

/**
 * Gets accurate caret coordinates by creating a mirror div that exactly
 * replicates the textarea's rendering, then measuring the caret marker position.
 */
export const getCaretCoordinates = (
  element: TextFieldElement
): CaretCoordinates | null => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  const selectionStart = element.selectionStart;
  if (selectionStart === null || selectionStart === undefined) {
    return null;
  }

  const computed = window.getComputedStyle(element);
  const lineHeight =
    parseFloat(computed.lineHeight) ||
    parseFloat(computed.fontSize) * 1.2 ||
    20;

  const rect = element.getBoundingClientRect();

  // For textareas, use mirror approach with proper scroll handling
  if (element.nodeName === "TEXTAREA") {
    const textarea = element as HTMLTextAreaElement;

    // Create a hidden div that mirrors the textarea exactly
    const mirror = document.createElement("div");

    // Copy all relevant styles for accurate text rendering
    const stylesToCopy = [
      "fontFamily",
      "fontSize",
      "fontWeight",
      "fontStyle",
      "fontVariant",
      "fontStretch",
      "letterSpacing",
      "textTransform",
      "wordSpacing",
      "textIndent",
      "lineHeight",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "borderTopWidth",
      "borderRightWidth",
      "borderBottomWidth",
      "borderLeftWidth",
      "boxSizing",
    ];

    mirror.style.position = "fixed";
    mirror.style.visibility = "hidden";
    mirror.style.whiteSpace = "pre-wrap";
    mirror.style.wordWrap = "break-word";
    mirror.style.overflow = "hidden";
    mirror.style.pointerEvents = "none";
    mirror.style.zIndex = "-9999";

    stylesToCopy.forEach((prop) => {
      const kebabProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
      mirror.style.setProperty(kebabProp, computed.getPropertyValue(kebabProp));
    });

    // Use the exact content width of the textarea
    mirror.style.width = `${textarea.clientWidth}px`;

    // Position mirror at same location as textarea for accurate measurement
    mirror.style.top = `${rect.top}px`;
    mirror.style.left = `${rect.left}px`;

    // Get text before caret
    const value = textarea.value.replace(/\r\n/g, "\n");
    const textBeforeCaret = value.substring(0, selectionStart);

    // Create content: text before caret + marker
    const textNode = document.createTextNode(textBeforeCaret);
    mirror.appendChild(textNode);

    // Create caret marker - use a visible character for measurement
    const caretSpan = document.createElement("span");
    caretSpan.textContent = "|";
    caretSpan.style.visibility = "hidden";
    mirror.appendChild(caretSpan);

    document.body.appendChild(mirror);

    // Measure caret span position relative to mirror
    const caretRect = caretSpan.getBoundingClientRect();
    const mirrorRect = mirror.getBoundingClientRect();

    // Calculate caret position relative to the mirror (which mirrors the textarea)
    const caretRelativeTop = caretRect.top - mirrorRect.top;
    const caretRelativeLeft = caretRect.left - mirrorRect.left;

    document.body.removeChild(mirror);

    // Account for textarea's scroll position to get viewport coordinates
    const scrollTop = textarea.scrollTop;
    const scrollLeft = textarea.scrollLeft;

    // Final position: textarea position + relative caret position - scroll offset
    const left = rect.left + caretRelativeLeft - scrollLeft;
    const top = rect.top + caretRelativeTop - scrollTop;

    return {
      left,
      top,
      height: lineHeight,
    };
  }

  // Fallback for input elements (single line)
  const input = element as HTMLInputElement;

  const paddingLeft = parseFloat(computed.paddingLeft) || 0;
  const borderLeft = parseFloat(computed.borderLeftWidth) || 0;

  // For inputs, estimate based on character width using cached canvas
  const textBeforeCaret = input.value.substring(0, selectionStart);

  // Use a cached canvas for performance - avoid creating new canvas on every call
  if (!cachedCanvas) {
    cachedCanvas = document.createElement("canvas");
  }
  const ctx = cachedCanvas.getContext("2d");
  if (!ctx) {
    return {
      left: rect.left + paddingLeft + borderLeft,
      top: rect.top + (rect.height - lineHeight) / 2,
      height: lineHeight,
    };
  }

  const fontString = `${computed.fontStyle} ${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;

  // Only update font if it changed (font setting is expensive)
  if (ctx.font !== fontString) {
    ctx.font = fontString;
  }

  const textWidth = ctx.measureText(textBeforeCaret).width;

  return {
    left: rect.left + paddingLeft + borderLeft + textWidth - input.scrollLeft,
    top: rect.top + (rect.height - lineHeight) / 2,
    height: lineHeight,
  };
};
