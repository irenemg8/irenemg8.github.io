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
      title: "GTI Hidropónico - sensor",
      description: "A smart sensor kit for monitoring vertical hydroponic gardens in real time",
      image: "/aidguide/gti.svg?height=600&width=800",
      date: "Sept 2022 - Feb 2023",
      tags: ["Arduino"],
      githubUrl: "/under-construction",
      liveUrl: "/under-construction",
      fullDescription:
    "GTI Hidropónico is a vertical hydroponic system enhanced with an Arduino-based sensor kit to monitor key environmental parameters. The system detects humidity, temperature, and signs of plant stress, alerting users instantly when their garden requires attention. Designed with urban sustainability in mind, it empowers users to grow healthy plants in small indoor spaces, while leveraging technology for precision farming.",
      techStack: ["Arduino", "ESP-IDF", "C++", "Chart.js"],
      challenges:
    "The main challenge was integrating reliable sensor data with user-friendly alerts. We solved it by calibrating the sensors under real conditions and designing a simple yet effective interface for timely feedback.",
      role: "Programmer | Scrum Master",
      demoUrl: "/under-construction",
    },
    {
      id: 2,
      title: "GTI Hidropónico - web",
      description: "A clean and responsive website to promote and sell smart hydroponic kits",
      image: "/aidguide/gti.svg?height=600&width=800",
      date: "Feb 2023 - Jun 2023",
      tags: ["HTML", "CSS", "JS", "PHP", "UX/UI", "Axure"],
      githubUrl: "/under-construction",
      liveUrl: "/under-construction",
      fullDescription:
    "This e-commerce platform was created to support the commercialization of GTI Hidropónico sensor kits. The website highlights the benefits of vertical hydroponic gardening and allows users to explore, customize, and purchase their smart garden kits online. Designed with a focus on simplicity and user trust, it features responsive layouts, engaging visuals, and clear product information to guide buyers through the decision-making process.",
      techStack: ["HTML", "CSS", "JS", "PHP", "UX/UI", "Axure"],
      challenges:
    "Crafting a brand identity that reflects innovation and sustainability was key. We focused on a minimal aesthetic with bold typography and used real-time user testing to optimize the purchase flow.",
      role: "UX/UI Designer & Frontend developer | Scrum Master",
      demoUrl: "/under-construction",
    },
    {
      id: 3,
      title: "EcoCity",
  description: "A connected streetlight network with air quality sensors and surveillance for safer, healthier cities",
      image: "/aidguide/logo_ecocity.png?height=600&width=800",
      date: "Sept 2023 - Feb 2024",
  tags: ["Android", "Java", "MQTT", "Raspberry Pi", "IoT"],
      githubUrl: "https://github.com/vjrivmon/IoT_Farola_",
      liveUrl: "/under-construction",
      fullDescription:
    "EcoCity is a smart city initiative focused on transforming traditional streetlights into intelligent nodes for environmental monitoring and urban security. Each streetlight is equipped with air quality sensors and a surveillance camera, all interconnected via MQTT and controlled through a Raspberry Pi. We developed an Android app that enables real-time visualization of pollution levels, alerts for unsafe air conditions, and access to live camera feeds. The solution enhances both environmental awareness and public safety, creating a more responsive and livable urban space.",
        techStack: ["Android Studio", "Java", "MQTT", "Raspberry Pi", "Firebase"],
      challenges:
    "Ensuring stable MQTT communication between multiple streetlights and the mobile app was technically demanding. We resolved it through efficient message routing and robust error handling within our IoT architecture.",
  role: "Mobile Developer & System Integration Designer | Scrum Master",
      demoUrl: "/under-construction",
    },
    {
      id: 4,
      title: "Yummy Fish",
  description: "A fun and fast-paced underwater game where you eat or get eaten to survive and evolve",
      image: "/aidguide/logo_yummy.svg?height=600&width=800",
      date: "Feb 2024 - Jun 2024",
  tags: ["Figma", "Unity", "C#", "3ds Max", "Game Design", "Audio Production"],
      githubUrl: "/under-construction",
      liveUrl: "/under-construction",
      fullDescription:
    "Yummy Fish is a 3D survival game where you play as a small fish trying to grow by eating smaller fish while avoiding being eaten by larger predators. The gameplay combines action, strategy, and progression mechanics in a colorful underwater world. All models and animations were created in Autodesk 3ds Max, and the original sound effects and background music were recorded and processed in the UPV professional sound booths. The game was developed in Unity and designed to deliver an engaging, intuitive experience with escalating difficulty and immersive feedback.",
  techStack: ["Unity", "C#", "3ds Max", "Audacity", "Blender", "Figma" ],
      challenges:
    "Balancing the difficulty curve and optimizing collision detection in a dynamic 3D environment was complex. We iteratively refined the mechanics using playtesting and data from in-game telemetry.",
      role: "Game Designer & Dev | 3D Artist | Scrum Master",
      demoUrl: "/under-construction",
    },

    {
      id: 5,
      title: "VIMYP",
  description: "A web-app platform for real-time multimodal route optimization and urban mobility analysis",
      image: "/aidguide/logo_vimyp.svg?height=600&width=800",
      date: "Sept 2024 - Feb 2025",
  tags: ["HTML", "CSS", "JS", "Docker", "UX/UI", "Smart Cities", "Data Visualization"],
      githubUrl: "https://github.com/vjrivmon/Codigos_Generales_PBIO_Sprint0",
      liveUrl: "https://vimyp.divdev.es/",
      fullDescription:
    "VIMYP is a smart city platform designed to enhance urban mobility by providing users with real-time, multimodal route planning and comprehensive traffic analytics. The platform integrates data from various transportation sources to offer optimized routing solutions, aiming to reduce congestion and promote sustainable travel options. As the UX/UI lead, I focused on creating an intuitive interface that presents complex data in an accessible manner, facilitating informed decision-making for both commuters and city planners.",
  techStack: ["CHart.js", "Leaflet", "Figma", "Adobe Dreamweaver"],
      challenges:
    "One of the main challenges was ensuring seamless integration of diverse data sources while maintaining a responsive and user-friendly interface. We addressed this by implementing efficient data handling techniques and conducting iterative user testing to refine the user experience.",
  role: "Lead UX/UI Designer & Frontend Developer | Scrum Master",
      demoUrl: "/under-construction",
    },

    
     {
      id: 6,
  title: "Geospatial Repository",
  description: "A digital platform for exploring and analyzing thematic cartographic studies",
      image: "/aidguide/repo_carto.png?height=600&width=800",
      date: "Jan 2025 - Feb 2025",
  tags: ["QGIS", "Python", "GeoJSON", "Web Mapping", "Data Visualization"],
      githubUrl: "https://github.com/irenemg8/Repo-Cartografia",
      liveUrl: "https://cartografia.divdev.es/", 
      fullDescription:
    "An interactive web repository designed to centralize and visualize a diverse range of cartographic studies. Utilizing QGIS for geospatial data processing and Python for backend development, the platform allows users to navigate through various thematic maps, each accompanied by detailed metadata and analytical insights. The responsive design ensures accessibility across devices, facilitating educational and research applications in geospatial analysis.",
  techStack: ["QGIS", "Python", "GeoJSON", "Leaflet.js", "Django", "Figma"],
      challenges:
    "Integrating multiple geospatial datasets with varying formats and ensuring seamless interaction within the web interface posed significant challenges. These were addressed by standardizing data inputs and optimizing the rendering process for efficient user experience.",
  role: "Full Stack Developer & UX/UI Designer",
     demoUrl: "/under-construction",
    },
    {
  id: 7,
  title: "AidGuide",
  description: "An autonomous navigation system for visually impaired users, combining AI, robotics and real-time urban perception",
  image: "/aidguide/logo.svg?height=600&width=800",
  date: "Feb 2025 - Jun 2025",
  tags: ["ROS2", "Python", "AI", "Computer Vision", "TurtleBot3", "Assistive Tech"],
  githubUrl: "https://github.com/vjrivmon/aidguide_04",
  liveUrl: "/under-construction",
  fullDescription:
    "AidGuide is a robotic guide dog developed to support visually impaired users in navigating urban environments safely and independently. Built on a TurtleBot3 platform using ROS2 and programmed in Python, the robot detects obstacles, pedestrians, traffic lights, and road conditions in real time. It intelligently calculates optimal routes, avoiding traffic jams and unsafe zones. The system is enhanced with a secure web-based control interface and biometric authentication (facial and fingerprint recognition) to personalize the experience and protect user privacy. I contributed to both the UX of the interface and the integration of hardware and vision systems.",
  techStack: ["ROS2", "Python", "OpenCV", "YOLO", "WebSockets", "React", "TensorFlow", "Three.js", "Ollama"],
  challenges:
    "The most complex challenge was achieving reliable real-time object detection in dynamic environments while ensuring smooth autonomous navigation. We solved this by fine-tuning lightweight AI models and designing fallback behaviors for uncertain scenarios.",
  role: "Software designer & dev",
  demoUrl: "/under-construction"
},

