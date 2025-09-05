"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Save, FileText, Folder, Terminal, Settings, 
  Code, Smartphone, Monitor, Palette, Coffee
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileWindow } from './mobile-window'

interface MobileCodeEditorWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileCodeEditorWindow({ isOpen, onClose }: MobileCodeEditorWindowProps) {
  const { t } = useLanguage()
  const isMobile = useIsMobile()
  const [activeFile, setActiveFile] = useState('portfolio.tsx')
  const [code, setCode] = useState(`// Portfolio Mobile App - React Native
import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated
} from 'react-native'

const Portfolio = () => {
  const [isVisible, setIsVisible] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [])

  const projects = [
    {
      id: 1,
      name: 'E-Commerce App',
      description: 'React Native + Firebase',
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 2, 
      name: 'Task Manager',
      description: 'Next.js + PostgreSQL',
      image: 'https://via.placeholder.com/300x200'
    }
  ]

  return (
    <ScrollView style={styles.container}>
      <Animated.View 
        style={[styles.header, { opacity: fadeAnim }]}
      >
        <Image 
          source={{ uri: '/profile-ge1.png' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Irene Medina</Text>
        <Text style={styles.role}>
          Full-Stack Developer
        </Text>
      </Animated.View>

      <View style={styles.projectsContainer}>
        {projects.map(project => (
          <TouchableOpacity 
            key={project.id}
            style={styles.projectCard}
          >
            <Image 
              source={{ uri: project.image }}
              style={styles.projectImage}
            />
            <Text style={styles.projectName}>
              {project.name}
            </Text>
            <Text style={styles.projectDesc}>
              {project.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginTop: 5
  },
  projectsContainer: {
    padding: 20
  },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  projectImage: {
    width: '100%',
    height: 150,
    borderRadius: 8
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10
  },
  projectDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  }
})

export default Portfolio`)

  const files = [
    { name: 'portfolio.tsx', icon: <Code className="w-4 h-4" />, active: true },
    { name: 'components/', icon: <Folder className="w-4 h-4" />, type: 'folder' },
    { name: 'styles.css', icon: <Palette className="w-4 h-4" /> },
    { name: 'package.json', icon: <FileText className="w-4 h-4" /> },
    { name: 'README.md', icon: <FileText className="w-4 h-4" /> }
  ]

  const handleRunCode = () => {
    if ('vibrate' in navigator && isMobile) {
      navigator.vibrate([50, 100, 50])
    }
    // Simular ejecución de código
    console.log('Running React Native app...')
  }

  const handleSaveCode = () => {
    if ('vibrate' in navigator && isMobile) {
      navigator.vibrate(25)
    }
    console.log('Code saved!')
  }

  const mobileContent = (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100 rounded-t-xl overflow-hidden">
      {/* Editor header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-gray-300">VS Code Mobile</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSaveCode}
            className="text-gray-300 hover:text-white hover:bg-gray-700 p-2"
          >
            <Save className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRunCode}
            className="text-green-400 hover:text-green-300 hover:bg-gray-700 p-2"
          >
            <Play className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* File explorer */}
        <div className="w-20 sm:w-48 bg-gray-800 border-r border-gray-700 overflow-hidden">
          <div className="p-2 sm:p-3 border-b border-gray-700">
            <h3 className="text-xs font-medium text-gray-400 hidden sm:block">EXPLORADOR</h3>
          </div>
          
          <div className="p-1 sm:p-2 space-y-1">
            {files.map((file, index) => (
              <motion.button
                key={file.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => file.type !== 'folder' && setActiveFile(file.name)}
                className={`
                  w-full text-left px-2 py-2 rounded text-sm flex items-center space-x-2 transition-colors
                  ${activeFile === file.name 
                    ? 'bg-blue-600/20 text-blue-300 border-r-2 border-blue-500' 
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                  }
                `}
              >
                <span className="text-gray-500">{file.icon}</span>
                <span className="truncate hidden sm:block">{file.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Code editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab bar */}
          <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700 overflow-x-auto">
            <div className="flex items-center space-x-2 text-sm">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 font-medium">{activeFile}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">TypeScript React</span>
            </div>
          </div>

          {/* Code content */}
          <div className="flex-1 overflow-auto">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none border-0 outline-0"
              style={{ 
                fontFamily: 'Fira Code, Monaco, Consolas, monospace',
                lineHeight: '1.6',
                tabSize: 2
              }}
              placeholder="// Empieza a escribir tu código aquí..."
            />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white text-xs">
            <div className="flex items-center space-x-4">
              <span>TypeScript React</span>
              <span>UTF-8</span>
              <span>Ln 47, Col 12</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Live</span>
              </div>
              <span>Irene Dev</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile coding tips */}
      <div className="p-4 bg-gray-800/50 border-t border-gray-700">
        <div className="flex items-start space-x-3">
          <Coffee className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-300">
              <span className="font-medium text-yellow-400">Tip móvil:</span> 
              {" "}Desliza horizontalmente en el código para ver más contenido. 
              Usa el botón ▶️ para ejecutar el código.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <MobileWindow
      isOpen={isOpen}
      onClose={onClose}
      title="VS Code"
      showHeader={false}
      maxHeight="95vh"
      customGradient="from-gray-900 via-gray-800 to-gray-900"
      className="pb-0"
    >
      {mobileContent}
    </MobileWindow>
  )
}
