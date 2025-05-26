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
  title: "Geospatial Repository",
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
  id: 7,
  title: "AidGuide",
  description: "An autonomous navigation system for visually impaired users, combining AI, robotics and real-time urban perception",
  image: "/aidguide/logo.svg?height=600&width=800",
  date: "Feb 2025 - Jun 2025",
  tags: ["ROS2", "Python", "AI", "Computer Vision", "TurtleBot3", "Assistive Tech"],
  githubUrl: "https://github.com/vjrivmon/aidguide_04",
  liveUrl: "https://aidguide.vercel.app",
  fullDescription:
    "AidGuide is a robotic guide dog developed to support visually impaired users in navigating urban environments safely and independently. Built on a TurtleBot3 platform using ROS2 and programmed in Python, the robot detects obstacles, pedestrians, traffic lights, and road conditions in real time. It intelligently calculates optimal routes, avoiding traffic jams and unsafe zones. The system is enhanced with a secure web-based control interface and biometric authentication (facial and fingerprint recognition) to personalize the experience and protect user privacy. I contributed to both the UX of the interface and the integration of hardware and vision systems.",
  techStack: ["ROS2", "Python", "OpenCV", "YOLO", "WebSockets", "React", "TensorFlow", "Three.js", "Ollama"],
  challenges:
    "The most complex challenge was achieving reliable real-time object detection in dynamic environments while ensuring smooth autonomous navigation. We solved this by fine-tuning lightweight AI models and designing fallback behaviors for uncertain scenarios.",
  role: "Software designer & dev",
  demoUrl: "/under-construction"
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
  
  const allTags = Array.from(new Set(projects.flatMap((project) => (project.tags || [])))).sort()

  const tagColorSchemes = [
    {
      light: 'hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-500/30',
      dark: 'dark:hover:bg-pink-900/70 dark:hover:text-pink-300 dark:hover:border-pink-700 dark:hover:shadow-lg dark:hover:shadow-pink-600/40'
    },
    {
      light: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/30',
      dark: 'dark:hover:bg-blue-900/70 dark:hover:text-blue-300 dark:hover:border-blue-700 dark:hover:shadow-lg dark:hover:shadow-blue-600/40'
    },
    {
      light: 'hover:bg-green-50 hover:text-green-600 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/30',
      dark: 'dark:hover:bg-green-900/70 dark:hover:text-green-300 dark:hover:border-green-700 dark:hover:shadow-lg dark:hover:shadow-green-600/40'
    },
    {
      light: 'hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/30',
      dark: 'dark:hover:bg-purple-900/70 dark:hover:text-purple-300 dark:hover:border-purple-700 dark:hover:shadow-lg dark:hover:shadow-purple-600/40'
    },
    {
      light: 'hover:bg-teal-50 hover:text-teal-600 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/30',
      dark: 'dark:hover:bg-teal-900/70 dark:hover:text-teal-300 dark:hover:border-teal-700 dark:hover:shadow-lg dark:hover:shadow-teal-600/40'
    },
    {
      light: 'hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-300 hover:shadow-lg hover:shadow-yellow-500/30',
      dark: 'dark:hover:bg-yellow-900/70 dark:hover:text-yellow-300 dark:hover:border-yellow-700 dark:hover:shadow-lg dark:hover:shadow-yellow-600/40'
    },
    {
      light: 'hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/30',
      dark: 'dark:hover:bg-indigo-900/70 dark:hover:text-indigo-300 dark:hover:border-indigo-700 dark:hover:shadow-lg dark:hover:shadow-indigo-600/40'
    },
    {
      light: 'hover:bg-slate-100 hover:text-slate-600 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-500/20',
      dark: 'dark:hover:bg-slate-800/70 dark:hover:text-slate-300 dark:hover:border-slate-600 dark:hover:shadow-lg dark:hover:shadow-slate-600/30'
    }
  ];

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
        {allTags.map((tag, index) => {
          const scheme = tagColorSchemes[index % tagColorSchemes.length];
          const hoverClasses = `${scheme.light} ${scheme.dark}`;
          return (
            <Badge
              key={tag}
              variant={"outline"} 
              className={`cursor-default transition-all duration-200 ease-in-out ${hoverClasses}`}
            >
              {tag}
            </Badge>
          );
        })}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={() => openModal("project", project)} />
        ))}
      </motion.div>
    </div>
  )
}
