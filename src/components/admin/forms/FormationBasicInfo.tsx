'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

interface FormationBasicInfoProps {
  formData: {
    title: string
    codeFormation: string
    statut: string
  }
  onInputChange: (field: string, value: unknown) => void
}

const statuts = [
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'FINALISEE', label: 'Finalisée' },
  { value: 'LIVREE', label: 'Livrée' },
  { value: 'ARCHIVE', label: 'Archivée' },
]

export function FormationBasicInfo({ formData, onInputChange }: FormationBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Informations de base
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nom du programme</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => onInputChange('title', e.target.value)}
              placeholder="Nom du programme de formation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codeFormation">Code formation</Label>
            <Input
              id="codeFormation"
              value={formData.codeFormation}
              onChange={e => onInputChange('codeFormation', e.target.value)}
              placeholder="Code unique de la formation"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="statut">Statut</Label>
          <Select
            value={formData.statut}
            onValueChange={(value: string) => onInputChange('statut', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuts.map(statut => (
                <SelectItem key={statut.value} value={statut.value}>
                  {statut.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
