import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Proyecto no encontrado
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Lo sentimos, el proyecto que buscas no existe o ha sido movido.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">
              🏠 Volver al Portfolio
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/#projects">
              📁 Ver todos los proyectos
            </Link>
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ¿Llegaste aquí por error? 
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
              Contacta conmigo
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
