"use client"

import { useState, useMemo, useRef, forwardRef } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Search, Calendar, BookOpen, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
// import HTMLFlipBook from 'react-pageflip' // Temporarily commented due to installation issues

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

const pressItems: PressItem[] = [
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
    platform: "3ª del Campus Salud Gandía",
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
      "The EcoCity Smart Streetlights project represents a leap forward in the integration of IoT technology into urban infrastructure. Far from being just a lighting solution, EcoCity's smart streetlights actively monitor key environmental parameters in real time, including temperature, humidity, smoke levels, and noise pollution. The system empowers city administrators and residents by allowing the adjustment of streetlight brightness through a dedicated Android application. Furthermore, users receive instant alerts whenever environmental thresholds are exceeded, enabling proactive responses to changing urban conditions. This innovative prototype aims to enhance quality of life, promote safety, and pave the way for smarter, greener cities. The project was developed by a multidisciplinary team from the Universitat Politècnica de València: Rubén García Quiralte, Pablo Meana Gonzalez, Irene Medina García, Pablo Rebollo de Miguel, and Vicente Jose Rivas Monferrer.",
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
  {
    id: 5,
    platform: "UPV Pódcast",
    logo: "/press/upv.png?height=200&width=200",
    title: "Talpa Tunneling UPV: Student Innovation Breaks Ground in TBM Tech",
    date: "May 2025",
    excerpt:
      "Talpa Tunneling UPV, a student team from Universitat Politècnica de València, takes on the global Not-a-Boring Competition by The Boring Company, pioneering new approaches in underground infrastructure.",
    fullArticle:
      "In a recent episode of 'Un Día Perfecte', the official podcast of Universitat Politècnica de València, the Talpa Tunneling UPV team shared their vision and technical journey in designing and building a custom tunnel boring machine (TBM) for The Boring Company's prestigious Not-a-Boring Competition. The interview highlighted the team's multidisciplinary collaboration across engineering, robotics, and software, as well as their innovative approach to automation, real-time monitoring, and sustainable tunnel construction.\n\nThe podcast delved into the real-world challenges faced by the students, such as integrating hardware and software subsystems, optimizing for safety and efficiency, and iterating design prototypes under time constraints. Team members discussed how agile methodologies and the UPV's ecosystem of support allowed them to translate academic theory into impactful, practical engineering solutions. The experience not only propels the university onto the international stage but also inspires a new generation of engineers to reimagine infrastructure for the future.",
    source: "https://podcast.upv.es/programa/un-dia-perfecte/?episodio=talpa-tunneling-upv-las-locuritas-de-ursula",
    contextualSummary:
      "This article covers the Talpa Tunneling UPV team's feature on the UPV podcast, emphasizing their participation in the Not-a-Boring Competition, technical innovation, and the importance of interdisciplinary teamwork in large-scale engineering projects."
  },
  {
    id: 6,
    platform: "IES J. Martínez Ruiz - Azorín",
    logo: "/press/etwinning.jpg?height=200&width=200",
    title: "Breaking New Ground: First eTwinning Program Certified at Our School",
    date: "Apr 2020",
    excerpt:
      "In the 2019–2020 academic year, students from 3º ESO CD Bilingual at IES J. Martínez Ruiz - Azorín made history as the school's very first cohort to achieve official eTwinning certification, setting a new standard for international collaboration and digital education.",
    fullArticle:
    "The 2019–2020 school year marked a turning point at IES J. Martínez Ruiz - Azorín as the bilingual students of 3º ESO CD pioneered the school's inaugural eTwinning program. As the first group to ever receive the eTwinning Certificate, these students set a precedent for innovative and international digital education within our institution. The project enabled the students to connect and collaborate with their European peers through the eTwinning platform, developing joint presentations, fostering language skills, and experiencing real-world teamwork in a digital environment. This collaborative journey not only enhanced their digital literacy and intercultural understanding but also positioned our school as a leader in educational innovation.\n\nAs a highlight of their efforts, the students created a multimedia presentation that reflects the milestones, challenges, and growth they experienced during the project. The recognition with the official eTwinning Certificate stands as a testament to their commitment and vision for a globally connected future. To discover more about this groundbreaking project, you can view the students' presentation through the following link.",
    source: "https://www.murciaeduca.es/iesjmartinezruizazorin/sitio/index.cgi?wid_seccion=36&wid_item=189",
    contextualSummary:
    "This article covers the achievement of the first-ever eTwinning certification at IES J. Martínez Ruiz - Azorín, highlighting the bilingual students' leadership in launching an international collaborative project and its impact on digital and intercultural education at the school."
  },
  {
    id: 7,
    platform: "Bon Dia Safor",
    logo: "/press/urbalab.png?height=200&width=200",
    title: "UrbanVive Showcased at Innpulso Emprende Gandía 2025",
    date: "Jun 2025",
    excerpt:
      "Our award-winning project UrbanVive, which earned first prize at the Campus Salud Gandía Hackathon, was featured at the VIII Innpulso Emprende Gandía 2025, a national innovation contest supported by the Ministry of Science, Innovation and Universities.",
    fullArticle:
      "As part of the VIII Innpulso Emprende Gandía 2025, our team had the opportunity to present UrbanVive, the smart city health-tech project that previously won first prize at the Campus Salud Gandía Hackathon. Organized under the umbrella of the 'Red Innpulso – Network of Science and Innovation Cities', and supported by Spain's Ministry of Science, Innovation and Universities, the event brought together high-impact proposals from across the country.\n\nUrbanVive was one of nine standout projects evaluated by the jury, which assessed submissions based on their technical feasibility, level of innovation, potential territorial impact, and alignment with the strategic objectives of Gandía's Urban Agenda. We're proud to have participated in a forum where innovation and real-world impact converge.\n\nThe event highlighted UrbanVive's continued growth and validation, reinforcing its mission to enhance urban well-being through technology. For a full list of finalists and more details about the initiative, visit the official site: https://www.urbalabgandia.com/es/innpulso-emprende-2025/",
    source: "https://www.urbalabgandia.com/es/innpulso-emprende-2025/",
    contextualSummary:
      "This press entry highlights UrbanVive's selection and presentation at Innpulso Emprende Gandía 2025, following its initial recognition as the winning project at the Campus Salud Hackathon. The project's inclusion in a national innovation contest demonstrates its technical maturity, innovative approach, and alignment with urban sustainability goals."
  },
  {
    id: 19,
    platform: "ENHANCE Alliance",
    logo: "/press/enhance.jpg?height=200&width=200",
    title: "Selected for the ENHANCE Summer School in Climate Change 2025",
    date: "Jun 2025",
    excerpt:
      "I have been officially selected to participate in the prestigious ENHANCE Summer School in Climate Change 2025, hosted by the ENHANCE Alliance and Warsaw University of Technology.",
    fullArticle:
      "I'm honored to share that I have been selected to attend the ENHANCE Summer School in Climate Change 2025, organized by the ENHANCE Alliance in collaboration with Warsaw University of Technology. This highly competitive and internationally recognized program brings together students from top European technical universities to collaborate on sustainable solutions to climate challenges.\n\nMy application was chosen for its alignment with the values and interdisciplinary focus of the Summer School, which emphasizes innovation, environmental responsibility, and collaborative research. The program offers a unique opportunity to work alongside experts and peers on pressing global issues such as decarbonization, climate adaptation, and environmental justice.\n\nThis experience represents a significant step in my commitment to applying technology and design for positive societal impact. I look forward to contributing meaningfully to the discussions and projects that emerge from this initiative.\n\nMore information about the program is available at: https://summerschool.enhance.pw.edu.pl/",
    source: "https://summerschool.enhance.pw.edu.pl/",
    contextualSummary:
      "This entry announces Irene Medina's selection to the ENHANCE Summer School in Climate Change 2025, recognizing her alignment with the school's interdisciplinary and sustainability-focused mission. The program gathers forward-thinking students from leading European institutions to address urgent climate issues."
  }
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
}

