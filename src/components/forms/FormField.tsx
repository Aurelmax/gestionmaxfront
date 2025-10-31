import { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
  description?: string
}

export function FormField({
  label,
  error,
  required = false,
  children,
  className,
  description,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
