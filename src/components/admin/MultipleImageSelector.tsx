'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { X, Plus, ExternalLink, Copy } from 'lucide-react'
import { MediaManager } from './MediaManager'
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

interface MultipleImageSelectorProps {
  value?: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  className?: string
}

export function MultipleImageSelector({
  value = [],
  onChange,
  maxImages = 10,
  className,
}: MultipleImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleImagesSelect = (files: MediaFile[]) => {
    const urls = files.map(file => file.url)
    const newUrls = [...value, ...urls].slice(0, maxImages)
    onChange(newUrls)
    setIsOpen(false)
    toast.success(`${files.length} image(s) ajoutée(s)`)
  }

  const handleRemoveImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index)
    onChange(newUrls)
    toast.success('Image supprimée')
  }

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("URL de l'image copiée")
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Images sélectionnées */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {value.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Actions au survol */}
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 bg-white/90 hover:bg-white"
                    onClick={() => window.open(url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 bg-white/90 hover:bg-white"
                    onClick={() => copyImageUrl(url)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 bg-white/90 hover:bg-white text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {/* Numéro de l'image */}
                <div className="absolute bottom-1 left-1">
                  <Badge variant="secondary" className="text-xs">
                    {index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bouton pour ajouter des images */}
        {value.length < maxImages && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-dashed">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter des images ({value.length}/{maxImages})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Sélectionner des images ({value.length}/{maxImages})
                </DialogTitle>
              </DialogHeader>
              <MediaManager
                onSelectMultiple={handleImagesSelect}
                multiple={true}
                acceptedTypes={['image/*']}
                maxSize={10}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Message si limite atteinte */}
        {value.length >= maxImages && (
          <div className="text-center text-sm text-gray-500">
            Limite de {maxImages} images atteinte
          </div>
        )}
      </div>
    </div>
  )
}
