FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Development
FROM base AS dev
CMD ["npm", "run", "dev"]

# Production build
FROM base AS builder
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
