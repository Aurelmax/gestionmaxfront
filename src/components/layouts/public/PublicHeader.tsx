'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Catalogue', href: '/catalogue' },
  { name: 'À propos', href: '/apropos' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

export function PublicHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <Image
              src="/visuel-formation-gestionmax-antibes.png"
              alt="GestionMax - Consultant formateur indépendant"
              width={400}
              height={120}
              className="h-20 w-auto"
              priority
            />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-brand-primary hover:bg-brand-primary/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-sm font-semibold leading-6 transition-colors',
                pathname === item.href
                  ? 'text-[#1f3b8e] bg-[#1f3b8e]/10 px-3 py-2 rounded-lg'
                  : 'text-gray-900 hover:text-[#1f3b8e] hover:bg-[#1f3b8e]/5 px-3 py-2 rounded-lg'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
          <Button
            variant="ghost"
            className="text-[#1f3b8e] hover:bg-[#1f3b8e]/10 hover:text-[#1f3b8e]"
            asChild
          >
            <Link href="/dashboard">Connexion</Link>
          </Button>
          <Button className="bg-[#1f3b8e] hover:bg-[#7eb33f] text-white" asChild>
            <Link href="/contact">RDV de Positionnement</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-2 px-6 pb-6 pt-2">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block rounded-lg px-3 py-2 text-base font-semibold leading-7',
                  pathname === item.href
                    ? 'bg-[#1f3b8e]/10 text-[#1f3b8e]'
                    : 'text-gray-900 hover:bg-[#7eb33f]/10 hover:text-[#7eb33f]'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full border-[#1f3b8e] text-[#1f3b8e] hover:bg-[#7eb33f] hover:text-white"
                asChild
              >
                <Link href="/dashboard">Connexion</Link>
              </Button>
              <Button className="w-full bg-[#1f3b8e] hover:bg-[#7eb33f] text-white" asChild>
                <Link href="/contact">RDV de Positionnement</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
