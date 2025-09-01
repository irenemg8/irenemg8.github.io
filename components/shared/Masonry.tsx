"use client"

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = () => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue

  const [value, setValue] = useState<number>(get)

  useEffect(() => {
    const handler = () => setValue(get)
    queries.forEach(q => matchMedia(q).addEventListener('change', handler))
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler))
  }, [queries])

  return value
}

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return [ref, size] as const
}

const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image()
          img.src = src
          img.onload = img.onerror = () => resolve()
        })
    )
  )
}

interface Item {
  id: string
  img: string
  url: string
  height: number
  width?: number
}

interface GridItem extends Item {
  x: number
  y: number
  w: number
  h: number
}

interface MasonryProps {
  items: Item[]
  ease?: string
  duration?: number
  stagger?: number
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random'
  scaleOnHover?: boolean
  hoverScale?: number
  blurToFocus?: boolean
  colorShiftOnHover?: boolean
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false
}) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1
  )

  const [containerRef, { width }] = useMeasure<HTMLDivElement>()
  const [imagesReady, setImagesReady] = useState(false)

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return { x: item.x, y: item.y }

    let direction = animateFrom
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right']
      direction = dirs[Math.floor(Math.random() * dirs.length)] as typeof animateFrom
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 }
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 }
      case 'left':
        return { x: -200, y: item.y }
      case 'right':
        return { x: window.innerWidth + 200, y: item.y }
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2
        }
      default:
        return { x: item.x, y: item.y + 100 }
    }
  }

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true))
  }, [items])

  const grid = useMemo<GridItem[]>(() => {
    if (!width) return []
    
    // Para collage centrado, usamos las dimensiones exactas especificadas
    const gap = 15
    const scale = Math.min(0.6, width / 1200) // Escalar más compacto para que quepa sin scroll
    
    // Primera pasada: calcular posiciones sin centrar
    let tempGrid: GridItem[] = []
    let currentX = 0
    let currentY = 0
    let rowHeight = 0
    let maxRowWidth = width - gap * 3 // Margen más estrecho para centrado
    let totalHeight = 0
    
    items.forEach(child => {
      const scaledWidth = (child.width || 300) * scale  
      const scaledHeight = (child.height || 300) * scale
      
      // Si no cabe en la fila actual, nueva fila
      if (currentX + scaledWidth > maxRowWidth && currentX > 0) {
        currentX = 0
        currentY += rowHeight + gap
        rowHeight = 0
      }

      tempGrid.push({
        ...child, 
        x: currentX, 
        y: currentY, 
        w: scaledWidth, 
        h: scaledHeight
      })
      
      currentX += scaledWidth + gap
      rowHeight = Math.max(rowHeight, scaledHeight)
      totalHeight = Math.max(totalHeight, currentY + scaledHeight)
    })

    // Segunda pasada: centrar horizontalmente cada fila
    const rows: GridItem[][] = []
    let currentRow: GridItem[] = []
    let lastY = -1
    
    tempGrid.forEach(item => {
      if (item.y !== lastY && currentRow.length > 0) {
        rows.push(currentRow)
        currentRow = []
      }
      currentRow.push(item)
      lastY = item.y
    })
    if (currentRow.length > 0) rows.push(currentRow)
    
    // Calcular altura total del collage
    const collageHeight = totalHeight
    const containerHeight = Math.min(window?.innerHeight * 0.7 || 600, 600) // Altura máxima
    const offsetY = Math.max(0, (containerHeight - collageHeight) / 2)
    
    // Centrar cada fila horizontalmente y centrar todo verticalmente
    return rows.flatMap(row => {
      const rowWidth = row[row.length - 1].x + row[row.length - 1].w
      const offsetX = (width - rowWidth) / 2
      
      return row.map(item => ({
        ...item,
        x: item.x + Math.max(0, offsetX),
        y: item.y + offsetY
      }))
    })
  }, [items, width])

  const hasMounted = useRef(false)

  useLayoutEffect(() => {
    if (!imagesReady) return

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h }

      if (!hasMounted.current) {
        if (duration > 0) {
          // Pop effect animation - scale desde 0
          gsap.fromTo(
            selector,
            {
              opacity: 0,
              scale: 0,
              x: item.x,
              y: item.y,
              width: item.w,
              height: item.h,
              transformOrigin: "center center",
              ...(blurToFocus && { filter: 'blur(10px)' })
            },
            {
              opacity: 1,
              scale: 1,
              ...animProps,
              transformOrigin: "center center",
              ...(blurToFocus && { filter: 'blur(0px)' }),
              duration: duration,
              ease: ease,
              delay: index * stagger
            }
          )
        } else {
          // Sin animaciones, solo posicionar directamente
          gsap.set(selector, {
            opacity: 1,
            scale: 1,
            ...animProps,
            ...(blurToFocus && { filter: 'blur(0px)' })
          })
        }
      } else {
        gsap.to(selector, {
          ...animProps,
          scale: 1,
          duration,
          ease,
          overwrite: 'auto'
        })
      }
    })

    hasMounted.current = true
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease])

  const handleMouseEnter = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: duration > 0 ? 0.2 : 0,
        ease: 'power2.out'
      })
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: duration > 0 ? 0.2 : 0 })
    }
  }

  const handleMouseLeave = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: duration > 0 ? 0.2 : 0,
        ease: 'power2.out'
      })
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement
      if (overlay) gsap.to(overlay, { opacity: 0, duration: duration > 0 ? 0.2 : 0 })
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {grid.map(item => (
        <div
          key={item.id}
          data-key={item.id}
          className="absolute box-content cursor-pointer"
          style={{ willChange: 'transform, width, height, opacity' }}
          onClick={() => window.open(item.url, '_blank', 'noopener')}
          onMouseEnter={e => handleMouseEnter(item.id, e.currentTarget)}
          onMouseLeave={e => handleMouseLeave(item.id, e.currentTarget)}
        >
          <img
            src={item.img}
            alt={`Artwork ${item.id}`}
            className="w-full h-full object-contain shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)]"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
          {colorShiftOnHover && (
            <div className="color-overlay absolute inset-0 bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0 pointer-events-none" />
          )}
        </div>
      ))}
    </div>
  )
}

export default Masonry
