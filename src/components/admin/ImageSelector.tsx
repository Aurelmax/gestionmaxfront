'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Image, X, ExternalLink, Copy } from 'lucide-react'
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

interface ImageSelectorProps {
  value?: string
  onChange: (url: string) => void
  placeholder?: string
  className?: string
}

export function ImageSelector({
  value,
  onChange,
  placeholder = 'Sélectionner une image',
  className,
}: ImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [_selectedImage, setSelectedImage] = useState<MediaFile | null>(null)

  const handleImageSelect = (file: MediaFile) => {
    setSelectedImage(file)
    onChange(file.url)
    setIsOpen(false)
    toast.success('Image sélectionnée')
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    onChange('')
    toast.success('Image supprimée')
  }

  const copyImageUrl = () => {
    if (value) {
      navigator.clipboard.writeText(value)
      toast.success("URL de l'image copiée")
    }
  }

  return (
    <div className={className}>
      {value ? (
        <div className="space-y-3">
          {/* Aperçu de l'image */}
          <div className="relative group">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border">
              <img src={value} alt="Aperçu" className="w-full h-full object-cover" />
            </div>

            {/* Actions au survol */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={() => window.open(value, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={copyImageUrl}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white text-red-500 hover:text-red-700"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* URL de l'image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">URL de l'image</label>
            <div className="flex gap-2">
              <Input value={value} readOnly className="text-sm" />
              <Button variant="outline" size="sm" onClick={copyImageUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bouton pour changer l'image */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Image className="h-4 w-4 mr-2" />
                Changer l'image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Sélectionner une image</DialogTitle>
              </DialogHeader>
              <MediaManager onSelect={handleImageSelect} acceptedTypes={['image/*']} maxSize={10} />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full h-32 border-dashed">
              <div className="text-center">
                <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">{placeholder}</p>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Sélectionner une image</DialogTitle>
            </DialogHeader>
            <MediaManager onSelect={handleImageSelect} acceptedTypes={['image/*']} maxSize={10} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