{
  id: 8,
  title: "NeuroSpot",
  description: "An interactive assessment platform using cognitive games and AWS cloud services to screen for early ADHD indicators in children.",
  image: "/aidguide/neurospot.svg?height=600&width=800",
  date: "May 2025",
  tags: ["AWS", "React", "Node.js", "Cognitive Games", "UX/UI", "Serverless", "AI", "Education Tech"],
  githubUrl: "https://github.com/vjrivmon/NeuroSpot",
  liveUrl: "/under-construction",
  fullDescription:
  "NeuroSpot is an innovative platform designed to support early detection of potential ADHD indicators in children through interactive cognitive games. The system integrates a suite of short, engaging tasks that assess attention, memory, and impulse control. Leveraging AWS services such as S3, CloudFront, Lambda, Rekognition, Transcribe, and Comprehend, NeuroSpot provides real-time analytics, automated feedback, and secure storage of sensitive data. As part of the development team, I contributed to the architecture, UI/UX design, and the implementation of cloud-based functionalities to ensure a seamless and secure user experience for both children and educators.",
  techStack: ["React", "Node.js", "AWS", "Figma", "Jest" ],  
  challenges:
  "The main challenge was integrating multiple AWS services to provide real-time analysis and maintaining strict compliance with data privacy standards for children. We addressed this through modular serverless architectures and rigorous user testing to ensure accessibility and reliability.",
  role: "Full Stack Developer & UX Designer",
  demoUrl: "/under-construction"
},

