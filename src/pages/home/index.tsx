import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { QuickLinks } from './components/QuickLinks'
import { PomodoroTimer } from './components/PomodoroTimer'

/** 首页 */
export function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col">
      <Header />
      <HeroSection />
      <QuickLinks />

      <section className="w-full max-w-7xl mx-auto px-6 pb-12">
        <PomodoroTimer />
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
  )
}
