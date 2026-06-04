# ---- 构建阶段 ----
FROM node:20-alpine AS builder

WORKDIR /app

# 先复制依赖文件，利用 Docker 缓存
COPY package.json package-lock.json ./
RUN npm ci

# 复制源码并构建
COPY . .
RUN npm run build

# ---- 运行阶段 ----
FROM node:20-alpine

WORKDIR /app

# 只复制 server 代码和依赖
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --production

# 复制构建产物
COPY --from=builder /app/dist ./dist

# 复制 server 源码
COPY server/index.js ./server/

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "server/index.js"]
