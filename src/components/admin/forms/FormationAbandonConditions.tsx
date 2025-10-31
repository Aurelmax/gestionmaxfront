'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

interface FormationAbandonConditionsProps {
  formData: {
    cessationAbandon?: {
      conditionsRenonciation?: string
      facturationAbandon?: string
    }
  }
  onNestedInputChange: (parent: string, field: string, value: unknown) => void
}

export function FormationAbandonConditions({
  formData,
  onNestedInputChange,
}: FormationAbandonConditionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Conditions d'abandon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="conditionsRenonciation">Conditions de renonciation</Label>
          <Textarea
            id="conditionsRenonciation"
            value={formData.cessationAbandon?.conditionsRenonciation || ''}
            onChange={e =>
              onNestedInputChange('cessationAbandon', 'conditionsRenonciation', e.target.value)
            }
            placeholder="Conditions en cas de renonciation avant le début de formation..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facturationAbandon">Facturation en cas d'abandon</Label>
          <Textarea
            id="facturationAbandon"
            value={formData.cessationAbandon?.facturationAbandon || ''}
            onChange={e =>
              onNestedInputChange('cessationAbandon', 'facturationAbandon', e.target.value)
            }
            placeholder="Modalités de facturation en cours de formation..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  )
}
