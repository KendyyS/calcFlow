"use client"

import { useEffect, useRef } from "react"

export function AnimatedGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      time += 0.003
      const w = canvas.width
      const h = canvas.height

      const gradient = ctx.createRadialGradient(
        w * (0.5 + 0.2 * Math.sin(time * 0.5)),
        h * (0.4 + 0.15 * Math.cos(time * 0.7)),
        0,
        w * 0.5,
        h * 0.5,
        w * 0.8
      )

      gradient.addColorStop(0, "hsla(217, 91%, 60%, 0.15)")
      gradient.addColorStop(0.4, "hsla(239, 84%, 67%, 0.1)")
      gradient.addColorStop(0.7, "hsla(226, 70%, 55%, 0.05)")
      gradient.addColorStop(1, "hsla(226, 70%, 55%, 0)")

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}