FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm install --no-frozen-lockfile && pnpm --filter @aperture/web build
EXPOSE 3000
CMD ["pnpm", "--filter", "@aperture/web", "start"]
