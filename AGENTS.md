# APERTURE Repository Agent Guide

## Mission
APERTURE is a Hermes domain agent for browser operations, UI verification, and evidence capture.

## Required workflow for coding agents
1. Inspect existing code before editing.
2. Read schemas/contracts before changing endpoint behavior.
3. Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` after changes.
4. Review your own diff before commit.
5. Prefer Context7 MCP for live library docs.
6. Use OpenAI Docs MCP for OpenAI API usage.
7. Use JCodeMunch when configured for repository retrieval; if absent, continue with local files only.
8. Never hide failures: propagate typed errors and structured logs.

## Runtime constraints
- Primary browser executor: Playwright.
- Semantic browser layer: Stagehand.
- OpenAI Computer Use is fallback-only and requires approval + feature flag.
- No hardcoded secrets.
- Every run must capture evidence artifacts and structured verdicts.

## Repo layout
- `apps/web`: Mission control UI (Next.js App Router)
- `apps/api`: Fastify REST API, auth/session, queue producer
- `apps/worker`: BullMQ workers, Playwright execution, schedules
- `packages/shared`: zod contracts, db schema, cross-service types
- `packages/agent-core`: planner, issue-writer, summarizer orchestration
- `packages/browser-core`: Playwright + Stagehand executor and evidence capture
- `packages/skills`: skill contracts and implementations
- `packages/evals`: verification and prompt/policy eval runner
- `packages/poml-contracts`: versioned POML contracts and templates
- `legacy/open-interpreter-fork`: archived legacy code only

## Done when
- Endpoints are real and UI controls are wired to API calls.
- Browser jobs generate screenshot/trace/dom/console/network evidence.
- Seeded environments/jobs are runnable.
- Lint/typecheck/tests pass for implemented scope.
- Docker compose + Dockerfiles run web/api/worker/postgres/redis in production shape.
