'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Copy, Eye, EyeOff, Mail, Key } from 'lucide-react'
import { payloadUserService as userService } from '@/lib/payload-user-service'
import { User as UserType } from '@/types/common'
import { toast } from 'sonner'

export function UserCredentials() {
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})

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

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copié dans le presse-papiers`)
  }

  const getRoleBadgeColor = (role: string) => {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Identifiants de connexion
        </CardTitle>
        <CardDescription>
          Liste de tous les utilisateurs avec leurs identifiants de connexion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mot de passe</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                      {user.firstName?.[0]}
                      {user.lastName?.[0] || user.name?.[0]}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="font-mono text-sm">{user.email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(user.email, 'Email')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {showPasswords[user.id] ? 'password123' : '••••••••'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePasswordVisibility(user.id)}
                    >
                      {showPasswords[user.id] ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('password123', 'Mot de passe')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(`${user.email} / password123`, 'Identifiants complets')
                      }
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copier tout
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">
            ⚠️ Informations importantes :
          </h3>
          <ul className="text-xs text-yellow-800 space-y-1">
            <li>
              • Tous les nouveaux utilisateurs ont le mot de passe par défaut :{' '}
              <code>password123</code>
            </li>
            <li>• Changez les mots de passe après la première connexion</li>
            <li>• Ces identifiants sont uniquement pour le développement</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
