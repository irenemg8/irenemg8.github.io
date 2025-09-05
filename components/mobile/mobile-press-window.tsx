"use client"

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Newspaper, Search, Calendar, ExternalLink, BookOpen, Star } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileWindow } from './mobile-window'
import { StickyNote } from '../desktop/sticky-note'

interface PressItem {
  id: number
  platform: string
  logo: string
  title: string
  date: string
  excerpt: string
  fullArticle: string
  source: string
  contextualSummary: string
}

interface MobilePressWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function MobilePressWindow({ isOpen, onClose }: MobilePressWindowProps) {
  const { t } = useLanguage()
  const isMobile = useIsMobile()
  const [selectedArticle, setSelectedArticle] = useState<PressItem | null>(null)
  const [showStickyNote, setShowStickyNote] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Press articles data
  const pressItems: PressItem[] = [
    {
      id: 1,
      platform: "Gandía Innova - UPV",
      logo: "/press/catedrainnovacion.jpeg",
      title: "EcoCity: Smart Urban Planning Prototype by GTI Students",
      date: "Feb 2024",
      excerpt: "EcoCity is a sustainable city model developed by students of the GTI degree at UPV, using IoT and AI technologies to optimize urban mobility and environmental impact.",
      fullArticle: "EcoCity is a smart urban planning project created by students of the Bachelor's Degree in Interactive Technologies (GTI) at the Universitat Politècnica de València. The prototype integrates IoT sensors, data visualization, and decision-making algorithms to simulate a sustainable city environment.",
      source: "https://gandiainnova.webs.upv.es/blog/2024/02/26/prototipos-gti-iot-2024/",
      contextualSummary: "This article highlights EcoCity, a prototype that merges IoT technology and data analytics to model a more efficient and eco-friendly city."
    },
    {
      id: 2,
      platform: "3ª del Campus Salud Gandía",
      logo: "/press/upvgandia.jpg",
      title: "URBANVIVE Wins First Prize at the 3rd Campus Salud Gandía Hackathon",
      excerpt: "URBANVIVE, an interdisciplinary team from UPV, wins the top award with an innovative urban project enhancing public health through biotechnology and smart design.",
      date: "May 2025",
      fullArticle: "At the third edition of Campus Salud Gandía 2025, the URBANVIVE team was awarded the first prize for their groundbreaking urban innovation project. URBANVIVE proposes the development and installation of paving stones enriched with a beneficial microbiota.",
      source: "https://cienciagandia.webs.upv.es/ca/2025/05/tercera-edicio-campus-salud-gandia/",
      contextualSummary: "The article covers the victory of the URBANVIVE team at Campus Salud Gandía 2025, highlighting their award-winning project that uses microbiota-enhanced paving stones to improve urban public health."
    },
    {
      id: 3,
      platform: "Gandía Innova - UPV",
      logo: "/press/catedrainnovacion.jpeg",
      title: "EcoCity: Smart Streetlights Prototype Revolutionizes Urban Life",
      date: "Mar 2024",
      excerpt: "EcoCity introduces smart streetlight technology that goes beyond lighting, offering real-time environmental monitoring and intelligent control for modern urban environments.",
      fullArticle: "The EcoCity Smart Streetlights project represents a leap forward in the integration of IoT technology into urban infrastructure. Far from being just a lighting solution, EcoCity's smart streetlights actively monitor key environmental parameters in real time.",
      source: "https://gandiainnova.webs.upv.es/blog/2024/03/08/prototipos-iot-gti-2024/",
      contextualSummary: "This news article presents the EcoCity Smart Streetlights project, highlighting its innovative approach to urban lighting by integrating advanced IoT monitoring and smart control."
    },
    {
      id: 4,
      platform: "UPV Pódcast",
      logo: "/press/upv.png",
      title: "Talpa Tunneling UPV: Student Innovation Breaks Ground in TBM Tech",
      date: "May 2025",
      excerpt: "Talpa Tunneling UPV, a student team from Universitat Politècnica de València, takes on the global Not-a-Boring Competition by The Boring Company, pioneering new approaches in underground infrastructure.",
      fullArticle: "In a recent episode of 'Un Día Perfecte', the official podcast of Universitat Politècnica de València, the Talpa Tunneling UPV team shared their vision and technical journey in designing and building a custom tunnel boring machine (TBM) for The Boring Company's prestigious Not-a-Boring Competition.",
      source: "https://podcast.upv.es/programa/un-dia-perfecte/?episodio=talpa-tunneling-upv-las-locuritas-de-ursula",
      contextualSummary: "This article covers the Talpa Tunneling UPV team's feature on the UPV podcast, emphasizing their participation in the Not-a-Boring Competition, technical innovation, and the importance of interdisciplinary teamwork."
    },
    {
      id: 5,
      platform: "IES J. Martínez Ruiz - Azorín",
      logo: "/press/etwinning.jpg",
      title: "Breaking New Ground: First eTwinning Program Certified at Our School",
      date: "Apr 2020",
      excerpt: "In the 2019–2020 academic year, students from 3º ESO CD Bilingual at IES J. Martínez Ruiz - Azorín made history as the school's very first cohort to achieve official eTwinning certification.",
      fullArticle: "In the 2019–2020 academic year, students from 3º ESO CD Bilingual at IES J. Martínez Ruiz - Azorín made history as the school's very first cohort to achieve official eTwinning certification, setting a new standard for international collaboration and digital education.",
      source: "https://example.com/etwinning",
      contextualSummary: "This article celebrates the achievement of the first eTwinning certification at IES J. Martínez Ruiz - Azorín, highlighting international collaboration and digital education excellence."
    }
  ]