interface PressLibraryModalProps {
  isOpen: boolean
  onClose: () => void
}

function parsePressDate(dateString: string): Date {
  const parts = dateString.split(' ')
  const month = parts[0]
  const year = parseInt(parts[1])
  
  const monthNumber = monthMap[month] ?? 0
  return new Date(year, monthNumber, 1)
}

// Componente de página individual usando forwardRef
const NewspaperPage = forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  className?: string;
}>((props, ref) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-100 border border-gray-300 dark:border-gray-400 shadow-lg ${props.className || ''}`} 
      ref={ref}
    >
      {props.children}
    </div>
  );
});

NewspaperPage.displayName = 'NewspaperPage';

// Componente de portada del periódico
const NewspaperCover = forwardRef<HTMLDivElement, {
  item: PressItem;
}>((props, ref) => {
  const { item } = props;
  return (
    <NewspaperPage ref={ref} className="p-4">
      <div className="h-full flex flex-col text-sm">
        {/* Header del periódico más compacto */}
        <div className="border-b-2 border-gray-700 dark:border-gray-600 pb-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">{item.date}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">EDICIÓN DIGITAL</div>
          </div>
          <div className="flex items-center justify-center mb-3">
            <Image
              src={item.logo}
              alt={item.platform}
              width={80}
              height={40}
              className="object-contain filter grayscale"
            />
          </div>
          <div className="text-center border-t border-b border-gray-600 dark:border-gray-500 py-1">
            <h1 className="text-xs font-bold text-gray-700 dark:text-gray-600 tracking-wider">
              {item.platform.toUpperCase()}
            </h1>
          </div>
        </div>

        {/* Titular principal */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-700 leading-tight mb-3 text-center">
            {item.title}
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-600 leading-relaxed text-justify">
            {item.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-600 dark:border-gray-500 pt-2 mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
          Pasa la página para leer el artículo completo →
        </div>
      </div>
    </NewspaperPage>
  );
});

NewspaperCover.displayName = 'NewspaperCover';

// Componente de página de contenido
const NewspaperContentPage = forwardRef<HTMLDivElement, {
  item: PressItem;
  isLastPage?: boolean;
}>((props, ref) => {
  const { item, isLastPage } = props;
  return (
    <NewspaperPage ref={ref} className="p-6">
      <div className="h-full flex flex-col">
        {/* Header de página interior */}
        <div className="border-b border-gray-400 dark:border-gray-500 pb-2 mb-4 flex justify-between items-center">
          <div className="text-xs text-gray-600 dark:text-gray-500">{item.platform}</div>
          <div className="text-xs text-gray-600 dark:text-gray-500">{item.date}</div>
        </div>

        {/* Contenido del artículo */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-700 mb-4 leading-tight">
            {item.title}
          </h3>
          <div className="prose prose-sm text-gray-800 dark:text-gray-700 leading-relaxed">
            <p className="text-justify whitespace-pre-line">
              {item.fullArticle}
            </p>
          </div>
        </div>

        {/* Footer con enlace */}
        {isLastPage && (
          <div className="border-t border-gray-400 dark:border-gray-500 pt-4 mt-4">
            <div className="text-center">
              <p className="text-xs text-gray-600 dark:text-gray-500 mb-2">{item.contextualSummary}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(item.source, '_blank')}
                className="text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Leer artículo original
              </Button>
            </div>
          </div>
        )}
      </div>
    </NewspaperPage>
  );
});

NewspaperContentPage.displayName = 'NewspaperContentPage';

// Componente de página de contenido paginado
const NewspaperArticlePage = forwardRef<HTMLDivElement, {
  item: PressItem;
  content: string;
  isLastPage?: boolean;
  pageNumber: number;
}>((props, ref) => {
  const { item, content, isLastPage, pageNumber } = props;
  return (
    <NewspaperPage ref={ref} className="p-4">
      <div className="h-full flex flex-col text-sm">
        {/* Header de página interior más compacto */}
        <div className="border-b border-gray-300 dark:border-gray-500 pb-2 mb-3 flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">{item.platform}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Pág. {pageNumber}</div>
        </div>

        {/* Contenido del artículo */}
        <div className="flex-1">
          {/* Título solo en la primera página de contenido */}
          {pageNumber === 1 && (
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-700 mb-3 leading-tight">
              {item.title}
            </h3>
          )}
          
          <div className="text-gray-800 dark:text-gray-700 leading-relaxed">
            <p className="text-justify text-sm">
              {content}
            </p>
          </div>
        </div>

        {/* Footer con enlace solo en la última página */}
        {isLastPage && (
          <div className="border-t border-gray-300 dark:border-gray-500 pt-3 mt-3">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{item.contextualSummary}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(item.source, '_blank')}
                className="text-xs h-7"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Leer original
              </Button>
            </div>
          </div>
        )}
      </div>
    </NewspaperPage>
  );
});

NewspaperArticlePage.displayName = 'NewspaperArticlePage';

export function PressLibraryModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<PressItem | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [totalPages, setTotalPages] = useState(2)
  const flipBookRef = useRef<any>(null)

  // Filtrar artículos (ordenados por fecha descendente)
  const filteredAndSortedItems = useMemo(() => {
    const filtered = pressItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return filtered.sort((a, b) => {
      const dateA = parsePressDate(a.date)
      const dateB = parsePressDate(b.date)
      return dateB.getTime() - dateA.getTime() // Descendente por defecto
    })
  }, [searchTerm])

  const openArticle = (url: string) => {
    window.open(url, '_blank')
  }

  // Función para dividir el contenido en páginas
  const splitContentIntoPages = (content: string) => {
    const wordsPerPage = 120 // Menos palabras por página ya que son más pequeñas
    const words = content.split(' ')
    const pages = []
    
    for (let i = 0; i < words.length; i += wordsPerPage) {
      const pageContent = words.slice(i, i + wordsPerPage).join(' ')
      pages.push(pageContent)
    }
    
    return pages
  }

  // Obtener páginas del artículo actual
  const articlePages = useMemo(() => {
    if (!selectedItem) return []
    return splitContentIntoPages(selectedItem.fullArticle)
  }, [selectedItem])

  // Calcular total de páginas (portada + páginas de contenido)
  const totalPagesCount = useMemo(() => {
    return 1 + articlePages.length // 1 portada + páginas del artículo
  }, [articlePages])

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPagesCount - 1))
  }

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0))
  }

  const handleSelectItem = (item: PressItem) => {
    setSelectedItem(item)
    setCurrentPage(0) // Reset to first page
    setDragOffset(0)
  }

  // Función para obtener el contenido de la página actual
  const getCurrentPageContent = () => {
    if (!selectedItem) return null
    
    if (currentPage === 0) {
      // Página 0 es la portada
      return { type: 'cover', item: selectedItem }
    } else {
      // Páginas 1+ son contenido del artículo
      const contentPageIndex = currentPage - 1
      const pageContent = articlePages[contentPageIndex]
      const isLastPage = contentPageIndex === articlePages.length - 1
      
      return { 
        type: 'content', 
        item: selectedItem,
        content: pageContent,
        isLastPage,
        pageNumber: currentPage
      }
    }
  }

  // Función para obtener el contenido de la página siguiente (para mostrar en la trasera)
  const getNextPageContent = () => {
    if (!selectedItem || currentPage >= totalPagesCount - 1) return null
    
    const nextPageIndex = currentPage + 1
    if (nextPageIndex === 0) {
      return { type: 'cover', item: selectedItem }
    } else {
      const contentPageIndex = nextPageIndex - 1
      const pageContent = articlePages[contentPageIndex]
      const isLastPage = contentPageIndex === articlePages.length - 1
      
      return { 
        type: 'content', 
        item: selectedItem,
        content: pageContent,
        isLastPage,
        pageNumber: nextPageIndex
      }
    }
  }

  // Funciones de drag
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault() // Prevenir selección de texto
    setIsDragging(true)
    setDragStartX(e.clientX)
    
    // Agregar feedback háptico en dispositivos que lo soporten
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - dragStartX
    setDragOffset(deltaX)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    // Si el drag fue significativo, cambiar página (más sensible)
    if (dragOffset > 60) {
      goToPrevPage()
    } else if (dragOffset < -60) {
      goToNextPage()
    }
    
    setDragOffset(0)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault() // Prevenir comportamientos por defecto
    setIsDragging(true)
    setDragStartX(e.touches[0].clientX)
    
    // Feedback háptico más fuerte para touch
    if ('vibrate' in navigator) {
      navigator.vibrate(15)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const deltaX = e.touches[0].clientX - dragStartX
    setDragOffset(deltaX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    // Si el drag fue significativo, cambiar página (más sensible)
    if (dragOffset > 60) {
      goToPrevPage()
    } else if (dragOffset < -60) {
      goToNextPage()
    }
    
    setDragOffset(0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          className="focus:outline-none opacity-0 pointer-events-none absolute"
          data-press-library-trigger
        >
          Press Library
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-0 border border-border bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <VisuallyHidden.Root>
          <DialogTitle>Biblioteca de Prensa Digital</DialogTitle>
        </VisuallyHidden.Root>
        
        {/* Barra superior estilo macOS */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 h-12 flex-shrink-0 rounded-t-xl">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200"
                title="Cerrar"
              />
              <div className="w-3 h-3 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-colors duration-200" title="Minimizar" />
              <div className="w-3 h-3 bg-green-500 hover:bg-green-600 rounded-full transition-colors duration-200" title="Maximizar" />
            </div>
          </div>
          <div className="text-foreground text-sm font-medium">
            Biblioteca de Prensa - Newsstand
          </div>
          <div className="w-16"></div>
        </div>

        {selectedItem ? (
          // Vista de periódico con páginas hojeables
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Barra de controles del periódico */}
            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setSelectedItem(null)}
                size="sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Volver a la biblioteca
              </Button>
              
              <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Página {currentPage + 1} de {totalPagesCount}</span>
                              {isDragging && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 bg-blue-500 rounded-full"
                                />
                              )}
                            </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPagesCount - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Periódico hojeable personalizado */}
            <div className="flex-1 flex items-center justify-center p-4 bg-background overflow-hidden">
              <div className="relative select-none">
                {/* Libro de periódico con efecto de voltear */}
                <div 
                  className="relative mx-auto cursor-grab active:cursor-grabbing"
                  style={{ 
                    width: 'min(75vw, 320px)', 
                    height: 'min(60vh, 450px)', 
                    perspective: '2000px',
                    perspectiveOrigin: '50% 50%'
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Página trasera (siempre visible) */}
                  <div className="absolute inset-0 bg-white dark:bg-gray-100 border border-gray-300 dark:border-gray-400 shadow-xl rounded-r-sm overflow-hidden transform-gpu">
                    {(() => {
                      const nextPageContent = getNextPageContent()
                      if (!nextPageContent) return null
                      
                      if (nextPageContent.type === 'cover') {
                        return <NewspaperCover item={nextPageContent.item} />
                      } else {
                        return (
                          <NewspaperArticlePage 
                            item={nextPageContent.item}
                            content={nextPageContent.content || ''}
                            isLastPage={nextPageContent.isLastPage || false}
                            pageNumber={nextPageContent.pageNumber || 1}
                          />
                        )
                      }
                    })()}
                  </div>
                  
                  {/* Página frontal (se voltea) - maleable */}
                  <div 
                    className="absolute inset-0 bg-white dark:bg-gray-100 border border-gray-300 dark:border-gray-400 shadow-2xl rounded-r-sm overflow-hidden transform-gpu"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      transformOrigin: 'left center',
                      transform: `
                        rotateY(${
                          isDragging 
                            ? Math.max(-140, Math.min(0, (dragOffset / 120) * -140)) 
                            : currentPage < totalPagesCount - 1 ? 0 : -180
                        }deg) 
                        ${isDragging ? 'scale(1.02)' : 'scale(1)'} 
                        ${isDragging ? `rotateX(${Math.max(-5, dragOffset / 50)}deg)` : 'rotateX(0deg)'}
                        ${isDragging ? `translateZ(${Math.abs(dragOffset / 10)}px)` : 'translateZ(0px)'}
                      `,
                      transition: isDragging 
                        ? 'none' 
                        : 'transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)',
                      filter: isDragging 
                        ? `drop-shadow(${Math.abs(dragOffset / 20)}px ${Math.abs(dragOffset / 20)}px 20px rgba(0,0,0,${Math.min(0.4, Math.abs(dragOffset) / 200)}))` 
                        : 'drop-shadow(2px 2px 8px rgba(0,0,0,0.1))'
                    }}
                  >
                    {/* Cara frontal */}
                    <div 
                      className="absolute inset-0" 
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: isDragging && dragOffset < -20 
                          ? `
                            skewY(${Math.max(-2, dragOffset / 100)}deg) 
                            rotateX(${Math.max(-4, dragOffset / 60)}deg)
                            scaleX(${Math.max(0.98, 1 + dragOffset / 1000)})
                          ` 
                          : 'none',
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                      }}
                    >
                      {(() => {
                        const currentPageContent = getCurrentPageContent()
                        if (!currentPageContent) return null
                        
                        if (currentPageContent.type === 'cover') {
                          return <NewspaperCover item={currentPageContent.item} />
                        } else {
                          return (
                            <NewspaperArticlePage 
                              item={currentPageContent.item}
                              content={currentPageContent.content || ''}
                              isLastPage={currentPageContent.isLastPage || false}
                              pageNumber={currentPageContent.pageNumber || 1}
                            />
                          )
                        }
                      })()}
                    </div>
                    
                    {/* Cara trasera (próxima página) */}
                    <div 
                      className="absolute inset-0" 
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      {(() => {
                        const nextPageContent = getNextPageContent()
                        if (!nextPageContent) return null
                        
                        if (nextPageContent.type === 'cover') {
                          return <NewspaperCover item={nextPageContent.item} />
                        } else {
                          return (
                            <NewspaperArticlePage 
                              item={nextPageContent.item}
                              content={nextPageContent.content || ''}
                              isLastPage={nextPageContent.isLastPage || false}
                              pageNumber={nextPageContent.pageNumber || 1}
                            />
                          )
                        }
                      })()}
                    </div>
                  </div>
                  
                  {/* Sistema de sombras múltiples más realista */}
                  <div 
                    className="absolute inset-0 pointer-events-none rounded-r-sm"
                    style={{ zIndex: -1 }}
                  >
                    {/* Sombra base */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/5 rounded-r-sm"
                      style={{ 
                        transform: `translateX(${isDragging ? Math.abs(dragOffset / 15) : 4}px) translateY(${isDragging ? Math.abs(dragOffset / 20) : 4}px)`,
                        opacity: isDragging ? Math.min(0.8, Math.abs(dragOffset) / 100) : 0.6,
                        filter: `blur(${isDragging ? Math.abs(dragOffset / 30) : 4}px)`
                      }}
                    />
                    
                    {/* Sombra de contacto */}
                    <div 
                      className="absolute inset-0 bg-black/30 rounded-r-sm"
                      style={{ 
                        transform: 'translateX(1px) translateY(1px)',
                        opacity: isDragging ? Math.min(0.4, Math.abs(dragOffset) / 150) : 0.2,
                        filter: 'blur(1px)'
                      }}
                    />
                  </div>
                  
                  {/* Indicador de curvatura y plegado del papel */}
                  <div 
                    className={`absolute left-0 top-0 bottom-0 transition-all duration-300 ${
                      isDragging && dragOffset < -15 ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {/* Línea de doblez */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-black/40 to-transparent"
                      style={{
                        transform: `translateX(${isDragging ? Math.max(-2, dragOffset / 100) : 0}px)`,
                      }}
                    />
                    
                    {/* Gradiente de curvatura */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/15 to-transparent"
                      style={{
                        transform: `rotateY(${isDragging ? Math.max(-45, (dragOffset / 150) * -45) : 0}deg)`,
                        transformOrigin: 'left center',
                        opacity: isDragging ? Math.min(1, Math.abs(dragOffset) / 80) : 0
                      }}
                    />
                  </div>
                  
                  {/* Efecto de brillo en el borde durante el drag */}
                  <div 
                    className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white/30 to-transparent transition-opacity duration-200 ${
                      isDragging && dragOffset < -25 ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      transform: `translateX(${isDragging ? Math.max(-1, dragOffset / 200) : 0}px)`,
                    }}
                  />
                </div>
                
                
              </div>
            </div>
          </div>
        ) : (
          // Vista de estantería de periódicos
          <div className="flex-1 flex flex-col overflow-hidden relative bg-background">
            
            {/* Barra de búsqueda simple */}
            <div className="p-4 bg-muted/30 border-b border-border">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar periódico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Estantería de periódicos */}
            <div className="flex-1 overflow-auto relative">
              {/* Efecto de los estantes */}
              <div className="absolute inset-0">
                <div className="h-full bg-gradient-to-b from-muted/20 via-background to-muted/20">
                  {/* Líneas de los estantes */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-border"></div>
                  <div className="absolute top-[25%] left-0 right-0 h-1 bg-gradient-to-b from-border to-muted shadow-lg"></div>
                  <div className="absolute top-[50%] left-0 right-0 h-1 bg-gradient-to-b from-border to-muted shadow-lg"></div>
                  <div className="absolute top-[75%] left-0 right-0 h-1 bg-gradient-to-b from-border to-muted shadow-lg"></div>
                </div>
              </div>

              <motion.div 
                className="relative z-10 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Grid responsive de periódicos */}
                <div className="grid gap-6 justify-items-center" style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  maxWidth: '100%'
                }}>
                  <AnimatePresence>
                    {filteredAndSortedItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 30, rotateY: -10 }}
                        animate={{ opacity: 1, y: 0, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 120,
                          damping: 20
                        }}
                        className="group cursor-pointer transform-gpu w-full max-w-[140px]"
                        onClick={() => handleSelectItem(item)}
                        style={{ perspective: "1000px" }}
                      >
                        <motion.div 
                          className="relative transform transition-all duration-500 hover:scale-110 hover:-translate-y-4 hover:rotate-2 hover:shadow-2xl group-hover:z-10"
                          whileHover={{
                            rotateY: 8,
                            rotateX: -3,
                            scale: 1.1,
                            translateY: -16
                          }}
                          whileTap={{
                            scale: 0.95,
                            rotateY: -5
                          }}
                        >
                          {/* Periódico realista con mejor aspecto 3D */}
                          <div 
                            className="w-full h-48 bg-white rounded-sm shadow-lg border border-gray-300 overflow-hidden transform rotate-1 group-hover:rotate-0 transition-all duration-500"
                            style={{
                              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                              transformStyle: 'preserve-3d'
                            }}
                          >
                            
                            {/* Header con logo del medio */}
                            <div className="h-12 bg-white border-b-2 border-black flex items-center justify-center p-2">
                              <Image
                                src={item.logo}
                                alt={item.platform}
                                width={36}
                                height={36}
                                className="object-contain filter grayscale"
                              />
                            </div>
                            
                            {/* Líneas de separación del periódico */}
                            <div className="h-px bg-black"></div>
                            
                            {/* Título principal del artículo */}
                            <div className="p-2 flex-1 bg-white">
                              <h4 className="text-xs font-bold text-black leading-tight line-clamp-3 mb-2" style={{ fontFamily: 'serif' }}>
                                {item.title}
                              </h4>
                              
                              {/* Líneas simulando texto de periódico con efecto más realista */}
                              <div className="space-y-1 mt-2">
                                <div className="h-px bg-gray-400 w-full opacity-60"></div>
                                <div className="h-px bg-gray-400 w-4/5 opacity-60"></div>
                                <div className="h-px bg-gray-400 w-full opacity-60"></div>
                                <div className="h-px bg-gray-400 w-3/4 opacity-60"></div>
                                <div className="h-px bg-gray-400 w-5/6 opacity-60"></div>
                              </div>
                            </div>
                            
                            {/* Footer con fecha */}
                            <div className="absolute bottom-2 left-2 right-2 border-t border-black pt-1">
                              <div className="text-xs text-black font-bold text-center" style={{ fontFamily: 'serif' }}>
                                {item.date}
                              </div>
                            </div>
                          </div>
                          
                          {/* Sombra dinámica mejorada */}
                          <div 
                            className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/20 to-black/30 rounded-lg transform translate-x-2 translate-y-2 -z-10 transition-all duration-500"
                            style={{
                              filter: 'blur(6px)'
                            }}
                          ></div>
                          
                          {/* Efecto de brillo en hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm pointer-events-none"></div>
                          
                          {/* Tooltip al hover mejorado */}
                          <motion.div 
                            className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-30 shadow-lg"
                            initial={{ y: 10, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                          >
                            <span className="font-medium">📰 {item.platform}</span>
                            <br />
                            <span className="text-xs opacity-80">Haz clic para hojear</span>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                              <div className="border-4 border-transparent border-t-black/90"></div>
                            </div>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
              
              {filteredAndSortedItems.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground font-medium">Estantería vacía</p>
                    <p className="text-muted-foreground text-sm">No hay periódicos con esos criterios</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}