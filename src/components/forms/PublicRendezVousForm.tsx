'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Calendar, User, Briefcase, MessageSquare, Accessibility } from 'lucide-react'
import { toast } from 'sonner'
import { CreateRendezVousRequest } from '@/types/rendez-vous'
import { useConfetti } from '@/hooks/useConfetti'

interface PublicRendezVousFormProps {
  programmeId?: string
  programmeTitre?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function PublicRendezVousForm({
  programmeId,
  programmeTitre,
  onSuccess,
  onCancel,
}: PublicRendezVousFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { triggerCelebration } = useConfetti()
  const [formData, setFormData] = useState({
    // Informations personnelles
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    entreprise: '',

    // Statut professionnel
    statut: '' as 'independant' | 'salarie' | '',

    // Détails du besoin
    origineBesoin: '',

    // Situation de handicap
    situationHandicap: '' as 'oui' | 'non' | '',

    // Informations du rendez-vous
    type: 'positionnement' as const,
    date: '',
    heure: '',
    duree: 30,
    lieu: 'visio' as const,
    notes: '',
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Préparer les données pour l'API
      const rendezVousData: CreateRendezVousRequest = {
        programmeId: programmeId || '1',
        client: {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          entreprise: formData.entreprise || undefined,
        },
        type: formData.type,
        date: formData.date,
        heure: formData.heure,
        duree: formData.duree,
        lieu: formData.lieu,
        notes: `Statut: ${formData.statut === 'independant' ? 'Indépendant' : 'Salarié'}
Origine du besoin: ${formData.origineBesoin}
Situation de handicap: ${formData.situationHandicap === 'oui' ? 'Oui' : 'Non'}
${formData.notes ? `\nNotes supplémentaires: ${formData.notes}` : ''}`,
      }

      const response = await fetch('/api/rendez-vous-payload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rendezVousData),
      })

      const data = await response.json()

      if (data.success) {
        // 🎉 Déclencher les confettis!
        triggerCelebration()
        toast.success('Votre demande de rendez-vous a été envoyée avec succès !')
        onSuccess?.()
      } else {
        toast.error(data.error || "Erreur lors de l'envoi de votre demande")
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Erreur lors de l'envoi de votre demande")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.nom &&
      formData.prenom &&
      formData.telephone &&
      formData.email &&
      formData.statut &&
      formData.origineBesoin &&
      formData.situationHandicap &&
      formData.date &&
      formData.heure
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Calendar className="h-6 w-6" />
          Demande de rendez-vous
        </CardTitle>
        {programmeTitre && (
          <p className="text-muted-foreground">
            Pour la formation : <strong>{programmeTitre}</strong>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations personnelles */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Vos informations personnelles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom" className="text-sm font-medium">
                  Nom *
                </Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={e => handleInputChange('nom', e.target.value)}
                  placeholder="Votre nom"
                  required
                />
              </div>
              <div>
                <Label htmlFor="prenom" className="text-sm font-medium">
                  Prénom *
                </Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={e => handleInputChange('prenom', e.target.value)}
                  placeholder="Votre prénom"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telephone" className="text-sm font-medium">
                  Téléphone *
                </Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={e => handleInputChange('telephone', e.target.value)}
                  placeholder="06 12 34 56 78"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="entreprise" className="text-sm font-medium">
                Entreprise
              </Label>
              <Input
                id="entreprise"
                value={formData.entreprise}
                onChange={e => handleInputChange('entreprise', e.target.value)}
                placeholder="Nom de votre entreprise (optionnel)"
              />
            </div>
          </div>

          {/* Statut professionnel */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Statut professionnel
            </h3>

            <div>
              <Label className="text-sm font-medium">Vous êtes *</Label>
              <RadioGroup
                value={formData.statut}
                onValueChange={value => handleInputChange('statut', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="independant" id="independant" />
                  <Label htmlFor="independant">Indépendant / Freelance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="salarie" id="salarie" />
                  <Label htmlFor="salarie">Salarié</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Origine du besoin */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Votre besoin
            </h3>

            <div>
              <Label htmlFor="origineBesoin" className="text-sm font-medium">
                Détail sur l'origine du besoin *
              </Label>
              <Textarea
                id="origineBesoin"
                value={formData.origineBesoin}
                onChange={e => handleInputChange('origineBesoin', e.target.value)}
                placeholder="Décrivez votre situation, vos objectifs et pourquoi vous souhaitez suivre cette formation..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Situation de handicap */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Accessibility className="h-5 w-5" />
              Accessibilité
            </h3>

            <div>
              <Label className="text-sm font-medium">Situation de handicap *</Label>
              <RadioGroup
                value={formData.situationHandicap}
                onValueChange={value => handleInputChange('situationHandicap', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non" id="handicap-non" />
                  <Label htmlFor="handicap-non">Non</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oui" id="handicap-oui" />
                  <Label htmlFor="handicap-oui">Oui</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-1">
                Cette information nous aide à adapter la formation à vos besoins spécifiques.
              </p>
            </div>
          </div>

          {/* Préférences de rendez-vous */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Préférences de rendez-vous
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-sm font-medium">
                  Date souhaitée *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={e => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="heure" className="text-sm font-medium">
                  Heure souhaitée *
                </Label>
                <Input
                  id="heure"
                  type="time"
                  value={formData.heure}
                  onChange={e => handleInputChange('heure', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes supplémentaires
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={e => handleInputChange('notes', e.target.value)}
                placeholder="Informations complémentaires, contraintes horaires, questions spécifiques..."
                rows={3}
              />
            </div>
          </div>

          {/* Informations légales */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Informations importantes</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Votre demande sera traitée dans les 24h ouvrées</li>
              <li>• Nous vous contacterons pour confirmer le rendez-vous</li>
              <li>• Les informations sur le handicap sont confidentielles</li>
              <li>• Ce rendez-vous est gratuit et sans engagement</li>
            </ul>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading || !isFormValid()} className="flex-1">
              {isLoading ? 'Envoi en cours...' : 'Envoyer ma demande'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Annuler
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
