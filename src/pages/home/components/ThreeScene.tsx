import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

const FRAME_MS = 1000 / 30 // 30fps，慢速旋转足够，软件渲染设备也省一半

// 点击循环的配色：[线框, 内核, 顶点, 星点]
const PALETTES = [
  [0x60a5fa, 0x38bdf8, 0x7dd3fc, 0xa78bfa],
  [0xf472b6, 0xfb7185, 0xfda4af, 0xc084fc],
  [0x34d399, 0x2dd4bf, 0x6ee7b7, 0x22d3ee],
  [0xfbbf24, 0xf59e0b, 0xfcd34d, 0xfb923c],
]

/** 探测 WebGL 是否可用，不支持则降级 */
function webglSupported(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

/** Three.js 3D 卡片 - 双层线框多面体，拖拽旋转 + 惯性 + 点击换色 */
export function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [failed] = useState(() => !webglSupported())

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || failed) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.z = 3.4

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    // canvas 充满容器，避免初始化时按物理像素溢出
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.maxWidth = '100%'
    renderer.domElement.style.maxHeight = '100%'
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.cursor = 'grab'
    renderer.domElement.style.touchAction = 'none'
    mount.appendChild(renderer.domElement)

    // 旋转组：外层线框 + 内核 + 顶点
    const group = new THREE.Group()
    scene.add(group)

    const outerGeo = new THREE.IcosahedronGeometry(1.2, 1)
    const wireMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.75 })
    const wire = new THREE.LineSegments(new THREE.WireframeGeometry(outerGeo), wireMat)
    group.add(wire)

    const pointsMat = new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.08 })
    const points = new THREE.Points(outerGeo, pointsMat)
    group.add(points)

    // 内核：反向旋转的小线框
    const innerGeo = new THREE.IcosahedronGeometry(0.62, 0)
    const innerMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 })
    const inner = new THREE.LineSegments(new THREE.WireframeGeometry(innerGeo), innerMat)
    group.add(inner)

    // 漂浮星点
    const starCount = 240
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 9
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starsMat = new THREE.PointsMaterial({ color: 0xa78bfa, size: 0.03, transparent: true, opacity: 0.6 })
    const stars = new THREE.Points(starGeo, starsMat)
    scene.add(stars)

    // —— 交互状态 ——
    const parallax = { x: 0, y: 0 } // 悬停视差
    let velX = 0
    let velY = 0 // 旋转惯性
    let dragging = false
    let lastX = 0
    let lastY = 0
    let moved = 0
    let popT = 0 // 点击弹一下的时间戳
    let palette = 0

    const applyPalette = (i: number) => {
      const [w, c, p, s] = PALETTES[i % PALETTES.length]
      wireMat.color.setHex(w)
      innerMat.color.setHex(c)
      pointsMat.color.setHex(p)
      starsMat.color.setHex(s)
    }

    const onPointerDown = (e: PointerEvent) => {
      dragging = true
      moved = 0
      lastX = e.clientX
      lastY = e.clientY
      try {
        renderer.domElement.setPointerCapture(e.pointerId)
      } catch {
        /* 忽略 */
      }
      renderer.domElement.style.cursor = 'grabbing'
    }
    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect()
      parallax.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      parallax.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      moved += Math.abs(dx) + Math.abs(dy)
      velY = dx * 0.006
      velX = dy * 0.006
      group.rotation.y += velY
      group.rotation.x += velX
      lastX = e.clientX
      lastY = e.clientY
    }
    const onPointerUp = (e: PointerEvent) => {
      if (dragging && moved < 6) {
        // 当作点击：换色 + 弹一下
        palette = (palette + 1) % PALETTES.length
        applyPalette(palette)
        popT = performance.now()
      }
      dragging = false
      renderer.domElement.style.cursor = 'grab'
      try {
        renderer.domElement.releasePointerCapture(e.pointerId)
      } catch {
        /* 忽略 */
      }
    }
    const el = renderer.domElement
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointerleave', () => {
      parallax.x = 0
      parallax.y = 0
    })

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(mount)
    resize()

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let onScreen = true
    let last = 0
    const tick = (now: number) => {
      // 惯性 + 自动慢转（拖拽时只用惯性）
      if (!dragging) {
        group.rotation.y += 0.003 + velY
        group.rotation.x += 0.0009 + velX
        velX *= 0.92
        velY *= 0.92
      }
      inner.rotation.y = -group.rotation.y * 1.6
      inner.rotation.x = -group.rotation.x * 1.6
      stars.rotation.y += 0.0005

      // 呼吸缩放 + 点击弹一下
      const breathe = 1 + Math.sin(now * 0.0015) * 0.04
      const pop = popT ? Math.max(0, 1 - (now - popT) / 350) * 0.18 : 0
      group.scale.setScalar(breathe + pop)

      // 悬停视差
      camera.position.x += (parallax.x * 0.7 - camera.position.x) * 0.05
      camera.position.y += (-parallax.y * 0.7 - camera.position.y) * 0.05
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    const animate = (now = 0) => {
      raf = requestAnimationFrame(animate)
      if (now - last < FRAME_MS) return // 30fps 节流
      last = now
      tick(now)
    }
    // 只在可见 + 在视口 + 未关闭动效时跑
    const shouldRun = () => onScreen && !document.hidden && !reduced
    const start = () => {
      if (raf === 0 && shouldRun()) raf = requestAnimationFrame(animate)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    // 滚出视口就停渲染
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting
        if (onScreen) start()
        else stop()
      },
      { threshold: 0.01 },
    )
    io.observe(mount)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)

    if (reduced) tick(0) // 静态渲染一帧
    else start()

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      renderer.dispose()
      outerGeo.dispose()
      innerGeo.dispose()
      starGeo.dispose()
      wire.geometry.dispose()
      inner.geometry.dispose()
      wireMat.dispose()
      innerMat.dispose()
      pointsMat.dispose()
      starsMat.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [failed])

  return (
    <div className="min-w-0 p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">✨</span>
        <span className="text-sm font-semibold text-white/70">3D 星体</span>
        <span className="text-xs text-white/25 ml-auto">拖拽旋转 · 点击换色</span>
      </div>
      <div
        ref={mountRef}
        className="w-full min-w-0 max-w-full aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center"
      >
        {failed && <span className="text-xs text-white/30">当前设备不支持 3D 渲染</span>}
      </div>
    </div>
  )
}
