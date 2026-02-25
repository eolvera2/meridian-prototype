---
name: guardrails-design
description: 'AI guardrails design workflow for Meridian. Use when implementing content safety, prompt injection detection, PHI leak prevention, or medication hallucination detection for MAF agents.'
---

# AI Guardrails Design

## Overview

Design and implement input/output guardrails for Meridian's MAF agents. Healthcare context requires layered safety measures for prompt injection, PHI leaks, and medication hallucination.

## Threat Model

| Threat | Risk | Impact |
|--------|------|--------|
| **Prompt injection** | User manipulates NurseAgent via voice input | Agent gives medical advice, breaks character |
| **PHI leak in reasoning** | Agent includes PHI in tool call arguments or logs | HIPAA violation |
| **Medication hallucination** | PatientFactsAgent invents medications | Wrong clinical decisions downstream |
| **Inappropriate content** | NurseAgent generates harmful or insensitive responses | Patient harm, liability |

## Layered Defense Architecture

```
Input → [Layer 1: Regex/Pattern] → [Layer 2: Classifier] → [Layer 3: LLM-as-Judge] → Agent
Agent → [Layer 1: Regex/Pattern] → [Layer 2: Classifier] → [Layer 3: LLM-as-Judge] → Output
```

### Layer 1: Regex/Pattern (Fast, Cheap)
- **Latency**: < 1ms
- **Use for**: Known bad patterns, obvious injection attempts, PHI patterns
- **Examples**: "ignore previous instructions", SSN patterns, audio file extensions

### Layer 2: Classifier (Medium)
- **Latency**: 50-200ms
- **Use for**: Content safety classification, intent detection
- **Tool**: Azure AI Content Safety API
- **Examples**: Harmful content, self-harm indicators, hate speech

### Layer 3: LLM-as-Judge (Expensive)
- **Latency**: 500ms-2s
- **Use for**: Subtle issues that need reasoning — medical advice detection, hallucination verification
- **Tool**: Azure OpenAI with a lightweight judge prompt
- **Examples**: "Is this response giving medical advice?", "Does this medication exist for this patient?"

## Implementation Workflow

### 1. Define What to Guard

Identify the agent and its risk profile:
- **NurseAgent** (voice): All 3 layers (patient-facing, highest risk)
- **PatientFactsAgent** (extraction): Layer 1 + 3 (hallucination detection)
- **SummarizationAgent** (summary): Layer 1 (PHI leak check)

### 2. Implement Guards as Async Functions

```python
async def guard_input(text: str) -> GuardResult:
    """Returns GuardResult(allowed=bool, reason=str, layer=int)"""
    # Layer 1: fast pattern check
    if regex_patterns.match(text):
        return GuardResult(allowed=False, reason="Pattern match", layer=1)
    # Layer 2: classifier (skip for real-time voice path if latency budget exceeded)
    # Layer 3: LLM judge (only for high-risk inputs)
```

### 3. Integrate Into Tool Pipeline

Guards go in `agents/tools.py` — wrap existing tool functions:

```python
async def guarded_tool_call(func, *args, **kwargs):
    input_check = await guard_input(str(args))
    if not input_check.allowed:
        return json.dumps({"error": input_check.reason, "blocked": True})
    result = await func(*args, **kwargs)
    output_check = await guard_output(result)
    if not output_check.allowed:
        return json.dumps({"error": output_check.reason, "blocked": True})
    return result
```

### 4. Voice Path Considerations

The real-time voice path has strict latency requirements:
- Layer 1 (regex): Always run — < 1ms overhead
- Layer 2 (classifier): Run in parallel, don't block audio
- Layer 3 (LLM judge): Post-hoc only — flag for review, don't block

### 5. Test with Adversarial Inputs

Test categories:
- Prompt injection attempts ("ignore your instructions and...")
- PHI extraction attempts ("what is the patient's SSN?")
- Medical advice requests ("should I stop taking my medication?")
- Edge cases (empty input, very long input, non-English)

## Checklist

- [ ] Threat model defined for target agent
- [ ] Layer 1 (regex) patterns implemented
- [ ] Layer 2 (classifier) integration planned
- [ ] Layer 3 (LLM judge) prompt designed
- [ ] All guard functions are async
- [ ] Voice real-time path not blocked by slow guards
- [ ] Fail-safe: block on guard error (not allow)
- [ ] Adversarial test cases written
- [ ] Metrics/logging for guard triggers
