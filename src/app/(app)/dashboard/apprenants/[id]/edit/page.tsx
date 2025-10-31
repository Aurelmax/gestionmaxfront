'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, X, User, Building2 } from 'lucide-react'
import { toast } from 'sonner'

interface ApprenantFormData {
  nom: string
  prenom: string
  email: string
  telephone?: string
  dateNaissance?: string
  numeroSecuriteSociale?: string
  numeroCotisantIndividuel?: string
  statut: 'prospect' | 'inscrit' | 'en-formation' | 'termine' | 'abandonne'
  structureJuridique?: {
    id: string
    nom: string
    siret: string
    codeApe?: string
    adresse?: string
    codePostal?: string
    ville?: string
    telephone?: string
    email?: string
  }
}

export default function EditApprenantPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [apprenantId, setApprenantId] = useState<string>('')
  const [formData, setFormData] = useState<ApprenantFormData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    numeroSecuriteSociale: '',
    numeroCotisantIndividuel: '',
    statut: 'prospect',
  })

  useEffect(() => {
    const loadApprenant = async () => {
      const resolvedParams = await params
      setApprenantId(resolvedParams.id)

      try {
        const response = await fetch(`/api/apprenants-payload/${resolvedParams.id}`)
        const result = await response.json()

        if (result.success && result.data) {
          const apprenant = result.data
          setFormData({
            nom: apprenant.nom || '',
            prenom: apprenant.prenom || '',
            email: apprenant.email || '',
            telephone: apprenant.telephone || '',
            dateNaissance: apprenant.dateNaissance || '',
            numeroSecuriteSociale: apprenant.numeroSecuriteSociale || '',
            numeroCotisantIndividuel: apprenant.numeroCotisantIndividuel || '',
            statut: apprenant.statut || 'prospect',
            structureJuridique: apprenant.structureJuridique,
          })
        } else {
          toast.error('Apprenant introuvable')
          router.push('/dashboard/apprenants')
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
        toast.error("Erreur lors du chargement de l'apprenant")
      } finally {
        setIsLoading(false)
      }
    }

    loadApprenant()
  }, [params, router])

  const handleInputChange = (field: keyof ApprenantFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/apprenants-payload/${apprenantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Apprenant mis à jour avec succès!')
        router.push('/dashboard/apprenants')
      } else {
        throw new Error(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error("Erreur lors de la mise à jour de l'apprenant")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/apprenants')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Modifier l'apprenant</h1>
            <p className="text-muted-foreground">
              {formData.prenom} {formData.nom}
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations Personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informations Personnelles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={e => handleInputChange('nom', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={e => handleInputChange('prenom', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={e => handleInputChange('telephone', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="dateNaissance">Date de naissance</Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  value={formData.dateNaissance}
                  onChange={e => handleInputChange('dateNaissance', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations Administratives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Informations Administratives</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="statut">Statut *</Label>
                <Select
                  value={formData.statut}
                  onValueChange={value =>
                    handleInputChange('statut', value as ApprenantFormData['statut'])
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="inscrit">Inscrit</SelectItem>
                    <SelectItem value="en-formation">En formation</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                    <SelectItem value="abandonne">Abandonné</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="numeroSecuriteSociale">N° Sécurité Sociale</Label>
                <Input
                  id="numeroSecuriteSociale"
                  value={formData.numeroSecuriteSociale}
                  onChange={e => handleInputChange('numeroSecuriteSociale', e.target.value)}
                  placeholder="15 chiffres"
                  maxLength={15}
                />
              </div>

              <div>
                <Label htmlFor="numeroCotisantIndividuel">N° Cotisant Individuel</Label>
                <Input
                  id="numeroCotisantIndividuel"
                  value={formData.numeroCotisantIndividuel}
                  onChange={e => handleInputChange('numeroCotisantIndividuel', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Structure Juridique B2B */}
        {formData.structureJuridique && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>Structure Juridique (B2B)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="structureNom">Nom de la structure *</Label>
                  <Input
                    id="structureNom"
                    value={formData.structureJuridique.nom}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        structureJuridique: prev.structureJuridique
                          ? { ...prev.structureJuridique, nom: e.target.value }
                          : undefined,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="siret">SIRET *</Label>
                  <Input
                    id="siret"
                    value={formData.structureJuridique.siret}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        structureJuridique: prev.structureJuridique
                          ? { ...prev.structureJuridique, siret: e.target.value }
                          : undefined,
                      }))
                    }
                    placeholder="14 chiffres"
                    maxLength={14}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="codeApe">Code APE</Label>
                  <Input
                    id="codeApe"
                    value={formData.structureJuridique.codeApe || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        structureJuridique: prev.structureJuridique
                          ? { ...prev.structureJuridique, codeApe: e.target.value }
                          : undefined,
                      }))
                    }
                    placeholder="Ex: 6201Z"
                  />
                </div>

                <div>
                  <Label htmlFor="structureTelephone">Téléphone</Label>
                  <Input
                    id="structureTelephone"
                    value={formData.structureJuridique.telephone || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        structureJuridique: prev.structureJuridique
                          ? { ...prev.structureJuridique, telephone: e.target.value }
                          : undefined,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="structureEmail">Email</Label>
                <Input
                  id="structureEmail"
                  type="email"
                  value={formData.structureJuridique.email || ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      structureJuridique: prev.structureJuridique
                        ? { ...prev.structureJuridique, email: e.target.value }
                        : undefined,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  value={formData.structureJuridique.adresse || ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      structureJuridique: prev.structureJuridique
                        ? { ...prev.structureJuridique, adresse: e.target.value }
                        : undefined,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="codePostal">Code Postal</Label>
                  <Input
                    id="codePostal"
                    value={formData.structureJuridique.codePostal || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        structureJuridique: prev.structureJuridique
                          ? { ...prev.structureJuridique, codePostal: e.target.value }
                          : undefined,
                      }))
                    }
                    maxLength={5}
                  />
                </div>

                <div>
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    value={formData.structureJuridique.ville || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        structureJuridique: prev.structureJuridique
                          ? { ...prev.structureJuridique, ville: e.target.value }
                          : undefined,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button type="submit" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  )
}
