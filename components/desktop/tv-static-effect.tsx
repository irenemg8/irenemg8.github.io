"use client"

import { useEffect, useState } from 'react'

export function TVStaticEffect() {
  const [glitchKey, setGlitchKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchKey(prev => prev + 1)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Barras de colores estilo TV sin señal */}
      <div className="absolute inset-0 flex">
        <div className="flex-1 bg-gradient-to-b from-gray-200 to-gray-300" />
        <div className="flex-1 bg-gradient-to-b from-yellow-400 to-yellow-500" />
        <div className="flex-1 bg-gradient-to-b from-cyan-400 to-cyan-500" />
        <div className="flex-1 bg-gradient-to-b from-green-400 to-green-500" />
        <div className="flex-1 bg-gradient-to-b from-purple-400 to-purple-500" />
        <div className="flex-1 bg-gradient-to-b from-red-400 to-red-500" />
        <div className="flex-1 bg-gradient-to-b from-blue-400 to-blue-500" />
      </div>

      {/* Efecto de ruido estático */}
      <div 
        key={glitchKey}
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='static'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' result='noise' seed='${glitchKey}'/%3E%3CfeColorMatrix in='noise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23static)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Líneas horizontales de escaneo */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.3) 2px,
            rgba(0, 0, 0, 0.3) 4px
          )`,
          animation: 'scanlines 8s linear infinite'
        }}
      />

      {/* Efecto de distorsión */}
      <div className="absolute inset-0 mix-blend-screen">
        <div 
          className="h-full w-full"
          style={{
            background: `linear-gradient(
              ${Math.random() * 360}deg,
              transparent ${Math.random() * 30 + 30}%,
              rgba(255, 0, 255, 0.1) ${Math.random() * 30 + 50}%,
              transparent ${Math.random() * 30 + 70}%
            )`,
            animation: 'flicker 0.1s infinite'
          }}
        />
      </div>

      {/* Mensaje de sin señal */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center z-10">
          <div className="text-6xl font-mono font-bold text-black/80 mb-4 animate-pulse">
            NO SIGNAL
          </div>
          <div className="text-xl font-mono text-black/60">
            Camera access denied
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanlines {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(10px);
          }
        }

        @keyframes flicker {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  )
}
