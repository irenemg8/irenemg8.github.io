"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PressModalProps {
  content: any
  onClose: () => void
}

export function PressModal({ content, onClose }: PressModalProps) {
  if (!content) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-background border rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8 relative">
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>

          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              <Image src={content.logo || "/placeholder.svg"} alt={content.platform} fill className="object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{content.platform}</h3>
              <p className="text-sm text-muted-foreground">{content.date}</p>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-6">{content.title}</h2>

          <div className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p>{content.fullArticle}</p>
            </div>

            {content.contextualSummary && (
              <div className="bg-muted/50 p-4 rounded-xl">
                <h4 className="font-semibold mb-2">Context</h4>
                <p className="text-muted-foreground text-sm">{content.contextualSummary}</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Button variant="outline" asChild>
              <a href={content.source} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Original Article
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
