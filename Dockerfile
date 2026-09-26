# ---------- Builder ----------
FROM node:26-alpine@sha256:2d984a15c9b54fd0aeb608b8e0d0d83529eb34d2966db27a1fb4f1edc3d298a3 AS builder

RUN apk add --no-cache git
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# node:26-alpine no trae corepack embebido (a diferencia de node:24); se instala vía npm,
# que sí sigue empaquetado, antes de usarlo para activar el pnpm pineado
RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@11.12.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
ENV HUSKY=0
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run typecheck && pnpm run build

# ---------- Production ----------
FROM node:26-alpine@sha256:2d984a15c9b54fd0aeb608b8e0d0d83529eb34d2966db27a1fb4f1edc3d298a3 AS production

# apk upgrade pulls Alpine security fixes published after the pinned base digest
# (e.g. openssl CVE-2026-14456 fixed in 3.5.8-r0); trivy-image gates on these
RUN apk upgrade --no-cache && apk add --no-cache curl
ENV NODE_ENV=production
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PORT=8080

# node:26-alpine no trae corepack embebido (a diferencia de node:24); se instala vía npm,
# que sí sigue empaquetado, antes de usarlo para activar el pnpm pineado
RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@11.12.0 --activate && \
    pnpm config set global-bin-dir "$PNPM_HOME"

# Create user without privileges
RUN adduser -D -u 10001 nodeuser

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nodeuser:nodeuser /app/dist ./dist

# Install a simple HTTP server
RUN pnpm add -g serve

# npm ships bundled with the base image but this project only uses pnpm;
# removing it drops its vulnerable transitive deps (tar, undici CVEs) from the final image
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# pnpm is only needed to install `serve` above; the runtime CMD calls serve directly.
# Its bundled dist (corepack cache) ships a vulnerable tar (CVE-2026-73566)
RUN rm -rf /root/.cache/node/corepack

USER nodeuser

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

CMD ["serve", "-s", "dist", "-l", "8080"]
