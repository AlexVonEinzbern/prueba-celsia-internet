# ---- Etapa de build ----
FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY celsia-web/package.json celsia-web/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY celsia-web/ .
RUN pnpm build

# ---- Etapa de producción ----
FROM nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
