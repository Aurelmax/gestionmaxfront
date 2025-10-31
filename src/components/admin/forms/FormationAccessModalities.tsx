'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target } from 'lucide-react'

interface FormationAccessModalitiesProps {
  formData: {
    modalitesAcces?: {
      prerequis?: string
      publicConcerne?: string
      duree?: string
      horaires?: string
      delaisMiseEnPlace?: string
      tarif?: number
      modalitesReglement?: string
    }
  }
  onNestedInputChange: (parent: string, field: string, value: unknown) => void
}

export function FormationAccessModalities({
  formData,
  onNestedInputChange,
}: FormationAccessModalitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Modalités d'accès
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prerequis">Prérequis</Label>
            <Textarea
              id="prerequis"
              value={formData.modalitesAcces?.prerequis || ''}
              onChange={e => onNestedInputChange('modalitesAcces', 'prerequis', e.target.value)}
              placeholder="Prérequis nécessaires..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publicConcerne">Public concerné</Label>
            <Textarea
              id="publicConcerne"
              value={formData.modalitesAcces?.publicConcerne || ''}
              onChange={e =>
                onNestedInputChange('modalitesAcces', 'publicConcerne', e.target.value)
              }
              placeholder="Description du public cible..."
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duree">Durée</Label>
            <Input
              id="duree"
              value={formData.modalitesAcces?.duree || ''}
              onChange={e => onNestedInputChange('modalitesAcces', 'duree', e.target.value)}
              placeholder="Ex: 14 heures"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="horaires">Horaires</Label>
            <Input
              id="horaires"
              value={formData.modalitesAcces?.horaires || ''}
              onChange={e => onNestedInputChange('modalitesAcces', 'horaires', e.target.value)}
              placeholder="Ex: 9h à 13h et de 14h à 17h"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="delaisMiseEnPlace">Délais de mise en place</Label>
            <Input
              id="delaisMiseEnPlace"
              value={formData.modalitesAcces?.delaisMiseEnPlace || ''}
              onChange={e =>
                onNestedInputChange('modalitesAcces', 'delaisMiseEnPlace', e.target.value)
              }
              placeholder="Ex: À réception de l'accord de prise en charge"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tarif">Tarif (€)</Label>
            <Input
              id="tarif"
              type="number"
              value={formData.modalitesAcces?.tarif || ''}
              onChange={e => onNestedInputChange('modalitesAcces', 'tarif', Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="modalitesReglement">Modalités de règlement</Label>
          <Textarea
            id="modalitesReglement"
            value={formData.modalitesAcces?.modalitesReglement || ''}
            onChange={e =>
              onNestedInputChange('modalitesAcces', 'modalitesReglement', e.target.value)
            }
            placeholder="Modalités de paiement..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  )
}
