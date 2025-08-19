"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowLeft, ArrowRight, RotateCcw, Share, Star, GitFork, Calendar, Code, X, Globe, RefreshCw, Clock, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
  private: boolean
}

interface GitHubSafariBrowserProps {
  isOpen: boolean
  onClose: () => void
}

export function GitHubSafariBrowser({ isOpen, onClose }: GitHubSafariBrowserProps) {
  const { t } = useLanguage()
  const [repositories, setRepositories] = useState<GitHubRepo[]>([])
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)
  const [searchFilter, setSearchFilter] = useState<'all' | 'type' | 'language'>('all')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Fetch repositories from GitHub API on open and auto-refresh
  useEffect(() => {
    if (isOpen) {
      fetchRepositories()
      
      // Auto-refresh every 30 seconds if enabled
      const interval = autoRefreshEnabled ? setInterval(() => {
        fetchRepositories()
      }, 30000) : null
      
      return () => {
        if (interval) clearInterval(interval)
      }
    }
  }, [isOpen, autoRefreshEnabled])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isDropdownOpen])

  const fetchRepositories = async () => {
    setLoading(true)
    try {
      let allRepos: GitHubRepo[] = []
      
      // Fetch own repositories
      const ownReposResponse = await fetch('https://api.github.com/users/irenemg8/repos?sort=updated&per_page=50')
      if (ownReposResponse.ok) {
        const ownRepos = await ownReposResponse.json()
        allRepos = [...allRepos, ...ownRepos]
      }
      
      // Fetch collaborative/forked repositories
      try {
        const searchResponse = await fetch('https://api.github.com/search/repositories?q=user:irenemg8+fork:true&sort=updated&per_page=20')
        if (searchResponse.ok) {
          const searchData = await searchResponse.json()
          const collabRepos = searchData.items || []
          
          // Filter out duplicates by repo id
          const existingIds = new Set(allRepos.map(repo => repo.id))
          const uniqueCollabRepos = collabRepos.filter((repo: GitHubRepo) => !existingIds.has(repo.id))
          
          allRepos = [...allRepos, ...uniqueCollabRepos]
        }
      } catch (searchError) {
        console.log('Could not fetch collaborative repos:', searchError)
      }
      
      // Sort all repositories by updated date (most recent first)
      allRepos.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      
      setRepositories(allRepos)
      setFilteredRepos(allRepos)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching repositories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Check if repository has GitHub Pages
  const hasGitHubPages = (repo: GitHubRepo) => {
    // Check for common GitHub Pages patterns
    return (
      repo.name === `${repo.full_name.split('/')[0]}.github.io` || // User/org pages
      repo.name.endsWith('.github.io') || // Custom domain pages
      repo.topics.includes('github-pages') || // Explicitly tagged
      repo.description?.toLowerCase().includes('github pages') ||
      repo.description?.toLowerCase().includes('portfolio') ||
      repo.description?.toLowerCase().includes('website')
    )
  }

  // Generate GitHub Pages URL
  const getGitHubPagesUrl = (repo: GitHubRepo) => {
    const [owner] = repo.full_name.split('/')
    if (repo.name === `${owner}.github.io`) {
      return `https://${owner}.github.io`
    }
    return `https://${owner}.github.io/${repo.name}`
  }

  // Filter repositories based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRepos(repositories)
      return
    }

    const filtered = repositories.filter(repo => {
      const query = searchQuery.toLowerCase()
      
      switch (searchFilter) {
        case 'type':
          return repo.language?.toLowerCase().includes(query)
        case 'language':
          return repo.language?.toLowerCase().includes(query)
        default:
          return (
            repo.name.toLowerCase().includes(query) ||
            repo.description?.toLowerCase().includes(query) ||
            repo.language?.toLowerCase().includes(query) ||
            repo.topics.some(topic => topic.toLowerCase().includes(query))
          )
      }
    })
    
    setFilteredRepos(filtered)
  }, [searchQuery, repositories, searchFilter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getLanguageColor = (language: string | null) => {
    const colors: { [key: string]: string } = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C#': '#239120',
      'PHP': '#4F5D95',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'Swift': '#fa7343',
      'Kotlin': '#A97BFF',
      'Ruby': '#701516',
    }
    return colors[language || ''] || '#6b7280'
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-6xl h-[90vh] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden mx-2 md:mx-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Safari-style Header */}
          <div className="flex items-center h-12 md:h-14 px-3 md:px-4 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
            {/* Traffic Light Buttons */}
            <div className="flex items-center space-x-2 mr-2 md:mr-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center group hover:bg-red-600 transition-colors"
              >
                <X className="w-1.5 h-1.5 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
              />
            </div>

            {/* Navigation Buttons */}
            {/*<div className="flex items-center space-x-2 mr-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchRepositories}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>*/}

            {/* Search Bar */}
            <div className="flex-1 flex items-center bg-white/80 dark:bg-gray-800/80 rounded-lg px-3 md:px-4 py-2 mx-2 md:mx-4 border border-gray-300/50 dark:border-gray-600/50">
              <Search className="w-4 h-4 text-gray-500 mr-2 md:mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Buscar repositorios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 min-w-0"
              />
              
              {/* Custom Dropdown */}
              <div className="relative ml-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsDropdownOpen(!isDropdownOpen)
                  }}
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="hidden sm:inline">
                    {searchFilter === 'all' ? 'Todo' : searchFilter === 'type' ? 'Tipo' : 'Lenguaje'}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 min-w-[120px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {[
                        { value: 'all', label: 'Todo' },
                        { value: 'type', label: 'Tipo' },
                        { value: 'language', label: 'Lenguaje' }
                      ].map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                          onClick={() => {
                            setSearchFilter(option.value as 'all' | 'type' | 'language')
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                            searchFilter === option.value
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          } ${option.value === 'all' ? 'rounded-t-lg' : option.value === 'language' ? 'rounded-b-lg' : ''}`}
                        >
                          {option.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Auto-refresh Toggle */}
            {/*<motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                autoRefreshEnabled 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              title={autoRefreshEnabled ? 'Auto-actualización activada' : 'Auto-actualización desactivada'}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefreshEnabled ? 'animate-spin' : ''}`} />
            </motion.button>*/}

            {/* Share Button */}
            {/*<motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Share className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>*/}
          </div>

          {/* Content Area */}
          <div className="flex flex-col lg:flex-row h-[calc(100%-3rem)] md:h-[calc(100%-3.5rem)]">
            {/* Repositories List */}
            <div className="w-full lg:w-2/5 xl:w-1/2 lg:border-r border-gray-200/50 dark:border-gray-700/50 overflow-y-auto">
              <div className="p-3 md:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-2">
                  <div>
                    <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Repositorios ({filteredRepos.length})
                    </h2>
                    {lastUpdated && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span className="hidden sm:inline">Actualizado: </span>
                        <span>{lastUpdated.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                  {loading && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  )}
                </div>

                <div className="space-y-2 md:space-y-3">
                  {filteredRepos.map((repo) => (
                    <motion.div
                      key={repo.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedRepo(repo)}
                      className={`p-3 md:p-4 rounded-lg md:rounded-xl border cursor-pointer transition-all ${
                        selectedRepo?.id === repo.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                          : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/70'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 truncate">
                            {repo.name}
                          </h3>
                         {/* {repo.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {repo.description}
                          </p>
                          )}*/}
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                              {repo.language && (
                                <div className="flex items-center space-x-1">
                                  <div
                                    className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full"
                                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                                  />
                                  <span className="truncate max-w-20">{repo.language}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                <span>{repo.stargazers_count}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <GitFork className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                <span>{repo.forks_count}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                <span className="hidden sm:inline">{formatDate(repo.updated_at)}</span>
                              </div>
                            </div>
                            {hasGitHubPages(repo) && (
                              <div className="flex items-center space-x-1 text-xs text-blue-500 dark:text-blue-400 flex-shrink-0">
                                <Globe className="w-3 h-3" />
                                <span>Pages</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Repository Detail */}
            <div className="w-full lg:w-3/5 xl:w-1/2 overflow-y-auto border-t lg:border-t-0 border-gray-200/50 dark:border-gray-700/50">
              {selectedRepo ? (
                <div className="p-4 md:p-6">
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-center space-x-3 mb-3 md:mb-4">
                      <Code className="w-5 h-5 md:w-6 md:h-6 text-blue-500 flex-shrink-0" />
                      <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 truncate">
                        {selectedRepo.name}
                      </h1>
                    </div>
                    
                  {selectedRepo.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {selectedRepo.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                      {selectedRepo.language && (
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getLanguageColor(selectedRepo.language) }}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {selectedRepo.language}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">{selectedRepo.stargazers_count} stars</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <GitFork className="w-4 h-4" />
                        <span className="text-sm">{selectedRepo.forks_count} forks</span>
                      </div>
                    </div>

                    {selectedRepo.topics.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Topics:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedRepo.topics.map((topic) => (
                            <span
                              key={topic}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <motion.a
                        href={selectedRepo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                      >
                        <Code className="w-4 h-4 mr-2" />
                        Ver en GitHub
                      </motion.a>
                      
                      {hasGitHubPages(selectedRepo) && (
                        <motion.a
                          href={getGitHubPagesUrl(selectedRepo)}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Ver GitHub Pages
                        </motion.a>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Última actualización: {formatDate(selectedRepo.updated_at)}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Selecciona un repositorio para ver los detalles</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
