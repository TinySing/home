import { useState, useEffect, useRef } from 'react'

type TimerMode = 'work' | 'break'
type TimerStatus = 'idle' | 'running' | 'paused'

const DURATIONS = {
  work: 25 * 60,
  break: 5 * 60,
}

/** 番茄钟 */
export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('work')
  const [status, setStatus] = useState<TimerStatus>('idle')
  const [seconds, setSeconds] = useState(DURATIONS.work)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const intervalRef = useRef<number | null>(null)

  const formatTime = (total: number) => {
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const progress = ((DURATIONS[mode] - seconds) / DURATIONS[mode]) * 100

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            if (mode === 'work') {
              setCompletedPomodoros((c) => c + 1)
              setMode('break')
              setSeconds(DURATIONS.break)
            } else {
              setMode('work')
              setSeconds(DURATIONS.work)
            }
            setStatus('idle')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [status, mode])

  const handleStart = () => setStatus('running')
  const handlePause = () => setStatus('paused')
  const handleReset = () => { setStatus('idle'); setSeconds(DURATIONS[mode]) }
  const handleSkip = () => {
    const next = mode === 'work' ? 'break' : 'work'
    setMode(next)
    setSeconds(DURATIONS[next])
    setStatus('idle')
  }

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-600/10 border border-rose-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍅</span>
          <span className="text-sm font-semibold text-white/70">番茄钟</span>
        </div>
        <span className="text-xs text-white/20">已完成 {completedPomodoros} 个</span>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode('work'); setSeconds(DURATIONS.work); setStatus('idle') }}
          className={`px-3 py-1 rounded-lg text-xs transition-all ${
            mode === 'work'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'bg-white/[0.04] text-white/30 border border-white/[0.06] hover:text-white/50'
          }`}
        >
          专注 25min
        </button>
        <button
          onClick={() => { setMode('break'); setSeconds(DURATIONS.break); setStatus('idle') }}
          className={`px-3 py-1 rounded-lg text-xs transition-all ${
            mode === 'break'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-white/[0.04] text-white/30 border border-white/[0.06] hover:text-white/50'
          }`}
        >
          休息 5min
        </button>
      </div>

      <div className="text-center mb-4">
        <div className="text-4xl font-mono font-light text-white tracking-wider mb-2">
          {formatTime(seconds)}
        </div>
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              mode === 'work' ? 'bg-rose-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        {status === 'idle' && (
          <button
            onClick={handleStart}
            className="px-5 py-2 rounded-xl bg-white/[0.08] border border-white/[0.1] text-sm text-white/70 hover:bg-white/[0.12] hover:text-white transition-all"
          >
            ▶ 开始
          </button>
        )}
        {status === 'running' && (
          <button
            onClick={handlePause}
            className="px-5 py-2 rounded-xl bg-white/[0.08] border border-white/[0.1] text-sm text-white/70 hover:bg-white/[0.12] hover:text-white transition-all"
          >
            ⏸ 暂停
          </button>
        )}
        {status === 'paused' && (
          <>
            <button
              onClick={handleStart}
              className="px-5 py-2 rounded-xl bg-white/[0.08] border border-white/[0.1] text-sm text-white/70 hover:bg-white/[0.12] hover:text-white transition-all"
            >
              ▶ 继续
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-white/40 hover:text-white/60 transition-all"
            >
              ↺ 重置
            </button>
          </>
        )}
        {status !== 'idle' && (
          <button
            onClick={handleSkip}
            className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-white/40 hover:text-white/60 transition-all"
          >
            ⏭ 跳过
          </button>
        )}
      </div>
    </div>
  )
}
