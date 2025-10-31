/**
 * Composant de gestion des utilisateurs - Version simplifiée
 */

'use client'

import { useState, useEffect } from 'react'
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserRole,
  UserStatus,
  USER_ROLES,
} from '@/types/common'
import { payloadUserService as userService } from '@/lib/payload-user-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  User as UserIcon,
  Phone,
  Calendar,
  Key,
  MoreVertical,
  Eye,
  EyeOff,
} from 'lucide-react'
import { toast } from 'sonner'
import { UserCredentials } from './UserCredentials'

export function UserManagementSimple() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    password: '',
    name: '',
    firstName: '',
    lastName: '',
    role: 'APPRENANT',
    phone: '',
    address: '',
    dateOfBirth: '',
  })

  // Charger les utilisateurs
  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const usersData = await userService.getUsers()
      setUsers(usersData)
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // Créer un utilisateur
  const handleCreateUser = async () => {
    console.log('🔵 handleCreateUser appelé', formData)

    // Validation côté client
    if (!formData.email || !formData.email.includes('@')) {
      console.log('❌ Email invalide:', formData.email)
      toast.error('Email invalide')
      return
    }

    if (!formData.password || formData.password.length < 6) {
      console.log('❌ Mot de passe trop court:', formData.password?.length)
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    if (!formData.name || formData.name.trim().length === 0) {
      console.log('❌ Nom vide')
      toast.error('Le nom est requis')
      return
    }

    try {
      console.log('✅ Validation OK, création en cours...')
      const newUser = await userService.createUser(formData)
      console.log('✅ Utilisateur créé:', newUser)
      toast.success('Utilisateur créé avec succès')
      setIsCreateDialogOpen(false)
      resetForm()
      await loadUsers()
      console.log('✅ Liste des utilisateurs rechargée')
    } catch (error) {
      console.error('❌ Erreur création:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création')
    }
  }

  // Mettre à jour un utilisateur
  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      const updateData: UpdateUserRequest = {
        id: selectedUser.id,
        name: formData.name,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        phone: formData.phone,
        address: formData.address,
      }

      await userService.updateUser(selectedUser.id, updateData)
      toast.success('Utilisateur mis à jour avec succès')
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      resetForm()
      loadUsers()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour')
    }
  }

  // Supprimer un utilisateur
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return

    try {
      await userService.deleteUser(userId)
      toast.success('Utilisateur supprimé avec succès')
      loadUsers()
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  // Réinitialiser le mot de passe
  const handleResetPassword = async () => {
    if (!selectedUser) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    try {
      await userService.changePassword(selectedUser.id, {
        oldPassword: '',
        newPassword: passwordData.newPassword,
      })
      toast.success('Mot de passe réinitialisé avec succès')
      setIsPasswordDialogOpen(false)
      setPasswordData({ newPassword: '', confirmPassword: '' })
      setSelectedUser(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la réinitialisation')
    }
  }

  // Ouvrir le dialogue de réinitialisation de mot de passe
  const openPasswordDialog = (user: User) => {
    setSelectedUser(user)
    setPasswordData({ newPassword: '', confirmPassword: '' })
    setIsPasswordDialogOpen(true)
  }

  // Activer/Désactiver un utilisateur
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

    try {
      await userService.updateUser(userId, { id: userId, status: newStatus as UserStatus })
      toast.success(`Utilisateur ${newStatus === 'active' ? 'activé' : 'désactivé'} avec succès`)
      loadUsers()
    } catch (error) {
      toast.error('Erreur lors de la modification du statut')
    }
  }

  // Ouvrir le dialogue d'édition
  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setFormData({
      email: user.email,
      password: '',
      name: user.name || user.nom || '',
      firstName: user.firstName || user.prenom || '',
      lastName: user.lastName || user.nom?.split(' ')[1] || '',
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      dateOfBirth: user.dateOfBirth || '',
    })
    setIsEditDialogOpen(true)
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      firstName: '',
      lastName: '',
      role: 'APPRENANT',
      phone: '',
      address: '',
      dateOfBirth: '',
    })
  }

  // Obtenir la couleur du badge selon le statut
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Obtenir la couleur du badge selon le rôle
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800'
      case 'FORMATEUR':
        return 'bg-green-100 text-green-800'
      case 'GESTIONNAIRE':
        return 'bg-orange-100 text-orange-800'
      case 'APPRENANT':
        return 'bg-gray-100 text-gray-800'
      case 'BENEFICIAIRE':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-1">Gérez les utilisateurs et leurs permissions</p>
        </div>

        {/* Bouton d'ajout d'utilisateur */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouvel utilisateur.
              </DialogDescription>
            </DialogHeader>
            <UserForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateUser}
              onCancel={() => {
                setIsCreateDialogOpen(false)
                resetForm()
              }}
              isEdit={false}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">utilisateurs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">utilisateurs actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formateurs</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'FORMATEUR').length}
            </div>
            <p className="text-xs text-muted-foreground">formateurs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Apprenants</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'APPRENANT').length}
            </div>
            <p className="text-xs text-muted-foreground">apprenants</p>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>Gérez tous les utilisateurs du système</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(user.status || 'active')}>
                      {user.status || 'active'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.phone ? (
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.lastLoginAt ? (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(user.lastLoginAt).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Jamais</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => openPasswordDialog(user)}>
                          <Key className="h-4 w-4 mr-2" />
                          Réinitialiser mot de passe
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleToggleUserStatus(user.id, user.status || 'active')}
                        >
                          {user.status === 'active' ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Activer
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogue d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>Modifiez les informations de l'utilisateur.</DialogDescription>
          </DialogHeader>
          <UserForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateUser}
            onCancel={() => {
              setIsEditDialogOpen(false)
              setSelectedUser(null)
              resetForm()
            }}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>

      {/* Dialogue de réinitialisation de mot de passe */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
            <DialogDescription>
              Définissez un nouveau mot de passe pour {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nouveau mot de passe *</label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Confirmer le mot de passe *</label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={e =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleResetPassword}>Réinitialiser</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Identifiants de connexion */}
      <UserCredentials />
    </div>
  )
}

// Composant de formulaire utilisateur
interface UserFormProps {
  formData: CreateUserRequest
  setFormData: (data: CreateUserRequest) => void
  onSubmit: () => void
  onCancel?: () => void
  isEdit: boolean
}

function UserForm({ formData, setFormData, onSubmit, onCancel, isEdit }: UserFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Email *</label>
          <Input
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@exemple.com"
            disabled={isEdit}
          />
        </div>
        {!isEdit && (
          <div>
            <label className="text-sm font-medium">Mot de passe *</label>
            <Input
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Nom *</label>
          <Input
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nom complet"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Prénom</label>
          <Input
            value={formData.firstName}
            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Prénom"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Nom de famille</label>
          <Input
            value={formData.lastName}
            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Nom de famille"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Rôle *</label>
          <Select
            value={formData.role}
            onValueChange={value => setFormData({ ...formData, role: value as UserRole })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(USER_ROLES).map(([key, value]) => (
                <SelectItem key={value} value={value}>
                  {key.replace('_', ' ').toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Téléphone</label>
          <Input
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+33 6 12 34 56 78"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Date de naissance</label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Adresse</label>
        <Input
          value={formData.address}
          onChange={e => setFormData({ ...formData, address: e.target.value })}
          placeholder="Adresse complète"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={onSubmit}>{isEdit ? 'Mettre à jour' : 'Créer'}</Button>
      </div>
    </div>
  )
}
