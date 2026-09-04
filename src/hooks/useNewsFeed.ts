import { useCallback, useEffect, useRef, useState } from 'react'
import type { NewsItem, NewsResponse } from '../types/news'

const POLL_MS = 60_000

interface UseNewsFeedResult {
  items: NewsItem[]
  date: string | null
  crawlTime: string | null
  updatedAt: string | null
  totalItems: number
  loading: boolean
  error: string | null
  refresh: () => void
}

/** 轮询最新热点新闻 */
export function useNewsFeed(limit = 36): UseNewsFeedResult {
  const [data, setData] = useState<NewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const abortRef = useRef<AbortController | null>(null)

  const refresh = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const load = async () => {
      try {
        const res = await fetch(`/api/news?limit=${limit}`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.message || `HTTP ${res.status}`)
        }
        const json = (await res.json()) as NewsResponse
        if (!controller.signal.aborted) {
          setData(json)
          setError(null)
        }
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [limit, tick])

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), POLL_MS)
    return () => clearInterval(id)
  }, [])

  return {
    items: data?.items ?? [],
    date: data?.date ?? null,
    crawlTime: data?.crawlTime ?? null,
    updatedAt: data?.updatedAt ?? null,
    totalItems: data?.totalItems ?? 0,
    loading,
    error,
    refresh,
  }
}
