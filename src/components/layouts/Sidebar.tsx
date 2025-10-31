'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  // FileText, // Commenté car Documents n'existe pas encore
  // Settings, // Commenté car Parametres n'existe pas encore
  UserCog,
  LogOut,
  PenTool,
  Image,
  Mail,
  GraduationCap,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Programmes', href: '/dashboard/programmes', icon: BookOpen },
  {
    name: 'Formations Personnalisées',
    href: '/dashboard/formation-programmes',
    icon: GraduationCap,
  },
  { name: 'Apprenants', href: '/dashboard/apprenants', icon: Users },
  { name: 'Rendez-vous', href: '/dashboard/rendez-vous', icon: Calendar },
  { name: 'Blog', href: '/dashboard/blog', icon: PenTool },
  { name: 'Contacts', href: '/dashboard/contacts', icon: Mail },
  { name: 'Médias', href: '/dashboard/medias', icon: Image },
  { name: 'Utilisateurs', href: '/dashboard/utilisateurs', icon: UserCog },
  // TODO: Créer les pages documents et parametres
  // { name: 'Documents', href: '/dashboard/documents', icon: FileText },
  // { name: 'Paramètres', href: '/dashboard/parametres', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary">GestionMax</h1>
        <p className="text-sm text-muted-foreground">Formation Pro</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map(item => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}

        {/* Interface Payload CMS désactivée - Utiliser uniquement le dashboard React */}
        {/*
        <div className="pt-4 border-t border-gray-200">
          <a
            href="/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
            Interface Payload CMS
          </a>
        </div>
        */}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            {user?.firstName?.[0]}
            {user?.lastName?.[0] || user?.name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Utilisateur'}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role || 'Utilisateur'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log('🚪 Clic sur déconnexion')
            // Rediriger vers la page de déconnexion dédiée
            window.location.href = '/dashboard/logout'
          }}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Se déconnecter
        </Button>
      </div>
    </div>
  )
}
