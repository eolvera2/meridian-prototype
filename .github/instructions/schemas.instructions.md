---
globs: src/meridian/schemas/**
---

# Schema Instructions

## Pydantic v2 Syntax

Use v2 patterns (NOT v1):
- `model_validator` instead of `@validator`
- `field_validator` instead of `@validator`
- `ConfigDict` instead of `class Config`
- `model_dump()` instead of `.dict()`

## Conventions

- Separate request and response models (e.g., `PatientCreate` vs `PatientResponse`)
- User story references in class docstrings: `"""GH-001: Patient model for..."""`
- User story range: GH-001 through GH-017
- PHI fields: annotate with comments for audit/compliance awareness
- Validators: use present tense error messages, include field name
