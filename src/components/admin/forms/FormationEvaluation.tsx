'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Plus, X } from 'lucide-react'

interface FormationEvaluationProps {
  formData: {
    modalitesEvaluation?: {
      typesEvaluation?: Array<{
        type: string
        description?: string
      }>
      plateformeEvaluation?: string
      grilleAnalyse?: string
    }
  }
  onNestedInputChange: (parent: string, field: string, value: unknown) => void
}

export function FormationEvaluation({ formData, onNestedInputChange }: FormationEvaluationProps) {
  const [newEvaluationType, setNewEvaluationType] = useState('')

  const handleAddEvaluationType = () => {
    if (newEvaluationType.trim()) {
      const newType = {
        type: newEvaluationType.trim(),
        description: '',
      }
      const updatedTypes = [...(formData.modalitesEvaluation?.typesEvaluation ?? []), newType]
      onNestedInputChange('modalitesEvaluation', 'typesEvaluation', updatedTypes)
      setNewEvaluationType('')
    }
  }

  const handleRemoveEvaluationType = (index: number) => {
    const updatedTypes = (formData.modalitesEvaluation?.typesEvaluation ?? []).filter(
      (_, i) => i !== index
    )
    onNestedInputChange('modalitesEvaluation', 'typesEvaluation', updatedTypes)
  }

  const handleUpdateEvaluationType = (index: number, field: string, value: string) => {
    const updatedTypes = (formData.modalitesEvaluation?.typesEvaluation ?? []).map((type, i) =>
      i === index ? { ...type, [field]: value } : type
    )
    onNestedInputChange('modalitesEvaluation', 'typesEvaluation', updatedTypes)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Modalités d'évaluation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newEvaluationType}
            onChange={e => setNewEvaluationType(e.target.value)}
            placeholder="Ajouter un type d'évaluation..."
            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddEvaluationType())}
          />
          <Button type="button" onClick={handleAddEvaluationType} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {(formData.modalitesEvaluation?.typesEvaluation?.length ?? 0) > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Types d'évaluation</h4>
            {(formData.modalitesEvaluation?.typesEvaluation ?? []).map((evaluation, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Input
                    value={evaluation.type}
                    onChange={e => handleUpdateEvaluationType(index, 'type', e.target.value)}
                    placeholder="Type d'évaluation"
                  />
                  <Input
                    value={evaluation.description}
                    onChange={e => handleUpdateEvaluationType(index, 'description', e.target.value)}
                    placeholder="Description"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveEvaluationType(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="plateformeEvaluation">Plateforme d'évaluation</Label>
            <Input
              id="plateformeEvaluation"
              value={formData.modalitesEvaluation?.plateformeEvaluation || ''}
              onChange={e =>
                onNestedInputChange('modalitesEvaluation', 'plateformeEvaluation', e.target.value)
              }
              placeholder="Ex: EVALBOX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grilleAnalyse">Grille d'analyse</Label>
            <Input
              id="grilleAnalyse"
              value={formData.modalitesEvaluation?.grilleAnalyse || ''}
              onChange={e =>
                onNestedInputChange('modalitesEvaluation', 'grilleAnalyse', e.target.value)
              }
              placeholder="Ex: Grille d'analyse des compétences"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
