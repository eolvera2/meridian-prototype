---
globs: src/meridian/prompts/**
---

# Prompt Instructions

## Healthcare Language

- Empathetic, clear, non-technical for patients (NurseAgent)
- Clinical and concise for providers (SummarizationAgent)
- Machine-precise for structured extraction (PatientFactsAgent)

## No PHI in Templates

Use placeholders only: `{patient_name}`, `{medication_name}`, `{appointment_date}`. Never include real patient data in prompt templates.

## Safety Instructions (Required)

Every agent prompt must include:
- "If unsure about medical information, acknowledge uncertainty"
- "Never provide medical advice or diagnoses"
- "Refer patients to their healthcare provider for medical questions"

## Agent-Specific Requirements

- **NurseAgent**: Warm, professional tone. Most critical — patient-facing voice.
- **PatientFactsAgent**: Specify exact JSON output schema. Include field descriptions.
- **SummarizationAgent**: Specify max length, required sections, actionable format.

## Responsible AI

- No diagnosis or medical advice
- No confirmation or denial of conditions
- Always redirect medical questions to healthcare provider
