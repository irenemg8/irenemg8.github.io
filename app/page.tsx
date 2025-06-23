"use client"
import { AnimatePresence } from "framer-motion"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ArtworksSection } from "@/components/sections/artworks-section"
import { HackathonsSection } from "@/components/sections/hackathons-section"
import { PressSection } from "@/components/sections/press-section"
import { GeSection } from "@/components/sections/ge-section"
import { WorldMapSection } from "@/components/sections/world-map-section"
import { Footer } from "@/components/shared/footer"
import { Header } from "@/components/shared/header"
import { CustomCursor } from "@/components/shared/custom-cursor"
import { ProjectModal } from "@/components/shared/project-modal"
import { ArtworkModal } from "@/components/shared/artwork-modal"
import { HackathonModal } from "@/components/shared/hackathon-modal"
import { PressModal } from "@/components/shared/press-modal"
import { GeModal } from "@/components/shared/ge-modal"
import { FloatingCTA } from "@/components/shared/floating-cta"
import { useActiveSection } from "@/hooks/use-active-section"
import { useModal } from "@/hooks/use-modal"

export default function Home() {
  const { activeSection, sectionRefs } = useActiveSection(["projects", "artworks", "hackathons", "press", "ge", "travels"])

  const { modalContent, modalType, isOpen, openModal, closeModal } = useModal()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CustomCursor />
      <Header activeSection={activeSection} />

      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <section id="projects" ref={(el) => { sectionRefs.current.projects = el }} className="py-16 md:py-24">
          <ProjectsSection openModal={openModal} title="💼 Projects 💼" />
        </section>

        <section id="artworks" ref={(el) => { sectionRefs.current.artworks = el }} className="py-16 md:py-24">
          <ArtworksSection openModal={openModal} title="🎨 Artworks 🎨" />
        </section>

        <section id="hackathons" ref={(el) => { sectionRefs.current.hackathons = el }} className="py-16 md:py-24">
          <HackathonsSection openModal={openModal} title="🚀 Hackathons 🚀" />
        </section>

        <section id="press" ref={(el) => { sectionRefs.current.press = el }} className="py-16 md:py-24">
          <PressSection openModal={openModal} title="📰 Press 📰" />
        </section>

        <section id="ge" ref={(el) => { sectionRefs.current.ge = el }} className="py-16 md:py-24">
          <GeSection openModal={openModal} title="🌟 GE - UPV 🌟" />
        </section>

        <section id="travels" ref={(el) => { sectionRefs.current.travels = el }} className="pt-16 pb-4 md:pt-24 md:pb-8">
          <WorldMapSection title="🌎 World map 🌎" />
        </section>
      </main>

      <Footer />
      <FloatingCTA />

      <AnimatePresence>
        {isOpen && (
          <>
            {modalType === "project" && <ProjectModal content={modalContent} onClose={closeModal} />}
            {modalType === "artwork" && <ArtworkModal content={modalContent} onClose={closeModal} />}
            {modalType === "hackathon" && <HackathonModal content={modalContent} onClose={closeModal} />}
            {modalType === "press" && <PressModal content={modalContent} onClose={closeModal} />}
            {modalType === "ge" && <GeModal content={modalContent} onClose={closeModal} />}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
