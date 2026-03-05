'use client'

export function BottomWaves() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 h-screen pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <div className="absolute inset-0 bottom-glow" />
      <div className="absolute inset-0 bottom-glow-2" />
      <div className="absolute inset-0 bottom-glow-3" />
    </div>
  )
}
