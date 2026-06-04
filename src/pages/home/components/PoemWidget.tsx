import { useState, useEffect } from 'react'

interface PoemData {
  title: string
  author: string
  content: string
  dynasty?: string
}

/** 每日诗词组件 */
export function PoemWidget() {
  const [poem, setPoem] = useState<PoemData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const fetchPoem = async () => {
      try {
        const res = await fetch('/api/poem')
        const data = await res.json()
        setPoem(data)
      } catch {
        setPoem({
          title: '静夜思',
          author: '李白',
          content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchPoem()
  }, [])

  if (loading) {
    return (
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse">
        <div className="h-4 bg-white/[0.05] rounded w-20 mb-4" />
        <div className="h-3 bg-white/[0.05] rounded w-full mb-2" />
        <div className="h-3 bg-white/[0.05] rounded w-3/4" />
      </div>
    )
  }

  if (!poem) return null

  const lines = poem.content.split('\n')
  const displayLines = expanded ? lines : lines.slice(0, 2)

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📜</span>
        <span className="text-sm font-semibold text-white/70">每日诗词</span>
      </div>

      <div className="mb-3">
        {displayLines.map((line, i) => (
          <p key={i} className="text-sm text-white/50 leading-loose font-serif">
            {line}
          </p>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-white/25">
          {poem.dynasty && <span className="mr-1">〔{poem.dynasty}〕</span>}
          {poem.author} · {poem.title}
        </div>
        {lines.length > 2 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-amber-400/50 hover:text-amber-400 transition-colors"
          >
            {expanded ? '收起' : '展开全文'}
          </button>
        )}
      </div>
    </div>
  )
}
