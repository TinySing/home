# Home — Command Deck

个人指挥台首页：科技风 HUD 界面 + radardb 热点新闻自然滚动轮询。

## 技术栈

- **前端**: React 19 + TypeScript + Tailwind CSS v4 + Vite
- **后端**: Express 5 (Node.js ≥ 22，内置 `node:sqlite`)
- **部署**: Docker

## 本地开发

需要 Node.js 22+（读取 SQLite 依赖内置模块）。

```bash
# 安装依赖
npm install
cd server && npm install && cd ..

# 同时启动前端和后端
npm run dev:all
```

前端: http://localhost:5173  
后端: http://localhost:3001

### 新闻库路径

默认读取相对路径 `../radardb/news`（即 `explore/radardb/news`）。

本地或服务器可通过环境变量覆盖：

```bash
export RADARDB_NEWS_PATH=/absolute/path/to/radardb/news
cd server && npm run dev
```

## Docker 部署

```bash
docker compose up -d --build
```

访问 http://localhost:3001

在 `docker-compose.yml` 中调整挂载与环境变量：

```yaml
environment:
  - RADARDB_NEWS_PATH=/data/radardb/news
volumes:
  - /your/server/radardb/news:/data/radardb/news:ro
```

## API 接口

| 接口 | 说明 |
|------|------|
| `GET /api/news?limit=40` | 最新日期 SQLite 中的热点新闻 |
| `GET /api/health` | 健康检查（含 newsPath 是否存在） |

`/api/news` 会扫描 `RADARDB_NEWS_PATH` 下最新的 `YYYY-MM-DD.db`，取最近一轮抓取的榜单条目。

## 项目结构

```
Home/
├── src/
│   ├── hooks/useNewsFeed.ts   # 新闻轮询
│   └── pages/home/
│       └── components/        # HUD 组件 + NewsRadar
├── server/
│   └── index.js               # Express + SQLite 读取
├── Dockerfile
└── docker-compose.yml         # RADARDB_NEWS_PATH 可配置
```
