"use client"

import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ElementType, ReactNode, RefObject } from "react"

interface TimelineContentProps {
  children: ReactNode
  animationNum: number
  timelineRef: RefObject<HTMLElement | null>
  customVariants?: {
    visible: (i: number) => object
    hidden: object
  }
  className?: string
  as?: ElementType
}

export function TimelineContent({
  children,
  animationNum,
  timelineRef,
  customVariants,
  className,
  as,
}: TimelineContentProps) {
  const isInView = useInView(timelineRef as RefObject<HTMLElement>, {
    once: true,
    margin: "0px 0px -50px 0px",
  })

  const defaultVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      filter: "blur(10px)",
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
  }

  const variants = customVariants || defaultVariants
  const Tag = as || "div"
  const MotionTag = motion.create(Tag as string)

  return (
    <MotionTag
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  )
}
