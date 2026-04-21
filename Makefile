.PHONY: dev build lint typecheck test e2e migrate seed format

dev:
	pnpm dev

build:
	pnpm build

lint:
	pnpm lint

typecheck:
	pnpm typecheck

test:
	pnpm test

e2e:
	pnpm e2e

migrate:
	pnpm db:migrate

seed:
	pnpm seed

format:
	pnpm format
