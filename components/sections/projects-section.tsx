"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ProjectCard } from "@/components/shared/project-card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface ProjectsSectionProps {
  openModal: (type: "project", content: any) => void
  title?: string
}

export function ProjectsSection({ openModal, title = "Projects" }: ProjectsSectionProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const projectsData = [
    {
      id: 1,
      title: "GTI Hidropónico - sensor kit",
      description: "A smart sensor kit for monitoring vertical hydroponic gardens in real time",
      image: "/placeholder.svg?height=600&width=800",
      date: "Sept 2022 - Feb 2023",
      tags: ["Arduino"],
     // githubUrl: "https://github.com",
     // liveUrl: "https://example.com",
      fullDescription:
    "GTI Hidropónico is a vertical hydroponic system enhanced with an Arduino-based sensor kit to monitor key environmental parameters. The system detects humidity, temperature, and signs of plant stress, alerting users instantly when their garden requires attention. Designed with urban sustainability in mind, it empowers users to grow healthy plants in small indoor spaces, while leveraging technology for precision farming.",
      techStack: ["Arduino", "ESP-IDF", "C++", "Chart.js"],
      challenges:
    "The main challenge was integrating reliable sensor data with user-friendly alerts. We solved it by calibrating the sensors under real conditions and designing a simple yet effective interface for timely feedback.",
      role: "Programmer | Scrum Master",
     // demoUrl: "https://example.com/demo",
    },
    {
      id: 2,
      title: "GTI Hidropónico - E-commerce web",
      description: "A clean and responsive website to promote and sell smart hydroponic kits",
      image: "/placeholder.svg?height=600&width=800",
      date: "Feb 2023 - Jun 2023",
      tags: ["HTML", "CSS", "JS", "PHP", "UX/UI", "Axure"],
      //githubUrl: "https://github.com",
      //liveUrl: "https://example.com",
      fullDescription:
    "This e-commerce platform was created to support the commercialization of GTI Hidropónico sensor kits. The website highlights the benefits of vertical hydroponic gardening and allows users to explore, customize, and purchase their smart garden kits online. Designed with a focus on simplicity and user trust, it features responsive layouts, engaging visuals, and clear product information to guide buyers through the decision-making process.",
      techStack: ["HTML", "CSS", "JS", "PHP", "UX/UI", "Axure"],
      challenges:
    "Crafting a brand identity that reflects innovation and sustainability was key. We focused on a minimal aesthetic with bold typography and used real-time user testing to optimize the purchase flow.",
      role: "UX/UI Designer & Frontend developer | Scrum Master",
      //demoUrl: "https://example.com/demo",
    },
    {
      id: 3,
      title: "EcoCity",
  description: "A connected streetlight network with air quality sensors and surveillance for safer, healthier cities",
      image: "/placeholder.svg?height=600&width=800",
      date: "Sept 2023 - Feb 2024",
  tags: ["Android", "Java", "MQTT", "Raspberry Pi", "IoT"],
      githubUrl: "https://github.com",
     // liveUrl: "https://example.com",
      fullDescription:
    "EcoCity is a smart city initiative focused on transforming traditional streetlights into intelligent nodes for environmental monitoring and urban security. Each streetlight is equipped with air quality sensors and a surveillance camera, all interconnected via MQTT and controlled through a Raspberry Pi. We developed an Android app that enables real-time visualization of pollution levels, alerts for unsafe air conditions, and access to live camera feeds. The solution enhances both environmental awareness and public safety, creating a more responsive and livable urban space.",
        techStack: ["Android Studio", "Java", "MQTT", "Raspberry Pi", "Firebase"],
      challenges:
    "Ensuring stable MQTT communication between multiple streetlights and the mobile app was technically demanding. We resolved it through efficient message routing and robust error handling within our IoT architecture.",
  role: "Mobile Developer & System Integration Designer | Scrum Master",
      demoUrl: "https://example.com/demo",
    },
    {
      id: 4,
      title: "Yummy Fish",
  description: "A fun and fast-paced underwater game where you eat or get eaten to survive and evolve",
      image: "/placeholder.svg?height=600&width=800",
      date: "Feb 2024 - Jun 2024",
  tags: ["Figma", "Unity", "C#", "3ds Max", "Game Design", "Audio Production"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      fullDescription:
    "Yummy Fish is a 3D survival game where you play as a small fish trying to grow by eating smaller fish while avoiding being eaten by larger predators. The gameplay combines action, strategy, and progression mechanics in a colorful underwater world. All models and animations were created in Autodesk 3ds Max, and the original sound effects and background music were recorded and processed in the UPV professional sound booths. The game was developed in Unity and designed to deliver an engaging, intuitive experience with escalating difficulty and immersive feedback.",
  techStack: ["Unity", "C#", "3ds Max", "Audacity", "Blender", "Figma" ],
      challenges:
    "Balancing the difficulty curve and optimizing collision detection in a dynamic 3D environment was complex. We iteratively refined the mechanics using playtesting and data from in-game telemetry.",
       role: "Game Designer & Dev | 3D Artist | Scrum Master",
     // demoUrl: "https://example.com/figma",
    },

    {
      id: 5,
      title: "VIMYP",
  description: "A web-app platform for real-time multimodal route optimization and urban mobility analysis",
      image: "/placeholder.svg?height=600&width=800",
      date: "Sept 2024 - Feb 2025",
  tags: ["HTML", "CSS", "JS", "Docker", "UX/UI", "Smart Cities", "Data Visualization"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      fullDescription:
    "VIMYP is a smart city platform designed to enhance urban mobility by providing users with real-time, multimodal route planning and comprehensive traffic analytics. The platform integrates data from various transportation sources to offer optimized routing solutions, aiming to reduce congestion and promote sustainable travel options. As the UX/UI lead, I focused on creating an intuitive interface that presents complex data in an accessible manner, facilitating informed decision-making for both commuters and city planners.",
  techStack: ["CHart.js", "Leaflet", "Figma", "Adobe Dreamweaver"],
      challenges:
    "One of the main challenges was ensuring seamless integration of diverse data sources while maintaining a responsive and user-friendly interface. We addressed this by implementing efficient data handling techniques and conducting iterative user testing to refine the user experience.",
  role: "Lead UX/UI Designer & Frontend Developer | Scrum Master",
     // demoUrl: "https://example.com/figma",
    },

     {
      id: 6,
      title: "VIMYP",
  description: "A web-app platform for real-time multimodal route optimization and urban mobility analysis",
      image: "/placeholder.svg?height=600&width=800",
      date: "Sept 2024 - Feb 2025",
  tags: ["HTML", "CSS", "JS", "Docker", "UX/UI", "Smart Cities", "Data Visualization"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      fullDescription:
    "VIMYP is a smart city platform designed to enhance urban mobility by providing users with real-time, multimodal route planning and comprehensive traffic analytics. The platform integrates data from various transportation sources to offer optimized routing solutions, aiming to reduce congestion and promote sustainable travel options. As the UX/UI lead, I focused on creating an intuitive interface that presents complex data in an accessible manner, facilitating informed decision-making for both commuters and city planners.",
  techStack: ["CHart.js", "Leaflet", "Figma", "Adobe Dreamweaver"],
      challenges:
    "One of the main challenges was ensuring seamless integration of diverse data sources while maintaining a responsive and user-friendly interface. We addressed this by implementing efficient data handling techniques and conducting iterative user testing to refine the user experience.",
  role: "Lead UX/UI Designer & Frontend Developer | Scrum Master",
     // demoUrl: "https://example.com/figma",
    },

     {
      id: 7,
  title: "Interactive Geospatial Repository",
  description: "A digital platform for exploring and analyzing thematic cartographic studies",
      image: "/placeholder.svg?height=600&width=800",
      date: "Jan 2025 - Feb 2025",
  tags: ["QGIS", "Python", "GeoJSON", "Web Mapping", "Data Visualization"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      fullDescription:
    "An interactive web repository designed to centralize and visualize a diverse range of cartographic studies. Utilizing QGIS for geospatial data processing and Python for backend development, the platform allows users to navigate through various thematic maps, each accompanied by detailed metadata and analytical insights. The responsive design ensures accessibility across devices, facilitating educational and research applications in geospatial analysis.",
  techStack: ["QGIS", "Python", "GeoJSON", "Leaflet.js", "Django", "Figma"],
      challenges:
    "Integrating multiple geospatial datasets with varying formats and ensuring seamless interaction within the web interface posed significant challenges. These were addressed by standardizing data inputs and optimizing the rendering process for efficient user experience.",
  role: "Full Stack Developer & UX/UI Designer",
     // demoUrl: "https://example.com/figma",
    },
    {
  id: 8,
  title: "AidGuide – AI-Powered Robotic Guide Dog",
  description: "An autonomous navigation system for visually impaired users, combining AI, robotics and real-time urban perception",
  image: "/aidguide-robot.svg?height=600&width=800",
  date: "Feb 2025 - Jun 2025",
  tags: ["ROS2", "Python", "Computer Vision", "AI", "TurtleBot3", "Assistive Tech"],
  githubUrl: "https://github.com/irenemedina/aidguide",
  liveUrl: "https://aidguide.vercel.app",
  fullDescription:
    "AidGuide is a robotic guide dog developed to support visually impaired users in navigating urban environments safely and independently. Built on a TurtleBot3 platform using ROS2 and programmed in Python, the robot detects obstacles, pedestrians, traffic lights, and road conditions in real time. It intelligently calculates optimal routes, avoiding traffic jams and unsafe zones. The system is enhanced with a secure web-based control interface and biometric authentication (facial and fingerprint recognition) to personalize the experience and protect user privacy. I contributed to both the UX of the interface and the integration of hardware and vision systems.",
  techStack: ["ROS2", "Python", "OpenCV", "YOLO", "WebSockets", "React", "TensorFlow", "Three.js", "Ollama"],
  challenges:
    "The most complex challenge was achieving reliable real-time object detection in dynamic environments while ensuring smooth autonomous navigation. We solved this by fine-tuning lightweight AI models and designing fallback behaviors for uncertain scenarios.",
  role: "Software designer & dev",
  demoUrl: "https://youtu.be/aidguide-demo"
},

    
    
  ]

  const monthMap: { [key: string]: number } = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sept: 8, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };

  function parseEndDate(dateString: string): Date {
    const parts = dateString.split(" - ");
    const endDateStr = parts.length > 1 ? parts[1] : parts[0];
    const dateParts = endDateStr.split(" ");
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

  const projects = projectsData.sort((a, b) => {
    const dateA = parseEndDate(a.date);
    const dateB = parseEndDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  
  const allTags = Array.from(new Set(projects.flatMap((project) => project.tags))).sort()

  const filteredProjects =
    selectedTags.length > 0
      ? projects.filter((project) => selectedTags.some((tag) => project.tags.includes(tag)))
      : projects

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
          A collection of my recent work spanning web applications, 3D experiences, and design.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {selectedTags.length > 0 && (
          <Badge
            variant="secondary"
            className="cursor-pointer flex items-center gap-1"
            onClick={() => setSelectedTags([])}
          >
            <X className="h-3 w-3" />
            <span>Clear filters ({selectedTags.length})</span>
          </Badge>
        )}

        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => {
              setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
            }}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={() => openModal("project", project)} />
        ))}
      </motion.div>
    </div>
  )
}
