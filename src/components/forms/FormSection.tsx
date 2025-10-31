import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export function FormSection({
  title,
  description,
  children,
  className,
  collapsible: _collapsible = false,
  defaultCollapsed: _defaultCollapsed = false,
}: FormSectionProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}
