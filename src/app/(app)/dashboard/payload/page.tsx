'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Database, Users, FileText, Image } from 'lucide-react'

export default function PayloadAdminPage() {
  const collections = [
    {
      name: 'Users',
      description: 'Gestion des utilisateurs et authentification',
      icon: Users,
      color: 'text-blue-600',
      count: 0,
    },
    {
      name: 'Formations',
      description: 'Catalogue des formations disponibles',
      icon: FileText,
      color: 'text-green-600',
      count: 0,
    },
    {
      name: 'Apprenants',
      description: 'Gestion des stagiaires et apprenants',
      icon: Users,
      color: 'text-purple-600',
      count: 0,
    },
    {
      name: 'Media',
      description: 'Upload et gestion des fichiers',
      icon: Image,
      color: 'text-orange-600',
      count: 0,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Interface Payload CMS</h1>
        <p className="text-muted-foreground">Gestion du contenu et des données</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map(collection => {
          const Icon = collection.icon
          return (
            <Card key={collection.name} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {collection.name}
                </CardTitle>
                <Icon className={`h-5 w-5 ${collection.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{collection.count}</div>
                <p className="text-xs text-muted-foreground">{collection.description}</p>
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => {
                    // Rediriger vers la page de gestion appropriée
                    const routes = {
                      Users: '/dashboard/utilisateurs',
                      Formations: '/dashboard/programmes',
                      Apprenants: '/dashboard/apprenants',
                      Media: '/dashboard/media',
                    }
                    const route = routes[collection.name as keyof typeof routes]
                    if (route) {
                      window.location.href = route
                    } else {
                      alert(`Route non configurée pour ${collection.name}`)
                    }
                  }}
                >
                  Gérer
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configuration Payload CMS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Base de données</h4>
                <p className="text-sm text-muted-foreground">MongoDB Atlas connecté</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Collections</h4>
                <p className="text-sm text-muted-foreground">
                  {collections.length} collections configurées
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                className="w-full"
                onClick={() => {
                  // Ouvrir l'interface Payload native dans un nouvel onglet
                  window.open('/admin', '_blank')
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ouvrir l'interface Payload complète
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
