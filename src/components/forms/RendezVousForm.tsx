'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Clock, User, MapPin, Video, PhoneCall } from 'lucide-react'
import { toast } from 'sonner'
import { CreateRendezVousRequest } from '@/types/rendez-vous'
import { useConfetti } from '@/hooks/useConfetti'

interface RendezVousFormProps {
  programmeId?: string
  programmeTitre?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function RendezVousForm({
  programmeId,
  programmeTitre,
  onSuccess,
  onCancel,
}: RendezVousFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { triggerBrandedConfetti } = useConfetti()
  const [formData, setFormData] = useState<CreateRendezVousRequest>({
    programmeId: programmeId || '',
    client: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      entreprise: '',
    },
    type: 'positionnement',
    date: '',
    heure: '',
    duree: 30,
    lieu: 'visio',
    notes: '',
  })

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('client.')) {
      const clientField = field.split('.')[1] as string
      setFormData(prev => ({
        ...prev,
        client: {
          ...prev.client,
          [clientField]: value,
        },
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/rendez-vous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // 🎉 Confettis!
        triggerBrandedConfetti()
        toast.success('Rendez-vous créé avec succès !')
        onSuccess?.()
      } else {
        toast.error(data.error || 'Erreur lors de la création du rendez-vous')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la création du rendez-vous')
    } finally {
      setIsLoading(false)
    }
  }

  const getLieuIcon = (lieu: string) => {
    switch (lieu) {
      case 'presentiel':
        return <MapPin className="h-4 w-4" />
      case 'visio':
        return <Video className="h-4 w-4" />
      case 'telephone':
        return <PhoneCall className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Demande de rendez-vous
        </CardTitle>
        {programmeTitre && (
          <p className="text-sm text-muted-foreground">
            Pour la formation : <strong>{programmeTitre}</strong>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations client */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Vos informations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Prénom *</label>
                <Input
                  value={formData.client.prenom}
                  onChange={e => handleInputChange('client.prenom', e.target.value)}
                  placeholder="Votre prénom"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nom *</label>
                <Input
                  value={formData.client.nom}
                  onChange={e => handleInputChange('client.nom', e.target.value)}
                  placeholder="Votre nom"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={formData.client.email}
                  onChange={e => handleInputChange('client.email', e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Téléphone</label>
                <Input
                  type="tel"
                  value={formData.client.telephone}
                  onChange={e => handleInputChange('client.telephone', e.target.value)}
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Entreprise</label>
              <Input
                value={formData.client.entreprise}
                onChange={e => handleInputChange('client.entreprise', e.target.value)}
                placeholder="Nom de votre entreprise"
              />
            </div>
          </div>

          {/* Type de rendez-vous */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Type de rendez-vous
            </h3>

            <div>
              <label className="text-sm font-medium">Type *</label>
              <Select
                value={formData.type}
                onValueChange={value => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positionnement">RDV de Positionnement</SelectItem>
                  <SelectItem value="information">Demande d'information</SelectItem>
                  <SelectItem value="inscription">Inscription</SelectItem>
                  <SelectItem value="suivi">Suivi de formation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date et heure */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date et heure
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Date *</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={e => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Heure *</label>
                <Input
                  type="time"
                  value={formData.heure}
                  onChange={e => handleInputChange('heure', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Durée (min)</label>
                <Select
                  value={formData.duree?.toString()}
                  onValueChange={value => handleInputChange('duree', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="90">1h30</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Lieu */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Lieu du rendez-vous
            </h3>

            <div>
              <label className="text-sm font-medium">Format *</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {['presentiel', 'visio', 'telephone'].map(lieu => (
                  <div
                    key={lieu}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.lieu === lieu
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('lieu', lieu)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getLieuIcon(lieu)}
                      <span className="font-medium capitalize">{lieu}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {lieu === 'presentiel' && 'Rendez-vous en personne'}
                      {lieu === 'visio' && 'Visioconférence'}
                      {lieu === 'telephone' && 'Appel téléphonique'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {formData.lieu === 'presentiel' && (
              <div>
                <label className="text-sm font-medium">Adresse</label>
                <Input
                  value={formData.adresse || ''}
                  onChange={e => handleInputChange('adresse', e.target.value)}
                  placeholder="Adresse du rendez-vous"
                />
              </div>
            )}

            {formData.lieu === 'visio' && (
              <div>
                <label className="text-sm font-medium">Lien de visioconférence</label>
                <Input
                  value={formData.lienVisio || ''}
                  onChange={e => handleInputChange('lienVisio', e.target.value)}
                  placeholder="https://meet.google.com/..."
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium">Notes supplémentaires</label>
            <Textarea
              value={formData.notes}
              onChange={e => handleInputChange('notes', e.target.value)}
              placeholder="Informations complémentaires, questions spécifiques..."
              rows={3}
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Envoi en cours...' : 'Demander le rendez-vous'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Annuler
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
