import { useNewsFeed } from '../../../hooks/useNewsFeed'
import { HudPanel } from './HudPanel'
import type { NewsItem } from '../../../types/news'

function formatCrawlLabel(date: string | null, crawlTime: string | null) {
  if (!date) return 'WAITING SIGNAL'
  if (!crawlTime) return date
  return `${date} · ${crawlTime.replace('-', ':')}`
}

const PLATFORM_TINT = [
  'bg-[#e8f0ec] text-[#3d6b5a] border-[#c5d6cd]',
  'bg-[#f3e8e8] text-[#b06a6a] border-[#e0c8c8]',
  'bg-[#f3ecdf] text-[#b8894a] border-[#e0d4b8]',
  'bg-[#e9ecf2] text-[#5b6b8a] border-[#c8ced9]',
]

function NewsRow({ item, index }: { item: NewsItem; index: number }) {
  const tint = PLATFORM_TINT[index % PLATFORM_TINT.length]
  const content = (
    <>
      <span className="font-mono text-[10px] text-[#9aa0a6] w-6 shrink-0 tabular-nums">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span
        className={`shrink-0 px-1.5 py-0.5 text-[10px] font-medium tracking-wide border truncate max-w-[5.5rem] ${tint}`}
      >
        {item.platform || item.platformId}
      </span>
      <span className="flex-1 text-sm text-[#4a5560] truncate group-hover:text-[#2c3338] transition-colors">
        {item.title}
      </span>
      <span className="shrink-0 font-mono text-[10px] text-[#9aa0a6] tabular-nums">
        #{item.rank}
      </span>
    </>
  )

  const className =
    'group flex items-center gap-3 px-4 py-2.5 border-b border-[#eee8df] hover:bg-white/70 transition-colors'

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    )
  }

  return <div className={className}>{content}</div>
}

function MarqueeList({ items }: { items: NewsItem[] }) {
  const loop = [...items, ...items]
  const duration = Math.max(28, items.length * 1.6)

  return (
    <div className="relative h-[340px] overflow-hidden bg-white/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#fcf9f4] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#fcf9f4] to-transparent z-10" />
      <div
        className="animate-news-marquee"
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        {loop.map((item, i) => (
          <NewsRow key={`${item.id}-${i}`} item={item} index={i % items.length} />
        ))}
      </div>
    </div>
  )
}

/** 热点雷达 */
export function NewsRadar() {
  const { items, date, crawlTime, updatedAt, totalItems, loading, error, refresh } =
    useNewsFeed(36)

  return (
    <HudPanel className="animate-fade-up corner-forest">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#eee8df]">
        <div className="flex items-center gap-3 min-w-0">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-[#3d6b5a] animate-pulse-dot" />
          </span>
          <div className="min-w-0">
            <div className="font-display text-sm font-semibold tracking-[0.2em] text-[#3d6b5a] uppercase">
              Signal Feed
            </div>
            <div className="font-mono text-[11px] text-[#9aa0a6] truncate">
              {formatCrawlLabel(date, crawlTime)}
              {totalItems ? ` · ${totalItems} signals` : ''}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="shrink-0 font-mono text-[11px] tracking-wider text-[#3d6b5a] hover:text-[#2f5446] border border-[#c5d6cd] px-2.5 py-1 hover:bg-[#e8f0ec] transition-colors"
        >
          SYNC
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="h-[340px] flex flex-col justify-center gap-3 px-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-3 rounded bg-[#eee8df]" style={{ width: `${70 - i * 4}%` }} />
          ))}
        </div>
      ) : error && items.length === 0 ? (
        <div className="h-[340px] flex flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="font-display text-sm text-[#b06a6a] tracking-wider">LINK DOWN</div>
          <p className="text-xs text-[#9aa0a6] max-w-sm leading-relaxed">{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="mt-2 font-mono text-[11px] text-[#3d6b5a] border border-[#c5d6cd] px-3 py-1.5 hover:bg-[#e8f0ec]"
          >
            RETRY
          </button>
        </div>
      ) : (
        <MarqueeList items={items} />
      )}

      <div className="flex items-center justify-between px-4 py-2 border-t border-[#eee8df] font-mono text-[10px] text-[#9aa0a6]">
        <span>RADARDB / NEWS</span>
        <span>{updatedAt ? `UPD ${updatedAt}` : 'AUTO POLL 60s'}</span>
      </div>
    </HudPanel>
  )
}
