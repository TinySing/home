import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { QuickLinks } from './components/QuickLinks'
import { WeatherWidget } from './components/WeatherWidget'
import { Bookmarks } from './components/Bookmarks'
import { NotesPanel } from './components/NotesPanel'
import { HitokotoWidget } from './components/HitokotoWidget'
import { PoemWidget } from './components/PoemWidget'
import { PomodoroTimer } from './components/PomodoroTimer'
import { quickLinks, bookmarks } from '../../utils/mock-data'

/** 首页 */
export function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* 顶部导航 */}
      <Header />

      {/* Hero 区域 */}
      <HeroSection />

      {/* 快捷入口 */}
      <QuickLinks links={quickLinks} />

      {/* 中间区域 - 有趣小玩意 + 侧边栏 */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：有趣小玩意 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 一言 + 诗词 并排 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HitokotoWidget />
              <PoemWidget />
            </div>

            {/* 番茄钟 */}
            <PomodoroTimer />
          </div>

          {/* 右侧：天气 + 书签 + 备忘录 */}
          <div className="space-y-6">
            <WeatherWidget />
            <Bookmarks bookmarks={bookmarks} />
            <NotesPanel />
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/20">
            © 2024 Home Dashboard. Built with React + TypeScript + Tailwind CSS
          </div>
          <div className="flex items-center gap-4 text-xs text-white/15">
            <span>v0.2.0</span>
            <span>•</span>
            <span>Powered by Vite</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
