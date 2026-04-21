FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm install --no-frozen-lockfile && pnpm --filter @aperture/api build
EXPOSE 4000
CMD ["sh", "-c", "pnpm --filter @aperture/api db:migrate && pnpm --filter @aperture/api start"]
