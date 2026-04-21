# ADR: Browser runtime stack for APERTURE

## Decision
Use Playwright as the deterministic executor, Stagehand for semantic observe/extract/act helpers, and OpenAI Responses API as planning/summarization/fallback computer-use.

## Why
- Playwright provides deterministic control, trace artifacts, screenshot baselines, and stable CI behavior.
- Stagehand provides semantic interaction abstractions for resilient automation in dynamic UIs.
- OpenAI Responses API gives structured planning and report generation while keeping computer-use behind explicit feature gates.

## Consequences
- Browser evidence capture is standardized across skills.
- Semantic helpers are optional overlays, not a replacement for deterministic selectors.
- Fallback computer-use is auditable and approval-gated.
