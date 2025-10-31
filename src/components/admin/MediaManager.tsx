'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Image, FileText, Trash2, Search, Eye, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface MediaFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  alt?: string
  uploadedAt: string
  category?: string
}

interface MediaManagerProps {
  onSelect?: (file: MediaFile) => void
  onSelectMultiple?: (files: MediaFile[]) => void
  multiple?: boolean
  acceptedTypes?: string[]
  maxSize?: number // en MB
}

export function MediaManager({
  onSelect,
  onSelectMultiple,
  multiple = false,
  acceptedTypes = ['image/*'],
  maxSize = 5,
}: MediaManagerProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = () => {
    // Charger les fichiers depuis le localStorage (simulation)
    const storedFiles = localStorage.getItem('blog_media_files')
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles))
    }
  }

  const saveFiles = (newFiles: MediaFile[]) => {
    setFiles(newFiles)
    localStorage.setItem('blog_media_files', JSON.stringify(newFiles))
  }

  const handleFileUpload = async (fileList: FileList) => {
    setIsUploading(true)

    try {
      const newFiles: MediaFile[] = []

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        if (!file) continue

        // Vérifier la taille
        if (file.size > maxSize * 1024 * 1024) {
          toast.error(`Le fichier ${file.name} est trop volumineux (max ${maxSize}MB)`)
          continue
        }

        // Vérifier le type
        if (
          !acceptedTypes.some(type => {
            if (type.endsWith('/*')) {
              return file.type.startsWith(type.slice(0, -1))
            }
            return file.type === type
          })
        ) {
          toast.error(`Le type de fichier ${file.type} n'est pas accepté`)
          continue
        }

        // Créer l'URL temporaire
        const url = URL.createObjectURL(file)

        const mediaFile: MediaFile = {
          id: `media_${Date.now()}_${i}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url,
          alt: file.name.split('.')[0],
          uploadedAt: new Date().toISOString(),
          category: file.type.startsWith('image/') ? 'image' : 'document',
        }

        newFiles.push(mediaFile)
      }

      if (newFiles.length > 0) {
        const updatedFiles = [...files, ...newFiles]
        saveFiles(updatedFiles)
        toast.success(`${newFiles.length} fichier(s) uploadé(s) avec succès`)
      }
    } catch (error) {
      console.error("Erreur lors de l'upload:", error)
      toast.error("Erreur lors de l'upload des fichiers")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files)
    }
  }

  const handleDeleteFile = (fileId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      const updatedFiles = files.filter(file => file.id !== fileId)
      saveFiles(updatedFiles)
      setSelectedFiles(selectedFiles.filter(file => file.id !== fileId))
      toast.success('Fichier supprimé')
    }
  }

  const handleSelectFile = (file: MediaFile) => {
    if (multiple) {
      const isSelected = selectedFiles.some(f => f.id === file.id)
      if (isSelected) {
        setSelectedFiles(selectedFiles.filter(f => f.id !== file.id))
      } else {
        setSelectedFiles([...selectedFiles, file])
      }
    } else {
      onSelect?.(file)
    }
  }

  const handleConfirmSelection = () => {
    if (multiple && onSelectMultiple) {
      onSelectMultiple(selectedFiles)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredFiles = files.filter(
    file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.alt?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const copyUrlToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copiée dans le presse-papier')
  }

  return (
    <div className="space-y-6">
      {/* Zone d'upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Télécharger des fichiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Glissez-déposez vos fichiers ici, ou{' '}
              <span className="text-blue-600 font-medium">cliquez pour sélectionner</span>
            </p>
            <p className="text-sm text-gray-500">
              Types acceptés: {acceptedTypes.join(', ')} • Taille max: {maxSize}MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>

          {isUploading && (
            <div className="mt-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Upload en cours...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bibliothèque de médias */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Bibliothèque de médias
            </CardTitle>
            {multiple && selectedFiles.length > 0 && (
              <Button onClick={handleConfirmSelection}>
                <Check className="h-4 w-4 mr-2" />
                Sélectionner ({selectedFiles.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Barre de recherche */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un fichier..."
              className="pl-9"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Liste des fichiers */}
          {filteredFiles.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {searchTerm ? 'Aucun fichier trouvé' : 'Aucun fichier. Téléchargez-en un !'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map(file => {
                const isSelected = selectedFiles.some(f => f.id === file.id)

                return (
                  <Card
                    key={file.id}
                    className={`relative group cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => handleSelectFile(file)}
                  >
                    <CardContent className="p-4">
                      {/* Image ou icône */}
                      <div className="aspect-square mb-3 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.alt}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="h-12 w-12 text-gray-400" />
                        )}
                      </div>

                      {/* Informations du fichier */}
                      <div className="space-y-1">
                        <p className="text-sm font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Badge de sélection */}
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </CardContent>

                    {/* Actions au survol */}
                    <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/90 hover:bg-white"
                        onClick={e => {
                          e.stopPropagation()
                          window.open(file.url, '_blank')
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/90 hover:bg-white"
                        onClick={e => {
                          e.stopPropagation()
                          copyUrlToClipboard(file.url)
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/90 hover:bg-white text-red-500 hover:text-red-700"
                        onClick={e => {
                          e.stopPropagation()
                          handleDeleteFile(file.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