{
  id: 9,
  title: "Othello",
  description: "A competitive AI agent for Othello, leveraging Minimax with alpha-beta pruning and custom heuristics.",
  image: "/aidguide/othello.png?height=600&width=800",
  date: "May 2025",
  tags: ["Unity", "C#", "AI", "Minimax", "Alpha-Beta Pruning", "Heuristic Design"],
  githubUrl: "https://github.com/irenemg8/othello_game",
  liveUrl: "https://irenemg8.github.io/othello_game/",
  fullDescription:
  "Othello Battle AI is a competitive artificial intelligence agent developed for the game Othello, designed to participate in academic tournaments. Implemented in C# within the Unity engine, the agent utilizes the Minimax algorithm with alpha-beta pruning to optimize its decision-making. A custom evaluation heuristic was engineered to balance positional strength, mobility, and game phase dynamics, aiming for both defensive and offensive strategies. This project showcases advanced AI logic, algorithmic efficiency, and a robust user interface for real-time gameplay.",
  techStack: ["Unity", "C#", "Minimax", "Alpha-Beta Pruning", "Custom Heuristics"],
  challenges:
    "The primary challenge was balancing AI performance and computational efficiency under strict tournament constraints. Fine-tuning the evaluation function to achieve strong gameplay across all phases of Othello required iterative testing, data-driven refinements, and a deep understanding of both algorithmic theory and game mechanics.",
  role: "AI Developer & Game Designer",
  demoUrl: "https://irenemg8.github.io/othello_game/"
},

