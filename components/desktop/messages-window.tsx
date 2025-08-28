"use client"

import { useState, useEffect, useRef } from 'react'
import { X, Minimize2, Maximize2, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  isUser: boolean
  avatar?: string
}

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unread: boolean
  topic: string
  messages: Message[]
}

interface MessagesWindowProps {
  onClose: () => void
}

export function MessagesWindow({ onClose }: MessagesWindowProps) {
  const { t } = useLanguage()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Inicializar conversaciones con mensajes precargados
  useEffect(() => {
    const initialConversations: Conversation[] = [
      {
        id: '1',
        name: 'Guillermo Castillo',
        avatar: '👨‍🍳',
        lastMessage: 'Archivo adjunto: 1 stickers',
        lastMessageTime: '9:17 a.m.',
        unread: false,
        topic: 'cooking',
        messages: [
          {
            id: 'm1',
            sender: 'Guillermo Castillo',
            content: '¡Hola! Escuché que te encanta cocinar pasta 🍝',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            isUser: false,
            avatar: '👨‍🍳'
          },
          {
            id: 'm2',
            sender: 'Tú',
            content: '¡Sí! Me encanta la cocina italiana, especialmente la pasta fresca',
            timestamp: new Date(Date.now() - 1000 * 60 * 28),
            isUser: true
          },
          {
            id: 'm3',
            sender: 'Guillermo Castillo',
            content: '¿Cuál es tu plato favorito para cocinar?',
            timestamp: new Date(Date.now() - 1000 * 60 * 25),
            isUser: false,
            avatar: '👨‍🍳'
          },
          {
            id: 'm4',
            sender: 'Tú',
            content: 'Definitivamente el cacio e pepe. Es simple pero requiere técnica perfecta',
            timestamp: new Date(Date.now() - 1000 * 60 * 23),
            isUser: true
          },
          {
            id: 'm5',
            sender: 'Guillermo Castillo',
            content: '¡Excelente elección! El secreto está en el agua de pasta con almidón',
            timestamp: new Date(Date.now() - 1000 * 60 * 20),
            isUser: false,
            avatar: '👨‍🍳'
          }
        ]
      },
      {
        id: '2',
        name: 'Rigo Rangel',
        avatar: '🧘',
        lastMessage: '🌈😊 What a glorious day!',
        lastMessageTime: '9:13 a.m.',
        unread: false,
        topic: 'yoga',
        messages: [
          {
            id: 'm1',
            sender: 'Rigo Rangel',
            content: 'Hey! ¿Sigues practicando yoga aéreo?',
            timestamp: new Date(Date.now() - 1000 * 60 * 45),
            isUser: false,
            avatar: '🧘'
          },
          {
            id: 'm2',
            sender: 'Tú',
            content: '¡Sí! Es mi actividad favorita, me ayuda con la flexibilidad y la fuerza',
            timestamp: new Date(Date.now() - 1000 * 60 * 43),
            isUser: true
          },
          {
            id: 'm3',
            sender: 'Rigo Rangel',
            content: '¿Cuánto tiempo llevas practicando?',
            timestamp: new Date(Date.now() - 1000 * 60 * 40),
            isUser: false,
            avatar: '🧘'
          },
          {
            id: 'm4',
            sender: 'Tú',
            content: 'Llevo 2 años y me encanta la sensación de estar suspendida en el aire',
            timestamp: new Date(Date.now() - 1000 * 60 * 38),
            isUser: true
          },
          {
            id: 'm5',
            sender: 'Rigo Rangel',
            content: '🌈😊 What a glorious day! El yoga aéreo debe ser increíble para la creatividad',
            timestamp: new Date(Date.now() - 1000 * 60 * 35),
            isUser: false,
            avatar: '🧘'
          }
        ]
      },
      {
        id: '3',
        name: 'Animation Team',
        avatar: '🎨',
        lastMessage: 'Do you want to review all the renders together next time we meet and decide o...',
        lastMessageTime: 'ayer',
        unread: true,
        topic: '3d',
        messages: [
          {
            id: 'm1',
            sender: 'Christine Huang',
            content: 'Irene, ¿has trabajado con Blender últimamente?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
            isUser: false,
            avatar: '👩'
          },
          {
            id: 'm2',
            sender: 'Tú',
            content: '¡Sí! Estoy modelando personajes para un proyecto personal',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
            isUser: true
          },
          {
            id: 'm3',
            sender: 'Chad Benjamin Potter',
            content: 'I just finished the latest renderings for the Sushi Car! What do you all think? 🍣🚗',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
            isUser: false,
            avatar: '👨‍💻'
          },
          {
            id: 'm4',
            sender: 'Tú',
            content: '¡Se ve increíble! Me encanta el estilo cartoon que le diste',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21),
            isUser: true
          },
          {
            id: 'm5',
            sender: 'Christine Huang',
            content: 'Do you want to review all the renders together next time we meet and decide on the final style?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20),
            isUser: false,
            avatar: '👩'
          }
        ]
      },
      {
        id: '4',
        name: 'Ashley Rico',
        avatar: '🎯',
        lastMessage: 'Did the kids finish their homework?',
        lastMessageTime: 'ayer',
        unread: false,
        topic: 'figma',
        messages: [
          {
            id: 'm1',
            sender: 'Ashley Rico',
            content: 'Vi tu portfolio, ¡tus diseños de logos en Figma son geniales!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
            isUser: false,
            avatar: '🎯'
          },
          {
            id: 'm2',
            sender: 'Tú',
            content: 'Gracias! Me encanta crear identidades visuales únicas para cada proyecto',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47),
            isUser: true
          },
          {
            id: 'm3',
            sender: 'Ashley Rico',
            content: '¿Cuál es tu proceso creativo para diseñar logos?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46),
            isUser: false,
            avatar: '🎯'
          },
          {
            id: 'm4',
            sender: 'Tú',
            content: 'Empiezo con investigación de la marca, luego bocetos a mano y finalmente Figma para vectorizar',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 45),
            isUser: true
          },
          {
            id: 'm5',
            sender: 'Ashley Rico',
            content: 'Did the kids finish their homework? Ah perdón, mensaje equivocado 😅',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 44),
            isUser: false,
            avatar: '🎯'
          }
        ]
      },
      {
        id: '5',
        name: 'Dawn Ramirez',
        avatar: '🌍',
        lastMessage: 'OK to visit tonight? I have some things I need the grandkids\' help with. 😅',
        lastMessageTime: 'ayer',
        unread: false,
        topic: 'travel',
        messages: [
          {
            id: 'm1',
            sender: 'Dawn Ramirez',
            content: '¿Cuál ha sido tu viaje favorito hasta ahora?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
            isUser: false,
            avatar: '🌍'
          },
          {
            id: 'm2',
            sender: 'Tú',
            content: 'Japón definitivamente! La mezcla de tradición y tecnología es fascinante',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 71),
            isUser: true
          },
          {
            id: 'm3',
            sender: 'Dawn Ramirez',
            content: '¡Qué envidia! ¿A dónde planeas viajar el próximo año?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 70),
            isUser: false,
            avatar: '🌍'
          },
          {
            id: 'm4',
            sender: 'Tú',
            content: 'Estoy pensando en Islandia o Nueva Zelanda, lugares con naturaleza impresionante',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 69),
            isUser: true
          },
          {
            id: 'm5',
            sender: 'Dawn Ramirez',
            content: 'OK to visit tonight? I have some things I need the grandkids\' help with. 😅',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 68),
            isUser: false,
            avatar: '🌍'
          }
        ]
      },
      {
        id: '6',
        name: 'Foodie Friends',
        avatar: '🍕',
        lastMessage: 'Incredible. I\'ll have to try making it myself.',
        lastMessageTime: 'ayer',
        unread: false,
        topic: 'food',
        messages: [
          {
            id: 'm1',
            sender: 'Foodie Friends',
            content: '¿Cuáles son tus comidas favoritas?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96),
            isUser: false,
            avatar: '🍕'
          },
          {
            id: 'm2',
            sender: 'Tú',
            content: 'Amo la pasta italiana, el sushi japonés y los tacos mexicanos!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 95),
            isUser: true
          },
          {
            id: 'm3',
            sender: 'Foodie Friends',
            content: '¡Excelentes elecciones! ¿Has probado hacer sushi en casa?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 94),
            isUser: false,
            avatar: '🍕'
          },
          {
            id: 'm4',
            sender: 'Tú',
            content: 'Sí! Es un proceso divertido pero requiere mucha práctica para el arroz perfecto',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 93),
            isUser: true
          },
          {
            id: 'm5',
            sender: 'Foodie Friends',
            content: 'Incredible. I\'ll have to try making it myself.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 92),
            isUser: false,
            avatar: '🍕'
          }
        ]
      },
      {
        id: '7',
        name: 'Antonio Manriquez',
        avatar: '💻',
        lastMessage: '🎮🎮🎮',
        lastMessageTime: 'ayer',
        unread: false,
        topic: 'tech',
        messages: [
          {
            id: 'm1',
            sender: 'Antonio Manriquez',
            content: '¿Qué tecnologías estás aprendiendo ahora?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120),
            isUser: false,
            avatar: '💻'
          },
          {
            id: 'm2',
            sender: 'Tú',
            content: 'Estoy profundizando en React, Next.js y Three.js para proyectos web 3D',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 119),
            isUser: true
          },
          {
            id: 'm3',
            sender: 'Antonio Manriquez',
            content: '¡Genial combo! Three.js es perfecto para portfolios interactivos',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 118),
            isUser: false,
            avatar: '💻'
          },
          {
            id: 'm4',
            sender: 'Tú',
            content: 'Exacto! También estoy experimentando con IA y machine learning',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 117),
            isUser: true
          },
          {
            id: 'm5',
            sender: 'Antonio Manriquez',
            content: '🎮🎮🎮',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 116),
            isUser: false,
            avatar: '💻'
          }
        ]
      },
      {
        id: '8',
        name: 'Po-Chun Yeh',
        avatar: '📸',
        lastMessage: 'Wow, looks beautiful. ☀️ Here\'s a photo of the beach!',
        lastMessageTime: 'ayer',
        unread: false,
        topic: 'photography',
        messages: [
          {
            id: 'm1',
            sender: 'Po-Chun Yeh',
            content: '¿Te gusta la fotografía?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 144),
            isUser: false,
            avatar: '📸'
          },
          {
            id: 'm2',
            sender: 'Tú',
            content: '¡Me encanta! Especialmente la fotografía de paisajes y retratos',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 143),
            isUser: true
          },
          {
            id: 'm3',
            sender: 'Po-Chun Yeh',
            content: '¿Qué cámara usas?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 142),
            isUser: false,
            avatar: '📸'
          },
          {
            id: 'm4',
            sender: 'Tú',
            content: 'Principalmente mi iPhone, pero estoy pensando en comprar una mirrorless',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 141),
            isUser: true
          },
          {
            id: 'm5',
            sender: 'Po-Chun Yeh',
            content: 'Wow, looks beautiful. ☀️ Here\'s a photo of the beach!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 140),
            isUser: false,
            avatar: '📸'
          }
        ]
      },
      {
        id: '9',
        name: 'Herland Antezana',
        avatar: '🎵',
        lastMessage: 'Yes, that sounds good! See you then.',
        lastMessageTime: 'ayer',
        unread: false,
        topic: 'music',
        messages: [
          {
            id: 'm1',
            sender: 'Herland Antezana',
            content: '¿Qué tipo de música te gusta?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 168),
            isUser: false,
            avatar: '🎵'
          },
          {
            id: 'm2',
            sender: 'Tú',
            content: 'Me gusta de todo! Desde indie pop hasta música clásica',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 167),
            isUser: true
          },
          {
            id: 'm3',
            sender: 'Herland Antezana',
            content: '¿Tocas algún instrumento?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 166),
            isUser: false,
            avatar: '🎵'
          },
          {
            id: 'm4',
            sender: 'Tú',
            content: 'Estoy aprendiendo a tocar el ukulele, es muy relajante',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 165),
            isUser: true
          },
          {
            id: 'm5',
            sender: 'Herland Antezana',
            content: 'Yes, that sounds good! See you then.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 164),
            isUser: false,
            avatar: '🎵'
          }
        ]
      }
    ]

    setConversations(initialConversations)
  }, [])

  // Respuestas de IA basadas en el tópico
  const getAIResponse = (topic: string, message: string): string => {
    const responses: Record<string, string[]> = {
      cooking: [
        "¡Qué interesante! La cocina es un arte maravilloso 🍳",
        "Me encantaría probar tus platos algún día",
        "¿Has probado alguna receta nueva últimamente?",
        "La pasta fresca casera es lo mejor, ¿verdad?",
        "¡Suena delicioso! ¿Cuál es tu secreto?"
      ],
      yoga: [
        "El yoga aéreo debe ser una experiencia liberadora 🧘‍♀️",
        "¿Qué postura es tu favorita?",
        "La flexibilidad y fuerza que da el yoga es increíble",
        "¿Cómo empezaste con el yoga aéreo?",
        "Namaste 🙏 El equilibrio es clave en la vida"
      ],
      '3d': [
        "¡Blender es una herramienta poderosa! 🎨",
        "¿Qué tipo de personajes te gusta modelar?",
        "El modelado 3D requiere mucha paciencia y creatividad",
        "¿Has probado con animación también?",
        "Los renders deben quedar impresionantes"
      ],
      figma: [
        "Figma es genial para diseño colaborativo 🎯",
        "¿Cuál ha sido tu proyecto favorito en Figma?",
        "El diseño de logos requiere mucha creatividad",
        "¿Prefieres minimalismo o diseños complejos?",
        "La identidad visual es crucial para cualquier marca"
      ],
      travel: [
        "¡Viajar es la mejor inversión! ✈️",
        "¿Qué lugar está en tu lista de deseos?",
        "Cada viaje es una nueva aventura",
        "¿Prefieres playa o montaña?",
        "Los viajes nos cambian la perspectiva de la vida"
      ],
      food: [
        "¡La comida es vida! 🍽️",
        "¿Cuál es tu restaurante favorito?",
        "Probar nuevos sabores es una aventura",
        "¿Cocinas en casa o prefieres salir?",
        "La gastronomía une culturas"
      ],
      tech: [
        "La tecnología avanza tan rápido 💻",
        "¿Qué framework prefieres para tus proyectos?",
        "El desarrollo web es apasionante",
        "¿Has probado alguna nueva tecnología últimamente?",
        "La programación es creatividad pura"
      ],
      photography: [
        "La fotografía captura momentos únicos 📸",
        "¿Prefieres luz natural o artificial?",
        "Cada foto cuenta una historia",
        "¿Cuál es tu lugar favorito para fotografiar?",
        "La composición es clave en una buena foto"
      ],
      music: [
        "La música es el lenguaje universal 🎵",
        "¿Cuál es tu canción favorita actualmente?",
        "Tocar un instrumento es muy terapéutico",
        "¿Has ido a algún concierto últimamente?",
        "La música nos conecta con nuestras emociones"
      ]
    }

    const topicResponses = responses[topic] || responses['tech']
    return topicResponses[Math.floor(Math.random() * topicResponses.length)]
  }

  // Enviar mensaje
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return

    const newMessage: Message = {
      id: `m${Date.now()}`,
      sender: 'Tú',
      content: messageInput,
      timestamp: new Date(),
      isUser: true
    }

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation) {
        const updatedConv = {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageInput,
          lastMessageTime: 'ahora'
        }
        
        // Simular respuesta de IA después de un breve delay
        setTimeout(() => {
          setIsTyping(true)
          setTimeout(() => {
            const aiResponse: Message = {
              id: `m${Date.now() + 1}`,
              sender: conv.name,
              content: getAIResponse(conv.topic, messageInput),
              timestamp: new Date(),
              isUser: false,
              avatar: conv.avatar
            }
            
            setConversations(prev => prev.map(c => {
              if (c.id === selectedConversation) {
                return {
                  ...c,
                  messages: [...c.messages, aiResponse],
                  lastMessage: aiResponse.content,
                  lastMessageTime: 'ahora'
                }
              }
              return c
            }))
            setIsTyping(false)
          }, 1000 + Math.random() * 2000)
        }, 500)
        
        return updatedConv
      }
      return conv
    }))

    setMessageInput('')
  }

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversations, selectedConversation])

  // Formatear timestamp
  const formatTime = (date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
  }

  // Filtrar conversaciones por búsqueda
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentConversation = conversations.find(c => c.id === selectedConversation)

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-5xl h-[600px] bg-gray-50 dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        {/* Barra de título */}
        <div className="bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              aria-label="Cerrar"
            />
            <button
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
              aria-label="Minimizar"
            />
            <button
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
              aria-label="Maximizar"
            />
          </div>
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Mensajes</h2>
          <div className="w-16" />
        </div>

        {/* Contenido principal */}
        <div className="flex h-[calc(100%-48px)]">
          {/* Lista de conversaciones */}
          <div className="w-80 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
            {/* Barra de búsqueda */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-blue-500 cursor-pointer hover:text-blue-600">Editar</span>
                <button className="text-blue-500 hover:text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9m-9 0a9 9 0 110-18 9 9 0 010 18zm0 0v-8m0 0l3 3m-3-3l-3 3" />
                  </svg>
                </button>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Mensajes</h1>
              <input
                type="text"
                placeholder="Buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Lista de chats */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    selectedConversation === conv.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
                      {conv.avatar}
                    </div>
                    {conv.unread && (
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {conv.name}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Área de chat */}
          {selectedConversation && currentConversation ? (
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
              {/* Header del chat */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xl">
                    {currentConversation.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{currentConversation.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">En línea</p>
                  </div>
                </div>
                <button className="text-blue-500 hover:text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {currentConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end space-x-2 max-w-[70%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {!message.isUser && (
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {message.avatar}
                        </div>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          message.isUser
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-end space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-sm">
                        {currentConversation.avatar}
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl">
                        <div className="flex space-x-1">
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input de mensaje */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="iMessage"
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Selecciona una conversación
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Elige un chat de la lista para empezar a conversar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
