import { useState, useCallback, useMemo } from 'react'

interface WithId {
  id?: string | number
  _id?: string | number
}

interface ListManagementOptions<T> {
  initialItems?: T[]
  searchFields?: (keyof T)[]
  filterFields?: (keyof T)[]
}

// Type guards
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

/**
 * Hook personnalisé pour la gestion de listes avec recherche et filtrage
 * Gère la recherche, le filtrage, la pagination et les sélections
 */
export function useListManagement<T extends WithId & Record<string, unknown>>(
  options: ListManagementOptions<T> = {}
) {
  const [items, setItems] = useState<T[]>(options.initialItems || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Record<string, unknown>>({})
  const [selectedItems, setSelectedItems] = useState<T[]>([])
  const [sortField, setSortField] = useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filtrage et recherche
  const filteredItems = useMemo(() => {
    let result = items

    // Recherche
    if (searchTerm && options.searchFields) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(item =>
        options.searchFields!.some(field => {
          const value = item[field]
          return value && value.toString().toLowerCase().includes(searchLower)
        })
      )
    }

    // Filtres
    Object.entries(filters).forEach(([field, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result = result.filter(item => {
          const itemValue = item[field]
          if (isString(value)) {
            const itemStr = itemValue?.toString() ?? ''
            return itemStr.toLowerCase().includes(value.toLowerCase())
          }
          return itemValue === value
        })
      }
    })

    // Tri
    if (sortField) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (aValue === undefined || bValue === undefined) return 0

        // Compare strings
        if (isString(aValue) && isString(bValue)) {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        // Compare numbers
        if (isNumber(aValue) && isNumber(bValue)) {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
        }

        // Fallback to generic comparison (with null checks)
        if (aValue !== null && bValue !== null) {
          if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
          if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [items, searchTerm, filters, sortField, sortDirection, options.searchFields])

  // Actions sur les éléments
  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item])
  }, [])

  const updateItem = useCallback((id: string | number, updates: Partial<T>) => {
    setItems(prev =>
      prev.map(item => (item.id === id || item._id === id ? { ...item, ...updates } : item))
    )
  }, [])

  const removeItem = useCallback((id: string | number) => {
    setItems(prev => prev.filter(item => item.id !== id && item._id !== id))
    setSelectedItems(prev => prev.filter(item => item.id !== id && item._id !== id))
  }, [])

  const removeItems = useCallback((ids: (string | number)[]) => {
    setItems(prev =>
      prev.filter(item => {
        const itemId = item.id ?? item._id
        return itemId === undefined || !ids.includes(itemId)
      })
    )
    setSelectedItems(prev =>
      prev.filter(item => {
        const itemId = item.id ?? item._id
        return itemId === undefined || !ids.includes(itemId)
      })
    )
  }, [])

  // Gestion de la sélection
  const selectItem = useCallback((item: T) => {
    setSelectedItems(prev => [...prev, item])
  }, [])

  const deselectItem = useCallback((item: T) => {
    setSelectedItems(prev =>
      prev.filter(selected => selected.id !== item.id && selected._id !== item._id)
    )
  }, [])

  const toggleSelection = useCallback(
    (item: T) => {
      const isSelected = selectedItems.some(
        selected => selected.id === item.id || selected._id === item._id
      )

      if (isSelected) {
        deselectItem(item)
      } else {
        selectItem(item)
      }
    },
    [selectedItems, selectItem, deselectItem]
  )

  const selectAll = useCallback(() => {
    setSelectedItems([...filteredItems])
  }, [filteredItems])

  const deselectAll = useCallback(() => {
    setSelectedItems([])
  }, [])

  // Gestion du tri
  const handleSort = useCallback(
    (field: keyof T) => {
      if (sortField === field) {
        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortField(field)
        setSortDirection('asc')
      }
    },
    [sortField]
  )

  // Gestion des filtres
  const setFilter = useCallback((field: string, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
    setSearchTerm('')
  }, [])

  // Réinitialisation
  const reset = useCallback(() => {
    setItems(options.initialItems || [])
    setSearchTerm('')
    setFilters({})
    setSelectedItems([])
    setSortField(null)
    setSortDirection('asc')
  }, [options.initialItems])

  return {
    // État
    items,
    filteredItems,
    searchTerm,
    filters,
    selectedItems,
    sortField,
    sortDirection,

    // Actions sur les éléments
    setItems,
    addItem,
    updateItem,
    removeItem,
    removeItems,

    // Recherche et filtrage
    setSearchTerm,
    setFilter,
    clearFilters,

    // Sélection
    selectItem,
    deselectItem,
    toggleSelection,
    selectAll,
    deselectAll,

    // Tri
    handleSort,

    // Utilitaires
    reset,
  }
}