  // Filter articles based on search
  const filteredArticles = useMemo(() => {
    if (!searchTerm) return pressItems
    return pressItems.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const handleArticleClick = (article: PressItem) => {
    setSelectedArticle(article)
    setShowStickyNote(true)
  }

  const handleExternalLink = (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (url !== "https://example.com/etwinning") {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleCloseSticky = () => {
    setShowStickyNote(false)
    setSelectedArticle(null)
  }

  // Get unique platforms for stats
  const platforms = [...new Set(pressItems.map(item => item.platform))]
  const recentArticles = pressItems.filter(item => 
    item.date.includes('2024') || item.date.includes('2025')
  ).length

  // Mobile optimized content
  const mobileContent = (
    <div className="space-y-4">
      {/* Header info */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Newspaper className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Biblioteca de Prensa
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Artículos y menciones en medios sobre mis proyectos
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar artículos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Articles grid - Mobile optimized */}
      <div className="grid grid-cols-1 gap-4">
        {filteredArticles.map((article) => (
          <motion.div
            key={article.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/20 cursor-pointer shadow-sm"
            onClick={() => handleArticleClick(article)}
          >
            <div className="flex items-start space-x-4">
              {/* Platform logo */}
              <div className="w-12 h-12 flex-shrink-0">
                <Image 
                  src={article.logo} 
                  alt={article.platform}
                  width={48}
                  height={48}
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm line-clamp-2 mb-1">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {article.platform}
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {article.date}
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={(e) => handleExternalLink(article.source, e)}
                    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </motion.button>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {article.excerpt}
                </p>
                
                {/* Award badge for URBANVIVE */}
                {article.title.includes('URBANVIVE') && (
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-3 h-3 text-yellow-600 fill-yellow-600" />
                    <span className="text-xs text-yellow-600 font-medium">Primer Premio</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No results message */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No se encontraron artículos que coincidan con tu búsqueda
          </p>
        </div>
      )}

      {/* Quick stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {pressItems.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Artículos</div>
          </div>
          <div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {platforms.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Plataformas</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {recentArticles}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Recientes</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <MobileWindow
        isOpen={isOpen}
        onClose={onClose}
        title="Biblioteca de Prensa"
        maxHeight="90vh"
        customGradient="from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20"
      >
        {mobileContent}
      </MobileWindow>

      {/* Sticky Note para información detallada del artículo */}
      <AnimatePresence>
        {showStickyNote && selectedArticle && (
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
                  x: isMobile ? 20 : 400,
                  y: isMobile ? 120 : 100
                }}
                customContent={
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-4">
                      <Image 
                        src={selectedArticle.logo} 
                        alt={selectedArticle.platform}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
                          {selectedArticle.title}
                        </h3>
                        <p className="text-sm text-gray-600">{selectedArticle.platform}</p>
                        <p className="text-xs text-gray-500">{selectedArticle.date}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-700 mb-3">
                        {selectedArticle.contextualSummary}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        Resumen del artículo:
                      </h4>
                      <p className="text-xs text-gray-600 mb-3">
                        {selectedArticle.fullArticle.substring(0, 200)}...
                      </p>
                    </div>

                    {selectedArticle.title.includes('URBANVIVE') && (
                      <div className="flex items-center gap-2 p-2 bg-yellow-100 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                        <span className="text-xs text-yellow-700 font-medium">
                          Artículo sobre proyecto ganador
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-300">
                      <a
                        href={selectedArticle.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        Leer artículo completo
                      </a>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
