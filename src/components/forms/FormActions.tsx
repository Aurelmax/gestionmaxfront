import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FormActionsProps {
  onSave?: () => void
  onCancel?: () => void
  onReset?: () => void
  isLoading?: boolean
  isDirty?: boolean
  saveLabel?: string
  cancelLabel?: string
  resetLabel?: string
  className?: string
  children?: ReactNode
  showReset?: boolean
}

export function FormActions({
  onSave,
  onCancel,
  onReset,
  isLoading = false,
  isDirty = false,
  saveLabel = 'Enregistrer',
  cancelLabel = 'Annuler',
  resetLabel = 'Réinitialiser',
  className,
  children,
  showReset = false,
}: FormActionsProps) {
  return (
    <div className={cn('flex items-center justify-between pt-6 border-t', className)}>
      <div className="flex items-center gap-2">
        {showReset && onReset && (
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={isLoading || !isDirty}
          >
            {resetLabel}
          </Button>
        )}
        {children}
      </div>

      <div className="flex items-center gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
        )}
        {onSave && (
          <Button type="button" onClick={onSave} disabled={isLoading} className="min-w-[120px]">
            {isLoading ? 'Enregistrement...' : saveLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
