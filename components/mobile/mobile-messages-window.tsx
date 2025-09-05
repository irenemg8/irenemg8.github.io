"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Smile, Camera, Image as ImageIcon, Mic, Phone, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileWindow } from './mobile-window'

interface Message {
  id: string
  text: string
  timestamp: Date
  sender: 'me' | 'other'
  type: 'text' | 'image' | 'audio'
  avatar?: string
  senderName?: string
}

interface MobileMessagesWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMessagesWindow({ isOpen, onClose }: MobileMessagesWindowProps) {
  const { t } = useLanguage()
  const isMobile = useIsMobile()
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! 👋 Gracias por visitar mi portfolio',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      sender: 'other',
      type: 'text',
      senderName: 'Irene',
      avatar: '/profile-ge1.png'
    },
    {
      id: '2',
      text: 'Soy desarrolladora Full-Stack especializada en React, Next.js y aplicaciones móviles',
      timestamp: new Date(Date.now() - 1000 * 60 * 29),
      sender: 'other',
      type: 'text',
      senderName: 'Irene',
      avatar: '/profile-ge1.png'
    },
    {
      id: '3',
      text: '¿Te interesa alguno de mis proyectos? Me encantaría saber tu opinión 🚀',
      timestamp: new Date(Date.now() - 1000 * 60 * 28),
      sender: 'other',
      type: 'text',
      senderName: 'Irene',
      avatar: '/profile-ge1.png'
    },
    {
      id: '4',
      text: 'También puedes contactarme por email: irenebati4@gmail.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 27),
      sender: 'other',
      type: 'text',
      senderName: 'Irene',
      avatar: '/profile-ge1.png'
    }
  ])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date(),
      sender: 'me',
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simular respuesta automática
    setTimeout(() => {
      const autoResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: '¡Gracias por tu mensaje! 😊 Te responderé pronto por email.',
        timestamp: new Date(),
        sender: 'other',
        type: 'text',
        senderName: 'Irene',
        avatar: '/profile-ge1.png'
      }
      setMessages(prev => [...prev, autoResponse])
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const hapticFeedback = () => {
    if ('vibrate' in navigator && isMobile) {
      navigator.vibrate(25)
    }
  }

  const mobileContent = (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-800/50 rounded-t-xl">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 bg-white/70 dark:bg-gray-700/70 border-b border-gray-200/50 dark:border-gray-600/50 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src="/profile-ge1.png" 
              alt="Irene"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-700 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Irene Medina</h3>
            <p className="text-sm text-green-500">En línea</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={hapticFeedback}
            className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/70"
          >
            <Phone className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={hapticFeedback}
            className="p-2 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/70"
          >
            <Video className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end space-x-2 max-w-[75%] ${
              message.sender === 'me' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              {message.sender === 'other' && message.avatar && (
                <img 
                  src={message.avatar} 
                  alt={message.senderName}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
              
              <div className={`px-4 py-3 rounded-2xl ${
                message.sender === 'me' 
                  ? 'bg-blue-500 text-white rounded-br-md' 
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
              } shadow-sm`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'me' 
                    ? 'text-blue-100' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 bg-white/70 dark:bg-gray-700/70 border-t border-gray-200/50 dark:border-gray-600/50">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={hapticFeedback}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
            >
              <Camera className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={hapticFeedback}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
            >
              <ImageIcon className="w-5 h-5" />
            </motion.button>
          </div>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="pr-12 rounded-full bg-gray-100 dark:bg-gray-600 border-0 focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage()
                  hapticFeedback()
                }
              }}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                hapticFeedback()
                // Toggle emoji picker (placeholder)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              <Smile className="w-5 h-5" />
            </motion.button>
          </div>

          {newMessage.trim() ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                handleSendMessage()
                hapticFeedback()
              }}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={hapticFeedback}
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              <Mic className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <MobileWindow
      isOpen={isOpen}
      onClose={onClose}
      title="Mensajes"
      showHeader={false} // El chat tiene su propio header
      maxHeight="90vh"
      customGradient="from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      className="pb-0" // Remove bottom padding for chat
    >
      {mobileContent}
    </MobileWindow>
  )
}
