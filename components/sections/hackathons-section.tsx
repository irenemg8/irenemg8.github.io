"use client"

import { motion } from "framer-motion"
import { HackathonCard } from "@/components/shared/hackathon-card"

interface HackathonsSectionProps {
  openModal: (type: "hackathon", content: any) => void
  title?: string
}

export function HackathonsSection({ openModal, title = "Hackathons" }: HackathonsSectionProps) {
  const hackathons = [
    {
      id: 1,
      eventName: "Global Game Jam",
      logo: "/placeholder.svg?height=200&width=200",
      projectTitle: "Eco Defender",
      role: "Lead Developer",
      description: "A game that raises awareness about environmental issues",
      date: "January 2023",
      awards: ["Best Game Design", "People's Choice"],
      fullStory:
        "Eco Defender is a tower defense game where players protect ecosystems from pollution and deforestation. The game features procedurally generated levels and a resource management system that teaches players about sustainable practices.",
      technologies: ["Unity", "C#", "Blender", "FMOD"],
      team: ["Jane Doe (Artist)", "John Smith (Sound Designer)", "Alex Johnson (Game Designer)"],
      challenges:
        "The biggest challenge was implementing the procedural level generation system in just 48 hours. We solved this by creating a modular approach that allowed us to quickly iterate and test different environmental layouts.",
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      mediaUrl: "https://youtube.com",
    },
    {
      id: 2,
      eventName: "AI Hackathon",
      logo: "/placeholder.svg?height=200&width=200",
      projectTitle: "VoiceAssist",
      role: "Frontend Developer",
      description: "AI-powered voice assistant for elderly care",
      date: "March 2023",
      awards: ["3rd Place Overall", "Best Use of AI"],
      fullStory:
        "VoiceAssist is an AI-powered voice assistant designed specifically for elderly users. It features simplified voice commands, medication reminders, emergency contacts, and integration with smart home devices. The interface was designed with accessibility in mind, featuring large text, high contrast, and simple navigation.",
      technologies: ["React", "TensorFlow.js", "Web Speech API", "Firebase"],
      team: ["Maria Garcia (AI Engineer)", "David Kim (Backend Developer)", "Sarah Chen (UX Researcher)"],
      challenges:
        "Training the voice recognition model to understand elderly voices with various accents and speech patterns was challenging. We collected diverse voice samples and fine-tuned the model to improve accuracy.",
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      mediaUrl: "https://youtube.com",
    },
    {
      id: 3,
      eventName: "Fintech Hackathon",
      logo: "/placeholder.svg?height=200&width=200",
      projectTitle: "BudgetBuddy",
      role: "Full Stack Developer",
      description: "Personal finance app with gamification elements",
      date: "June 2023",
      awards: ["1st Place Overall", "Best UX Design"],
      fullStory:
        "BudgetBuddy is a personal finance application that uses gamification to encourage better financial habits. Users earn points and badges for saving money, staying under budget, and achieving financial goals. The app features visualizations of spending patterns, automated categorization of expenses, and personalized financial advice.",
      technologies: ["Next.js", "TypeScript", "Plaid API", "MongoDB", "Chart.js"],
      team: ["Michael Brown (Product Manager)", "Emily Wilson (UI Designer)", "James Lee (Data Scientist)"],
      challenges:
        "Integrating with multiple banking APIs while ensuring data security and privacy was our main challenge. We implemented end-to-end encryption and followed best practices for handling sensitive financial information.",
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      mediaUrl: "https://youtube.com",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold mb-4 font-pecita">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A showcase of my hackathon projects, highlighting creativity, teamwork, and dev.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {hackathons.map((hackathon) => (
          <HackathonCard key={hackathon.id} hackathon={hackathon} onClick={() => openModal("hackathon", hackathon)} />
        ))}
      </motion.div>
    </div>
  )
}
