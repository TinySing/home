/** 顶部导航栏 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a1a]/80 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            H
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">Home</span>
        </div>

        {/* 右侧 - 当前时间小标签 */}
        <div className="flex items-center gap-3 text-sm text-white/30">
          <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] font-mono">
            {new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })}
          </span>
        </div>
      </div>
    </header>
  )
}
