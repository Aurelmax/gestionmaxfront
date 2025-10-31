'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        // TODO: Implémenter l'endpoint /api/stats dans le backend
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`)
        // const data = await response.json()
        // setStats(data)

        // Données de démo pour l'instant
        setStats({
          apprenants: 0,
          programmes: 0,
          rendezvous: 0,
          contacts: 0
        })
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  const cards = [
    {
      title: 'Apprenants',
      value: (stats?.['apprenants'] as number) || 0,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Programmes',
      value: (stats?.['programmes'] as number) || 0,
      icon: BookOpen,
      color: 'text-green-600',
    },
    {
      title: 'Rendez-vous',
      value: (stats?.['rendezVous'] as number) || 0,
      icon: Calendar,
      color: 'text-orange-600',
    },
    {
      title: 'Articles',
      value: (stats?.['articles'] as number) || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des statistiques...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(card => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Aucune activité récente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prochains rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Aucun rendez-vous planifié</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
