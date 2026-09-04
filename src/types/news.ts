export interface NewsItem {
  id: number
  title: string
  platformId: string
  platform: string
  rank: number
  url: string
  firstCrawlTime: string
  lastCrawlTime: string
  crawlCount: number
  updatedAt: string
}

export interface NewsResponse {
  date: string
  crawlTime: string | null
  totalItems: number
  updatedAt: string | null
  path: string
  fileName: string
  items: NewsItem[]
}
