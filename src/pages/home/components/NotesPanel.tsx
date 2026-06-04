import { useState, useEffect } from 'react'

interface Note {
  id: string
  content: string
  createdAt: string
  color: string
}

const STORAGE_KEY = 'home-notes'

const defaultNotes: Note[] = [
  { id: '1', content: '这是你的第一条备忘录 ✏️ 点击可以编辑', createdAt: new Date().toISOString(), color: 'sky' },
]

const colors = ['sky', 'amber', 'emerald', 'rose', 'violet']

function getNoteColor(color: string): string {
  const colorMap: Record<string, string> = {
    sky: 'border-l-sky-400 bg-sky-500/5',
    amber: 'border-l-amber-400 bg-amber-500/5',
    emerald: 'border-l-emerald-400 bg-emerald-500/5',
    rose: 'border-l-rose-400 bg-rose-500/5',
    violet: 'border-l-violet-400 bg-violet-500/5',
  }
  return colorMap[color] || colorMap.sky
}

function formatRelativeTime(timeStr: string): string {
  const diff = Date.now() - new Date(timeStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return new Date(timeStr).toLocaleDateString('zh-CN')
}

/** 备忘录面板 - localStorage 持久化 */
export function NotesPanel() {
  const [notes, setNotes] = useState<Note[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  // 从 localStorage 加载
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setNotes(JSON.parse(stored))
      } else {
        setNotes(defaultNotes)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNotes))
      }
    } catch {
      setNotes(defaultNotes)
    }
  }, [])

  // 保存到 localStorage
  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes))
  }

  // 添加新备忘录
  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      createdAt: new Date().toISOString(),
      color: colors[Math.floor(Math.random() * colors.length)],
    }
    const newNotes = [newNote, ...notes]
    saveNotes(newNotes)
    setEditingId(newNote.id)
    setEditContent('')
  }

  // 保存编辑
  const saveEdit = (id: string) => {
    if (!editContent.trim()) {
      // 空内容删除
      saveNotes(notes.filter((n) => n.id !== id))
    } else {
      saveNotes(notes.map((n) => (n.id === id ? { ...n, content: editContent } : n)))
    }
    setEditingId(null)
  }

  // 删除备忘录
  const deleteNote = (id: string) => {
    saveNotes(notes.filter((n) => n.id !== id))
  }

  return (
    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/70">备忘录</h3>
        <button
          onClick={addNote}
          className="text-xs text-white/20 hover:text-sky-400 transition-colors"
        >
          + 新建
        </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="text-center text-white/20 text-sm py-8">
            暂无备忘录，点击新建
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-lg border-l-2 ${getNoteColor(note.color)} group relative`}
            >
              {editingId === note.id ? (
                <div>
                  <textarea
                    autoFocus
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onBlur={() => saveEdit(note.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        saveEdit(note.id)
                      }
                    }}
                    className="w-full bg-transparent text-sm text-white/70 outline-none resize-none"
                    rows={2}
                    placeholder="输入备忘录内容..."
                  />
                </div>
              ) : (
                <div
                  onClick={() => {
                    setEditingId(note.id)
                    setEditContent(note.content)
                  }}
                  className="cursor-pointer"
                >
                  <p className="text-sm text-white/50 leading-relaxed mb-2">
                    {note.content || '点击编辑...'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white/20">
                      {formatRelativeTime(note.createdAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNote(note.id)
                      }}
                      className="text-[11px] text-white/10 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      删除
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
