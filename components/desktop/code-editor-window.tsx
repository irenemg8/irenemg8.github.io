"use client"

import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { X, FileText, Folder, FolderOpen, Play, Terminal, Settings, Search, GitBranch } from 'lucide-react'

interface File {
  id: string
  name: string
  content: string
  language: string
  path: string
}

interface CodeEditorWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function CodeEditorWindow({ isOpen, onClose }: CodeEditorWindowProps) {
  const [activeFile, setActiveFile] = useState<string | null>('welcome.js')
  const [files, setFiles] = useState<File[]>([
    {
      id: 'welcome.js',
      name: 'welcome.js',
      language: 'javascript',
      path: '/welcome.js',
      content: `// ¡Bienvenido a VS Code!
// Este es un editor de código completamente funcional

function saludar(nombre) {
  console.log(\`¡Hola, \${nombre}! 👋\`)
  return \`Bienvenido/a, \${nombre}\`
}

// Ejemplo de uso
const usuario = "Desarrollador"
const mensaje = saludar(usuario)

// Características disponibles:
// ✅ Resaltado de sintaxis
// ✅ Auto-completado
// ✅ Múltiples pestañas
// ✅ Explorador de archivos
// ✅ Terminal integrada
// ✅ Buscar y reemplazar

export default saludar
`
    },
    {
      id: 'styles.css',
      name: 'styles.css',
      language: 'css',
      path: '/styles.css',
      content: `/* Estilos principales */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button:hover {
  background: #3730a3;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
}
`
    },
    {
      id: 'data.json',
      name: 'data.json',
      language: 'json',
      path: '/data.json',
      content: `{
  "proyecto": "Editor de Código VS Code",
  "version": "1.0.0",
  "características": [
    "Editor Monaco",
    "Múltiples lenguajes",
    "Explorador de archivos",
    "Terminal integrada",
    "Interfaz VS Code"
  ],
  "tecnologías": {
    "frontend": "Next.js + React",
    "editor": "Monaco Editor",
    "estilos": "Tailwind CSS",
    "iconos": "Lucide React"
  },
  "estado": "activo",
  "lastModified": "2024-01-15T10:30:00Z"
}
`
    }
  ])
  const [openFiles, setOpenFiles] = useState<string[]>(['welcome.js'])
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [terminalVisible, setTerminalVisible] = useState(false)
  const [terminalContent, setTerminalContent] = useState('$ Bienvenido a la terminal integrada!\n$ Escribe tus comandos aquí...\n')

  const editorOptions = {
    minimap: { enabled: true },
    fontSize: 14,
    lineNumbers: 'on' as const,
    automaticLayout: true,
    wordWrap: 'on' as const,
    theme: 'vs-dark',
    scrollBeyondLastLine: false,
    renderLineHighlight: 'all' as const,
    cursorBlinking: 'blink' as const,
    smoothScrolling: true,
    contextmenu: true,
    dragAndDrop: true,
    links: true,
    multiCursorModifier: 'ctrlCmd' as const,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on' as const,
    tabCompletion: 'on' as const,
  }

  const activeFileData = files.find(f => f.id === activeFile)

  const handleFileSelect = (fileId: string) => {
    setActiveFile(fileId)
    if (!openFiles.includes(fileId)) {
      setOpenFiles([...openFiles, fileId])
    }
  }

  const handleCloseTab = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newOpenFiles = openFiles.filter(id => id !== fileId)
    setOpenFiles(newOpenFiles)
    
