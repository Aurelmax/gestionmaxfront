'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, Search, User, Phone, Calendar, Eye, Edit } from 'lucide-react'

// Interface pour les apprenants Payload CMS
interface ApprenantPayload {
  id: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  dateNaissance?: string
  numeroSecuriteSociale?: string
  numeroCotisantIndividuel?: string
  statut: 'prospect' | 'inscrit' | 'en-formation' | 'termine' | 'abandonne'
  programme?: string
  progression?: number
  formations?: any[]
  dateInscription?: string
  structureJuridique?: any
  notes?: string
}

export default function ApprenantsPage() {
  const router = useRouter()
  const [apprenants, setApprenants] = useState<ApprenantPayload[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const loadApprenants = useCallback(async () => {
    try {
      setIsLoading(true)
      // Utiliser l'API Payload CMS au lieu de MongoDB directement
      const response = await fetch('/api/apprenants-payload')
      const result = await response.json()

      if (result.success) {
        setApprenants(result.data)
      } else {
        console.error('Erreur:', result.error)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des apprenants:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadApprenants()
  }, [loadApprenants])

  const filteredApprenants = apprenants.filter(
    apprenant =>
      apprenant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apprenant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apprenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadgeColor = (statut: string) => {
    switch (statut) {
      case 'prospect':
        return 'bg-yellow-100 text-yellow-800'
      case 'inscrit':
        return 'bg-blue-100 text-blue-800'
      case 'en-formation':
        return 'bg-green-100 text-green-800'
      case 'termine':
        return 'bg-gray-100 text-gray-800'
      case 'abandonne':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'prospect':
        return 'Prospect'
      case 'inscrit':
        return 'Inscrit'
      case 'en-formation':
        return 'En formation'
      case 'termine':
        return 'Terminé'
      case 'abandonne':
        return 'Abandonné'
      default:
        return statut
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Apprenants</h1>
          <p className="text-gray-600 mt-1">
            Gérez les apprenants et leurs formations (données depuis Payload CMS)
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel apprenant
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apprenants.length}</div>
            <p className="text-xs text-muted-foreground">apprenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscrits</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apprenants.filter(a => a.statut === 'inscrit' || a.statut === 'prospect').length}
            </div>
            <p className="text-xs text-muted-foreground">inscrits/prospects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apprenants.filter(a => a.statut === 'en-formation').length}
            </div>
            <p className="text-xs text-muted-foreground">en formation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apprenants.filter(a => a.statut === 'termine').length}
            </div>
            <p className="text-xs text-muted-foreground">diplômés</p>
          </CardContent>
        </Card>
      </div>

      {/* Recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des apprenants</CardTitle>
          <CardDescription>Gérez tous les apprenants du système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un apprenant..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {filteredApprenants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun apprenant trouvé. Créez-en un via le formulaire de positionnement.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Apprenant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Structure</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApprenants.map(apprenant => (
                  <TableRow key={apprenant.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {apprenant.prenom?.[0] || 'A'}
                            {apprenant.nom?.[0] || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {apprenant.prenom} {apprenant.nom}
                          </div>
                          <div className="text-sm text-gray-500">{apprenant.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(apprenant.statut)}>
                        {getStatusLabel(apprenant.statut)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {apprenant.telephone ? (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{apprenant.telephone}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{apprenant.structureJuridique?.nom || '-'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {apprenant.dateInscription
                            ? new Date(apprenant.dateInscription).toLocaleDateString()
                            : '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/apprenants/${apprenant.id}/edit`)}
                          className="flex items-center space-x-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Modifier</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/apprenants/${apprenant.id}/edit`)}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Voir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
