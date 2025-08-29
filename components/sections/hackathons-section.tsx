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
      logo: "/hackathon/IMG_7130.jpeg?height=200&width=200",
      projectTitle: "EcoSpot",
      role: "Software developer",
      description: "Participated in the eMobility Hackathon in Valencia, designing a mobile app for electric vehicle charging stations. The goal was to promote smart, user-friendly, and sustainable mobility solutions.",
      date: "Sept 2023",
      awards: ["Semifinalists"],
      fullStory:
        "During the 2-day hackathon, I worked on a team that developed an app to locate, reserve, and review EV charging points in real time. I focused on front-end design and UX, creating a simple, intuitive interface. We applied agile methods to deliver a working MVP and presented it to industry leaders.",
      technologies: ["Axure", "Figma", "Android"],
      team: ["Irene Medina García", "Vicente Rivas Monferrer", "Teresa López Garrido", "Raúl Real González"],
      challenges:
        "One of the main challenges was developing a functional MVP in less than 36 hours, which required rapid decision-making and tight coordination. Additionally, the lack of real-time charging station data forced us to simulate responses, complicating backend integration. Designing a user experience that worked for different types of EV users demanded continuous iteration and validation. Finally, working within a multidisciplinary team meant aligning technical, design, and business perspectives under constant time pressure.",
      //githubUrl: "https://github.com",
      //liveUrl: "https://example.com",
      mediaUrl: "/hackathon/emobility.pdf",
    },
     {
    id: 2,
    eventName: "Safor Salut Hackathon – 3rd Edition",
    logo: "/hackathon/IMG_7131_back.png?height=200&width=200",
    projectTitle: "URBANVIVE",
    role: "UX/UI/UC Specialist",
    description: "A smart microbiota-integrated flooring system to promote wellness while walking",
    date: "May 2025",
    awards: ["1st Place – Overall Winner"],
    fullStory:
      "UrbanVive is an innovative health-tech solution designed during the 3rd edition of the Safor Salut Hackathon in Gandía. The project focuses on creating a responsive floor system embedded with beneficial microbiota that interact with the human body through physical contact, promoting well-being as users walk across it. Beyond physical health, the system also incorporates sensory feedback and ambient interaction to encourage mindful walking and stress relief. As the UX/UI Specialist, I was responsible for the entire user journey design, ensuring accessibility, clarity, and emotional engagement across the experience. Our project stood out for combining biotechnology, urban design, and digital interactivity in a cohesive, impactful prototype.",
    technologies: ["Figma", "Arduino", "Biosensors"],
    team: [
      "Irene Medina García (UX/UI/UC Specialist)",
      "Pablo Rebollo De Miguel (Hardware Developer)",
      "Nuria Casañ (Biomedical Intern)",
      "Juan Chucuri (Biological Researcher)"
    ],
    challenges:
      "The main challenge was translating complex microbiota research into a tangible, user-centered product within a 48-hour timeframe. We tackled this by rapidly prototyping the concept using cross-disciplinary sprints and testing micro-interactions with users in real time.",
    //githubUrl: "https://github.com/urbanvive/hackathon-safor-salut",
    liveUrl: "https://www.canva.com/design/DAGmUaMmc1Q/qEBb7fra-d-sfrh8tSUNvQ/view?utm_content=DAGmUaMmc1Q&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h917ff62e5e",
    mediaUrl: "https://cienciagandia.webs.upv.es/ca/2025/05/tercera-edicio-campus-salud-gandia/amp/"
  },
    {
      id: 3,
      eventName: "Smart City Challenges 2025",
      logo: "/hackathon/vrain_logo_back.jpeg?height=200&width=200",
      projectTitle: "Aura",
      role: "UX/UI & Frontend Developer",
      description: "AI-powered assistant for visually impaired people",
      date: "Jun 2025",
      awards: ["Pending"],
      fullStory:
        "Aura is an innovative mobile application designed to empower visually impaired individuals by transforming their smartphones into intelligent personal assistants. Utilizing the device's camera, advanced image recognition, and real-time voice feedback, Aura helps users independently navigate indoor and outdoor spaces, identify products in supermarkets (brand, properties, price, and more), and access detailed visual information about their surroundings. The app goes beyond navigation: it aims to bridge accessibility gaps by integrating artificial intelligence, open data, and voice interaction, offering a scalable platform for multiple smart city applications.",
      technologies: ["Figma", "React Native", "TypeScript", "Speech-To-Text", "AWS", "Open Data APIs"],
      team: ["Irene Medina García (UX/UI & Frontend)", "Vicente Rivas Monferrer (Backend)", "Ada González (Frontend)", "Raúl Fortea (Backend)"],
      challenges:
            "Our main challenge was to achieve high-accuracy real-time image recognition in diverse environments, while ensuring seamless and accessible voice interaction for users with different levels of vision loss. We also prioritized user privacy and data security, implementing strict permission controls and processing sensitive data locally whenever possible.",
      //githubUrl: "https://github.com",
      //liveUrl: "https://example.com",
      //mediaUrl: "https://youtube.com",
    },


  ]

  const monthMap: { [key: string]: number } = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sept: 8, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };

  function parseHackathonDate(dateString: string): Date {
    const dateParts = dateString.split(" ");
    if (dateParts.length < 2) {
      // Fallback for unexpected date formats, return a very old date to sort last
      return new Date(0); 
    }
    const [monthStr, yearStr] = dateParts;
    const year = parseInt(yearStr, 10);
    const month = monthMap[monthStr];
    
    if (isNaN(year) || month === undefined) {
        // Fallback for unparseable month or year
        return new Date(0);
    }
    // Create date for the end of the month to ensure correct comparison
    return new Date(year, month + 1, 0); 
  }

  const sortedHackathons = hackathons.sort((a, b) => {
    const dateA = parseHackathonDate(a.date);
    const dateB = parseHackathonDate(b.date);
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
          A showcase of my hackathon projects, highlighting creativity, teamwork & dev.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sortedHackathons.map((hackathon) => (
          <HackathonCard key={hackathon.id} hackathon={hackathon} onClick={() => openModal("hackathon", hackathon)} />
        ))}
      </motion.div>
    </div>
  )
}
