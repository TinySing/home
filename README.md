# 🏠 Home

个人首页 Dashboard，集成了天气、一言、每日诗词、猫咪图片等小部件。

## 技术栈

- **前端**: React 19 + TypeScript + Tailwind CSS v4 + Vite
- **后端**: Express 5 (Node.js)
- **部署**: Docker

## 本地开发

```bash
# 安装依赖
npm install
cd server && npm install && cd ..

# 同时启动前端和后端
npm run dev:all
```

前端: http://localhost:5173
后端: http://localhost:3001

## Docker 部署

```bash
docker compose up -d --build
```

访问 http://localhost:3001

## API 接口

| 接口 | 说明 |
|------|------|
| `GET /api/weather?city=Shanghai` | 天气（wttr.in） |
| `GET /api/hitokoto` | 一言（hitokoto.cn） |
| `GET /api/poem` | 每日诗词 |
| `GET /api/cat` | 随机猫咪图片 |
| `GET /api/health` | 健康检查 |

所有外部 API 均为免费接口，无需付费。

## 项目结构

```
Home/
├── src/                  # 前端源码
│   └── pages/home/
│       └── components/   # 各小部件组件
├── server/               # Express 后端
│   └── index.js          # API 路由
├── Dockerfile            # 多阶段构建
├── docker-compose.yml    # 容器编排
└── vite.config.ts        # Vite 配置
```
