"use client"

import { useIsMobile } from '@/hooks/use-mobile'
import { MobileWindow } from './mobile-window'

interface MobileFolderWrapperProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxHeight?: string
  customGradient?: string
}

export function MobileFolderWrapper({ 
  isOpen, 
  onClose, 
  title, 
  children,
  maxHeight = "95vh",
  customGradient = "from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900"
}: MobileFolderWrapperProps) {
  const isMobile = useIsMobile()

  // En móvil, usar MobileWindow
  if (isMobile) {
    return (
      <MobileWindow
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        maxHeight={maxHeight}
        customGradient={customGradient}
      >
        <div className="mobile-folder-content">
          {children}
        </div>
      </MobileWindow>
    )
  }

  // En desktop, renderizar directamente el contenido (será manejado por el componente padre)
  return <>{children}</>
}
