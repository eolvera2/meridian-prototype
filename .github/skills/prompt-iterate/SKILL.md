---
name: prompt-iterate
description: 'Structured prompt iteration workflow for MAF agent system prompts. Use when improving NurseAgent, PatientFactsAgent, or SummarizationAgent prompts for accuracy, safety, and clinical appropriateness.'
---

# Prompt Iteration

## Overview

Structured workflow for improving system prompts for Meridian's MAF agents. Prompts live in `src/meridian/prompts/{agent-name}/system-prompt.md` and are critical for healthcare safety and quality.

## Workflow

### 1. Load Current Prompt

Read the current prompt from `src/meridian/prompts/{agent-name}/system-prompt.md`.

### 2. Identify Issues

Common problems by agent:

| Agent | Common Issues |
|-------|--------------|
| **NurseAgent** | Too verbose, not empathetic enough, gives medical advice, fails to redirect to provider |
| **PatientFactsAgent** | Misses facts, halluccinates medications, wrong JSON schema, includes PHI in reasoning |
| **SummarizationAgent** | Too long, misses key clinical details, includes unnecessary information, lacks actionability |

### 3. Edit Prompt

Apply improvements following these principles:

- **Healthcare-appropriate language** — empathetic, clear, non-technical for patients
- **No PHI in templates** — use placeholders: `{patient_name}`, `{medication_name}`
- **Safety instructions** — "If unsure about medical information, acknowledge uncertainty"
- **Responsible AI** — no diagnosis, no medical advice, always refer to healthcare provider
- **Structured output** — for PatientFactsAgent, specify exact JSON schema in prompt
- **Conciseness** — for SummarizationAgent, specify max length and required sections

### 4. Define Evaluation Criteria

| Dimension | NurseAgent | PatientFactsAgent | SummarizationAgent |
|-----------|-----------|-------------------|-------------------|
| Accuracy | Correct patient info referenced | All facts extracted | Key details captured |
| Safety | No medical advice, redirects to provider | No hallucinated meds | No fabricated data |
| Tone | Warm, professional, empathetic | N/A (machine output) | Clinical, concise |
| Completeness | All questions addressed | All structured fields populated | All action items noted |
| PHI handling | No PHI in reasoning/logs | PHI only in structured output | PHI only in summary body |

### 5. Test Against Sample Inputs

Create 3-5 test transcripts covering:
- Normal follow-up call
- Patient with medication concerns
- Patient requesting medical advice (should redirect)
- Uncooperative or confused patient
- Edge case: very short transcript

### 6. Save Improved Version

Update the prompt file and commit with clear description of what changed and why.

## Prompt Template Structure

```markdown
# System Prompt — {Agent Name}

## Role
[Who you are and what you do]

## Context
[What information you have access to]

## Instructions
[Step-by-step behavior expectations]

## Safety Rules
- Never provide medical advice
- If unsure, say "I'm not qualified to answer that — please speak with your healthcare provider"
- Never confirm or deny diagnoses

## Output Format
[For PatientFactsAgent: exact JSON schema]
[For SummarizationAgent: section structure and length limits]
```

## Checklist

- [ ] Current prompt loaded and reviewed
- [ ] Issues identified (accuracy, safety, tone, completeness)
- [ ] Prompt edited following healthcare language guidelines
- [ ] No PHI in prompt template (placeholders only)
- [ ] Safety instructions included
- [ ] Evaluation criteria defined
- [ ] Tested against 3-5 sample inputs
- [ ] Improvement documented in commit message
