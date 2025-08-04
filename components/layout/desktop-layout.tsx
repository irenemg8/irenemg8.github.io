"use client"

import { DesktopWindow } from '@/components/layout/desktop-window'
import { PortfolioHeader } from '@/components/layout/portfolio-header'
import { NavigationMenu } from '@/components/layout/navigation-menu'
import { DesktopProjects } from '@/components/sections/desktop-projects'
import { DesktopAbout } from '@/components/sections/desktop-about'
import { DesktopFooter } from '@/components/layout/desktop-footer'

export function DesktopLayout() {
  return (
    <DesktopWindow>
      <div className="min-h-full flex flex-col">
        {/* Header Section */}
        <PortfolioHeader />
        
        {/* Navigation */}
        <NavigationMenu />
        
        {/* Projects Section */}
        <section className="flex-1">
          <DesktopProjects />
        </section>
        
        {/* About Section */}
        <section>
          <DesktopAbout />
        </section>
        
        {/* Footer */}
        <DesktopFooter />
      </div>
    </DesktopWindow>
  )
}