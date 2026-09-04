import { useClock } from '../../../hooks/useClock'
import { useGreeting } from '../../../hooks/useGreeting'

/** Hero：柔和多色问候 */
export function HeroSection() {
  const time = useClock()
  const { greeting, dateStr } = useGreeting()
  const [hh, mm, ss] = time.split(':')

  return (
    <section className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div className="animate-fade-up max-w-xl">
            <div className="inline-flex items-center gap-2 mb-5 font-mono text-[11px] tracking-[0.28em] text-[#3d6b5a] uppercase">
              <span className="h-px w-8 bg-[#b06a6a]/50" />
              Command Deck
              <span className="h-1.5 w-1.5 rounded-full bg-[#5a8f6b] animate-pulse-dot" />
              Online
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight leading-[1.15] bg-gradient-to-r from-[#2c3338] via-[#3d6b5a] to-[#b06a6a] bg-clip-text text-transparent">
              {greeting}
            </h1>
            <p className="mt-4 text-[#6b7280] text-sm sm:text-base tracking-wide">
              {dateStr}
            </p>
            <p className="mt-3 text-xs text-[#9aa0a6] font-mono tracking-wider">
              PERSONAL OPS // SIGNAL MONITOR
            </p>
          </div>

          <div
            className="animate-fade-up hud-panel corner-amber px-6 sm:px-8 py-5 self-start lg:self-auto"
            style={{ animationDelay: '120ms' }}
          >
            <div className="font-mono text-[10px] tracking-[0.3em] text-[#b8894a] mb-3 uppercase">
              System Clock
            </div>
            <div className="font-display flex items-baseline gap-1 text-5xl sm:text-6xl font-medium text-[#2c3338] tracking-widest tabular-nums">
              <span>{hh}</span>
              <span className="text-[#b06a6a] animate-pulse">:</span>
              <span>{mm}</span>
              <span className="text-[#3d6b5a]/70 text-3xl sm:text-4xl ml-1">:{ss}</span>
            </div>
            <div className="mt-3 h-px w-full bg-gradient-to-r from-[#b06a6a]/30 via-[#b8894a]/40 to-[#3d6b5a]/30" />
            <div className="mt-2 flex justify-between font-mono text-[10px] text-[#9aa0a6]">
              <span>UTC+8</span>
              <span className="text-[#5a8f6b]">SYNC OK</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
