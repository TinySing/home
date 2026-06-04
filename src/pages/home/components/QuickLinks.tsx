import type { QuickLink } from '../../../types'

interface QuickLinksProps {
  links: QuickLink[]
}

/** 快捷入口网格 */
export function QuickLinks({ links }: QuickLinksProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">快捷入口</h2>
        <button className="text-sm text-white/30 hover:text-sky-400 transition-colors">
          管理 →
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
          >
            {/* 图标 */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
              {link.icon}
            </div>

            {/* 文字 */}
            <div className="text-center">
              <div className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                {link.title}
              </div>
              <div className="text-xs text-white/25 mt-0.5">
                {link.description}
              </div>
            </div>

            {/* hover 发光效果 */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          </a>
        ))}
      </div>
    </section>
  )
}
