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
      eventName: "eMobility",
      logo: "/hackathon/onklub.jpeg?height=200&width=200",
      projectTitle: "EcoSpot",
      role: "Software developer",
      description: "Participated in the eMobility Hackathon in Valencia, designing a mobile app for electric vehicle charging stations. The goal was to promote smart, user-friendly, and sustainable mobility solutions.",
      date: "Sept 2023",
      //awards: ["Best Game Design", "People's Choice"],
      fullStory:
        "During the 2-day hackathon, I worked on a team that developed an app to locate, reserve, and review EV charging points in real time. I focused on front-end design and UX, creating a simple, intuitive interface. We applied agile methods to deliver a working MVP and presented it to industry leaders.",
      technologies: ["Unity", "C#", "Blender", "FMOD"],
      team: ["Irene Medina García", "Vicente Rivas Monferrer", "Teresa López Garrido", "Raúl Real González"],
      challenges:
        "One of the main challenges was developing a functional MVP in less than 36 hours, which required rapid decision-making and tight coordination. Additionally, the lack of real-time charging station data forced us to simulate responses, complicating backend integration. Designing a user experience that worked for different types of EV users demanded continuous iteration and validation. Finally, working within a multidisciplinary team meant aligning technical, design, and business perspectives under constant time pressure.",
      //githubUrl: "https://github.com",
      //liveUrl: "https://example.com",
      mediaUrl: "https://youtube.com",
    },
     {
    id: 2,
    eventName: "Safor Salut Hackathon – 3rd Edition",
    logo: "https://www.google.com/imgres?q=safor%20salud%20logo&imgurl=https%3A%2F%2Fsaforsalut.es%2Fwp-content%2Fuploads%2F2020%2F10%2Flogo_horizontal.png&imgrefurl=https%3A%2F%2Fsaforsalut.es%2F&docid=CJ8qRPYSX_CKOM&tbnid=CZ4VolgGGHpdQM&vet=12ahUKEwiwpsON_K6NAxWXVaQEHeaFLwwQM3oECBcQAA..i&w=850&h=408&hcb=2&ved=2ahUKEwiwpsON_K6NAxWXVaQEHeaFLwwQM3oECBcQAA?height=200&width=200",
    projectTitle: "URBANVIVE",
    role: "UX Specialist",
    description: "A smart microbiota-integrated flooring system to promote wellness while walking",
    date: "May 2025",
    awards: ["1st Place – Overall Winner"],
    fullStory:
      "UrbanVive is an innovative health-tech solution designed during the 3rd edition of the Safor Salut Hackathon in Gandía. The project focuses on creating a responsive floor system embedded with beneficial microbiota that interact with the human body through physical contact, promoting well-being as users walk across it. Beyond physical health, the system also incorporates sensory feedback and ambient interaction to encourage mindful walking and stress relief. As the UX/UI Specialist, I was responsible for the entire user journey design, ensuring accessibility, clarity, and emotional engagement across the experience. Our project stood out for combining biotechnology, urban design, and digital interactivity in a cohesive, impactful prototype.",
    technologies: ["Figma", "Arduino", "Biosensors"],
    team: [
      "Irene Medina García (UX/UI Specialist)",
      "Pablo Rebollo De Miguel (Hardware Developer)",
      "Lucía Martínez (Biotech Researcher)",
      "Jorge Navarro (Project Manager)"
    ],
    challenges:
      "The main challenge was translating complex microbiota research into a tangible, user-centered product within a 48-hour timeframe. We tackled this by rapidly prototyping the concept using cross-disciplinary sprints and testing micro-interactions with users in real time.",
    githubUrl: "https://github.com/urbanvive/hackathon-safor-salut",
    liveUrl: "https://urbanvive.vercel.app",
    mediaUrl: "https://www.youtube.com/watch?v=urbanvive2025"
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
