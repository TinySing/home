import { useClock } from '../../../hooks/useClock'
import { useGreeting } from '../../../hooks/useGreeting'

/** Hero 区域 - 问候语 + 实时时钟 */
export function HeroSection() {
  const time = useClock()
  const { greeting, dateStr } = useGreeting()

  return (
    <section className="relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-sky-500/5 to-transparent rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col items-center text-center">
          {/* 问候语 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
            {greeting}
            <span className="inline-block ml-3 animate-pulse">👋</span>
          </h1>

          {/* 日期 */}
          <p className="text-lg text-white/40 mb-8">{dateStr}</p>

          {/* 实时时钟 */}
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
            <div className="text-5xl sm:text-6xl font-mono font-light text-white tracking-widest">
              {time}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
