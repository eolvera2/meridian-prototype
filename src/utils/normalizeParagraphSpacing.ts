/**
 * Normalizes paragraph spacing in text by:
 * - Converting Windows line endings (CRLF) to Unix (LF)
 * - Removing trailing whitespace before newlines
 * - Collapsing multiple consecutive newlines (3+) to double newlines
 * - Trimming leading/trailing whitespace
 * 
 * @param text - The text to normalize
 * @returns Normalized text with consistent paragraph spacing, or undefined if input is falsy
 * 
 * @example
 * ```ts
 * normalizeParagraphSpacing("Hello\r\n\r\n\r\nWorld") // "Hello\n\nWorld"
 * ```
 */
export function normalizeParagraphSpacing(text?: string): string | undefined {
  if (!text) return text;

  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
