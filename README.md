# APERTURE

APERTURE is a Hermes domain agent for browser operations, UI verification, and evidence capture.

## Monorepo layout
- `apps/web` Next.js Mission Control dashboard
- `apps/api` Fastify API with durable task ledger endpoints
- `apps/worker` BullMQ worker for browser runs and recurring workflows
- `packages/*` shared contracts, browser runtime, skills, evals, and POML contracts
- `infra/docker` production Dockerfiles
- `docs` ADRs, runbook, migration notes, MCP setup

## Quick start (local)
```bash
cp .env.example .env
pnpm install
pnpm db:migrate
pnpm seed
pnpm dev
```

## Verification commands
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm e2e
```

## Coolify deployment (Docker Compose)
1. Create project from repository and choose Docker Compose.
2. Use `docker-compose.yml` as source.
3. Set env vars from `.env.example` in Coolify UI.
4. Expose only `web` service publicly (`3000`).
5. Keep `api`, `worker`, `postgres`, and `redis` internal.
6. Deploy; compose healthchecks gate startup.

## Seeded demo artifacts
- Seeded `env_local` environment and `job_demo` donation guard job.
- Demo route in web app: `/demo-checkout`.
- Text baseline artifact for demo route: `packages/evals/baselines/demo-checkout-baseline.md`.

## Deferred intentionally
- Full production auth provider integration (v1 uses internal token header).
- Real Stagehand/OpenAI execution wiring beyond feature-gated contracts.
