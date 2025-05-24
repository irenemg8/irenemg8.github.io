"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500 && !isDismissed) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <div className="relative bg-primary text-primary-foreground rounded-2xl shadow-lg p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background text-foreground"
              onClick={handleDismiss}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Dismiss</span>
            </Button>
            <Button className="rounded-xl" asChild>
              <a href="/irene-medina-garcia-cv.pdf" download>
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </a>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
