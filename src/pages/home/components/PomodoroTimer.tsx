import { useState, useEffect, useRef } from 'react'
import { HudPanel } from './HudPanel'

type TimerMode = 'work' | 'break'
type TimerStatus = 'idle' | 'running' | 'paused'

const DURATIONS = {
  work: 25 * 60,
  break: 5 * 60,
}

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
  const handleReset = () => {
    setStatus('idle')
    setSeconds(DURATIONS[mode])
  }
  const handleSkip = () => {
    const next = mode === 'work' ? 'break' : 'work'
    setMode(next)
    setSeconds(DURATIONS[next])
    setStatus('idle')
  }

  const btnBase =
    'font-mono text-[11px] tracking-wider px-3 py-1.5 border transition-colors'

  return (
    <HudPanel className="p-5 corner-rose">
      <div className="flex items-center justify-between mb-4">
        <div className="font-display text-sm font-semibold tracking-[0.18em] text-[#b06a6a] uppercase">
          Focus Timer
        </div>
        <span className="font-mono text-[11px] text-[#9aa0a6]">
          DONE {completedPomodoros}
        </span>
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => {
            setMode('work')
            setSeconds(DURATIONS.work)
            setStatus('idle')
          }}
          className={`${btnBase} ${
            mode === 'work'
              ? 'bg-[#f3e8e8] text-[#b06a6a] border-[#e0c8c8]'
              : 'bg-transparent text-[#9aa0a6] border-[#ddd6cc] hover:text-[#4a5560]'
          }`}
        >
          WORK 25
        </button>
        <button
          onClick={() => {
            setMode('break')
            setSeconds(DURATIONS.break)
            setStatus('idle')
          }}
          className={`${btnBase} ${
            mode === 'break'
              ? 'bg-[#e8f0ec] text-[#3d6b5a] border-[#c5d6cd]'
              : 'bg-transparent text-[#9aa0a6] border-[#ddd6cc] hover:text-[#4a5560]'
          }`}
        >
          BREAK 5
        </button>
      </div>

      <div className="text-center mb-4">
        <div className="font-display text-5xl font-medium text-[#2c3338] tracking-widest tabular-nums mb-3">
          {formatTime(seconds)}
        </div>
        <div className="w-full h-1 bg-[#eee8df] overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              mode === 'work' ? 'bg-[#b06a6a]' : 'bg-[#3d6b5a]'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        {status === 'idle' && (
          <button
            onClick={handleStart}
            className={`${btnBase} bg-[#f3e8e8] text-[#b06a6a] border-[#e0c8c8] hover:bg-[#eadada] px-5`}
          >
            START
          </button>
        )}
        {status === 'running' && (
          <button
            onClick={handlePause}
            className={`${btnBase} bg-[#f3e8e8] text-[#b06a6a] border-[#e0c8c8] hover:bg-[#eadada] px-5`}
          >
            PAUSE
          </button>
        )}
        {status === 'paused' && (
          <>
            <button
              onClick={handleStart}
              className={`${btnBase} bg-[#f3e8e8] text-[#b06a6a] border-[#e0c8c8] hover:bg-[#eadada] px-5`}
            >
              RESUME
            </button>
            <button
              onClick={handleReset}
              className={`${btnBase} text-[#9aa0a6] border-[#ddd6cc] hover:text-[#4a5560]`}
            >
              RESET
            </button>
          </>
        )}
        {status !== 'idle' && (
          <button
            onClick={handleSkip}
            className={`${btnBase} text-[#9aa0a6] border-[#ddd6cc] hover:text-[#4a5560]`}
          >
            SKIP
          </button>
        )}
      </div>
    </HudPanel>
  )
}
