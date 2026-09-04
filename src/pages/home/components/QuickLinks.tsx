const links = [
  {
    id: '1',
    title: 'TrendRadar',
    description: '趋势雷达',
    url: '/radar',
    tag: 'RADAR',
    corner: 'corner-forest',
    tagClass: 'text-[#3d6b5a]',
    titleClass: 'text-[#3d6b5a] group-hover:text-[#2f5446]',
    bar: 'bg-[#3d6b5a]',
  },
  {
    id: '2',
    title: 'Console',
    description: '公众号推送控制台',
    url: '/console',
    tag: 'OPS',
    corner: 'corner-rose',
    tagClass: 'text-[#b06a6a]',
    titleClass: 'text-[#b06a6a] group-hover:text-[#965656]',
    bar: 'bg-[#b06a6a]',
  },
  {
    id: '3',
    title: 'History',
    description: '历史图谱',
    url: '/history',
    tag: 'MAP',
    corner: 'corner-amber',
    tagClass: 'text-[#b8894a]',
    titleClass: 'text-[#b8894a] group-hover:text-[#9a723c]',
    bar: 'bg-[#b8894a]',
  },
  {
    id: '4',
    title: '听悟 API',
    description: '转写管理台',
    url: 'https://tinybits.cc/tingwu/',
    tag: 'TOOL',
    corner: 'corner-indigo',
    tagClass: 'text-[#5b6b8a]',
    titleClass: 'text-[#5b6b8a] group-hover:text-[#475574]',
    bar: 'bg-[#5b6b8a]',
  },
]

/** 快捷入口 — 四色分区 */
export function QuickLinks() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 pb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {links.map((link, i) => {
          const external = /^https?:\/\//.test(link.url)
          return (
            <a
              key={link.id}
              href={link.url}
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className={`group hud-panel ${link.corner} p-4 transition-all hover:-translate-y-0.5 animate-fade-up overflow-hidden`}
              style={{ animationDelay: `${80 + i * 60}ms` }}
            >
              <div className={`absolute left-0 top-3 bottom-3 w-[3px] ${link.bar} opacity-70`} />
              <div className="flex items-center justify-between mb-3 pl-1">
                <span className={`font-mono text-[10px] tracking-[0.2em] ${link.tagClass}`}>
                  {link.tag}
                </span>
                <span className="text-[#c4bbb0] group-hover:text-[#8a8178] transition-colors text-xs">
                  ↗
                </span>
              </div>
              <div
                className={`font-display text-base font-semibold pl-1 transition-colors ${link.titleClass}`}
              >
                {link.title}
              </div>
              <div className="text-xs text-[#8a8178] mt-1 pl-1">{link.description}</div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
