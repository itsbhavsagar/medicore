import { motion, type Transition } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageWrapperProps {
  children: ReactNode
}

const transition: Transition = {
  duration: 0.28,
  ease: [0.16, 1, 0.3, 1],
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <motion.main
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 px-6 py-6 md:px-8 md:py-8"
      initial={{ opacity: 0, y: 12 }}
      transition={transition}
    >
      {children}
    </motion.main>
  )
}
