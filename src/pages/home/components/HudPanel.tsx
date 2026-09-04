import type { ReactNode } from 'react'

interface HudPanelProps {
  children: ReactNode
  className?: string
  sweep?: boolean
}

/** HUD 面板外壳：角标边框 + 可选扫光 */
export function HudPanel({ children, className = '', sweep = false }: HudPanelProps) {
  return (
    <div
      className={`hud-panel overflow-hidden ${sweep ? 'animate-sweep' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
