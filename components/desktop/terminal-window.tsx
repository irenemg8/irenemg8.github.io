"use client"

import { useState, useEffect, useRef } from 'react'
import { X, Minus, Square } from 'lucide-react'

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
  const [history, setHistory] = useState<string[]>([
    'Last login: ' + new Date().toLocaleString() + ' on console',
    'Welcome to Terminal! Type "help" for available commands.',
    ''
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [currentPath, setCurrentPath] = useState('/Users/irene')
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
                    content: 'Mi portfolio web - irenemg8.github.io\nDesarrollado con Next.js y React\n¡Gracias por visitarlo!',
                    size: 89
                  },
                  'projects': {
                    name: 'projects',
                    type: 'directory',
                    children: {
                      'README.md': {
                        name: 'README.md',
                        type: 'file',
                        content: '# Mis Proyectos\n\n- Portfolio Web\n- VS Code Editor\n- Terminal App\n- Launchpad',
                        size: 78
                      }
                    }
                  }
                }
              },
              Documents: {
                name: 'Documents',
                type: 'directory',
                children: {
                  'notes.txt': {
                    name: 'notes.txt',
                    type: 'file',
                    content: 'Mis notas personales:\n- Aprender más React\n- Mejorar el portfolio\n- Estudiar nuevas tecnologías',
                    size: 102
                  }
                }
              },
              Downloads: {
                name: 'Downloads',
                type: 'directory',
                children: {}
              }
            }
          }
        }
      },
      Applications: {
        name: 'Applications',
        type: 'directory',
        children: {
          'Terminal.app': { name: 'Terminal.app', type: 'directory', children: {} },
          'Safari.app': { name: 'Safari.app', type: 'directory', children: {} },
          'VS Code.app': { name: 'VS Code.app', type: 'directory', children: {} }
        }
      },
      tmp: {
        name: 'tmp',
        type: 'directory',
        children: {}
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
        output = `Comandos disponibles:
  ls [path]      - Listar archivos y directorios
  cd [path]      - Cambiar directorio
  pwd            - Mostrar directorio actual
  cat [file]     - Mostrar contenido de archivo
  mkdir [name]   - Crear directorio
  touch [name]   - Crear archivo vacío
  rm [name]      - Eliminar archivo
  echo [text]    - Mostrar texto
  whoami         - Mostrar usuario actual
  date           - Mostrar fecha y hora
  uname          - Información del sistema
  history        - Mostrar historial de comandos
  clear          - Limpiar terminal
  exit           - Cerrar terminal`
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
            output = `ls: ${targetPath}: No such file or directory`
            break
          }
        }

        if (targetDir && targetDir.children && !output) {
          const items = Object.values(targetDir.children)
          if (items.length === 0) {
            output = ''
          } else {
            output = items.map(item => {
              const color = item.type === 'directory' ? '\x1b[34m' : '\x1b[37m'
              const reset = '\x1b[0m'
              return `${color}${item.name}${reset}`
            }).join('  ')
          }
        }
        break

      case 'pwd':
        output = currentPath
        break

      case 'cd':
        const newPath = params[0] || '/Users/irene'
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
        } else {
          output = `cd: ${newPath}: No such file or directory`
        }
        break

      case 'cat':
        if (params.length === 0) {
          output = 'cat: missing file operand'
        } else {
          const fileName = params[0]
          const currentDir = getCurrentDirectory()
          if (currentDir && currentDir.children && currentDir.children[fileName]) {
            const file = currentDir.children[fileName]
            if (file.type === 'file') {
              output = file.content || ''
            } else {
              output = `cat: ${fileName}: Is a directory`
            }
          } else {
            output = `cat: ${fileName}: No such file or directory`
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
        output = `${cmd}: command not found. Type 'help' for available commands.`
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-full max-h-[80vh] bg-black rounded-lg shadow-2xl overflow-hidden border border-gray-700">
        {/* Barra de título */}
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
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
            <span className="text-gray-300 text-sm font-medium">Terminal</span>
          </div>
        </div>

        {/* Terminal content */}
        <div
          ref={terminalRef}
          className="h-full p-4 font-mono text-sm text-green-400 bg-black overflow-y-auto"
          style={{ minHeight: 'calc(100% - 40px)' }}
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
  )
}
