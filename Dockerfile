# ---- 构建阶段 ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- 运行阶段 ----
FROM node:22-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY server/index.js ./server/

ENV NODE_ENV=production
ENV PORT=3001
# 默认指向容器内挂载路径，可通过 compose 覆盖
ENV RADARDB_NEWS_PATH=/data/radardb/news

EXPOSE 3001

CMD ["node", "server/index.js"]
