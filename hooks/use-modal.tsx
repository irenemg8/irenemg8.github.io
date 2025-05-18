"use client"

import { useState } from "react"

type ModalType = "project" | "artwork" | "hackathon" | "press" | null

export function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [modalContent, setModalContent] = useState<any>(null)
  const [modalType, setModalType] = useState<ModalType>(null)

  const openModal = (type: ModalType, content: any) => {
    setModalContent(content)
    setModalType(type)
    setIsOpen(true)
    document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
  }

  const closeModal = () => {
    setIsOpen(false)
    document.body.style.overflow = "" // Re-enable scrolling
  }

  return {
    isOpen,
    modalContent,
    modalType,
    openModal,
    closeModal,
  }
}
