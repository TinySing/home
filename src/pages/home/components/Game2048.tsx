import { useState, useEffect, useCallback } from 'react'

type Board = number[][]
type Dir = 'up' | 'down' | 'left' | 'right'

const SIZE = 4
const BEST_KEY = 'game2048_best'

const TILE_STYLE: Record<number, string> = {
  0: 'bg-white/[0.03] text-transparent',
  2: 'bg-slate-500/20 text-white/80',
  4: 'bg-slate-400/25 text-white/90',
  8: 'bg-amber-500/30 text-amber-100',
  16: 'bg-amber-500/40 text-amber-100',
  32: 'bg-orange-500/40 text-orange-100',
  64: 'bg-orange-500/55 text-orange-100',
  128: 'bg-rose-500/40 text-rose-100',
  256: 'bg-rose-500/55 text-rose-100',
  512: 'bg-fuchsia-500/50 text-fuchsia-100',
  1024: 'bg-violet-500/55 text-violet-100',
  2048: 'bg-sky-500/60 text-sky-50',
}

function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
}

function addRandom(board: Board): Board {
  const empty: [number, number][] = []
  board.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v === 0) empty.push([r, c])
    }),
  )
  if (empty.length === 0) return board
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  const next = board.map((row) => [...row])
  next[r][c] = Math.random() < 0.9 ? 2 : 4
  return next
}

function initBoard(): Board {
  return addRandom(addRandom(emptyBoard()))
}

/** 压缩并合并一行（向左），返回新行与得分增量 */
function collapse(row: number[]): { row: number[]; gained: number } {
  const nums = row.filter((v) => v !== 0)
  let gained = 0
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1]) {
      nums[i] *= 2
      gained += nums[i]
      nums.splice(i + 1, 1)
    }
  }
  while (nums.length < SIZE) nums.push(0)
  return { row: nums, gained }
}

function rotate(board: Board): Board {
  const next = emptyBoard()
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) next[c][SIZE - 1 - r] = board[r][c]
  return next
}

function move(board: Board, dir: Dir): { board: Board; gained: number; moved: boolean } {
  let work = board.map((row) => [...row])
  const rotations = { left: 0, up: 3, right: 2, down: 1 }[dir]
  for (let i = 0; i < rotations; i++) work = rotate(work)

  let gained = 0
  const collapsed = work.map((row) => {
    const res = collapse(row)
    gained += res.gained
    return res.row
  })

  let result = collapsed
  for (let i = 0; i < (4 - rotations) % 4; i++) result = rotate(result)

  const moved = JSON.stringify(result) !== JSON.stringify(board)
  return { board: result, gained, moved }
}

function hasMoves(board: Board): boolean {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return true
      if (c < SIZE - 1 && board[r][c] === board[r][c + 1]) return true
      if (r < SIZE - 1 && board[r][c] === board[r + 1][c]) return true
    }
  return false
}

/** 2048 小游戏 - 方向键或按钮操作 */
export function Game2048() {
  const [board, setBoard] = useState<Board>(emptyBoard)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => Number(localStorage.getItem(BEST_KEY)) || 0)
  const [over, setOver] = useState(false)
  const [won, setWon] = useState(false)
  const [started, setStarted] = useState(false)

  const start = useCallback(() => {
    setBoard(initBoard())
    setScore(0)
    setOver(false)
    setWon(false)
    setStarted(true)
  }, [])

  const handleMove = useCallback(
    (dir: Dir) => {
      if (!started || over) return
      setBoard((prev) => {
        const { board: next, gained, moved } = move(prev, dir)
        if (!moved) return prev
        const withTile = addRandom(next)
        setScore((s) => {
          const total = s + gained
          setBest((b) => {
            const nb = Math.max(b, total)
            localStorage.setItem(BEST_KEY, String(nb))
            return nb
          })
          return total
        })
        if (!won && withTile.some((row) => row.includes(2048))) setWon(true)
        if (!hasMoves(withTile)) setOver(true)
        return withTile
      })
    },
    [started, over, won],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      }
      const dir = map[e.key]
      if (!dir) return
      e.preventDefault()
      handleMove(dir)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleMove])

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-600/10 border border-indigo-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎮</span>
          <span className="text-sm font-semibold text-white/70">2048</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50">
            分数 <span className="font-mono text-white/80">{score}</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50">
            最高 <span className="font-mono text-white/80">{best}</span>
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-4 gap-2 p-2 rounded-xl bg-white/[0.02]">
          {board.flat().map((v, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center font-mono font-bold transition-colors ${
                TILE_STYLE[v] ?? 'bg-sky-500/60 text-sky-50'
              } ${v >= 1024 ? 'text-base' : 'text-xl'}`}
            >
              {v || ''}
            </div>
          ))}
        </div>

        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-[#0a0a1a]/80 backdrop-blur-sm gap-3">
            <div className="text-sm text-white/50">合并方块,凑出 2048</div>
            <button
              onClick={start}
              className="px-6 py-2.5 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-sm font-semibold text-white hover:bg-indigo-500/45 transition-all"
            >
              ▶ 开始游戏
            </button>
          </div>
        )}

        {started && (over || won) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-[#0a0a1a]/80 backdrop-blur-sm gap-3">
            <div className="text-2xl font-bold text-white">
              {won && !over ? '🎉 达成 2048!' : '游戏结束'}
            </div>
            <button
              onClick={start}
              className="px-5 py-2 rounded-xl bg-white/[0.1] border border-white/[0.15] text-sm text-white hover:bg-white/[0.18] transition-all"
            >
              再来一局
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-white/25 hidden sm:block">方向键 ← ↑ → ↓ 操作</span>
        <div className="grid grid-cols-3 gap-1.5 sm:hidden">
          <span />
          <DirBtn label="↑" onClick={() => handleMove('up')} />
          <span />
          <DirBtn label="←" onClick={() => handleMove('left')} />
          <DirBtn label="↓" onClick={() => handleMove('down')} />
          <DirBtn label="→" onClick={() => handleMove('right')} />
        </div>
        <button
          onClick={start}
          className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/40 hover:text-white/60 transition-all"
        >
          ↺ 重开
        </button>
      </div>
    </div>
  )
}

function DirBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 hover:bg-white/[0.12] transition-all flex items-center justify-center"
    >
      {label}
    </button>
  )
}
