'use client'

import { useState, useEffect } from 'react'
import { RendezVous, RendezVousFilters, RendezVousStats } from '@/types/rendez-vous'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Calendar,
  Clock,
  Phone,
  MapPin,
  Video,
  MoreVertical,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  GraduationCap,
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function RendezVousManagement() {
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([])
  const [stats, setStats] = useState<RendezVousStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<RendezVousFilters>({})
  const router = useRouter()

  useEffect(() => {
    loadRendezVous()
  }, [filters])

  const loadRendezVous = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/rendez-vous-payload?${new URLSearchParams(filters as any)}`
      )
      const data = await response.json()

      if (data.success) {
        setRendezVous(data.data.rendezVous)
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error)
      toast.error('Erreur lors du chargement des rendez-vous')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/rendez-vous/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatus }),
      })

      if (response.ok) {
        toast.success('Statut mis à jour')
        loadRendezVous()
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) return

    try {
      const response = await fetch(`/api/rendez-vous/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Rendez-vous supprimé')
        loadRendezVous()
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      enAttente: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      confirme: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      annule: { color: 'bg-red-100 text-red-800', icon: XCircle },
      termine: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      reporte: { color: 'bg-orange-100 text-orange-800', icon: RefreshCw },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.enAttente
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      positionnement: { color: 'bg-blue-100 text-blue-800', label: 'Positionnement' },
      information: { color: 'bg-green-100 text-green-800', label: 'Information' },
      inscription: { color: 'bg-purple-100 text-purple-800', label: 'Inscription' },
      suivi: { color: 'bg-orange-100 text-orange-800', label: 'Suivi' },
    }

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.information
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getLieuIcon = (lieu: string) => {
    switch (lieu) {
      case 'presentiel':
        return <MapPin className="h-4 w-4" />
      case 'visio':
        return <Video className="h-4 w-4" />
      case 'telephone':
        return <Phone className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const formatDate = (date: string, heure: string) => {
    try {
      // Nettoyer la date si elle contient déjà une heure
      const cleanDate = date.includes('T') ? date.split('T')[0] : date

      // Créer l'objet date avec le format ISO complet
      const dateObj = new Date(`${cleanDate}T${heure}:00`)

      // Vérifier si la date est valide
      if (isNaN(dateObj.getTime())) {
        return `${cleanDate} ${heure}`
      }

      return dateObj.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (error) {
      // En cas d'erreur, retourner le format brut
      return `${date} ${heure}`
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
          <h1 className="text-3xl font-bold">Gestion des Rendez-vous</h1>
          <p className="text-muted-foreground">Gérez tous les rendez-vous de formation</p>
        </div>
        <Button onClick={() => router.push('/dashboard/rendez-vous/nouveau')}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau RDV
        </Button>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total RDV</CardTitle>
              <Calendar className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aujourd'hui
              </CardTitle>
              <Clock className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aujourdhui}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cette semaine
              </CardTitle>
              <Calendar className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cetteSemaine}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmés</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.confirmes}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                className="pl-9"
                value={filters.search || ''}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <Select
              value={filters.statut || 'all'}
              onValueChange={value =>
                setFilters({ ...filters, statut: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="enAttente">En attente</SelectItem>
                <SelectItem value="confirme">Confirmé</SelectItem>
                <SelectItem value="annule">Annulé</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
                <SelectItem value="reporte">Reporté</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.type || 'all'}
              onValueChange={value =>
                setFilters({ ...filters, type: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="positionnement">Positionnement</SelectItem>
                <SelectItem value="information">Information</SelectItem>
                <SelectItem value="inscription">Inscription</SelectItem>
                <SelectItem value="suivi">Suivi</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.lieu || 'all'}
              onValueChange={value =>
                setFilters({ ...filters, lieu: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Lieu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les lieux</SelectItem>
                <SelectItem value="presentiel">Présentiel</SelectItem>
                <SelectItem value="visio">Visio</SelectItem>
                <SelectItem value="telephone">Téléphone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des rendez-vous */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Programme</TableHead>
                <TableHead>Date/Heure</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rendezVous && rendezVous.length > 0 ? (
                rendezVous.map(rdv => (
                  <TableRow key={rdv.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {rdv.client?.prenom} {rdv.client?.nom}
                        </div>
                        <div className="text-sm text-muted-foreground">{rdv.client?.email}</div>
                        {rdv.client?.telephone && (
                          <div className="text-sm text-muted-foreground">
                            {rdv.client.telephone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{rdv.programmeTitre}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatDate(rdv.date, rdv.heure)}</div>
                      <div className="text-sm text-muted-foreground">{rdv.duree} min</div>
                    </TableCell>
                    <TableCell>{getTypeBadge(rdv.type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLieuIcon(rdv.lieu)}
                        <span className="capitalize">{rdv.lieu}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(rdv.statut)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/rendez-vous/${rdv.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/rendez-vous/${rdv.id}/edit`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>

                          {rdv.type === 'positionnement' && rdv.statut === 'termine' && (
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/formation-programmes/nouveau?rdvId=${rdv.id}`
                                )
                              }
                            >
                              <GraduationCap className="h-4 w-4 mr-2" />
                              Créer formation personnalisée
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          {rdv.statut === 'enAttente' && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(rdv.id, 'confirme')}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirmer
                            </DropdownMenuItem>
                          )}

                          {rdv.statut === 'confirme' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(rdv.id, 'termine')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Marquer terminé
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => handleStatusChange(rdv.id, 'annule')}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Annuler
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => handleDelete(rdv.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucun rendez-vous trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
