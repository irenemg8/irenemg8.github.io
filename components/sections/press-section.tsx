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
      logo: "/press/catedrainnovacion.jpeg?height=200&width=200",
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
      platform: "Tercera edición del Campus Salud Gandía",
      logo: "/press/upvgandia.jpg?height=200&width=200",
      title: "URBANVIVE Wins First Prize at the 3rd Campus Salud Gandía Hackathon",
      excerpt: "URBANVIVE, an interdisciplinary team from UPV, wins the top award with an innovative urban project enhancing public health through biotechnology and smart design.",
      date: "May 2025",
      fullArticle:
        "At the third edition of Campus Salud Gandía 2025, the URBANVIVE team was awarded the first prize for their groundbreaking urban innovation project. URBANVIVE proposes the development and installation of paving stones enriched with a beneficial microbiota, capable of releasing natural compounds as people walk over them. These compounds, absorbed through the skin or inhaled, have proven positive effects: strengthening the immune system, reducing stress and anxiety, and helping to prevent respiratory issues and common colds. The project exemplifies a new intersection between biotechnology, urban design, and public health, and was presented by students from the Interactive Technologies Degree at the Gandia Campus (UPV), the Biomedical Engineering Degree (UPV), and a researcher from the IBMCP at UPV. URBANVIVE reflects a vision for healthier, more sustainable cities, leveraging science to enhance citizens' daily wellbeing.",
      source: "https://cienciagandia.webs.upv.es/ca/2025/05/tercera-edicio-campus-salud-gandia/",
      contextualSummary:
        "The article covers the victory of the URBANVIVE team at Campus Salud Gandía 2025, highlighting their award-winning project that uses microbiota-enhanced paving stones to improve urban public health through natural biotechnology, interdisciplinary collaboration, and innovation.",
    },
    {
      id: 3,
      platform: "Gandía Innova - UPV",
      logo: "/press/catedrainnovacion.jpeg?height=200&width=200",
      title: "EcoCity: Smart Streetlights Prototype Revolutionizes Urban Life",
      date: "Mar 2024",
      excerpt: "EcoCity introduces smart streetlight technology that goes beyond lighting, offering real-time environmental monitoring and intelligent control for modern urban environments.",
      fullArticle:
        "The EcoCity Smart Streetlights project represents a leap forward in the integration of IoT technology into urban infrastructure. Far from being just a lighting solution, EcoCity’s smart streetlights actively monitor key environmental parameters in real time, including temperature, humidity, smoke levels, and noise pollution. The system empowers city administrators and residents by allowing the adjustment of streetlight brightness through a dedicated Android application. Furthermore, users receive instant alerts whenever environmental thresholds are exceeded, enabling proactive responses to changing urban conditions. This innovative prototype aims to enhance quality of life, promote safety, and pave the way for smarter, greener cities. The project was developed by a multidisciplinary team from the Universitat Politècnica de València: Rubén García Quiralte, Pablo Meana Gonzalez, Irene Medina García, Pablo Rebollo de Miguel, and Vicente Jose Rivas Monferrer.",
      source: "https://gandiainnova.webs.upv.es/blog/2024/03/08/prototipos-iot-gti-2024/",
      contextualSummary:
        "This news article presents the EcoCity Smart Streetlights project, highlighting its innovative approach to urban lighting by integrating advanced IoT monitoring and smart control. Developed by a team of students at UPV, EcoCity exemplifies the future of sustainable, connected cities.",
    },
    {
      id: 4,
      platform: "Gandía Council News",
      logo: "/press/Logo_ayto_gandia.jpg?height=200&width=200",
      title: "Gandía Hosts the Third Edition of Campus Salud Gandía",
      date: "May 2025",
      excerpt: "The city of Gandía welcomes the third edition of Campus Salud GandÍa, an intensive university event focusing on urban health innovation.",
      fullArticle:
        "On May 2nd and 3rd, 2025, Gandía hosted the third edition of Campus Salud Gandía, an intensive university event dedicated to promoting innovation in urban health. The event brought together students, researchers, and professionals to collaborate on projects aimed at improving the quality of life in urban environments. This year's edition featured a series of workshops, presentations, and collaborative sessions, fostering interdisciplinary approaches to health challenges in cities. The initiative underscores Gandía's commitment to integrating academic research and practical solutions to enhance public health and urban living.",
      source: "https://www.gandia.es/atg/news/new.php?id=5250",
      contextualSummary:
        "The article details Gandía's hosting of the third Campus Salud Gandía, emphasizing the city's dedication to fostering innovation in urban health through academic and professional collaboration.",
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
