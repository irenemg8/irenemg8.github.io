"use client"

import { useState, useEffect, useRef } from "react"

export function useActiveSection(sections: string[]) {
  const [activeSection, setActiveSection] = useState("")
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset for header

      // Find the section that is currently in view
      for (const section of sections) {
        const element = sectionRefs.current[section]

        if (!element) continue

        const { offsetTop, offsetHeight } = element

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  return { activeSection, sectionRefs }
}
