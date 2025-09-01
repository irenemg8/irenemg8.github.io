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
  const [searchVisible, setSearchVisible] = useState(false)
  const [gitVisible, setGitVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<{file: File, matches: number}[]>([])
  const [activeSidebar, setActiveSidebar] = useState<'files' | 'search' | 'git'>('files')
  const [commitMessage, setCommitMessage] = useState('')
  const [isCommitting, setIsCommitting] = useState(false)
  const [commitSuccess, setCommitSuccess] = useState(false)
  const [hasChanges, setHasChanges] = useState(true)
  const [commitHistory, setCommitHistory] = useState<{id: string, message: string, time: string, author: string}[]>([
    { id: 'a1b2c3d', message: 'Initial commit: Add portfolio structure', time: '2 horas ago', author: 'Irene' },
    { id: 'e4f5g6h', message: 'Update terminal functionality', time: '1 hora ago', author: 'Irene' },
    { id: 'i7j8k9l', message: 'Add VS Code editor component', time: '30 min ago', author: 'Irene' }
  ])

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

  const searchInFiles = (term: string) => {
    if (!term.trim()) {
      setSearchResults([])
      return
    }

    const results = files.map(file => {
      const matches = (file.content.toLowerCase().match(new RegExp(term.toLowerCase(), 'g')) || []).length
      return { file, matches }
    }).filter(result => result.matches > 0)

    setSearchResults(results)
  }

  const handleCommit = async () => {
    if (!commitMessage.trim() || !hasChanges) return

    setIsCommitting(true)
    
    // Simular proceso de commit con delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Crear nuevo commit
    const newCommit = {
      id: Math.random().toString(36).substr(2, 7),
      message: commitMessage.trim(),
      time: 'ahora mismo',
      author: 'Irene'
    }
    
    // Agregar al historial
    setCommitHistory(prev => [newCommit, ...prev])
    
    // Limpiar formulario y mostrar éxito
    setCommitMessage('')
    setHasChanges(false)
    setIsCommitting(false)
    setCommitSuccess(true)
    
    // Simular que aparecen nuevos cambios después de un rato
    setTimeout(() => {
      setHasChanges(true)
      setCommitSuccess(false)
    }, 3000)
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
              <button 
                onClick={onClose}
                className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                title="Cerrar"
              />
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-300 text-sm font-medium">Visual Studio Code</span>
          </div>
         
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Barra lateral de actividades */}
          <div className="w-12 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-2 space-y-4">
            <button
              onClick={() => {
                setSidebarVisible(true)
                setActiveSidebar('files')
              }}
              className={`p-2 rounded transition-colors ${
                activeSidebar === 'files' && sidebarVisible 
                  ? 'text-white bg-gray-700' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Folder className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setSidebarVisible(true)
                setActiveSidebar('search')
              }}
              className={`p-2 rounded transition-colors ${
                activeSidebar === 'search' && sidebarVisible 
                  ? 'text-white bg-gray-700' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setSidebarVisible(true)
                setActiveSidebar('git')
              }}
              className={`p-2 rounded transition-colors ${
                activeSidebar === 'git' && sidebarVisible 
                  ? 'text-white bg-gray-700' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <GitBranch className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTerminalVisible(!terminalVisible)}
              className="p-2 text-gray-400 hover:text-white rounded transition-colors"
            >
              <Terminal className="w-5 h-5" />
            </button>
          </div>

          {/* Panel lateral */}
          {sidebarVisible && (
            <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
              {activeSidebar === 'files' && (
                <>
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
                </>
              )}

              {activeSidebar === 'search' && (
                <>
                  <div className="p-3 border-b border-gray-700">
                    <h3 className="text-gray-300 text-sm font-medium">BUSCAR</h3>
                  </div>
                  <div className="p-3">
                    <input
                      type="text"
                      placeholder="Buscar en archivos..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        searchInFiles(e.target.value)
                      }}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1 p-2 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <div className="space-y-2">
                        <div className="text-xs text-gray-400 mb-2">
                          {searchResults.length} archivo(s) encontrado(s)
                        </div>
                        {searchResults.map(result => (
                          <button
                            key={result.file.id}
                            onClick={() => handleFileSelect(result.file.id)}
                            className="w-full flex items-center justify-between px-2 py-1 text-left text-sm rounded transition-colors text-gray-400 hover:text-white hover:bg-gray-700"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span>{result.file.name}</span>
                            </div>
                            <span className="text-xs bg-gray-600 px-1 rounded">{result.matches}</span>
                          </button>
                        ))}
                      </div>
                    ) : searchTerm ? (
                      <div className="text-sm text-gray-400">Sin resultados</div>
                    ) : (
                      <div className="text-sm text-gray-400">Escribe para buscar</div>
                    )}
                  </div>
                </>
              )}

              {activeSidebar === 'git' && (
                <>
                  <div className="p-3 border-b border-gray-700">
                    <h3 className="text-gray-300 text-sm font-medium">CONTROL DE CÓDIGO</h3>
                  </div>
                  <div className="flex-1 p-2 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Sección de cambios */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-gray-400">CAMBIOS</div>
                          {hasChanges && (
                            <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                              {files.length}
                            </div>
                          )}
                        </div>
                        
                        {commitSuccess ? (
                          <div className="flex items-center space-x-2 text-sm text-green-400 mb-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>✅ Commit realizado correctamente</span>
                          </div>
                        ) : hasChanges ? (
                          <div className="space-y-1 mb-3">
                            {files.map(file => (
                              <div key={file.id} className="flex items-center space-x-2 text-sm">
                                <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">{file.name}</span>
                                <span className="text-xs text-yellow-500 ml-auto">M</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 mb-3">
                            Sin cambios pendientes
                          </div>
                        )}
                        
                        {/* Formulario de commit */}
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Mensaje del commit..."
                            value={commitMessage}
                            onChange={(e) => setCommitMessage(e.target.value)}
                            disabled={!hasChanges || isCommitting}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <button 
                            onClick={handleCommit}
                            disabled={!commitMessage.trim() || !hasChanges || isCommitting}
                            className={`w-full text-white text-sm py-1 px-3 rounded transition-colors flex items-center justify-center space-x-2 ${
                              isCommitting 
                                ? 'bg-yellow-600 cursor-not-allowed' 
                                : commitSuccess 
                                  ? 'bg-green-600' 
                                  : !commitMessage.trim() || !hasChanges 
                                    ? 'bg-gray-600 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            {isCommitting ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                                <span>Commiting...</span>
                              </>
                            ) : commitSuccess ? (
                              <>
                                <span>✅ Completado</span>
                              </>
                            ) : (
                              <>
                                <span>✓ Commit</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Historial de commits */}
                      <div className="border-t border-gray-700 pt-3">
                        <div className="text-xs text-gray-400 mb-2">HISTORIAL</div>
                        <div className="space-y-2">
                          {commitHistory.slice(0, 5).map(commit => (
                            <div key={commit.id} className="bg-gray-750 rounded p-2 text-xs">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-blue-400 font-mono">{commit.id}</span>
                                <span className="text-gray-400">{commit.time}</span>
                              </div>
                              <div className="text-gray-300 text-sm">{commit.message}</div>
                              <div className="text-gray-400 text-xs mt-1">por {commit.author}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
