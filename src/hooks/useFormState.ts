import { useState, useCallback } from 'react'

/**
 * Hook personnalisé pour la gestion d'état de formulaires complexes
 * Gère les données, les erreurs, la validation et les états de chargement
 */
export function useFormState<T extends Record<string, Record<string, unknown>>>(
  initialData: T,
  validationRules?: Partial<Record<keyof T, (value: Record<string, unknown>) => string | null>>
) {
  const [data, setData] = useState<T>(initialData)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Mise à jour d'un champ simple
  const updateField = useCallback(
    (field: keyof T, value: Record<string, unknown>) => {
      setData(prev => ({ ...prev, [field]: value }))
      setIsDirty(true)

      // Validation en temps réel si une règle existe
      if (validationRules?.[field]) {
        const error = validationRules[field]!(value)
        setErrors(prev => ({
          ...prev,
          [field]: error,
        }))
      }
    },
    [validationRules]
  )

  // Mise à jour d'un champ imbriqué
  const updateNestedField = useCallback(
    (parent: keyof T, field: string, value: Record<string, unknown>) => {
      setData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: value,
        },
      }))
      setIsDirty(true)
    },
    []
  )

  // Mise à jour d'un tableau
  const updateArrayField = useCallback(
    (field: keyof T, index: number, value: Record<string, unknown>) => {
      setData(prev => {
        const currentValue = prev[field]
        const newArray = Array.isArray(currentValue) ? [...currentValue] : []
        newArray[index] = value
        return { ...prev, [field]: newArray as unknown as T[keyof T] }
      })
      setIsDirty(true)
    },
    []
  )

  // Ajouter un élément à un tableau
  const addToArray = useCallback((field: keyof T, item: Record<string, unknown>) => {
    setData(prev => {
      const currentValue = prev[field]
      const currentArray = Array.isArray(currentValue) ? currentValue : []
      return {
        ...prev,
        [field]: [...currentArray, item] as unknown as T[keyof T],
      }
    })
    setIsDirty(true)
  }, [])

  // Supprimer un élément d'un tableau
  const removeFromArray = useCallback((field: keyof T, index: number) => {
    setData(prev => {
      const currentValue = prev[field]
      const newArray = Array.isArray(currentValue) ? [...currentValue] : []
      newArray.splice(index, 1)
      return { ...prev, [field]: newArray as unknown as T[keyof T] }
    })
    setIsDirty(true)
  }, [])

  // Validation complète du formulaire
  const validateForm = useCallback((): boolean => {
    if (!validationRules) return true

    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.entries(validationRules).forEach(([field, validator]) => {
      if (!validator) return
      const fieldValue = data[field as keyof T]
      if (fieldValue !== undefined) {
        const error = validator(fieldValue)
        if (error) {
          newErrors[field as keyof T] = error
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }, [data, validationRules])

  // Réinitialiser le formulaire
  const resetForm = useCallback(
    (newData?: T) => {
      setData(newData || initialData)
      setErrors({})
      setIsDirty(false)
      setIsLoading(false)
    },
    [initialData]
  )

  // Mettre à jour toutes les données
  const setFormData = useCallback((newData: T) => {
    setData(newData)
    setIsDirty(true)
  }, [])

  return {
    data,
    errors,
    isLoading,
    isDirty,
    updateField,
    updateNestedField,
    updateArrayField,
    addToArray,
    removeFromArray,
    validateForm,
    resetForm,
    setFormData,
    setIsLoading,
  }
}
