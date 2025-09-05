"use client"

import { ComponentType, forwardRef } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileWindow } from './mobile-window'

interface WithMobileWindowOptions {
  title?: string
  maxHeight?: string
  customGradient?: string
  showHeader?: boolean
  allowSwipeToClose?: boolean
}

interface WindowProps {
  isOpen: boolean
  onClose: () => void
  [key: string]: any
}

export function withMobileWindow<T extends WindowProps>(
  Component: ComponentType<T>,
  options: WithMobileWindowOptions = {}
) {
  const {
    title = "Ventana",
    maxHeight = "85vh",
    customGradient = "from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900",
    showHeader = true,
    allowSwipeToClose = true
  } = options

  const WrappedComponent = forwardRef<HTMLDivElement, T>((props, ref) => {
    const isMobile = useIsMobile()

    // En desktop, renderizar el componente original
    if (!isMobile) {
      return <Component {...props} ref={ref} />
    }

    // En móvil, envolver con MobileWindow
    const { isOpen, onClose, ...otherProps } = props

    return (
      <MobileWindow
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        maxHeight={maxHeight}
        customGradient={customGradient}
        showHeader={showHeader}
        allowSwipeToClose={allowSwipeToClose}
      >
        {/* Contenedor especial para el contenido desktop dentro de móvil */}
        <div className="mobile-adapted-content">
          {/* Renderizar solo el contenido interno del componente desktop */}
          <Component {...props} isOpen={true} />
        </div>
      </MobileWindow>
    )
  })

  WrappedComponent.displayName = `withMobileWindow(${Component.displayName || Component.name})`
  
  return WrappedComponent
}
