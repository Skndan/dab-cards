"use client"

import { motion, useInView, UseInViewOptions, Variant } from "framer-motion"
import { useRef } from "react"

interface ScrollAnimationProps {
  children: React.ReactNode
  className?: string
  variant?: "fade" | "slideUp" | "slideLeft" | "slideRight" | "scale"
  delay?: number
  duration?: number
  viewport?: UseInViewOptions
}

export function ScrollAnimation({
  children,
  className = "",
  variant = "fade",
  delay = 0,
  duration = 0.5,
  viewport = { once: true, margin: "-50px" },
}: ScrollAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, viewport)

  const variants: Record<string, { hidden: Variant; visible: Variant }> = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    slideLeft: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    },
    slideRight: {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  }

  const selectedVariant = variants[variant]

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={selectedVariant}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