    if (activeFile === fileId) {
      setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null)
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFile) {
      setFiles(files.map(f => 
        f.id === activeFile ? { ...f, content: value } : f
      ))
    }
  }

  const createNewFile = () => {
    const fileName = prompt('Nombre del nuevo archivo:')
    if (fileName) {
      const extension = fileName.split('.').pop()
      let language = 'plaintext'
      
      switch (extension) {
        case 'js':
        case 'jsx':
          language = 'javascript'
          break
        case 'ts':
        case 'tsx':
          language = 'typescript'
          break
        case 'css':
          language = 'css'
          break
        case 'html':
          language = 'html'
          break
        case 'json':
          language = 'json'
          break
        case 'py':
          language = 'python'
          break
      }

      const newFile: File = {
        id: fileName,
        name: fileName,
        language,
        path: `/${fileName}`,
        content: ''
      }

      setFiles([...files, newFile])
      handleFileSelect(fileName)
    }
  }

  const executeTerminalCommand = (command: string) => {
    let output = ''
    
    switch (command.toLowerCase().trim()) {
      case 'ls':
        output = files.map(f => f.name).join('  ')
        break
      case 'pwd':
        output = '/home/user/project'
        break
      case 'clear':
        setTerminalContent('$ ')
        return
      case 'help':
        output = 'Comandos disponibles: ls, pwd, clear, help, npm, git'
        break
      case 'npm install':
        output = 'Instalando dependencias...\n✅ Dependencias instaladas correctamente'
        break
      case 'git status':
        output = 'En rama main\nTu rama está actualizada con "origin/main"\n\nCambios no confirmados:'
        break
      default:
        output = `Comando no reconocido: ${command}`
    }
    
    setTerminalContent(prev => prev + `\n$ ${command}\n${output}\n$ `)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Barra de título */}
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-300 text-sm font-medium">Visual Studio Code</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Barra lateral de actividades */}
          <div className="w-12 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-2 space-y-4">
            <button
              onClick={() => setSidebarVisible(!sidebarVisible)}
              className="p-2 text-gray-400 hover:text-white rounded transition-colors"
            >
              <Folder className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded transition-colors">
              <GitBranch className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTerminalVisible(!terminalVisible)}
              className="p-2 text-gray-400 hover:text-white rounded transition-colors"
            >
              <Terminal className="w-5 h-5" />
            </button>
          </div>

          {/* Explorador de archivos */}
          {sidebarVisible && (
            <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
              <div className="p-3 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-300 text-sm font-medium">EXPLORADOR</h3>
                  <button
                    onClick={createNewFile}
                    className="text-gray-400 hover:text-white text-xs"
                    title="Nuevo archivo"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex-1 p-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-300 text-xs font-medium mb-2">
                    <FolderOpen className="w-4 h-4" />
                    <span>PROYECTO</span>
                  </div>
                  {files.map(file => (
                    <button
                      key={file.id}
                      onClick={() => handleFileSelect(file.id)}
                      className={`w-full flex items-center space-x-2 px-2 py-1 text-left text-sm rounded transition-colors ${
                        activeFile === file.id 
                          ? 'bg-gray-700 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-750'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>{file.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Área principal del editor */}
          <div className="flex-1 flex flex-col">
            {/* Pestañas de archivos */}
            <div className="bg-gray-800 border-b border-gray-700 flex">
              {openFiles.map(fileId => {
                const file = files.find(f => f.id === fileId)
                if (!file) return null
                
                return (
                  <div
                    key={fileId}
                    className={`flex items-center px-3 py-2 border-r border-gray-700 cursor-pointer group ${
                      activeFile === fileId ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveFile(fileId)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="text-sm">{file.name}</span>
                    <button
                      onClick={(e) => handleCloseTab(fileId, e)}
                      className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Editor principal */}
            <div className={`flex-1 ${terminalVisible ? 'h-2/3' : 'h-full'}`}>
              {activeFileData ? (
                <Editor
                  value={activeFileData.content}
                  language={activeFileData.language}
                  theme="vs-dark"
                  options={editorOptions}
                  onChange={handleEditorChange}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Selecciona un archivo para editarlo</p>
                  </div>
                </div>
              )}
            </div>

            {/* Terminal */}
            {terminalVisible && (
              <div className="h-1/3 bg-gray-900 border-t border-gray-700 flex flex-col">
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                  <h4 className="text-gray-300 text-sm font-medium">TERMINAL</h4>
                  <button
                    onClick={() => setTerminalVisible(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 p-3 font-mono text-sm text-green-400 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{terminalContent}</pre>
                  <div className="flex">
                    <span>$ </span>
                    <input
                      type="text"
                      className="bg-transparent border-none outline-none flex-1 text-green-400"
                      placeholder="Escribe un comando..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const command = e.currentTarget.value
                          executeTerminalCommand(command)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
