/** 快捷入口卡片 */
export interface QuickLink {
  id: string
  title: string
  description: string
  icon: string
  url: string
  color: string
}

/** 书签项 */
export interface Bookmark {
  id: string
  name: string
  url: string
  icon: string
  category: string
}
