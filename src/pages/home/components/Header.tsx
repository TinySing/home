/** 顶部导航 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a1a]/80 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
              <path d="M10 2L2 9.5h2V18h5v-5h2v5h5V9.5h2L10 2z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">我的主页</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-white/30">
          <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] font-mono">
            {new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}
          </span>
        </div>
      </div>
    </header>
  )
}
