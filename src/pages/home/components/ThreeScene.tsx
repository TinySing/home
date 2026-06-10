import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

const FRAME_MS = 1000 / 30 // 30fps，慢速旋转足够，软件渲染设备也省一半

/** 探测 WebGL 是否可用，不支持则降级 */
function webglSupported(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

/** Three.js 3D 卡片 - 旋转线框多面体 + 粒子，鼠标视差 */
export function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [failed] = useState(() => !webglSupported())

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || failed) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.z = 3.2

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    mount.appendChild(renderer.domElement)

    // 线框多面体
    const geo = new THREE.IcosahedronGeometry(1.15, 1)
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.7 }),
    )
    scene.add(wire)

    // 顶点辉光点
    const points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.07 }),
    )
    scene.add(points)

    // 漂浮星点
    const starCount = 220
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 9
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xa78bfa, size: 0.03, transparent: true, opacity: 0.6 }),
    )
    scene.add(stars)

    const target = { x: 0, y: 0 }
    const onMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    mount.addEventListener('mousemove', onMove)

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
    const tick = () => {
      wire.rotation.y += 0.004
      wire.rotation.x += 0.0015
      points.rotation.copy(wire.rotation)
      stars.rotation.y += 0.0006

      // 鼠标视差
      camera.position.x += (target.x * 0.6 - camera.position.x) * 0.05
      camera.position.y += (-target.y * 0.6 - camera.position.y) * 0.05
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    const animate = (now = 0) => {
      raf = requestAnimationFrame(animate)
      if (now - last < FRAME_MS) return // 30fps 节流
      last = now
      tick()
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

    if (reduced) tick() // 静态渲染一帧
    else start()

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      mount.removeEventListener('mousemove', onMove)
      renderer.dispose()
      geo.dispose()
      starGeo.dispose()
      wire.geometry.dispose()
      ;(wire.material as THREE.Material).dispose()
      ;(points.material as THREE.Material).dispose()
      ;(stars.material as THREE.Material).dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [failed])

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">✨</span>
        <span className="text-sm font-semibold text-white/70">3D 星体</span>
        <span className="text-xs text-white/25 ml-auto">移动鼠标交互</span>
      </div>
      <div
        ref={mountRef}
        className="w-full aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center"
      >
        {failed && <span className="text-xs text-white/30">当前设备不支持 3D 渲染</span>}
      </div>
    </div>
  )
}
