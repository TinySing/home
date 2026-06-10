const links = [
  {
    id: '1',
    title: 'TrendRadar',
    description: '趋势雷达',
    icon: '📡',
    url: '/radar',
    color: 'from-blue-500/20 to-cyan-700/20',
  },
  {
    id: '2',
    title: 'Console',
    description: '内容控制台',
    icon: '🖥️',
    url: '/console',
    color: 'from-emerald-500/20 to-teal-700/20',
  },
  {
    id: '3',
    title: 'History',
    description: '历史图谱',
    icon: '📜',
    url: '/history',
    color: 'from-amber-500/20 to-orange-700/20',
  },
]

/** 快捷入口 */
export function QuickLinks() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 pb-8">
      <div className="grid grid-cols-3 gap-4">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group p-4 rounded-2xl bg-gradient-to-br ${link.color} border border-white/[0.06] hover:border-white/[0.12] transition-all hover:scale-[1.02]`}
          >
            <div className="text-2xl mb-2">{link.icon}</div>
            <div className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
              {link.title}
            </div>
            <div className="text-xs text-white/30 mt-0.5">{link.description}</div>
          </a>
        ))}
      </div>
    </section>
  )
}
