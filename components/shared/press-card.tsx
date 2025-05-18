"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface PressItem {
  id: number
  platform: string
  logo: string
  title: string
  date: string
  excerpt: string
}

interface PressCardProps {
  item: PressItem
  onClick: () => void
}

export function PressCard({ item, onClick }: PressCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={cardVariants}>
      <Card
        className="overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 rounded-2xl border border-border/50"
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              <Image src={item.logo || "/placeholder.svg"} alt={item.platform} fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{item.platform}</span>
              <span className="text-xs text-muted-foreground">{item.date}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-3">{item.title}</h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">{item.excerpt}</p>

          <div className="flex items-center text-sm font-medium text-primary">
            <span>Read more</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
