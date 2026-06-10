import { useClock } from '../../../hooks/useClock'
import { useGreeting } from '../../../hooks/useGreeting'

/** Hero 区域 - 问候 + 实时时钟 */
export function HeroSection() {
  const time = useClock()
  const { greeting, dateStr } = useGreeting()

  return (
    <section className="relative">
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
            {greeting}
            <span className="inline-block ml-3">👋</span>
          </h1>
          <p className="text-lg text-white/40 mb-8">{dateStr}</p>
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
