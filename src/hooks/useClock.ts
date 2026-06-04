import { useState, useEffect } from 'react'
import { formatTime } from '../utils/format'

/** 实时时钟 hook */
export function useClock() {
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTime(new Date()))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return time
}
