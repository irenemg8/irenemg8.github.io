"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { 
  Calendar, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Heart, 
  Coffee,
  Palette,
  Code,
  Music,
  Camera,
  Plane,
  BookOpen,
  Lightbulb,
  Target,
  Star
} from "lucide-react"

interface TimelineItem {
  id: string
  year: string
  date: string
  title: string
  organization: string
  location: string
  description: string
  type: 'work' | 'education' | 'achievement' | 'personal'
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
  skills?: string[]
}

const timelineData: TimelineItem[] = [
  {
    id: '2024',
    year: '2024',
    date: 'Presente',
    title: 'Senior UX/UI Designer & Frontend Developer',
    organization: 'Freelance',
    location: 'Madrid, España',
    description: 'Especializada en crear experiencias digitales inolvidables. Diseño interfaces modernas y desarrollo soluciones frontend de alto rendimiento.',
    type: 'work',
    icon: Briefcase,
    color: 'from-lavender-500 to-lilac-600',
    skills: ['React', 'Next.js', 'Figma', 'Framer Motion', 'Three.js']
  },
  {
    id: '2023',
    year: '2023',
    date: 'Nov 2023',
    title: 'UX/UI Design Certification',
    organization: 'Google',
    location: 'Online',
    description: 'Certificación profesional en diseño UX/UI con enfoque en metodologías ágiles y design thinking.',
    type: 'education',
    icon: GraduationCap,
    color: 'from-blue-500 to-indigo-600',
    skills: ['Design Thinking', 'Prototyping', 'User Research', 'Figma']
  },
  {
    id: '2022',
    year: '2022',
    date: 'Sep 2022',
    title: 'Frontend Developer',
    organization: 'TechCorp',
    location: 'Barcelona, España',
    description: 'Desarrollo de aplicaciones web modernas con React y TypeScript. Implementación de sistemas de diseño y optimización de rendimiento.',
    type: 'work',
    icon: Code,
    color: 'from-green-500 to-emerald-600',
    skills: ['React', 'TypeScript', 'SASS', 'Git', 'Agile']
  },
  {
    id: '2021',
    year: '2021',
    date: 'Ene 2021',
    title: 'Hackathon Winner',
    organization: 'Innovation Challenge',
    location: 'Madrid, España',
    description: 'Primer lugar en hackathon de innovación social con una app para conectar voluntarios con ONGs locales.',
    type: 'achievement',
    icon: Award,
    color: 'from-yellow-500 to-orange-600',
    skills: ['Innovation', 'Team Leadership', 'MVP Development']
  },
  {
    id: '2020',
    year: '2020',
    date: 'Jun 2020',
    title: 'Grado en Ingeniería Informática',
    organization: 'Universidad Politécnica de Valencia',
    location: 'Valencia, España',
    description: 'Graduada con matrícula de honor. Especialización en desarrollo web y experiencia de usuario.',
    type: 'education',
    icon: GraduationCap,
    color: 'from-purple-500 to-pink-600',
    skills: ['Computer Science', 'Web Development', 'Database Design']
  }
]

const personalFacts = [
  { icon: Coffee, text: "Consumo 4+ cafés al día", color: "text-amber-600" },
  { icon: Music, text: "Toco el piano desde los 8 años", color: "text-purple-600" },
  { icon: Camera, text: "Aficionada a la fotografía urbana", color: "text-blue-600" },
  { icon: Plane, text: "He visitado 15 países", color: "text-green-600" },
  { icon: BookOpen, text: "Leo 20+ libros al año", color: "text-orange-600" },
  { icon: Heart, text: "Voluntaria en animal shelter", color: "text-red-500" }
]

