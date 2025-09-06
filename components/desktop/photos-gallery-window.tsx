"use client"

import { useState } from 'react';
import DomeGallery from './dome-gallery';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotosGalleryWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PhotosGalleryWindow({ isOpen, onClose }: PhotosGalleryWindowProps) {
  const [isMounted, setIsMounted] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center"
        >
          <div className="w-[90%] h-[90%] max-w-7xl max-h-6xl bg-black rounded-lg shadow-2xl overflow-hidden">
            {/* macOS Window Header */}
            <div className="h-8 bg-gray-800/90 backdrop-blur-sm flex items-center justify-between px-4 relative">
              {/* Traffic Light Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-150 flex items-center justify-center group"
                  title="Cerrar galería"
                >
                  <svg 
                    width="8" 
                    height="8" 
                    viewBox="0 0 8 8" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  >
                    <path d="M1 1L7 7M7 1L1 7" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </button>
                <button
                  className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors duration-150"
                  title="Minimizar"
                >
                </button>
                <button
                  className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors duration-150"
                  title="Maximizar"
                >
                </button>
              </div>
              
              {/* Window Title */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <span className="text-white text-sm font-medium">Fotos</span>
              </div>
            </div>

            {/* Gallery Content */}
            <div className="h-[calc(100%-2rem)]" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)' }}>
              <DomeGallery 
                fit={0.5}
                minRadius={500}
                segments={45}
                maxVerticalRotationDeg={0}
                dragDampening={2}
                grayscale={false}
                imageBorderRadius="30px"
                openedImageBorderRadius="30px"
                overlayBlurColor="#060010"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
