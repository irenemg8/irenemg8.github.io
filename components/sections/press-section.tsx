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
      platform: "Gandía Innova - UPV",
      logo: "/press/placeholder.svg?height=200&width=200",
      title: "EcoCity: Smart Urban Planning Prototype by GTI Students",
      date: "Feb 2024",
      excerpt: "EcoCity is a sustainable city model developed by students of the GTI degree at UPV, using IoT and AI technologies to optimize urban mobility and environmental impact.",
      fullArticle:
        "EcoCity is a smart urban planning project created by students of the Bachelor's Degree in Interactive Technologies (GTI) at the Universitat Politècnica de València. The prototype integrates IoT sensors, data visualization, and decision-making algorithms to simulate a sustainable city environment. It allows users to analyze environmental indicators, traffic flow, and air quality in real time, making it a practical educational model for future smart cities. The project was featured in the GTI-IoT 2024 showcase and received praise for its innovation and applicability.",
      source: "https://gandiainnova.webs.upv.es/blog/2024/02/26/prototipos-gti-iot-2024/",
      contextualSummary:
        "This article highlights EcoCity, a prototype that merges IoT technology and data analytics to model a more efficient and eco-friendly city. Developed by GTI students, the project aims to educate and inspire future urban solutions.",
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

  const monthMap: { [key: string]: number } = {
    Jan: 0, January: 0,
    Feb: 1, February: 1,
    Mar: 2, March: 2,
    Apr: 3, April: 3,
    May: 4, 
    Jun: 5, June: 5,
    Jul: 6, July: 6,
    Aug: 7, August: 7,
    Sep: 8, Sept: 8, September: 8,
    Oct: 9, October: 9,
    Nov: 10, November: 10,
    Dec: 11, December: 11
  };

  function parsePressDate(dateString: string): Date {
    const dateParts = dateString.split(" ");
    if (dateParts.length < 2) {
      return new Date(0); 
    }
    const [monthStr, yearStr] = dateParts;
    const year = parseInt(yearStr, 10);
    const month = monthMap[monthStr];
    
    if (isNaN(year) || month === undefined) {
        return new Date(0);
    }
    return new Date(year, month + 1, 0); 
  }

  const sortedPressItems = pressItems.sort((a, b) => {
    const dateA = parsePressDate(a.date);
    const dateB = parsePressDate(b.date);
    return dateB.getTime() - dateA.getTime(); // De más reciente a más antiguo
  });

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
        {sortedPressItems.map((item) => (
          <PressCard key={item.id} item={item} onClick={() => openModal("press", item)} />
        ))}
      </motion.div>
    </div>
  )
}
