export interface ProjectMetadata {
  slug: string
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
}

export const projectsMetadata: Record<string, ProjectMetadata> = {
  aidguide: {
    slug: 'aidguide',
    title: 'AidGuide - Aplicación de Ayuda Interactiva',
    description: 'Aplicación de ayuda interactiva desarrollada con tecnologías modernas para mejorar la experiencia del usuario.',
    image: '/social-previews/aidguide.png',
    category: 'Web Development',
    technologies: ['React', 'TypeScript', 'Next.js'],
    githubUrl: 'https://github.com/irenemg8/aidguide'
  },
  aura: {
    slug: 'aura',
    title: 'Aura - Proyecto de Hackathon',
    description: 'Proyecto desarrollado durante hackathon enfocado en experiencia de usuario y tecnología innovadora.',
    image: '/social-previews/aura.png',
    category: 'Hackathon',
    technologies: ['JavaScript', 'UI/UX', 'Prototipado'],
    githubUrl: 'https://github.com/irenemg8/aura'
  },
  blackjack: {
    slug: 'blackjack',
    title: 'Blackjack Game - Juego de Cartas',
    description: 'Implementación del clásico juego de Blackjack con interfaz moderna y lógica avanzada.',
    image: '/social-previews/blackjack.png',
    category: 'Game Development',
    technologies: ['JavaScript', 'HTML5', 'CSS3'],
    githubUrl: 'https://github.com/irenemg8/blackjack'
  },
  catan: {
    slug: 'catan',
    title: 'Catan Digital - Juego de Mesa Digital',
    description: 'Versión digital del popular juego de mesa Catan con funcionalidades multijugador.',
    image: '/social-previews/catan.png',
    category: 'Game Development',
    technologies: ['React', 'Node.js', 'Socket.io'],
    githubUrl: 'https://github.com/irenemg8/catan'
  },
  'cops-robbers': {
    slug: 'cops-robbers',
    title: 'Cops & Robbers - Juego Estratégico',
    description: 'Juego estratégico de persecución con algoritmos avanzados de IA y física de juego.',
    image: '/social-previews/cops-robbers.png',
    category: 'Game Development',
    technologies: ['Unity', 'C#', 'AI Algorithm'],
    githubUrl: 'https://github.com/irenemg8/cops-robbers'
  },
  ecocity: {
    slug: 'ecocity',
    title: 'EcoCity - Simulador de Ciudad Sostenible',
    description: 'Aplicación de simulación para planificación urbana sostenible y gestión ambiental.',
    image: '/social-previews/ecocity.png',
    category: 'Simulation',
    technologies: ['Python', 'Data Analysis', 'Visualization'],
    githubUrl: 'https://github.com/irenemg8/ecocity'
  },
  neurospot: {
    slug: 'neurospot',
    title: 'NeuroSpot - Análisis Neurológico',
    description: 'Herramienta de análisis neurológico usando machine learning para detección de patrones.',
    image: '/social-previews/neurospot.png',
    category: 'AI/ML',
    technologies: ['Python', 'TensorFlow', 'Medical Imaging'],
    githubUrl: 'https://github.com/irenemg8/neurospot'
  },
  portfolio: {
    slug: 'portfolio',
    title: 'Portfolio Personal - Experiencia Inmersiva',
    description: 'Portfolio personal con diseño inmersivo que simula el escritorio de macOS.',
    image: '/social-previews/portfolio.png',
    category: 'Portfolio',
    technologies: ['Next.js', 'TypeScript', 'Framer Motion', 'Three.js'],
    githubUrl: 'https://github.com/irenemg8/irenemg8.github.io',
    liveUrl: 'https://irenemg8.github.io'
  },
  promptgen: {
    slug: 'promptgen',
    title: 'PromptGen - Generador de Prompts AI',
    description: 'Herramienta para generar prompts optimizados para modelos de inteligencia artificial.',
    image: '/social-previews/Promptgen.png',
    category: 'AI Tools',
    technologies: ['React', 'OpenAI API', 'TypeScript'],
    githubUrl: 'https://github.com/irenemg8/promptgen'
  },
  othello: {
    slug: 'othello',
    title: 'Othello/Reversi - Juego Clásico',
    description: 'Implementación del clásico juego Othello con IA inteligente y interfaz elegante.',
    image: '/social-previews/Othello.png',
    category: 'Game Development',
    technologies: ['JavaScript', 'AI Algorithm', 'Game Theory'],
    githubUrl: 'https://github.com/irenemg8/othello'
  },
  'torres-hanoi': {
    slug: 'torres-hanoi',
    title: 'Torres de Hanoi - Resolver Algoritmo',
    description: 'Visualización interactiva del clásico problema de las Torres de Hanoi con algoritmos recursivos.',
    image: '/social-previews/torres-hanoi.png',
    category: 'Algorithm Visualization',
    technologies: ['JavaScript', 'Algorithm', 'Animation'],
    githubUrl: 'https://github.com/irenemg8/torres-hanoi'
  },
  chatbot: {
    slug: 'chatbot',
    title: 'Chatbot Inteligente - Asistente Virtual',
    description: 'Chatbot inteligente con procesamiento de lenguaje natural y aprendizaje automático.',
    image: '/social-previews/Chatbot.png',
    category: 'AI/ML',
    technologies: ['Python', 'NLP', 'Machine Learning'],
    githubUrl: 'https://github.com/irenemg8/chatbot'
  },
  'personal-vault': {
    slug: 'personal-vault',
    title: 'Personal Vault - Almacenamiento Seguro',
    description: 'Sistema de almacenamiento personal seguro con encriptación y gestión de archivos.',
    image: '/social-previews/personal-vault.png',
    category: 'Security',
    technologies: ['Node.js', 'Encryption', 'File Management'],
    githubUrl: 'https://github.com/irenemg8/personal-vault'
  },
  'pug-palace': {
    slug: 'pug-palace',
    title: 'Pug Palace - Sitio Web de Mascotas',
    description: 'Sitio web dedicado a mascotas con galería interactiva y funcionalidades de comunidad.',
    image: '/social-previews/pug-palace.png',
    category: 'Web Development',
    technologies: ['React', 'CSS3', 'Community Features'],
    githubUrl: 'https://github.com/irenemg8/pug-palace'
  }
}

export function getProjectMetadata(slug: string): ProjectMetadata | null {
  return projectsMetadata[slug] || null
}

export function getAllProjectSlugs(): string[] {
  return Object.keys(projectsMetadata)
}
