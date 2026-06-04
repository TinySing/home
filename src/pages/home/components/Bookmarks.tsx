import type { Bookmark } from '../../../types'

interface BookmarksProps {
  bookmarks: Bookmark[]
}

/** 书签/收藏夹 */
export function Bookmarks({ bookmarks }: BookmarksProps) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/70">常用书签</h3>
        <button className="text-xs text-white/20 hover:text-sky-400 transition-colors">
          编辑
        </button>
      </div>

      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <a
            key={bookmark.id}
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group"
          >
            <span className="text-lg">{bookmark.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors truncate">
                {bookmark.name}
              </div>
            </div>
            <span className="flex-shrink-0 text-[10px] text-white/15 px-1.5 py-0.5 rounded bg-white/[0.03]">
              {bookmark.category}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
