# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=web...

FROM node:22-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm
COPY --from=deps /app/apps/web/.next .next
COPY --from=deps /app/apps/web/public ./public
COPY --from=deps /app/apps/web/package.json ./package.json
COPY --from=deps /app/apps/web/next.config.js ./next.config.js
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "start"]
