"use client"

import { motion } from 'framer-motion'
import { MobileApp } from './mobile-app'

export function MobileDock() {
  const dockApps = [
    {
      id: 'messages',
      name: 'Mensajes',
      image: '/Dock/Messages.png',
      gradient: 'from-green-500 to-green-700',
      onTap: () => {
        // Trigger messages window
        console.log('Messages app tapped')
      }
    },
    {
      id: 'safari',
      name: 'Safari',
      image: '/Dock/Safari.png',
      gradient: 'from-blue-500 to-blue-700',
      onTap: () => {
        // Trigger safari browser
        const button = document.querySelector('[data-github-safari-trigger]') as HTMLButtonElement;
        if (button) button.click();
      }
    },
    {
      id: 'spotify',
      name: 'Spotify',
      image: '/Dock/spotify.png',
      gradient: 'from-green-400 to-green-600',
      onTap: () => {
        console.log('Spotify app tapped')
      }
    },
    {
      id: 'mail',
      name: 'Mail',
      image: '/Dock/Mail.png',
      gradient: 'from-blue-500 to-blue-700',
      onTap: () => {
        window.location.href = 'mailto:irenebati4@gmail.com'
      }
    }
  ]

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
        className="
          bg-white/20 dark:bg-gray-900/20 
          backdrop-blur-2xl 
          rounded-3xl 
          px-4 sm:px-6 py-3 sm:py-4 
          border border-white/30 dark:border-gray-700/30
          shadow-2xl
          max-w-sm sm:max-w-md
        "
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="flex items-center space-x-3 sm:space-x-6">
          {dockApps.map((app, index) => (
            <div key={app.id} className="flex-shrink-0">
              <MobileApp
                name={app.name}
                image={app.image}
                gradient={app.gradient}
                onTap={app.onTap}
                delay={0.6 + index * 0.1}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
