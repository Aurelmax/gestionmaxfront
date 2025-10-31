'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Phone, Mail } from 'lucide-react'

interface FormationTrainerInfoProps {
  formData: {
    contactFormateur?: {
      nom?: string
      email?: string
      telephone?: string
      role?: string
      biographie?: string
    }
  }
  onNestedInputChange: (parent: string, field: string, value: unknown) => void
}

export function FormationTrainerInfo({ formData, onNestedInputChange }: FormationTrainerInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Informations formateur
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="formateur_nom">Nom du formateur</Label>
            <Input
              id="formateur_nom"
              value={formData.contactFormateur?.nom || ''}
              onChange={e => onNestedInputChange('contactFormateur', 'nom', e.target.value)}
              placeholder="Nom complet du formateur"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="formateur_role">Rôle</Label>
            <Input
              id="formateur_role"
              value={formData.contactFormateur?.role || ''}
              onChange={e => onNestedInputChange('contactFormateur', 'role', e.target.value)}
              placeholder="Ex: Consultant formateur en informatique"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="formateur_email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="formateur_email"
              type="email"
              value={formData.contactFormateur?.email || ''}
              onChange={e => onNestedInputChange('contactFormateur', 'email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="formateur_telephone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Téléphone
            </Label>
            <Input
              id="formateur_telephone"
              value={formData.contactFormateur?.telephone || ''}
              onChange={e => onNestedInputChange('contactFormateur', 'telephone', e.target.value)}
              placeholder="06.XX.XX.XX.XX"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="formateur_biographie">Biographie</Label>
          <Textarea
            id="formateur_biographie"
            value={formData.contactFormateur?.biographie || ''}
            onChange={e => onNestedInputChange('contactFormateur', 'biographie', e.target.value)}
            placeholder="Présentation du formateur, son expérience, ses compétences..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  )
}
