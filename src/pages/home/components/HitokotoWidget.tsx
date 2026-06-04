import { useState, useEffect } from 'react'

interface HitokotoData {
  content: string
  source: string
  author: string | null
  type: string
}

const typeLabels: Record<string, string> = {
  anime: '动漫',
  game: '游戏',
  literature: '文学',
  original: '原创',
  internet: '网络',
  other: '其他',
  'video': '影视',
  poetry: '诗词',
  philosophy: '哲学',
  fun: '搞笑',
}

/** 一言组件 */
export function HitokotoWidget() {
  const [hitokoto, setHitokoto] = useState<HitokotoData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchHitokoto = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/hitokoto')
      const data = await res.json()
      setHitokoto(data)
    } catch {
      setHitokoto({
        content: '世界上最宽阔的是海洋，比海洋更宽阔的是天空，比天空更宽阔的是人的心灵。',
        source: '悲惨世界',
        author: '雨果',
        type: 'literature',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHitokoto()
  }, [])

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <span className="text-sm font-semibold text-white/70">一言</span>
        </div>
        <button
          onClick={fetchHitokoto}
          disabled={loading}
          className="text-xs text-white/20 hover:text-violet-400 transition-colors disabled:opacity-50"
        >
          {loading ? '...' : '换一句 →'}
        </button>
      </div>

      {hitokoto && (
        <div>
          <p className="text-sm text-white/60 leading-relaxed mb-3 italic">
            「{hitokoto.content}」
          </p>
          <div className="flex items-center justify-between text-xs text-white/25">
            <span>
              {hitokoto.author ? `${hitokoto.author} · ` : ''}{hitokoto.source}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/[0.05] text-white/20">
              {typeLabels[hitokoto.type] || hitokoto.type}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
