#!/usr/bin/env python3
"""Audio Persistence Guard — pre-commit hook for Meridian.

Scans staged files for patterns that might persist audio data to disk
or blob storage. HIPAA requires that audio is NEVER persisted — only
transcripts are kept.

Usage:
    python scripts/no_audio_persist.py [files...]
"""

import re
import sys

AUDIO_PATTERNS = [
    # File operations with audio extensions
    (r'open\s*\(.*\.\s*(?:wav|mp3|ogg|flac|aac|m4a|webm)',
     "Audio file write detected"),
    # Blob storage uploads with audio
    (r'(?:blob|storage|upload|save).*(?:audio|voice|recording|call)',
     "Potential audio upload to blob storage"),
    # Writing audio data
    (r'(?:write|save|persist|store).*(?:audio|pcm|wav|mp3)',
     "Audio data persistence detected"),
    # Audio file creation
    (r'(?:Path|pathlib).*\.(?:wav|mp3|ogg|flac)',
     "Audio file path construction"),
]

COMPILED_PATTERNS = [(re.compile(p, re.IGNORECASE), msg) for p, msg in AUDIO_PATTERNS]

# Lines that are clearly comments or strings describing the rule (not violations)
ALLOWLIST_PATTERNS = [
    re.compile(r'^\s*#'),           # Python comments
    re.compile(r'^\s*//'),          # JS comments
    re.compile(r'^\s*\*'),          # Block comments
    re.compile(r'audio.*never.*persist', re.IGNORECASE),  # Documenting the rule
    re.compile(r'HIPAA.*audio', re.IGNORECASE),            # Documenting the rule
]


def scan_file(filepath: str) -> list[tuple[int, str, str]]:
    """Scan a file for audio persistence patterns."""
    violations = []
    try:
        with open(filepath, encoding="utf-8") as f:
            for line_num, line in enumerate(f, 1):
                stripped = line.strip()
                # Skip comments and rule documentation
                if any(p.search(stripped) for p in ALLOWLIST_PATTERNS):
                    continue
                for pattern, message in COMPILED_PATTERNS:
                    if pattern.search(line):
                        violations.append((line_num, stripped, message))
    except (OSError, UnicodeDecodeError):
        pass
    return violations


def main() -> int:
    files = sys.argv[1:]
    if not files:
        return 0

    total_violations = 0
    for filepath in files:
        violations = scan_file(filepath)
        for line_num, line, message in violations:
            print(f"  {filepath}:{line_num}: {message}", file=sys.stderr)
            print(f"    {line[:120]}", file=sys.stderr)
            total_violations += 1

    if total_violations > 0:
        print(f"\n❌ Audio persistence guard found {total_violations} violation(s).", file=sys.stderr)
        print("   HIPAA: Audio must NEVER be persisted. Use transcripts only.", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
