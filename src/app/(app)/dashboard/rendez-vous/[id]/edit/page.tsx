'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, X, User, Calendar } from 'lucide-react'
import { toast } from 'sonner'

export const dynamic = 'force-dynamic'

interface RendezVousFormData {
  client: {
    nom: string
    prenom: string
    email: string
    telephone?: string
    entreprise?: string
  }
  programmeId: string
  programmeTitre: string
  type: 'positionnement' | 'information' | 'inscription' | 'suivi'
  statut: 'enAttente' | 'confirme' | 'annule' | 'termine' | 'reporte'
  date: string
  heure: string
  duree: number
  lieu: 'presentiel' | 'visio' | 'telephone'
  adresse?: string
  lienVisio?: string
  notes?: string
}

const programmesMock = [
  {
    id: '1',
    titre: 'Création de son site internet (WordPress) + Stratégie de développement digital',
  },
  {
    id: '2',
    titre: 'Marketing digital avec Brevo + Techniques de vente en ligne avec WooCommerce',
  },
  {
    id: '3',
    titre: 'Gestion de la sécurité de votre site & analyse Web',
  },
]

export default function EditRendezVousPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.['id'] as string

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [formData, setFormData] = useState<RendezVousFormData>({
    client: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      entreprise: '',
    },
    programmeId: '',
    programmeTitre: '',
    type: 'information',
    statut: 'enAttente',
    date: '',
    heure: '',
    duree: 60,
    lieu: 'presentiel',
    adresse: '',
    lienVisio: '',
    notes: '',
  })

  useEffect(() => {
    const fetchRendezVous = async () => {
      try {
        const response = await fetch(`/api/rendez-vous/${id}`)
        const result = await response.json()

        if (result.success && result.data) {
          const rdv = result.data
          setFormData({
            client: rdv.client || {
              nom: '',
              prenom: '',
              email: '',
              telephone: '',
              entreprise: '',
            },
            programmeId: rdv.programmeId || rdv.programme || '',
            programmeTitre: rdv.programmeTitre || '',
            type: rdv.type || 'information',
            statut: rdv.statut || 'enAttente',
            date: rdv.date || '',
            heure: rdv.heure || '',
            duree: rdv.duree || 60,
            lieu: rdv.lieu || 'presentiel',
            adresse: rdv.adresse || '',
            lienVisio: rdv.lienVisio || '',
            notes: rdv.notes || '',
          })
        } else {
          toast.error('Rendez-vous introuvable')
          router.push('/dashboard/rendez-vous')
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rendez-vous:', error)
        toast.error('Erreur lors de la récupération du rendez-vous')
      } finally {
        setIsFetching(false)
      }
    }

    if (id) {
      fetchRendezVous()
    }
  }, [id, router])

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('client.')) {
      const clientField = field.split('.')[1] as string
      setFormData(prev => ({
        ...prev,
        client: {
          ...prev.client,
          [clientField]: value,
        },
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleProgrammeChange = (programmeId: string) => {
    const programme = programmesMock.find(p => p['id'] === programmeId)
    setFormData(prev => ({
      ...prev,
      programmeId,
      programmeTitre: programme?.titre || '',
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/rendez-vous/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Rendez-vous modifié avec succès')
        router.push('/dashboard/rendez-vous')
      } else {
        throw new Error(result.error || 'Erreur lors de la modification')
      }
    } catch (error) {
      console.error('Erreur lors de la modification du rendez-vous:', error)
      toast.error('Erreur lors de la modification du rendez-vous')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/rendez-vous')
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du rendez-vous...</p>
        </div>
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
            <h1 className="text-3xl font-bold">Modifier le Rendez-vous</h1>
            <p className="text-muted-foreground">Modifier les informations du rendez-vous</p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations Client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informations Client</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client.nom">Nom *</Label>
                  <Input
                    id="client.nom"
                    value={formData.client.nom}
                    onChange={e => handleInputChange('client.nom', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client.prenom">Prénom *</Label>
                  <Input
                    id="client.prenom"
                    value={formData.client.prenom}
                    onChange={e => handleInputChange('client.prenom', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="client.email">Email *</Label>
                <Input
                  id="client.email"
                  type="email"
                  value={formData.client.email}
                  onChange={e => handleInputChange('client.email', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="client.telephone">Téléphone</Label>
                <Input
                  id="client.telephone"
                  value={formData.client.telephone}
                  onChange={e => handleInputChange('client.telephone', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="client.entreprise">Entreprise</Label>
                <Input
                  id="client.entreprise"
                  value={formData.client.entreprise}
                  onChange={e => handleInputChange('client.entreprise', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Détails du Rendez-vous */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Détails du Rendez-vous</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="programmeId">Programme *</Label>
                <Select value={formData.programmeId} onValueChange={handleProgrammeChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un programme" />
                  </SelectTrigger>
                  <SelectContent>
                    {programmesMock.map(programme => (
                      <SelectItem key={programme['id']} value={programme['id']}>
                        {programme.titre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={value => handleInputChange('type', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positionnement">Positionnement</SelectItem>
                      <SelectItem value="information">Information</SelectItem>
                      <SelectItem value="inscription">Inscription</SelectItem>
                      <SelectItem value="suivi">Suivi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="statut">Statut *</Label>
                  <Select
                    value={formData.statut}
                    onValueChange={value => handleInputChange('statut', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enAttente">En attente</SelectItem>
                      <SelectItem value="confirme">Confirmé</SelectItem>
                      <SelectItem value="annule">Annulé</SelectItem>
                      <SelectItem value="termine">Terminé</SelectItem>
                      <SelectItem value="reporte">Reporté</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={e => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="heure">Heure *</Label>
                  <Input
                    id="heure"
                    type="time"
                    value={formData.heure}
                    onChange={e => handleInputChange('heure', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duree">Durée (minutes) *</Label>
                  <Input
                    id="duree"
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    value={formData.duree}
                    onChange={e => handleInputChange('duree', parseInt(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lieu">Lieu *</Label>
                  <Select
                    value={formData.lieu}
                    onValueChange={value => handleInputChange('lieu', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presentiel">Présentiel</SelectItem>
                      <SelectItem value="visio">Visio</SelectItem>
                      <SelectItem value="telephone">Téléphone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations Complémentaires */}
        <Card>
          <CardHeader>
            <CardTitle>Informations Complémentaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.lieu === 'presentiel' && (
              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  value={formData.adresse}
                  onChange={e => handleInputChange('adresse', e.target.value)}
                  placeholder="Adresse complète du rendez-vous"
                />
              </div>
            )}

            {formData.lieu === 'visio' && (
              <div>
                <Label htmlFor="lienVisio">Lien de visioconférence</Label>
                <Input
                  id="lienVisio"
                  value={formData.lienVisio}
                  onChange={e => handleInputChange('lienVisio', e.target.value)}
                  placeholder="https://meet.google.com/..."
                />
              </div>
            )}

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={e => handleInputChange('notes', e.target.value)}
                placeholder="Notes supplémentaires sur le rendez-vous..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Modification...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>
    </div>
  )
}
