'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Upload, Image, File, Search, Download, Trash2, Eye } from 'lucide-react'

export default function MediaPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Données mock pour les médias
  const mockMedia = [
    {
      id: '1',
      name: 'logo-gestionmax.png',
      type: 'image',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      alt: 'Logo GestionMax',
      url: '/images/logo-gestionmax.png',
    },
    {
      id: '2',
      name: 'formation-wordpress.pdf',
      type: 'document',
      size: '1.8 MB',
      uploadDate: '2024-01-14',
      alt: 'Programme formation WordPress',
      url: '/documents/formation-wordpress.pdf',
    },
    {
      id: '3',
      name: 'formateur-background.webp',
      type: 'image',
      size: '3.2 MB',
      uploadDate: '2024-01-13',
      alt: 'Image de fond formateur',
      url: '/images/formateur-background.webp',
    },
  ]

  const filteredMedia = mockMedia.filter(
    media =>
      media.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      media.alt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTypeIcon = (type: string) => {
    return type === 'image' ? Image : File
  }

  const getTypeBadgeColor = (type: string) => {
    return type === 'image' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Médias</h1>
          <p className="text-gray-600 mt-1">Gérez vos fichiers et images</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau fichier
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMedia.length}</div>
            <p className="text-xs text-muted-foreground">fichiers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMedia.filter(m => m.type === 'image').length}
            </div>
            <p className="text-xs text-muted-foreground">images</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMedia.filter(m => m.type === 'document').length}
            </div>
            <p className="text-xs text-muted-foreground">documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taille totale</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.4 MB</div>
            <p className="text-xs text-muted-foreground">stockage utilisé</p>
          </CardContent>
        </Card>
      </div>

      {/* Zone de téléchargement */}
      <Card>
        <CardHeader>
          <CardTitle>Zone de téléchargement</CardTitle>
          <CardDescription>
            Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Télécharger des fichiers</h3>
            <p className="text-gray-600 mb-4">Formats supportés: JPG, PNG, GIF, PDF, DOC, DOCX</p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Sélectionner des fichiers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des médias */}
      <Card>
        <CardHeader>
          <CardTitle>Bibliothèque de médias</CardTitle>
          <CardDescription>Gérez tous vos fichiers uploadés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un fichier..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedia.map(media => {
              const Icon = getTypeIcon(media.type)
              return (
                <Card key={media.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Icon className="h-8 w-8 text-gray-600" />
                      <Badge className={getTypeBadgeColor(media.type)}>{media.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold truncate mb-1">{media.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{media.alt}</p>
                    <div className="text-xs text-gray-500 mb-3">
                      <div>Taille: {media.size}</div>
                      <div>Ajouté: {new Date(media.uploadDate).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
