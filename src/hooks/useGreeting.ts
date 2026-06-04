import { useState, useEffect } from 'react'
import { getGreeting, formatDate } from '../utils/format'

/** 日期问候 hook */
export function useGreeting() {
  const [greeting, setGreeting] = useState(() => getGreeting())
  const [dateStr, setDateStr] = useState(() => formatDate(new Date()))

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getGreeting())
      setDateStr(formatDate(new Date()))
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  return { greeting, dateStr }
}