const skills = {
  design: [
    { name: "Figma", level: 95 },
    { name: "Adobe XD", level: 88 },
    { name: "Sketch", level: 82 },
    { name: "Photoshop", level: 90 },
    { name: "Illustrator", level: 85 }
  ],
  development: [
    { name: "React", level: 93 },
    { name: "TypeScript", level: 88 },
    { name: "Next.js", level: 90 },
    { name: "Tailwind CSS", level: 95 },
    { name: "Framer Motion", level: 87 }
  ],
  tools: [
    { name: "Git", level: 90 },
    { name: "Docker", level: 75 },
    { name: "AWS", level: 70 },
    { name: "Notion", level: 92 },
    { name: "Slack", level: 88 }
  ]
}

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeTimelineItem, setActiveTimelineItem] = useState<string | null>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  useEffect(() => {
    // Easter egg for achievements
    if (typeof window !== 'undefined' && (window as any).portfolioAchievements) {
      (window as any).portfolioAchievements.addEasterEgg('about_section_visited')
    }
  }, [])

  return (
    <section 
      ref={containerRef}
      id="about"
      className="py-20 md:py-32 bg-gradient-to-br from-lavender-50/30 via-background to-lilac-50/20 dark:from-lavender-950/20 dark:via-background dark:to-lilac-950/10"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            {/* Stylized Avatar */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <motion.div
                className="w-full h-full rounded-full bg-gradient-to-br from-lavender-400 via-lilac-500 to-lavender-600 p-1"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-lavender-200 to-lilac-300 dark:from-lavender-800 dark:to-lilac-900 flex items-center justify-center overflow-hidden">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                    className="text-6xl"
                  >
                    👩🏻‍💻
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Floating elements around avatar */}
              {[Palette, Code, Heart, Lightbulb].map((Icon, index) => (
                <motion.div
                  key={index}
                  className="absolute"
                  style={{
                    left: `${50 + 40 * Math.cos((index * Math.PI) / 2)}%`,
                    top: `${50 + 40 * Math.sin((index * Math.PI) / 2)}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2 + index * 0.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center">
                    <Icon size={16} className="text-lavender-600 dark:text-lavender-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-6">
            <span className="bg-gradient-to-r from-lavender-600 via-lilac-500 to-lavender-700 bg-clip-text text-transparent">
              Sobre mí
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Soy una apasionada del diseño y la tecnología. Me encanta crear experiencias 
            digitales que no solo funcionen perfectamente, sino que también emocionen e inspiren.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-poppins font-semibold mb-8 flex items-center gap-2">
              <Calendar className="text-lavender-600" size={24} />
              Mi Trayectoria
            </h3>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700">
                <motion.div
                  className="w-full bg-gradient-to-b from-lavender-500 to-lilac-600 origin-top"
                  style={{ 
                    scaleY: useTransform(scrollYProgress, [0.2, 0.8], [0, 1])
                  }}
                />
              </div>

              {/* Timeline items */}
              {timelineData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className={`relative flex items-start gap-4 pb-8 cursor-pointer transition-all duration-300 ${
                    activeTimelineItem === item.id ? 'scale-105' : ''
                  }`}
                  onMouseEnter={() => setActiveTimelineItem(item.id)}
                  onMouseLeave={() => setActiveTimelineItem(null)}
                >
                  {/* Timeline dot */}
                  <motion.div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${item.color} shadow-lg`}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <item.icon size={16} className="text-white" />
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    className={`flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border transition-all duration-300 ${
                      activeTimelineItem === item.id 
                        ? 'border-lavender-300 dark:border-lavender-700 shadow-xl' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    layout
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-foreground text-lg">{item.title}</h4>
                      <span className="text-sm font-medium px-2 py-1 rounded-full bg-lavender-100 dark:bg-lavender-900 text-lavender-700 dark:text-lavender-300">
                        {item.year}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <span className="font-medium">{item.organization}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {item.location}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    {item.skills && (
                      <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill, skillIndex) => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.6 + index * 0.1 + skillIndex * 0.05 }}
                            className="px-2 py-1 text-xs rounded-full bg-lavender-100 dark:bg-lavender-900 text-lavender-700 dark:text-lavender-300"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills & Personal Facts */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-12"
          >
            {/* Skills */}
            <div>
              <h3 className="text-2xl font-poppins font-semibold mb-8 flex items-center gap-2">
                <Target className="text-lavender-600" size={24} />
                Habilidades
              </h3>

              <div className="space-y-8">
                {Object.entries(skills).map(([category, skillList], categoryIndex) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 + categoryIndex * 0.1 }}
                  >
                    <h4 className="font-semibold text-foreground capitalize mb-4 text-lg">
                      {category === 'design' ? 'Diseño' : category === 'development' ? 'Desarrollo' : 'Herramientas'}
                    </h4>
                    
                    <div className="space-y-3">
                      {skillList.map((skill, skillIndex) => (
                        <div key={skill.name} className="flex items-center justify-between">
                          <span className="text-muted-foreground font-medium">{skill.name}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-lavender-500 to-lilac-600 rounded-full"
                                initial={{ width: 0 }}
                                animate={isInView ? { width: `${skill.level}%` } : {}}
                                transition={{ 
                                  delay: 0.8 + categoryIndex * 0.1 + skillIndex * 0.05,
                                  duration: 1,
                                  ease: "easeOut"
                                }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground font-medium w-8">
                              {skill.level}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Personal Facts */}
            <div>
              <h3 className="text-2xl font-poppins font-semibold mb-8 flex items-center gap-2">
                <Star className="text-lavender-600" size={24} />
                Datos Curiosos
              </h3>

              <div className="grid gap-4">
                {personalFacts.map((fact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-lavender-300 dark:hover:border-lavender-700 transition-all duration-300"
                  >
                    <fact.icon size={20} className={fact.color} />
                    <span className="text-muted-foreground">{fact.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-20"
        >
          <p className="text-lg text-muted-foreground mb-8">
            ¿Te gusta lo que ves? ¡Hablemos de tu próximo proyecto!
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(147, 51, 234, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-lavender-500 to-lilac-600 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Contactar
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}