{
  id: 10,
  title: "Cops and Robbers",
  description: "A strategic multiplayer board game simulation featuring AI-driven agents and real-time pursuit logic.",
  image: "/aidguide/cops.webp?height=600&width=800",
  date: "May 2024",
  tags: ["Unity", "C#", "AI"],
  githubUrl: "https://github.com/vjrivmon/cops-and-robbers",
  liveUrl: "/under-construction",
  fullDescription:
  "Cops and Robbers is a simulation-based multiplayer board game developed as an academic team project. The game models the classic pursuit-evasion dynamic, where players take on the roles of cops or robbers. Advanced AI agents utilize graph-based pathfinding algorithms to optimize their movements and strategies. The simulation incorporates real-time decision-making, obstacle avoidance, and player-versus-player logic, delivering a competitive and educational experience. My contributions focused on AI behavior design, game mechanics development, and optimizing the simulation for seamless multiplayer interaction.",
  techStack: ["C#", "Graph Algorithms"],  
  challenges:
    "The main challenge involved designing efficient AI for both pursuit and evasion in complex, variable game environments. Achieving balanced gameplay and real-time responsiveness required iterative tuning of pathfinding algorithms and robust game logic architecture.",
  role: "AI & Gameplay Developer",
  demoUrl: "/under-construction"
},

{
  id: 11,
  title: "Blackjack",
  description: "A digital adaptation of the classic Blackjack card game featuring intuitive UI, robust game logic, and AI opponents.",
  image: "/aidguide/blackjack.webp?height=600&width=800",
  date: "May 2024",
  tags: ["Unity", "C#", "AI"],
  githubUrl: "https://github.com/vjrivmon/blackjack",
  liveUrl: "/under-construction",
  fullDescription:
  "Blackjack is a digital recreation of the iconic casino card game, developed as a collaborative academic project. The game offers a polished, user-friendly interface and faithfully implements the official rules and betting mechanics of Blackjack. The application features AI-driven opponents with varying levels of difficulty, enhancing replay value and strategic challenge. My contributions included designing the UI for a smooth player experience, programming core game logic, and developing the AI behavior to simulate real-life dealer and player actions.",
  techStack: ["C#", "Graph Algorithms"],  
  challenges:
  "The key challenge was ensuring accurate rule enforcement and dynamic game flow while maintaining a responsive, intuitive user interface. Developing AI strategies for opponents required balancing realism and fun across different skill levels.",
role: "UI/UX Designer & Game Developer",
demoUrl: "/under-construction"
},

{
  id: 12,
  title: "Torres de Hanoi",
  description: "An interactive visualization and solver for the classic Towers of Hanoi puzzle with step-by-step guidance.",
  image: "/aidguide/torres.jpeg?height=600&width=800",
  date: "Mar 2024",
  tags: ["Unity", "C#", "AI"],
  githubUrl: "https://github.com/vjrivmon/torres-de-hanoi",
  liveUrl: "/under-construction",
  fullDescription:
  "Towers of Hanoi is an educational application that visualizes and solves the legendary recursive puzzle. The tool offers an intuitive UI allowing users to manually solve the puzzle or watch an automated step-by-step solution, effectively demonstrating recursion principles in computer science. The project emphasizes didactic clarity and visual engagement, making complex algorithms accessible for students and enthusiasts. My role involved UI/UX design, algorithm implementation, and enhancing user interactivity for a smooth learning experience.",
  techStack: ["C#", "Graph Algorithms"],  
  challenges:
    "The main challenge was translating recursive algorithm logic into clear, real-time visual feedback for users. Ensuring both educational value and usability required close attention to interface design and performance optimization.",
  role: "UI/UX Designer & Algorithm Developer",
  demoUrl: "/under-construction"
},

