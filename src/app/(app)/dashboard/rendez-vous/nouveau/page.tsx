'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { ArrowLeft, Save, X, User, Calendar, Building2, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface NouveauRendezVousFormData {
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

interface ApprenantB2BData {
  // Données apprenant
  nom: string
  prenom: string
  email: string
  telephone?: string
  dateNaissance?: string
  numeroSecuriteSociale?: string
  numeroCotisantIndividuel?: string

  // Données structure juridique
  structureNom: string
  siret: string
  codeApe?: string
  structureAdresse?: string
  structureCodePostal?: string
  structureVille?: string
  structureTelephone?: string
  structureEmail?: string

  // Contact principal
  contactNom?: string
  contactPrenom?: string
  contactFonction?: string
  contactEmail?: string
  contactTelephone?: string
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

export default function NouveauRendezVousPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<NouveauRendezVousFormData>({
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

  const [b2bData, setB2bData] = useState<ApprenantB2BData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    numeroSecuriteSociale: '',
    numeroCotisantIndividuel: '',
    structureNom: '',
    siret: '',
    codeApe: '',
    structureAdresse: '',
    structureCodePostal: '',
    structureVille: '',
    structureTelephone: '',
    structureEmail: '',
    contactNom: '',
    contactPrenom: '',
    contactFonction: '',
    contactEmail: '',
    contactTelephone: '',
  })

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('client.')) {
      const clientField = field.split('.')[1] as keyof NouveauRendezVousFormData['client']
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

  const handleB2BInputChange = (field: keyof ApprenantB2BData, value: string) => {
    setB2bData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleProgrammeChange = (programmeId: string) => {
    const programme = programmesMock.find(p => p.id === programmeId)
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
      // 1️⃣ Créer le rendez-vous
      const nouveauRendezVous = {
        ...formData,
        rappelEnvoye: false,
        createdBy: '1', // ID de l'utilisateur connecté
      }

      const rdvResponse = await fetch('/api/rendez-vous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nouveauRendezVous),
      })

      const rdvResult = await rdvResponse.json()

      if (!rdvResult.success) {
        throw new Error(rdvResult.error || 'Erreur lors de la création du rendez-vous')
      }

      // 2️⃣ Si c'est un rendez-vous de positionnement, créer la fiche apprenant B2B
      if (formData.type === 'positionnement' && b2bData.siret && b2bData.structureNom) {
        const apprenantResponse = await fetch('/dashboard/creer-apprenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(b2bData),
        })

        const apprenantResult = await apprenantResponse.json()

        if (!apprenantResult.success) {
          console.warn(
            'Avertissement: Le rendez-vous a été créé mais la fiche apprenant a échoué:',
            apprenantResult.error
          )
          toast.error(`Rendez-vous créé mais erreur apprenant: ${apprenantResult.error}`)
        } else {
          toast.success('Rendez-vous et fiche apprenant créés avec succès!')
        }
      } else {
        toast.success('Rendez-vous créé avec succès!')
      }

      // Rediriger vers la liste des rendez-vous
      router.push('/dashboard/rendez-vous')
    } catch (error) {
      console.error('Erreur lors de la création:', error)
      toast.error('Erreur lors de la création du rendez-vous')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/rendez-vous')
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
            <h1 className="text-3xl font-bold">Nouveau Rendez-vous</h1>
            <p className="text-muted-foreground">Créer un nouveau rendez-vous avec un client</p>
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
                      <SelectItem key={programme.id} value={programme.id}>
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

        {/* Données B2B - Affiché uniquement pour les rendez-vous de positionnement */}
        {formData.type === 'positionnement' && (
          <>
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-900">
                  <User className="h-5 w-5" />
                  <span>Données Apprenant (B2B)</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Ces informations permettront de créer automatiquement la fiche apprenant
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="b2b.nom">Nom *</Label>
                    <Input
                      id="b2b.nom"
                      value={b2bData.nom}
                      onChange={e => handleB2BInputChange('nom', e.target.value)}
                      required={formData.type === 'positionnement'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="b2b.prenom">Prénom *</Label>
                    <Input
                      id="b2b.prenom"
                      value={b2bData.prenom}
                      onChange={e => handleB2BInputChange('prenom', e.target.value)}
                      required={formData.type === 'positionnement'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="b2b.email">Email *</Label>
                    <Input
                      id="b2b.email"
                      type="email"
                      value={b2bData.email}
                      onChange={e => handleB2BInputChange('email', e.target.value)}
                      required={formData.type === 'positionnement'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="b2b.telephone">Téléphone</Label>
                    <Input
                      id="b2b.telephone"
                      value={b2bData.telephone}
                      onChange={e => handleB2BInputChange('telephone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="b2b.dateNaissance">Date de naissance</Label>
                    <Input
                      id="b2b.dateNaissance"
                      type="date"
                      value={b2bData.dateNaissance}
                      onChange={e => handleB2BInputChange('dateNaissance', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="b2b.numeroSecuriteSociale">N° Sécurité Sociale</Label>
                    <Input
                      id="b2b.numeroSecuriteSociale"
                      value={b2bData.numeroSecuriteSociale}
                      onChange={e => handleB2BInputChange('numeroSecuriteSociale', e.target.value)}
                      placeholder="15 chiffres"
                      maxLength={15}
                    />
                  </div>
                  <div>
                    <Label htmlFor="b2b.numeroCotisantIndividuel">N° Cotisant Individuel</Label>
                    <Input
                      id="b2b.numeroCotisantIndividuel"
                      value={b2bData.numeroCotisantIndividuel}
                      onChange={e =>
                        handleB2BInputChange('numeroCotisantIndividuel', e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-900">
                  <Building2 className="h-5 w-5" />
                  <span>Structure Juridique (B2B)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="b2b.structureNom">Nom de la structure (Raison sociale) *</Label>
                    <Input
                      id="b2b.structureNom"
                      value={b2bData.structureNom}
                      onChange={e => handleB2BInputChange('structureNom', e.target.value)}
                      required={formData.type === 'positionnement'}
                      placeholder="Ex: SARL Martin Formations"
                    />
                  </div>
                  <div>
                    <Label htmlFor="b2b.siret">SIRET *</Label>
                    <Input
                      id="b2b.siret"
                      value={b2bData.siret}
                      onChange={e => handleB2BInputChange('siret', e.target.value)}
                      required={formData.type === 'positionnement'}
                      placeholder="14 chiffres"
                      maxLength={14}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="b2b.codeApe">Code APE</Label>
                  <Input
                    id="b2b.codeApe"
                    value={b2bData.codeApe}
                    onChange={e => handleB2BInputChange('codeApe', e.target.value)}
                    placeholder="Ex: 8559A"
                  />
                </div>

                <div>
                  <Label htmlFor="b2b.structureAdresse">Adresse de la structure</Label>
                  <Input
                    id="b2b.structureAdresse"
                    value={b2bData.structureAdresse}
                    onChange={e => handleB2BInputChange('structureAdresse', e.target.value)}
                    placeholder="Numéro et nom de rue"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="b2b.structureCodePostal">Code Postal</Label>
                    <Input
                      id="b2b.structureCodePostal"
                      value={b2bData.structureCodePostal}
                      onChange={e => handleB2BInputChange('structureCodePostal', e.target.value)}
                      maxLength={5}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="b2b.structureVille">Ville</Label>
                    <Input
                      id="b2b.structureVille"
                      value={b2bData.structureVille}
                      onChange={e => handleB2BInputChange('structureVille', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="b2b.structureTelephone">Téléphone de la structure</Label>
                    <Input
                      id="b2b.structureTelephone"
                      value={b2bData.structureTelephone}
                      onChange={e => handleB2BInputChange('structureTelephone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="b2b.structureEmail">Email de la structure</Label>
                    <Input
                      id="b2b.structureEmail"
                      type="email"
                      value={b2bData.structureEmail}
                      onChange={e => handleB2BInputChange('structureEmail', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-900">
                  <FileText className="h-5 w-5" />
                  <span>Contact Principal de la Structure</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="b2b.contactNom">Nom</Label>
                    <Input
                      id="b2b.contactNom"
                      value={b2bData.contactNom}
                      onChange={e => handleB2BInputChange('contactNom', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="b2b.contactPrenom">Prénom</Label>
                    <Input
                      id="b2b.contactPrenom"
                      value={b2bData.contactPrenom}
                      onChange={e => handleB2BInputChange('contactPrenom', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="b2b.contactFonction">Fonction</Label>
                    <Input
                      id="b2b.contactFonction"
                      value={b2bData.contactFonction}
                      onChange={e => handleB2BInputChange('contactFonction', e.target.value)}
                      placeholder="Ex: Directeur RH"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="b2b.contactEmail">Email du contact</Label>
                    <Input
                      id="b2b.contactEmail"
                      type="email"
                      value={b2bData.contactEmail}
                      onChange={e => handleB2BInputChange('contactEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="b2b.contactTelephone">Téléphone du contact</Label>
                    <Input
                      id="b2b.contactTelephone"
                      value={b2bData.contactTelephone}
                      onChange={e => handleB2BInputChange('contactTelephone', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Création...' : 'Créer le rendez-vous'}
          </Button>
        </div>
      </form>
    </div>
  )
}
