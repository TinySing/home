import { useRef, useEffect } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

interface Star {
  x: number
  y: number
  r: number
  base: number // 基础亮度
  phase: number // 闪烁相位
  speed: number // 闪烁速度
}

const COUNT = 60
const LINK_DIST = 130
const MOUSE_DIST = 160
const FRAME_MS = 1000 / 30 // 环境背景，30fps 足够，省一半绘制

/** 粒子星空背景 - 纯 canvas，鼠标交互连线，无依赖 */
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 用户关闭动效则不跑动画，只绘制一帧静态
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const particles: Particle[] = []
    const stars: Star[] = []
    const mouse = { x: -9999, y: -9999 }
    let raf = 0
    let last = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const seed = () => {
      particles.length = 0
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
        })
      }
      // 静态闪烁星点，数量随屏幕面积，O(n) 绘制几乎无成本
      stars.length = 0
      const starCount = Math.min(260, Math.max(90, Math.round((width * height) / 7000)))
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.1 + 0.3,
          base: Math.random() * 0.5 + 0.25,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.002 + 0.0008,
        })
      }
    }

    const draw = (now = 0) => {
      if (!reduced) raf = requestAnimationFrame(draw)
      if (now - last < FRAME_MS) return // 30fps 节流
      last = now

      ctx.clearRect(0, 0, width, height)

      // 闪烁星点
      for (const s of stars) {
        const alpha = s.base + Math.sin(now * s.speed + s.phase) * 0.35
        if (alpha <= 0) continue
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(226, 232, 240, ${alpha})`
        ctx.fill()
      }

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // 鼠标轻推
        const mdx = p.x - mouse.x
        const mdy = p.y - mouse.y
        const md = Math.hypot(mdx, mdy)
        if (md < MOUSE_DIST) {
          const force = (MOUSE_DIST - md) / MOUSE_DIST
          p.x += (mdx / md) * force * 1.2
          p.y += (mdy / md) * force * 1.2
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.9, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(125, 211, 252, 0.85)'
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < LINK_DIST) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(120, 175, 255, ${0.32 * (1 - d / LINK_DIST)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    // 标签页隐藏时停循环，省 CPU/电
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
        raf = 0
      } else if (!reduced && raf === 0) {
        raf = requestAnimationFrame(draw)
      }
    }

    resize()
    seed()
    if (reduced) draw()
    else raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none"
      aria-hidden="true"
    />
  )
}
