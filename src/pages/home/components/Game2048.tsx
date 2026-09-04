import { useState, useEffect, useCallback } from 'react'

type Board = number[][]
type Dir = 'up' | 'down' | 'left' | 'right'

const SIZE = 4
const BEST_KEY = 'game2048_best'

const TILE_STYLE: Record<number, string> = {
  0: 'bg-[#f0ebe3] text-transparent',
  2: 'bg-[#e8f0ec] text-[#3d6b5a]',
  4: 'bg-[#dce8e2] text-[#2f5446]',
  8: 'bg-[#f3ecdf] text-[#b8894a]',
  16: 'bg-[#eadfc8] text-[#8a6a35]',
  32: 'bg-[#f3e8e8] text-[#b06a6a]',
  64: 'bg-[#e8d4d4] text-[#8f5252]',
  128: 'bg-[#e9ecf2] text-[#5b6b8a]',
  256: 'bg-[#d5dae6] text-[#3f4d6a]',
  512: 'bg-[#c5d6cd] text-[#2f5446]',
  1024: 'bg-[#3d6b5a] text-white',
  2048: 'bg-[#b06a6a] text-white',
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
    <div className="hud-panel corner-indigo p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="font-display text-sm font-semibold tracking-[0.18em] text-[#5b6b8a] uppercase">
          Grid 2048
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 border border-[#ddd6cc] text-[#9aa0a6]">
            SCR <span className="text-[#3d6b5a]">{score}</span>
          </span>
          <span className="px-2.5 py-1 border border-[#ddd6cc] text-[#9aa0a6]">
            BEST <span className="text-[#b8894a]">{best}</span>
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-4 gap-2 p-2 bg-[#f0ebe3]/70 border border-[#eee8df]">
          {board.flat().map((v, i) => (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center font-mono font-bold transition-colors ${
                TILE_STYLE[v] ?? 'bg-[#3d6b5a] text-white'
              } ${v >= 1024 ? 'text-base' : 'text-xl'}`}
            >
              {v || ''}
            </div>
          ))}
        </div>

        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fcf9f4]/90 backdrop-blur-sm gap-3">
            <div className="text-sm text-[#8a8178] font-mono">MERGE TO 2048</div>
            <button
              onClick={start}
              className="px-6 py-2.5 font-mono text-xs tracking-wider bg-[#e8f0ec] border border-[#c5d6cd] text-[#3d6b5a] hover:bg-[#dce8e2] transition-all"
            >
              START
            </button>
          </div>
        )}

        {started && (over || won) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fcf9f4]/90 backdrop-blur-sm gap-3">
            <div className="font-display text-xl font-semibold text-[#2c3338]">
              {won && !over ? 'CLEAR 2048' : 'GAME OVER'}
            </div>
            <button
              onClick={start}
              className="px-5 py-2 font-mono text-xs tracking-wider bg-[#f3e8e8] border border-[#e0c8c8] text-[#b06a6a] hover:bg-[#eadada] transition-all"
            >
              RETRY
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-[#9aa0a6] hidden sm:block font-mono">ARROWS TO MOVE</span>
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
          className="px-3 py-1.5 font-mono text-[11px] tracking-wider border border-[#ddd6cc] text-[#9aa0a6] hover:text-[#3d6b5a] transition-all"
        >
          RESET
        </button>
      </div>
    </div>
  )
}

function DirBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 bg-[#f0ebe3] border border-[#ddd6cc] text-[#4a5560] hover:bg-[#eee8df] transition-all flex items-center justify-center"
    >
      {label}
    </button>
  )
}
