FROM node:26.13.1-bookworm-slim AS deps
WORKDIR /app
COPY container-package.json package.json
COPY container-package-lock.json package-lock.json
RUN npm ci --omit=dev && mkdir -p node_modules
FROM node:26.13.1-bookworm-slim
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node server.mjs ./
USER node
EXPOSE 3000
CMD ["node","server.mjs"]
