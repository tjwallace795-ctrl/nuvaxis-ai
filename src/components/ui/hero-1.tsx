'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Menu, X } from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
}

interface AnnouncementBanner {
  text: string
  linkText: string
  linkHref: string
}

interface CallToAction {
  text: string
  href: string
  variant: 'primary' | 'secondary'
}

interface HeroLandingProps {
  // Logo and branding
  logo?: {
    src: string
    alt: string
    companyName: string
  }

  // Navigation
  navigation?: NavigationItem[]
  loginText?: string
  loginHref?: string
  /** Hide the built-in header when the app already has its own navbar */
  showHeader?: boolean

  // Hero content
  title: string
  highlight?: string
  description: string
  announcementBanner?: AnnouncementBanner
  callToActions?: CallToAction[]

  // Styling options
  titleSize?: 'small' | 'medium' | 'large'
  gradientColors?: {
    from: string
    to: string
  }

  // Additional customization
  className?: string
}

const defaultProps: Partial<HeroLandingProps> = {
  navigation: [],
  showHeader: true,
  titleSize: 'large',
  gradientColors: {
    from: '#3b82f6',
    to: '#a855f7',
  },
  callToActions: [
    { text: 'Get started', href: '#', variant: 'primary' },
    { text: 'Learn more', href: '#', variant: 'secondary' },
  ],
}

export function HeroLanding(props: HeroLandingProps) {
  const {
    logo,
    navigation,
    loginText,
    loginHref,
    showHeader,
    title,
    highlight,
    description,
    announcementBanner,
    callToActions,
    titleSize,
    className,
  } = { ...defaultProps, ...props }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getTitleSizeClasses = () => {
    switch (titleSize) {
      case 'small':
        return 'text-2xl sm:text-3xl md:text-5xl'
      case 'medium':
        return 'text-2xl sm:text-4xl md:text-6xl'
      case 'large':
      default:
        return 'text-3xl sm:text-5xl md:text-7xl'
    }
  }

  const renderCallToAction = (cta: CallToAction, index: number) => {
    if (cta.variant === 'primary') {
      return (
        <a
          key={index}
          href={cta.href}
          className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-5 py-2.5 sm:px-7 sm:py-3.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-purple-900/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 transition-all"
        >
          {cta.text}
        </a>
      )
    } else {
      return (
        <a
          key={index}
          href={cta.href}
          className="text-xs sm:text-sm/6 font-semibold text-white hover:text-purple-300 transition-colors"
        >
          {cta.text} <span aria-hidden="true">→</span>
        </a>
      )
    }
  }

  return (
    <div className={`min-h-screen w-full overflow-x-hidden relative ${className || ''}`}>
      {showHeader && (
        <header className="absolute inset-x-0 top-0 z-10">
          <nav aria-label="Global" className="flex items-center justify-between p-4 sm:p-6 lg:px-8">
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">{logo?.companyName}</span>
                {logo?.src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={logo?.alt} src={logo?.src} className="h-6 sm:h-8 w-auto" />
                )}
              </a>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 hover:text-white transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                <Menu aria-hidden="true" className="size-6" />
              </button>
            </div>
            {navigation && navigation.length > 0 && (
              <div className="hidden lg:flex lg:gap-x-8 xl:gap-x-12">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm/6 font-semibold text-white hover:text-purple-300 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            )}
            {loginText && loginHref && (
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <a
                  href={loginHref}
                  className="text-sm/6 font-semibold text-white hover:text-purple-300 transition-colors"
                >
                  {loginText} <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            )}
          </nav>
          <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DialogContent className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-slate-950 px-4 py-4 sm:px-6 sm:py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10 lg:hidden">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">{logo?.companyName}</span>
                  {logo?.src && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={logo?.alt} src={logo?.src} className="h-6 sm:h-8 w-auto" />
                  )}
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-300 hover:text-white transition-colors"
                >
                  <span className="sr-only">Close menu</span>
                  <X aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mt-2 flow-root">
                <div className="-my-6 divide-y divide-white/10">
                  {navigation && navigation.length > 0 && (
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/10 transition-colors"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                  {loginText && loginHref && (
                    <div className="py-6">
                      <a
                        href={loginHref}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/10 transition-colors"
                      >
                        {loginText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </header>
      )}

      <div className="relative isolate px-6 pt-4 overflow-hidden min-h-screen flex flex-col justify-center">
        <div className="mx-auto max-w-4xl pt-20 sm:pt-24">
          {/* Announcement banner */}
          {announcementBanner && (
            <div className="mb-6 sm:mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-xs sm:px-4 sm:text-sm/6 text-gray-300 ring-1 ring-white/15 hover:ring-purple-400/50 bg-white/5 backdrop-blur-sm transition-all">
                {announcementBanner.text}{' '}
                <a
                  href={announcementBanner.linkHref}
                  className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                  <span aria-hidden="true" className="absolute inset-0" />
                  {announcementBanner.linkText} <span aria-hidden="true" className="text-purple-400">&rarr;</span>
                </a>
              </div>
            </div>
          )}

          <div className="text-center">
            <h1 className={`${getTitleSizeClasses()} font-bold tracking-tight text-balance text-white`}>
              {title}
              {highlight && (
                <>
                  {' '}
                  <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {highlight}
                  </span>
                </>
              )}
            </h1>
            <p className="mt-6 sm:mt-8 text-base sm:text-lg font-medium text-pretty text-gray-300 sm:text-xl/8 max-w-2xl mx-auto">
              {description}
            </p>

            {/* Call to action buttons */}
            {callToActions && callToActions.length > 0 && (
              <div className="mt-8 sm:mt-10 flex items-center justify-center gap-x-4 sm:gap-x-6">
                {callToActions.map((cta, index) => renderCallToAction(cta, index))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Export types for consumers
export type { HeroLandingProps, NavigationItem, AnnouncementBanner, CallToAction }
