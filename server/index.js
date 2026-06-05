import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// 生产环境：托管前端静态文件
const frontendDist = join(__dirname, '..', 'dist')
app.use(express.static(frontendDist))

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(frontendDist, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Home Server running at http://localhost:${PORT}`)
})
