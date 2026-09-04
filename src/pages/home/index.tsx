import { Suspense, lazy } from 'react'
import { HeroSection } from './components/HeroSection'
import { QuickLinks } from './components/QuickLinks'
import { PomodoroTimer } from './components/PomodoroTimer'
import { WeatherWidget } from './components/WeatherWidget'
import { QuoteWidget } from './components/QuoteWidget'
import { Game2048 } from './components/Game2048'
import { ParticleBackground } from './components/ParticleBackground'
import { NewsRadar } from './components/NewsRadar'

const ThreeScene = lazy(() =>
  import('./components/ThreeScene').then((m) => ({ default: m.ThreeScene })),
)

/** 首页 — 柔和多色设计 */
export function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#e6edf2]">
      <ParticleBackground />
      <div className="fixed inset-0 grid-atmosphere pointer-events-none z-[1]" aria-hidden="true" />

      {/* 装饰色块：增加画面层次 */}
      <div
        className="fixed top-24 -left-20 w-72 h-72 rounded-full bg-[#b06a6a]/10 blur-3xl pointer-events-none z-[1] animate-drift"
        aria-hidden="true"
      />
      <div
        className="fixed top-1/3 -right-16 w-80 h-80 rounded-full bg-[#3d6b5a]/10 blur-3xl pointer-events-none z-[1] animate-drift"
        style={{ animationDelay: '3s' }}
        aria-hidden="true"
      />
      <div
        className="fixed bottom-20 left-1/3 w-64 h-64 rounded-full bg-[#b8894a]/10 blur-3xl pointer-events-none z-[1] animate-drift"
        style={{ animationDelay: '6s' }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <HeroSection />
        <QuickLinks />

        <section className="w-full max-w-7xl mx-auto px-6 pb-6">
          <NewsRadar />
        </section>

        <section className="w-full max-w-7xl mx-auto px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <WeatherWidget />
          <QuoteWidget />
        </section>

        <section className="w-full max-w-7xl mx-auto px-6 pb-6">
          <PomodoroTimer />
        </section>

        <section className="w-full max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <Game2048 />
          <Suspense
            fallback={
              <div className="min-w-0 min-h-[320px] hud-panel corner-indigo animate-pulse" />
            }
          >
            <ThreeScene />
          </Suspense>
        </section>

        <footer className="mt-auto border-t border-[#d9d2c8] py-8 bg-white/40">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-mono text-xs text-[#9aa0a6] tracking-wider">
              © {new Date().getFullYear()} COMMAND DECK
            </div>
            <div className="text-xs text-[#9aa0a6]">
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#3d6b5a] transition-colors font-mono"
              >
                京ICP备2026031601号
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
