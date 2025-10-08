FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm
COPY . .
RUN pnpm install
RUN pnpx prisma generate

RUN pnpm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/generated ./dist/src/generated

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production
ENV LOG_LEVEL=info

CMD ["node", "dist/src/index.js"]