{
  id: 13,
  title: "Talpa Tunneling UPV",
  description: "A multidisciplinary engineering project developing a custom tunnel boring machine (TBM) for the Not-A-Boring Competition.",
  image: "/aidguide/talpa.svg?height=600&width=800",
  date: "Apr 2025 - Apr 2026",
  tags: ["Mechanical Engineering", "Robotics", "Automation", "CAD", "IoT"],
  githubUrl: "https://github.com/Talpa-Tunneling-UPV",
  liveUrl: "/under-construction",
  fullDescription:
    "Talpa Tunneling UPV is a student-led initiative at Universitat Politècnica de València aimed at designing and building a fully functional tunnel boring machine (TBM) to compete in The Boring Company's Not-A-Boring Competition. The project integrates mechanical design, robotics, real-time monitoring, and automation systems, following an agile methodology to drive rapid prototyping and interdisciplinary collaboration. My contributions centered on software architecture for sensor data acquisition, real-time dashboard visualization, and supporting the control system for autonomous tunneling operations. The project exemplifies innovation, teamwork, and the application of cutting-edge technology to real-world infrastructure challenges.",
  techStack: ["Figma", "Python", "ROS2", "Node.js", "React"],
  challenges:
    "The key challenges included achieving reliable mechanical performance in harsh conditions, integrating hardware and software components, and ensuring robust real-time communication between subsystems. Iterative testing and cross-functional collaboration were crucial to optimizing both tunneling speed and system stability.",
  role: "Software Systems Engineer & Dashboard Developer",
  demoUrl: "/under-construction"
},

