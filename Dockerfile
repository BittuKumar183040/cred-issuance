FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .
RUN pnpm run build

FROM node:20-alpine AS runtime
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./dist/src/generated

ENV PORT=3000
ENV NODE_ENV=production
ENV LOG_LEVEL=info

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/index.js"]
