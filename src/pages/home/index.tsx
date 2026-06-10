import { Suspense, lazy } from 'react'
import { HeroSection } from './components/HeroSection'
import { QuickLinks } from './components/QuickLinks'
import { PomodoroTimer } from './components/PomodoroTimer'
import { WeatherWidget } from './components/WeatherWidget'
import { QuoteWidget } from './components/QuoteWidget'
import { Game2048 } from './components/Game2048'
import { ParticleBackground } from './components/ParticleBackground'

const ThreeScene = lazy(() =>
  import('./components/ThreeScene').then((m) => ({ default: m.ThreeScene })),
)

/** 首页 */
export function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a1a] flex flex-col">
      <ParticleBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
      <HeroSection />
      <QuickLinks />

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
            <div className="min-w-0 min-h-[320px] p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 animate-pulse" />
          }
        >
          <ThreeScene />
        </Suspense>
      </section>

      <footer className="mt-auto border-t border-white/[0.04] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/40">
            © {new Date().getFullYear()} 我的主页
          </div>
          <div className="text-xs text-white/40">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
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