{
  id: 14,
  title: "3D Portfolio Demo",
  description: "Personal portfolio that blends advanced 3D graphics with UX/UI best practices, redefining how creative professionals showcase work online.",
  image: "/aidguide/portfolio.png?height=600&width=800",
  date: "Mar 2025",
  tags: ["3D", "UX/UI", "Portfolio", "Web Design", "Animation"],
  githubUrl: "https://github.com/irenemg8/Portfolio",
  liveUrl: "https://irene.divdev.es/",
  fullDescription:
  "The 3D Portfolio Demo is a prototype personal website designed to set a new benchmark in digital self-presentation for creative professionals. Combining real-time 3D elements, interactive navigation, and smooth animations, the site offers an immersive user experience while adhering to best practices in accessibility and responsive design. Custom assets—including floating clouds, stylized flowers, and Greek columns—were modeled in Blender and integrated using Three.js and React. The project prioritizes both aesthetics and usability, delivering a visually striking and highly functional portfolio platform. My contributions spanned 3D modeling, front-end development, animation, and overall UX strategy, ensuring the project aligns with contemporary digital storytelling trends.",
  techStack: ["Blender", "Three.js", "React", "Figma", "Tailwind CSS"],
  challenges:
    "The primary challenge was achieving optimal performance and compatibility across devices while delivering rich 3D interactions. Careful optimization of assets, efficient use of JavaScript libraries, and a mobile-first approach were crucial for a seamless user experience.",
    role: "Designer & Developer",
    demoUrl: "https://irene.divdev.es/"
},
    {
  id: 15,
  title: "Aura",
  description: "An all-in-one assistant app for visually impaired users, integrating multiple accessibility tools into a single, seamless experience.",
  image: "/aidguide/aura.png?height=600&width=800",
  date: "May 2025 - Jun 2025",
  tags: ["Accessibility", "Voice Control", "Computer Vision", "Assistive Tech", "Mobile App"],
  githubUrl: "https://github.com/agonfer/auraFlutter",
  liveUrl: "/under-construction",
  fullDescription:
    "Aura is an intelligent assistant app designed specifically for blind and visually impaired users. Unlike fragmented accessibility solutions that require switching between multiple applications, Aura unifies all essential assistive functionalities into one intuitive platform. The app uses the smartphone camera to interpret the surrounding environment in real time, enabling obstacle detection, product price recognition in supermarkets, and money denomination identification. Users can interact with Aura via voice commands without needing to touch any buttons, allowing for hands-free operation. Navigation guidance, object detection, and voice-based querying are just a few of the core features. Aura redefines independence by transforming complex everyday tasks into accessible interactions, powered by cutting-edge technologies such as AI, computer vision, and voice recognition.",
  techStack: ["TensorFlow Lite", "React Native", "Google Cloud Vision", "Speech-to-Text API", "Figma"],
  challenges:
    "The main challenge was consolidating diverse assistive technologies into a single, coherent user experience optimized for accessibility. Balancing real-time camera processing, voice interaction, and system responsiveness required precise engineering and user-centric design thinking.",
    role: "Lead Designer & Frontend Developer",
    demoUrl: "/under-construction"
},
{
  "id": 16,
  "title": "PyCatan",
  "description": "A fully playable digital adaptation of 'The Settlers of Catan' board game, built in Python with a modular architecture and turn-based mechanics.",
  "image": "/aidguide/catan.jpg?height=600&width=800",
  "date": "May 2025 - Jun 2025",
  "tags": ["Python", "Game Development", "Turn-Based", "OOP", "CLI"],
  "githubUrl": "https://github.com/vjrivmon/PyCatan",
  "liveUrl": "/under-construction",
  "fullDescription":
    "PyCatan is a terminal-based implementation of the iconic strategy board game 'The Settlers of Catan', built from scratch using Python. The project captures the core mechanics of the original game—resource collection, settlement building, trading, and strategic expansion—through a text-based interface. Developed as part of a collaborative software engineering exercise, the game employs a clean object-oriented architecture, with separate modules handling game state, player interactions, dice rolls, and map generation. While minimalist in visuals, the gameplay remains rich and faithful to the board game experience. The project served as a foundation to explore concepts such as state machines, input validation, and event-driven logic in a constrained environment.",
  "techStack": ["Python", "OOP", "Terminal UI"],
  "challenges":
    "The greatest challenge was designing a scalable and maintainable game logic system that could handle the complexity of Catan's ruleset without a graphical interface. Managing player state, turn sequences, and resource transactions via console inputs required careful planning and rigorous testing.",
  "role": "Developer & Game Logic Architect",
  "demoUrl": "/under-construction"
},

{
  "id": 17,
  "title": "PromptGen",
  "description": "A lightweight prompt management tool that streamlines the creation, organization, and reuse of AI prompts for productivity and creative workflows.",
  "image": "/aidguide/promptgen.png?height=600&width=800",
  "date": "Jun 2025",
  "tags": ["AI", "Prompt Engineering", "Productivity", "Next.js"],
  "githubUrl": "https://github.com/irenemg8/promptgen",
  "liveUrl": "https://irenemg8.github.io/promptgen/",
  "fullDescription":
    "PromptGen is a web-based utility designed for developers, designers, and AI power users who work frequently with generative tools such as ChatGPT, Midjourney, and DALL·E. The app allows users to create, tag, organize, and retrieve custom AI prompts in a fast and structured way. Built with scalability and UX in mind, PromptGen includes features like dynamic prompt templates, tag-based filtering, and clipboard export for seamless integration into creative workflows. It also supports user authentication and persistent cloud storage, making it a go-to solution for managing personal or team-based prompt libraries.",
  "techStack": ["Next.js", "Tailwind CSS", "TypeScript", "Firebase"],
  "challenges":
    "The biggest challenge was designing a user-friendly system for dynamically managing and categorizing prompts while ensuring real-time performance and responsiveness. Balancing simplicity with power-user features required careful UX strategy and performance optimization.",
  "role": "Full-Stack Developer & UI/UX Designer",
  "demoUrl": "https://irenemg8.github.io/promptgen/"
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
