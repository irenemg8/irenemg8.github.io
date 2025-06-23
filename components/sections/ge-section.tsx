"use client"

import { motion } from "framer-motion"
import { GeCard } from "@/components/shared/ge-card"

interface GeSectionProps {
  openModal: (type: "ge", content: any) => void
  title?: string
}

export function GeSection({ openModal, title = "🌟 Generación espontánea 🌟" }: GeSectionProps) {
  const geData = [
    {
      id: 1,
      title: "Talpa Tunneling UPV",
      position: "Automation Specialist",
      description: "UX/UI designer & developer, data analyst, and performance optimizer.",
      image: "/aidguide/talpa.svg?height=600&width=800",
      date: "Apr 2025 - Apr 2026",
      location: "Valencia, Spain / Texas, USA",
      tags: ["UX/UI Design", "Development", "Data Analysis", "Performance Optimization", "Automation"],
      fullDescription: "As an Automation Specialist at Talpa Tunneling UPV, I am responsible for designing and developing user interfaces that enhance the user experience while optimizing system performance. My role encompasses data analysis to drive informed decision-making and implementing automation solutions to streamline processes. Working in a dynamic environment spanning Valencia, Spain and Texas, USA, I collaborate with international teams to deliver cutting-edge tunneling technology solutions.",
      techStack: ["UX/UI Design", "Data Analysis", "Performance Optimization", "Automation Systems"],
      challenges: "The main challenge involves creating intuitive interfaces for complex tunneling systems while ensuring optimal performance across different geographical locations and user bases. This requires balancing technical complexity with user-friendly design principles.",
      role: "UX/UI Designer & Developer, Data Analyst, Performance Optimizer",
      company: "Talpa Tunneling UPV",
      type: "Professional Experience"
    },
    {
      id: 2,
      title: "AidGuide",
      position: "Founder & Head of Automation & Marketing",
      description: "Creator of spontaneous generation and leader of automation and marketing department at EPSG (UPV) Gandía.",
      image: "/aidguide/logo.svg?height=600&width=800",
      date: "Feb 2025 - Present",
      location: "Gandía, Valencia, Spain",
      tags: ["Innovation Leadership", "Corporate Design", "UI Supervision", "Accessibility", "Marketing Strategy", "Automation"],
      fullDescription: "As the founder and creator of the spontaneous generation (GE) initiative at EPSG (UPV) Gandía, I lead the technological innovation department focusing on automation and marketing. We are pioneers in creating spontaneous technological generation at the university, developing groundbreaking projects that merge assistive technology with cutting-edge design. I oversee all user interfaces, corporate design standards, and accessibility implementations across our projects, ensuring that innovation meets real-world needs while maintaining the highest design and usability standards.",
      techStack: ["Leadership", "Corporate Design", "UI/UX Supervision", "Accessibility Standards", "Marketing Strategy", "Innovation Management"],
      challenges: "The main challenge has been establishing a completely new framework for spontaneous generation in technology while ensuring all projects meet strict accessibility standards and corporate design guidelines. Building a department from scratch requires balancing innovation with practical implementation and market needs.",
      role: "Founder, Creator of Spontaneous Generation, Head of Automation & Marketing Department",
      company: "EPSG (UPV) - Gandía/Valencia",
      type: "Leadership & Innovation"
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-pecita">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Spontaneous generation of opportunities and experiences that shape my career journey at UPV.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {geData.map((item) => (
          <GeCard
            key={item.id}
            item={item}
            onClick={() => openModal("ge", item)}
          />
        ))}
      </motion.div>
    </div>
  )
} 