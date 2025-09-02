"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Award, Calendar } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Hackathon {
  id: number
  eventName: string
  logo: string
  userPhoto: string
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
    <motion.div variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="h-full">
      <Card
        className="overflow-hidden h-full cursor-pointer hover:shadow-md transition-all duration-300 rounded-2xl border border-border/50 flex flex-col"
        onClick={onClick}
      >
        <div className="relative h-48 overflow-hidden">
          {/* Logo del evento como fondo */}
          <Image
            src={hackathon.logo || "/placeholder.svg"}
            alt={hackathon.eventName}
            fill
            className="object-cover opacity-20 transition-transform duration-500 hover:scale-105"
          />
          {/* Foto de la usuaria superpuesta */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={hackathon.userPhoto || "/placeholder-user.png"}
                alt={`Irene en ${hackathon.eventName}`}
                fill
                className="object-cover"
              />
            </div>
          </div>
          {/* Nombre del evento en esquina superior */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
            <p className="text-white text-sm font-medium">{hackathon.eventName}</p>
          </div>
        </div>
        
        <CardContent className="p-6 flex-grow">
          <div className="mb-3">
            <h3 className="text-xl font-bold">{hackathon.projectTitle}</h3>
            <p className="text-lg font-semibold text-primary">{hackathon.role}</p>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {hackathon.date}
            </div>
          </div>
          
          <p className="text-muted-foreground mb-4 line-clamp-2">{hackathon.description}</p>

        </CardContent>
        
        {(hackathon.awards && hackathon.awards.length > 0) && (
          <CardFooter className="px-6 py-4 border-t flex justify-between mt-auto">
            <div className="flex items-center text-sm font-medium">
              <Award className="h-4 w-4 text-primary mr-1" />
              <span>Awards</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(hackathon.awards || []).slice(0, 2).map((award, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {award}
                </Badge>
              ))}
              {(hackathon.awards || []).length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{hackathon.awards.length - 2}
                </Badge>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}
