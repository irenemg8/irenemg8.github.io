"use client"

import { useState, useEffect, useRef } from 'react'
import { X, Minus, Square } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface TerminalWindowProps {
  isOpen: boolean
  onClose: () => void
}

interface FileSystemNode {
  name: string
  type: 'file' | 'directory'
  content?: string
  children?: { [key: string]: FileSystemNode }
  permissions?: string
  size?: number
}

export function TerminalWindow({ isOpen, onClose }: TerminalWindowProps) {
  const { t } = useLanguage()
  
  const [history, setHistory] = useState<string[]>([
    t('terminal.last_login') + ' ' + new Date().toLocaleString() + ' on console',
    t('terminal.welcome'),
    t('terminal.desktop_content'),
    '📁 proyectos    📁 fotos    📁 documentos    📄 portfolio.txt',
    ''
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [currentPath, setCurrentPath] = useState('/Users/irene/Desktop')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sistema de archivos simulado
  const [fileSystem] = useState<FileSystemNode>({
    name: '/',
    type: 'directory',
    children: {
      Users: {
        name: 'Users',
        type: 'directory',
        children: {
          irene: {
            name: 'irene',
            type: 'directory',
            children: {
              Desktop: {
                name: 'Desktop',
                type: 'directory',
                children: {
                  'portfolio.txt': {
                    name: 'portfolio.txt',
                    type: 'file',
                    content: t('terminal.portfolio_content'),
                    size: 89
                  },
                  'proyectos': {
                    name: 'proyectos',
                    type: 'directory',
                    children: {
                      'web-portfolio': {
                        name: 'web-portfolio',
                        type: 'directory',
                        children: {
                          'README.md': {
                            name: 'README.md',
                            type: 'file',
                            content: t('terminal.readme_content'),
                            size: 180
                          },
                          'package.json': {
                            name: 'package.json',
                            type: 'file',
                            content: '{\n  "name": "portfolio-irenemg8",\n  "version": "1.0.0",\n  "dependencies": {\n    "next": "^14.0.0",\n    "react": "^18.0.0"\n  }\n}',
                            size: 140
                          }
                        }
                      },
                      'hackathons': {
                        name: 'hackathons',
                        type: 'directory',
                        children: {
                          'datathon-2024.md': {
                            name: 'datathon-2024.md',
                            type: 'file',
                            content: '# Datathon 2024\n\nProyecto ganador del hackathon de datos\n\n## Tecnologías:\n- Python\n- Machine Learning\n- Data Visualization',
                            size: 120
                          }
                        }
                      },
                      'ia-projects': {
                        name: 'ia-projects',
                        type: 'directory',
                        children: {
                          'neural-networks.py': {
                            name: 'neural-networks.py',
                            type: 'file',
                            content: '# Redes Neuronales Básicas\nimport tensorflow as tf\n\n# Modelo simple de clasificación\nmodel = tf.keras.Sequential([\n    tf.keras.layers.Dense(128, activation="relu"),\n    tf.keras.layers.Dense(10, activation="softmax")\n])',
                            size: 205
                          }
                        }
                      }
                    }
                  },
                  'fotos': {
                    name: 'fotos',
                    type: 'directory',
                    children: {
                      'perfil.jpg': { name: 'perfil.jpg', type: 'file', size: 2048 },
                      'hackathon-team.jpg': { name: 'hackathon-team.jpg', type: 'file', size: 3072 },
                      'graduation.jpg': { name: 'graduation.jpg', type: 'file', size: 2560 }
                    }
                  },
                  'documentos': {
                    name: 'documentos',
                    type: 'directory',
                    children: {
                      'cv-irene-medina.pdf': {
                        name: 'cv-irene-medina.pdf',
                        type: 'file',
                        content: t('terminal.cv_content'),
                        size: 1024
                      },
                      'notas.txt': {
                        name: 'notas.txt',
                        type: 'file',
                        content: t('terminal.notes_content'),
                        size: 142
                      }
                    }
                  }
                }
              },
              Downloads: {
                name: 'Downloads',
                type: 'directory',
                children: {
                  'codigo-fuente.zip': { name: 'codigo-fuente.zip', type: 'file', size: 8192 }
                }
              }
            }
          }
        }
      },
      Aplicaciones: {
        name: 'Aplicaciones',
        type: 'directory',
        children: {
          'Terminal.app': { name: 'Terminal.app', type: 'directory', children: {} },
          'VSCode.app': { name: 'VSCode.app', type: 'directory', children: {} },
          'Safari.app': { name: 'Safari.app', type: 'directory', children: {} },
          'Spotify.app': { name: 'Spotify.app', type: 'directory', children: {} }
        }
      }
    }
  })

  const getCurrentDirectory = (): FileSystemNode | null => {
    const pathParts = currentPath.split('/').filter(p => p)
    let current = fileSystem

    for (const part of pathParts) {
      if (current.children && current.children[part]) {
        current = current.children[part]
      } else {
        return null
      }
    }
    return current
  }

  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim()
    if (!trimmedCommand) return

    // Añadir comando al historial
    setCommandHistory(prev => [...prev, trimmedCommand])
    setHistoryIndex(-1)

    const args = trimmedCommand.split(' ')
    const cmd = args[0].toLowerCase()
    const params = args.slice(1)

    let output = ''

    switch (cmd) {
      case 'help':
        output = `${t('terminal.help_title')}
  ${t('terminal.help_commands.ls')}
  ${t('terminal.help_commands.cd')}
  ${t('terminal.help_commands.pwd')}
  ${t('terminal.help_commands.cat')}
  ${t('terminal.help_commands.echo')}
  ${t('terminal.help_commands.whoami')}
  ${t('terminal.help_commands.date')}
  ${t('terminal.help_commands.history')}
  ${t('terminal.help_commands.clear')}
  ${t('terminal.help_commands.exit')}
  
${t('terminal.help_tip')}
${t('terminal.help_navigate')}`
        break

      case 'ls':
        const targetPath = params[0] || currentPath
        const resolvedPath = targetPath.startsWith('/') ? targetPath : `${currentPath}/${targetPath}`.replace(/\/+/g, '/')
        const pathParts = resolvedPath.split('/').filter(p => p)
        let targetDir = fileSystem

        for (const part of pathParts) {
          if (targetDir.children && targetDir.children[part]) {
            targetDir = targetDir.children[part]
          } else {
            output = `ls: ${targetPath}: ${t('terminal.no_such_file')}`
            break
          }
        }

        if (targetDir && targetDir.children && !output) {
          const items = Object.values(targetDir.children)
          if (items.length === 0) {
            output = ''
          } else {
            output = items.map(item => {
              if (item.type === 'directory') {
                return `📁 ${item.name}`
              } else {
                const ext = item.name.split('.').pop()
                let icon = '📄'
                if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') icon = '🖼️'
                else if (ext === 'pdf') icon = '📋'
                else if (ext === 'py') icon = '🐍'
                else if (ext === 'js' || ext === 'ts' || ext === 'tsx') icon = '⚡'
                else if (ext === 'md') icon = '📝'
                else if (ext === 'json') icon = '🔧'
                else if (ext === 'zip') icon = '📦'
                else if (ext === 'txt') icon = '📄'
                return `${icon} ${item.name}`
              }
            }).join('    ')
          }
        }
        break

      case 'pwd':
        output = currentPath
        break

      case 'cd':
        const newPath = params[0] || '/Users/irene/Desktop'
        let resolvedNewPath = ''

        if (newPath === '~' || newPath === '') {
          resolvedNewPath = '/Users/irene'
        } else if (newPath === '..') {
          const pathParts = currentPath.split('/').filter(p => p)
          pathParts.pop()
          resolvedNewPath = '/' + pathParts.join('/')
        } else if (newPath.startsWith('/')) {
          resolvedNewPath = newPath
        } else {
          resolvedNewPath = `${currentPath}/${newPath}`.replace(/\/+/g, '/')
        }

        // Verificar si el directorio existe
        const newPathParts = resolvedNewPath.split('/').filter(p => p)
        let checkDir = fileSystem

        let pathExists = true
        for (const part of newPathParts) {
          if (checkDir.children && checkDir.children[part] && checkDir.children[part].type === 'directory') {
            checkDir = checkDir.children[part]
          } else {
            pathExists = false
            break
          }
        }

        if (pathExists) {
          setCurrentPath(resolvedNewPath || '/')
          // Mostrar contenido del nuevo directorio automáticamente
          const items = Object.values(checkDir.children || {})
          if (items.length > 0) {
            const listing = items.map(item => {
              if (item.type === 'directory') {
                return `📁 ${item.name}`
              } else {
                const ext = item.name.split('.').pop()
                let icon = '📄'
                if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') icon = '🖼️'
                else if (ext === 'pdf') icon = '📋'
                else if (ext === 'py') icon = '🐍'
                else if (ext === 'js' || ext === 'ts' || ext === 'tsx') icon = '⚡'
                else if (ext === 'md') icon = '📝'
                else if (ext === 'json') icon = '🔧'
                else if (ext === 'zip') icon = '📦'
                else if (ext === 'txt') icon = '📄'
                return `${icon} ${item.name}`
              }
            }).join('    ')
            output = `📂 Contenido de ${resolvedNewPath || '/'}:\n${listing}`
          } else {
            output = `📂 Directorio vacío: ${resolvedNewPath || '/'}`
          }
        } else {
            output = `cd: ${newPath}: ${t('terminal.no_such_file')}`
        }
        break

      case 'cat':
        if (params.length === 0) {
          output = `cat: ${t('terminal.missing_file_operand')}`
        } else {
          const fileName = params[0]
          const currentDir = getCurrentDirectory()
          if (currentDir && currentDir.children && currentDir.children[fileName]) {
            const file = currentDir.children[fileName]
            if (file.type === 'file') {
              output = file.content || ''
            } else {
              output = `cat: ${fileName}: ${t('terminal.is_directory')}`
            }
          } else {
            output = `cat: ${fileName}: ${t('terminal.no_such_file')}`
          }
        }
        break

      case 'echo':
        output = params.join(' ')
        break

      case 'whoami':
        output = 'irene'
        break

      case 'date':
        output = new Date().toString()
        break

      case 'uname':
        if (params.includes('-a')) {
          output = 'macOS Darwin Kernel Version 23.1.0 x86_64'
        } else {
          output = 'Darwin'
        }
        break

      case 'history':
        output = commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n')
        break

      case 'mkdir':
        if (params.length === 0) {
          output = 'mkdir: missing operand'
        } else {
          output = `mkdir: created directory '${params[0]}'`
        }
        break

      case 'touch':
        if (params.length === 0) {
          output = 'touch: missing file operand'
        } else {
          output = `touch: created file '${params[0]}'`
        }
        break

      case 'rm':
        if (params.length === 0) {
          output = 'rm: missing operand'
        } else {
          output = `rm: removed '${params[0]}'`
        }
        break

      case 'clear':
        setHistory([])
        return

      case 'exit':
        onClose()
        return

      default:
        output = `${cmd}: ${t('terminal.command_not_found')}`
    }

    // Añadir comando y output al historial
    setHistory(prev => [
      ...prev,
      `${getPrompt()}${trimmedCommand}`,
      output
    ])
  }

  const getPrompt = () => {
    const shortPath = currentPath.replace('/Users/irene', '~')
    return `irene@desktop ${shortPath} % `
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput)
      setCurrentInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentInput('')
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex] || '')
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Autocompletado básico
      const currentDir = getCurrentDirectory()
      if (currentDir && currentDir.children) {
        const files = Object.keys(currentDir.children)
        const matches = files.filter(f => f.startsWith(currentInput))
        if (matches.length === 1) {
          setCurrentInput(matches[0])
        }
      }
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <style jsx>{`
        .scrollbar-terminal::-webkit-scrollbar {
          width: 12px;
        }
        .scrollbar-terminal::-webkit-scrollbar-track {
          background: #1a202c;
          border-radius: 6px;
        }
        .scrollbar-terminal::-webkit-scrollbar-thumb {
          background: #4a5568;
          border-radius: 6px;
          border: 2px solid #1a202c;
        }
        .scrollbar-terminal::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
        .scrollbar-terminal::-webkit-scrollbar-thumb:active {
          background: #a0aec0;
        }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-full max-h-[80vh] bg-black rounded-lg shadow-2xl overflow-hidden border border-gray-700 flex flex-col">
        {/* Barra de título fija */}
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors shadow-sm"
                title="Cerrar"
              />
              <div className="w-3 h-3 bg-yellow-400 hover:bg-yellow-500 rounded-full shadow-sm transition-colors" />
              <div className="w-3 h-3 bg-green-400 hover:bg-green-500 rounded-full shadow-sm transition-colors" />
            </div>
            <span className="text-gray-300 text-sm font-medium">{t('terminal.title')}</span>
          </div>
        </div>

        {/* Terminal content con scroll */}
        <div
          ref={terminalRef}
          className="flex-1 p-4 font-mono text-sm text-green-400 bg-black overflow-y-auto scrollbar-terminal"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#4a5568 #1a202c'
          }}
        >
          {/* Historial */}
          <div className="whitespace-pre-wrap">
            {history.map((line, index) => (
              <div key={index} className="mb-1">
                {line}
              </div>
            ))}
          </div>

          {/* Input actual */}
          <div className="flex items-center">
            <span className="text-green-400 mr-2">{getPrompt()}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none flex-1 text-green-400 font-mono caret-green-400"
              autoFocus
            />
          </div>
        </div>
        </div>
      </div>
    </>
  )
}
