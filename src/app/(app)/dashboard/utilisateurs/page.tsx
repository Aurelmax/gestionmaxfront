'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { User, Plus, Search, Edit, Trash2, Mail, Shield, Clock } from 'lucide-react'
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUser,
} from '@/lib/api'
import type { User as UserType } from '@/lib/api'
import type { UserRole } from '@/types/common'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  // Charger les utilisateurs depuis le backend Payload
  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetchUsers({ limit: 100 })
      setUsers(response.docs)
      setFilteredUsers(response.docs)
      toast.success(`${response.docs.length} utilisateurs chargés`)
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
      toast.error('Impossible de charger les utilisateurs. Vérifiez que le backend est démarré sur le port 4200.')

      // Fallback: afficher l'utilisateur courant
      try {
        const currentUser = await getCurrentUser()
        setUsers([currentUser])
        setFilteredUsers([currentUser])
      } catch {
        setUsers([])
        setFilteredUsers([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // Filtrer les utilisateurs en temps réel
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = users.filter(
      (user) =>
        user.email?.toLowerCase().includes(query) ||
        user.name?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query)
    )
    setFilteredUsers(filtered)
  }, [searchQuery, users])

  const handleCreateUser = () => {
    setIsNewUser(true)
    setSelectedUser({
      id: '',
      email: '',
      name: '',
      role: 'APPRENANT',
      status: 'active',
    } as UserType)
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: UserType) => {
    setIsNewUser(false)
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleSaveUser = async () => {
    if (!selectedUser) return

    // Validation
    if (!selectedUser.email) {
      toast.error('L\'email est requis')
      return
    }

    try {
      if (isNewUser) {
        const password = (document.getElementById('password') as HTMLInputElement)?.value
        if (!password || password.length < 8) {
          toast.error('Le mot de passe doit contenir au moins 8 caractères')
          return
        }

        await createUser({ ...selectedUser, password })
        toast.success('Utilisateur créé avec succès')
      } else {
        await updateUser(selectedUser.id, selectedUser)
        toast.success('Utilisateur mis à jour avec succès')
      }

      setIsDialogOpen(false)
      loadUsers()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la sauvegarde de l\'utilisateur'
      )
    }
  }

  const handleDeleteUser = async (user: UserType) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.email} ?`)) {
      return
    }

    try {
      await deleteUser(user.id)
      toast.success('Utilisateur supprimé avec succès')
      loadUsers()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la suppression de l\'utilisateur'
      )
    }
  }

  const getRoleBadge = (role?: string) => {
    const colors: Record<string, string> = {
      SUPER_ADMIN: 'bg-purple-100 text-purple-800',
      ADMIN: 'bg-red-100 text-red-800',
      FORMATEUR: 'bg-blue-100 text-blue-800',
      GESTIONNAIRE: 'bg-green-100 text-green-800',
      APPRENANT: 'bg-gray-100 text-gray-800',
    }

    return (
      <Badge className={colors[role || ''] || 'bg-gray-100 text-gray-800'}>
        {role || 'N/A'}
      </Badge>
    )
  }

  const getStatusBadge = (status?: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
    }

    return (
      <Badge className={colors[status || ''] || 'bg-gray-100 text-gray-800'}>
        {status === 'active' ? 'Actif' : status === 'inactive' ? 'Inactif' : 'En attente'}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
        <p className="text-muted-foreground">
          Gérez les comptes utilisateurs du backend Payload CMS
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Apprenants</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === 'APPRENANT').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des Utilisateurs</CardTitle>
            <Button onClick={handleCreateUser}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Utilisateur
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par email, nom ou rôle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.name || '-'}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {user.createdAt ? formatDate(user.createdAt) : '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Créer/Modifier */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isNewUser ? 'Nouvel Utilisateur' : 'Modifier l\'Utilisateur'}
            </DialogTitle>
            <DialogDescription>
              {isNewUser
                ? 'Créer un nouveau compte utilisateur dans le backend Payload CMS'
                : 'Modifier les informations de l\'utilisateur'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="utilisateur@example.com"
                value={selectedUser?.email || ''}
                onChange={(e) =>
                  setSelectedUser((prev) => (prev ? { ...prev, email: e.target.value } : null))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                placeholder="Nom complet"
                value={selectedUser?.name || ''}
                onChange={(e) =>
                  setSelectedUser((prev) => (prev ? { ...prev, name: e.target.value } : null))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rôle *</Label>
              <select
                id="role"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={selectedUser?.role || 'APPRENANT'}
                onChange={(e) =>
                  setSelectedUser((prev) => (prev ? { ...prev, role: e.target.value as UserRole } : null))
                }
              >
                <option value="APPRENANT">Apprenant</option>
                <option value="FORMATEUR">Formateur</option>
                <option value="GESTIONNAIRE">Gestionnaire</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>

            {isNewUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 8 caractères
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveUser}>
              {isNewUser ? 'Créer' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-blue-900">
                Gestion des utilisateurs via Backend Payload
              </h3>
              <p className="text-sm text-blue-800">
                Cette page communique avec le backend Payload CMS séparé (port 4200) via l'API REST.
                Les utilisateurs sont gérés dans la base de données MongoDB du backend.
              </p>
              <p className="text-xs text-blue-700 mt-2">
                💡 <strong>Note:</strong> Les fonctions de création, modification et suppression
                nécessitent l'implémentation complète des endpoints dans src/lib/api.ts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
