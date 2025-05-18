"use client"

import { motion } from "framer-motion"
import { PressCard } from "@/components/shared/press-card"

interface PressSectionProps {
  openModal: (type: "press", content: any) => void
  title?: string
}

export function PressSection({ openModal, title = "Press" }: PressSectionProps) {
  const pressItems = [
    {
      id: 1,
      platform: "Tech Insider",
      logo: "/placeholder.svg?height=200&width=200",
      title: "Rising Stars in Frontend Development",
      date: "April 2023",
      excerpt: "An interview with one of the most innovative frontend developers in the industry today.",
      fullArticle:
        "In this exclusive interview, we dive deep into the creative process and technical expertise that has made this developer stand out in the competitive world of frontend development. From pioneering new approaches to UI/UX design to contributing to open-source projects, their work has influenced how modern web applications are built and experienced by users worldwide.",
      source: "https://example.com/article1",
      contextualSummary:
        "This interview focused on recent projects and contributions to the frontend community, highlighting innovative approaches to responsive design and animation techniques.",
    },
    {
      id: 2,
      platform: "Design Weekly",
      logo: "/placeholder.svg?height=200&width=200",
      title: "The Intersection of Code and Design",
      date: "February 2023",
      excerpt: "How this developer-designer is bridging the gap between beautiful design and functional code.",
      fullArticle:
        "The traditional divide between designers and developers is being challenged by a new generation of creative technologists who excel in both domains. This feature explores how combining strong design sensibilities with technical expertise leads to more cohesive, innovative digital products. Through case studies of recent projects, we see how this approach results in websites and applications that are not only visually stunning but also technically robust and user-friendly.",
      source: "https://example.com/article2",
      contextualSummary:
        "This feature article examined the growing trend of designer-developers and how this hybrid role is reshaping the industry, with specific examples from recent portfolio work.",
    },
    {
      id: 3,
      platform: "Web Dev Journal",
      logo: "/placeholder.svg?height=200&width=200",
      title: "Optimizing Performance in Modern Web Apps",
      date: "December 2022",
      excerpt: "A technical deep-dive into performance optimization techniques for complex web applications.",
      fullArticle:
        "Performance is increasingly becoming a key differentiator in web development. This technical article explores advanced techniques for optimizing load times, rendering performance, and interaction responsiveness in complex web applications. From code splitting and lazy loading to efficient state management and rendering strategies, the piece covers practical approaches that developers can implement immediately to improve user experience and engagement metrics.",
      source: "https://example.com/article3",
      contextualSummary:
        "This technical article shared insights and best practices for web performance optimization, based on real-world experience with high-traffic applications and complex interactive interfaces.",
    },
    {
      id: 4,
      platform: "Creative Coding",
      logo: "/placeholder.svg?height=200&width=200",
      title: "Exploring Creative Possibilities with WebGL",
      date: "October 2022",
      excerpt: "How this developer is pushing the boundaries of web graphics with WebGL and Three.js.",
      fullArticle:
        "The web browser has evolved into a powerful platform for graphics and interactive experiences. This feature explores innovative projects that leverage WebGL and Three.js to create immersive 3D experiences directly in the browser. From data visualizations to interactive art installations, these projects demonstrate how web technologies can be used for creative expression while maintaining performance and accessibility across devices.",
      source: "https://example.com/article4",
      contextualSummary:
        "This article showcased experimental 3D web projects and discussed the technical challenges and creative process behind creating immersive browser-based experiences.",
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
          Featured articles, interviews, and media coverage highlighting my work and expertise.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {pressItems.map((item) => (
          <PressCard key={item.id} item={item} onClick={() => openModal("press", item)} />
        ))}
      </motion.div>
    </div>
  )
}
