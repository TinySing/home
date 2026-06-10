import { useState, useEffect } from 'react'

interface Quote {
  text: string
  from: string
}

const FALLBACK: Quote[] = [
  { text: '岁月不待人，时节不饶人。', from: '陶渊明' },
  { text: '路漫漫其修远兮，吾将上下而求索。', from: '屈原' },
  { text: '纸上得来终觉浅，绝知此事要躬行。', from: '陆游' },
  { text: '不积跬步，无以至千里。', from: '荀子' },
  { text: '业精于勤，荒于嬉。', from: '韩愈' },
  { text: '海内存知己，天涯若比邻。', from: '王勃' },
]

/** 每日一言 - hitokoto 免费 API，失败回退本地句库 */
export function QuoteWidget() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [nonce, setNonce] = useState(0)

  const refresh = () => {
    setLoading(true)
    setNonce((n) => n + 1)
  }

  useEffect(() => {
    let active = true
    const fetchQuote = async () => {
      try {
        const res = await fetch('https://v1.hitokoto.cn/?encode=json')
        if (!res.ok) throw new Error('fetch failed')
        const data = await res.json()
        if (active) setQuote({ text: data.hitokoto, from: data.from || '佚名' })
      } catch {
        if (active) setQuote(FALLBACK[Math.floor(Math.random() * FALLBACK.length)])
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchQuote()
    return () => {
      active = false
    }
  }, [nonce])

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-500/20 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">💭</span>
          <span className="text-sm font-semibold text-white/70">每日一言</span>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="text-xs text-white/30 hover:text-white/60 transition-colors disabled:opacity-40"
        >
          ↻ 换一条
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col justify-center gap-2 animate-pulse">
          <div className="h-4 bg-white/[0.05] rounded w-full" />
          <div className="h-4 bg-white/[0.05] rounded w-2/3" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-base leading-relaxed text-white/80">“{quote?.text}”</p>
          <p className="text-xs text-white/30 mt-3 text-right">—— {quote?.from}</p>
        </div>
      )}
    </div>
  )
}
