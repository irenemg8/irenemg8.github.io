"use client"

import { MacOSWindow } from '@/components/layout/macos-window'
import { MacOSCursor } from '@/components/ui/macos-cursor'
import { MacOSDock } from '@/components/ui/macos-dock'
import { PortfolioHeader } from '@/components/layout/portfolio-header'
import { NavigationMenu } from '@/components/layout/navigation-menu'
import { DesktopProjects } from '@/components/sections/desktop-projects'
import { DesktopAbout } from '@/components/sections/desktop-about'
import { DesktopFooter } from '@/components/layout/desktop-footer'
import { SpotifyMiniPlayer } from '@/components/desktop/spotify-mini-player'

export function DesktopLayout() {
  return (
    <>
      <MacOSCursor />
      <MacOSWindow>
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
    </MacOSWindow>
    <MacOSDock />
    <SpotifyMiniPlayer />
    </>
  )
}