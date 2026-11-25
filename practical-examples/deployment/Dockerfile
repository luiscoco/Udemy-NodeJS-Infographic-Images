FROM node:26.13.1-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY lessons ./lessons
RUN npm ci --omit=dev --ignore-scripts
FROM node:26.13.1-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node shared ./shared
COPY --chown=node:node applications ./applications
USER node
EXPOSE 3000
CMD ["node","applications/task-api/server.mjs"]
