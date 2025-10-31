import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArrayFieldProps<T> {
  items: T[]
  onAdd: () => void
  onRemove: (index: number) => void
  renderItem: (item: T, index: number) => ReactNode
  addLabel?: string
  emptyMessage?: string
  className?: string
  maxItems?: number
  minItems?: number
}

export function ArrayField<T>({
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel = 'Ajouter un élément',
  emptyMessage = 'Aucun élément',
  className,
  maxItems,
  minItems = 0,
}: ArrayFieldProps<T>) {
  const canAdd = maxItems ? items.length < maxItems : true
  const canRemove = items.length > minItems

  return (
    <div className={cn('space-y-4', className)}>
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">{renderItem(item, index)}</div>
                  {canRemove && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRemove(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {canAdd && (
        <Button type="button" variant="outline" onClick={onAdd} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          {addLabel}
        </Button>
      )}
    </div>
  )
}
