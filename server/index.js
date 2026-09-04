import express from 'express'
import cors from 'cors'
import { readdirSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { DatabaseSync } from 'node:sqlite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// radardb/news 目录：优先环境变量，服务器部署时可挂载任意路径
const DEFAULT_NEWS_DIR = resolve(__dirname, '../../radardb/news')
const RADARDB_NEWS_PATH = resolve(
  process.env.RADARDB_NEWS_PATH || DEFAULT_NEWS_DIR,
)

app.use(cors())

const frontendDist = join(__dirname, '..', 'dist')
app.use(express.static(frontendDist))

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    newsPath: RADARDB_NEWS_PATH,
    newsPathExists: existsSync(RADARDB_NEWS_PATH),
  })
})

/** 找出 news 目录下最新日期的 YYYY-MM-DD.db */
function findLatestDb(newsDir) {
  if (!existsSync(newsDir)) return null

  const files = readdirSync(newsDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.db$/.test(name))
    .sort()

  if (files.length === 0) return null

  const latest = files[files.length - 1]
  return {
    date: latest.replace(/\.db$/, ''),
    fileName: latest,
    path: join(newsDir, latest),
  }
}

/**
 * 读取最新热点新闻
 * GET /api/news?limit=40
 */
app.get('/api/news', (req, res) => {
  try {
    const limit = Math.min(
      Math.max(parseInt(String(req.query.limit || '40'), 10) || 40, 1),
      100,
    )

    const latest = findLatestDb(RADARDB_NEWS_PATH)
    if (!latest) {
      return res.status(404).json({
        error: 'no_news_db',
        message: `未找到新闻数据库，请检查 RADARDB_NEWS_PATH: ${RADARDB_NEWS_PATH}`,
        path: RADARDB_NEWS_PATH,
      })
    }

    const db = new DatabaseSync(latest.path, { readOnly: true })

    try {
      const crawl = db
        .prepare(
          `SELECT crawl_time AS crawlTime, total_items AS totalItems, created_at AS createdAt
           FROM crawl_records
           ORDER BY id DESC
           LIMIT 1`,
        )
        .get()

      const latestCrawlTime = crawl?.crawlTime
      let items = []

      if (latestCrawlTime) {
        items = db
          .prepare(
            `SELECT
               n.id,
               n.title,
               n.platform_id AS platformId,
               p.name AS platform,
               n.rank,
               n.url,
               n.first_crawl_time AS firstCrawlTime,
               n.last_crawl_time AS lastCrawlTime,
               n.crawl_count AS crawlCount,
               n.updated_at AS updatedAt
             FROM news_items n
             LEFT JOIN platforms p ON p.id = n.platform_id
             WHERE n.last_crawl_time = ?
             ORDER BY n.rank ASC, n.id DESC
             LIMIT ?`,
          )
          .all(latestCrawlTime, limit)
      }

      if (items.length < limit) {
        const excludeIds = items.map((i) => i.id)
        const placeholders = excludeIds.length
          ? `AND n.id NOT IN (${excludeIds.map(() => '?').join(',')})`
          : ''
        const more = db
          .prepare(
            `SELECT
               n.id,
               n.title,
               n.platform_id AS platformId,
               p.name AS platform,
               n.rank,
               n.url,
               n.first_crawl_time AS firstCrawlTime,
               n.last_crawl_time AS lastCrawlTime,
               n.crawl_count AS crawlCount,
               n.updated_at AS updatedAt
             FROM news_items n
             LEFT JOIN platforms p ON p.id = n.platform_id
             WHERE 1=1 ${placeholders}
             ORDER BY n.updated_at DESC, n.rank ASC
             LIMIT ?`,
          )
          .all(...excludeIds, limit - items.length)
        items = items.concat(more)
      }

      res.json({
        date: latest.date,
        crawlTime: latestCrawlTime || null,
        totalItems: crawl?.totalItems ?? items.length,
        updatedAt: crawl?.createdAt || null,
        path: RADARDB_NEWS_PATH,
        fileName: latest.fileName,
        items,
      })
    } finally {
      db.close()
    }
  } catch (err) {
    console.error('[api/news]', err)
    res.status(500).json({
      error: 'news_query_failed',
      message: err instanceof Error ? err.message : String(err),
      path: RADARDB_NEWS_PATH,
    })
  }
})

// SPA fallback（Express 5 不用裸 *）
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()
  if (req.path.startsWith('/api/')) return next()
  res.sendFile(join(frontendDist, 'index.html'), (err) => {
    if (err) next()
  })
})

app.listen(PORT, () => {
  console.log(`Home Server running at http://localhost:${PORT}`)
  console.log(`RADARDB_NEWS_PATH = ${RADARDB_NEWS_PATH}`)
  console.log(`news dir exists: ${existsSync(RADARDB_NEWS_PATH)}`)
})
