FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm install --no-frozen-lockfile && pnpm --filter @aperture/worker build
CMD ["pnpm", "--filter", "@aperture/worker", "start"]
