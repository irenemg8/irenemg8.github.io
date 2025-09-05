"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { HackathonCard } from "@/components/shared/hackathon-card"
import { StickyNote } from "@/components/desktop/sticky-note"

interface HackathonsSectionProps {
  openModal: (type: "hackathon", content: any) => void
  title?: string
}

export function HackathonsSection({ openModal, title = "Hackathons" }: HackathonsSectionProps) {
  const [showStickyNote, setShowStickyNote] = useState(false)
  const [stickyNoteContent, setStickyNoteContent] = useState<any>(null)
  
  const hackathons = [
    {
      id: 1,
      eventName: "eMobility",
      logo: "/hackathon/IMG_7130.jpeg",
      userPhoto: "/hackathon/profile-onklub.png",
      projectTitle: "EcoSpot",
      role: "Software Dev",
      description: "Participé en el Hackathon eMobility de Valencia, diseñando una aplicación móvil para estaciones de carga de vehículos eléctricos. El objetivo era promover soluciones de movilidad inteligentes, intuitivas y sostenibles.",
      date: "Sept 2023",
      awards: ["Semifinalistas"],
      fullStory:
        "Durante el hackathon de dos días, trabajé en un equipo que desarrolló una aplicación para localizar, reservar y revisar puntos de carga de vehículos eléctricos en tiempo real. Me centré en el diseño front-end y la experiencia de usuario (UX), creando una interfaz sencilla e intuitiva. Aplicamos métodos ágiles para desarrollar un MVP funcional y lo presentamos a los líderes del sector.",
      technologies: ["Axure", "Android", "Canva"],
      team: ["Irene Medina García", "Vicente Rivas Monferrer", "Teresa López Garrido", "Raúl Real González"],
      challenges:
        "Uno de los principales desafíos fue desarrollar un MVP funcional en menos de 36 horas, lo que requirió una rápida toma de decisiones y una estrecha coordinación. Además, la falta de datos de estaciones de carga en tiempo real nos obligó a simular respuestas, lo que complicó la integración del backend. Diseñar una experiencia de usuario que funcionara para diferentes tipos de usuarios de vehículos eléctricos exigió iteración y validación continuas. Finalmente, trabajar en un equipo multidisciplinario implicó alinear las perspectivas técnicas, de diseño y de negocio bajo una presión de tiempo constante.",
      githubUrl: "https://y37yne.axshare.com/?id=paqflt&p=registro",
      mediaUrl: "/hackathon/emobility.pdf",
    },
     {
    id: 2,
    eventName: "Safor Salut Hackathon – 3ª Edición",
    logo: "/hackathon/IMG_7131.png",
    userPhoto: "/hackathon/IMG_7131_back.png",
    projectTitle: "URBANVIVE",
    role: "Especialista UX/UI",
    description: "Un sistema de suelo inteligente con microbiota integrada para promover el bienestar al caminar.",
    date: "May 2025",
    awards: ["1º Premio"],
    fullStory:
      "UrbanVive es una solución innovadora de health-tech diseñada durante la 3ª edición del Hackathon Safor Salut en Gandía. El proyecto se centra en crear un sistema de suelo inteligente con microbiota integrada que interactúa con el cuerpo a través del contacto físico, promoviendo el bienestar al caminar. Más allá de la salud física, el sistema también incorpora retroalimentación sensorial e interacción ambiental para fomentar el caminar consciente y el alivio del estrés. Como Especialista UX/UI, fui responsable de todo el diseño de la experiencia del usuario, asegurando accesibilidad, claridad y compromiso emocional en toda la experiencia.",
    technologies: ["Figma", "Arduino", "Biosensores"],
    team: [
      "Irene Medina García (Especialista UX/UI)",
      "Pablo Rebollo De Miguel (Hardware Developer)",
      "Nuria Casañ (Especialista Biomédica)",
      "Juan Chucuri (Investigador Biológico)"
    ],
    challenges:
      "El principal desafío fue traducir la investigación compleja de microbiota en un producto tangible centrado en el usuario dentro de un marco de tiempo de 48 horas. Lo abordamos mediante la creación rápida de prototipos del concepto utilizando sprints interdisciplinarios y probando micro-interacciones con usuarios en tiempo real.",
    liveUrl: "https://www.canva.com/design/DAGmUaMmc1Q/qEBb7fra-d-sfrh8tSUNvQ/view?utm_content=DAGmUaMmc1Q&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h917ff62e5e",
    mediaUrl: "https://cienciagandia.webs.upv.es/ca/2025/05/tercera-edicio-campus-salud-gandia/amp/"
  },
    {
      id: 3,
      eventName: "Smart City Challenges 2025",
      logo: "/hackathon/vrain_logo.jpeg",
      userPhoto: "/hackathon/Irene-medina-CSG25.jpg",
      projectTitle: "Aura",
      role: "Diseñadora UX/UI & Frontend Dev",
      description: "Asistente impulsado por IA para personas invidentes.",
      date: "Jun 2025",
      awards: ["2º Premio"],
      fullStory:
        "Aura es una aplicación móvil innovadora diseñada para empoderar a personas con discapacidad visual transformando sus smartphones en asistentes personales inteligentes. Utilizando la cámara del dispositivo, reconocimiento de imágenes avanzado y retroalimentación de voz en tiempo real, Aura ayuda a los usuarios a navegar de forma independiente por espacios interiores y exteriores, identificar productos en supermercados (marca, propiedades, precio y más) y acceder a información visual detallada de su entorno. La aplicación va más allá de la navegación: busca cerrar brechas de accesibilidad integrando inteligencia artificial, datos abiertos e interacción por voz, ofreciendo una plataforma escalable para múltiples aplicaciones de ciudades inteligentes.",
      technologies: ["Figma", "React Native", "TypeScript", "Speech-To-Text", "AWS", "Open Data APIs"],
      team: ["Irene Medina García (UX/UI & Frontend)", "Vicente Rivas Monferrer (Backend)", "Ada González (Frontend)", "Raúl Fortea (Backend)"],
      challenges:
            "Nuestro principal desafío fue lograr un reconocimiento de imágenes en tiempo real de alta precisión en entornos diversos, mientras aseguramos una interacción de voz fluida y accesible para usuarios con diferentes niveles de pérdida visual. También priorizamos la privacidad del usuario y la seguridad de datos, implementando controles de permisos estrictos y procesando datos sensibles localmente siempre que fuera posible.",
      mediaUrl: "/hackathon/Memoria Técnica Aura.pdf",
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

  const handleHackathonClick = (hackathon: any) => {
    setStickyNoteContent(hackathon)
    setShowStickyNote(true)
  }

  const handleCloseSticky = () => {
    setShowStickyNote(false)
    setStickyNoteContent(null)
  }

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
          <HackathonCard key={hackathon.id} hackathon={hackathon} onClick={() => handleHackathonClick(hackathon)} />
        ))}
      </motion.div>
      
      {/* Sticky Note para información del hackathon */}
      <AnimatePresence>
        {showStickyNote && stickyNoteContent && (
          <div style={{ 
            position: 'fixed', 
            left: 0, 
            top: 0, 
            width: '100%', 
            height: '100%',
            pointerEvents: 'none',
            zIndex: 50000 
          }}>
            <div style={{ pointerEvents: 'auto' }}>
              <StickyNote
                onDelete={handleCloseSticky}
                onDragToTrash={handleCloseSticky}
                initialPosition={{ 
                  x: 400,
                  y: 100
                }}
                customContent={
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={stickyNoteContent.logo || "/placeholder.svg"} 
                        className="w-14 h-14 object-cover rounded-lg"
                        alt={stickyNoteContent.eventName}
                      />
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          {stickyNoteContent.projectTitle}
                        </h3>
                        <p className="text-sm text-gray-600">{stickyNoteContent.role}</p>
                        <p className="text-xs text-gray-500">{stickyNoteContent.date}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-700 mb-3">
                        {stickyNoteContent.description}
                      </p>
                    </div>

                    {stickyNoteContent.awards && stickyNoteContent.awards.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                          🏆 Premios:
                        </h4>
                        <ul className="text-xs space-y-1">
                          {stickyNoteContent.awards.map((award: string, idx: number) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2 text-yellow-600">•</span>
                              <span className="text-gray-600">{award}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {stickyNoteContent.technologies && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                          💻 Tecnologías:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {stickyNoteContent.technologies.map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-yellow-200/50 text-xs rounded-full text-gray-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {stickyNoteContent.team && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                          👥 Equipo:
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {stickyNoteContent.team.map((member: string, idx: number) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2 text-yellow-600">•</span>
                              <span>{member}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(stickyNoteContent.liveUrl || stickyNoteContent.githubUrl || stickyNoteContent.mediaUrl) && (
                      <div className="pt-2 border-t border-gray-300 space-y-1">
                        {stickyNoteContent.liveUrl && (
                          <a
                            href={stickyNoteContent.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            🔗 Ver proyecto
                          </a>
                        )}
                        {stickyNoteContent.githubUrl && (
                          <a
                            href={stickyNoteContent.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            📁 Repositorio
                          </a>
                        )}
                        {stickyNoteContent.mediaUrl && (
                          <a
                            href={stickyNoteContent.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            📄 Más información
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                }
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
