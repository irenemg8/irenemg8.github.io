"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Hackathon {
  id: number
  eventName: string
  logo: string
  projectTitle: string
  role: string
  description: string
  date: string
  awards: string[]
}

interface HackathonCardProps {
  hackathon: Hackathon
  onClick: () => void
}

export function HackathonCard({ hackathon, onClick }: HackathonCardProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
      <Card
        className="overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 rounded-2xl border border-border/50 h-full"
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              <Image
                src={hackathon.logo || "/placeholder.svg"}
                alt={hackathon.eventName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold">{hackathon.eventName}</h3>
              <p className="text-sm text-muted-foreground">{hackathon.date}</p>
            </div>
          </div>

          <h4 className="text-xl font-bold mb-2">{hackathon.projectTitle}</h4>
          <p className="text-sm text-muted-foreground mb-2">Role: {hackathon.role}</p>
          <p className="text-muted-foreground mb-4 line-clamp-2">{hackathon.description}</p>

          {hackathon.awards.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm font-medium">
                <Award className="h-4 w-4 text-primary" />
                <span>Awards</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {hackathon.awards.map((award, index) => (
                  <Badge key={index} variant="outline">
                    {award}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
