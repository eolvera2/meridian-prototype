#!/usr/bin/env python3
"""PHI Pattern Scanner — pre-commit hook for Meridian.

Scans staged Python files for patterns that might log or persist
protected health information (PHI). Exits with code 1 if violations found.

Usage:
    python scripts/phi_scan.py [files...]

If no files are passed, scans all .py files in src/ and tests/.
"""

import re
import sys

# Patterns that suggest PHI is being logged or printed
PHI_PATTERNS = [
    # Patient identifiers in log/print statements
    (r'(?:log(?:ger|ging)?|print)\s*\(.*(?:patient.*name|first_name|last_name|full_name)',
     "Potential PHI in log/print: patient name"),
    (r'(?:log(?:ger|ging)?|print)\s*\(.*(?:ssn|social_security)',
     "Potential PHI in log/print: SSN"),
    (r'(?:log(?:ger|ging)?|print)\s*\(.*(?:mrn|medical_record)',
     "Potential PHI in log/print: MRN"),
    (r'(?:log(?:ger|ging)?|print)\s*\(.*date_of_birth',
     "Potential PHI in log/print: date of birth"),
    # f-strings with patient data
    (r'f["\'].*\{(?:patient\.(?:name|first_name|last_name|ssn|mrn|date_of_birth)|'
     r'name|first_name|last_name).*\}',
     "Potential PHI in f-string"),
]

COMPILED_PATTERNS = [(re.compile(p, re.IGNORECASE), msg) for p, msg in PHI_PATTERNS]


def scan_file(filepath: str) -> list[tuple[int, str, str]]:
    """Scan a file for PHI patterns. Returns list of (line_num, line, message)."""
    violations = []
    try:
        with open(filepath, encoding="utf-8") as f:
            for line_num, line in enumerate(f, 1):
                # Skip comments
                stripped = line.strip()
                if stripped.startswith("#"):
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
        print("No files to scan.", file=sys.stderr)
        return 0

    total_violations = 0
    for filepath in files:
        violations = scan_file(filepath)
        for line_num, line, message in violations:
            print(f"  {filepath}:{line_num}: {message}", file=sys.stderr)
            print(f"    {line[:120]}", file=sys.stderr)
            total_violations += 1

    if total_violations > 0:
        print(f"\n❌ PHI scan found {total_violations} potential violation(s).", file=sys.stderr)
        print("   Use patient IDs (UUIDs) instead of names/SSNs in logs.", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
