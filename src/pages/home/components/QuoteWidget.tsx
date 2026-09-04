import { useState, useEffect } from 'react'
import { HudPanel } from './HudPanel'

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
    <HudPanel className="p-5 h-full flex flex-col corner-rose">
      <div className="flex items-center justify-between mb-4">
        <div className="font-display text-sm font-semibold tracking-[0.18em] text-[#b06a6a] uppercase">
          Pulse Quote
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="font-mono text-[11px] text-[#9aa0a6] hover:text-[#b06a6a] transition-colors disabled:opacity-40"
        >
          NEXT
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col justify-center gap-2 animate-pulse">
          <div className="h-4 bg-[#eee8df] rounded w-full" />
          <div className="h-4 bg-[#eee8df] rounded w-2/3" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-base leading-relaxed text-[#4a5560]">
            “{quote?.text}”
          </p>
          <p className="font-mono text-[11px] text-[#9aa0a6] mt-4 text-right">
            — {quote?.from}
          </p>
        </div>
      )}
    </HudPanel>
  )
}
