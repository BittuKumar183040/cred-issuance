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
COPY --from=builder /app/entrypoint.sh /app/entrypoint.sh

ENV PORT=3000
ENV NODE_ENV=production
ENV LOG_LEVEL=info

EXPOSE 3000
RUN chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"]
