const links = [
  {
    id: '1',
    title: 'GitHub',
    description: '代码仓库',
    icon: '🐙',
    url: 'https://github.com',
    color: 'from-gray-500/20 to-gray-700/20',
  },
  {
    id: '2',
    title: 'ChatGPT',
    description: 'AI 助手',
    icon: '🤖',
    url: 'https://chat.openai.com',
    color: 'from-emerald-500/20 to-teal-700/20',
  },
  {
    id: '3',
    title: 'Notion',
    description: '知识管理',
    icon: '📝',
    url: 'https://notion.so',
    color: 'from-gray-400/20 to-gray-600/20',
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
