'use client'

import { useState } from 'react'
import { Programme } from '@/types/index'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Save,
  X,
  Plus,
  BookOpen,
  Clock,
  Euro,
  Users,
  Target,
  FileText,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'

interface ProgrammeFormCompletProps {
  programme?: Programme
  onSave: (programme: Omit<Programme, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ProgrammeFormComplet({
  programme,
  onSave,
  onCancel,
  isLoading = false,
}: ProgrammeFormCompletProps) {
  const [formData, setFormData] = useState({
    codeFormation: programme?.codeFormation || '',
    titre: programme?.titre || '',
    description: programme?.description || '',
    objectifs: programme?.objectifs || '',
    prerequis: programme?.prerequis || '',
    publicConcerne: programme?.publicConcerne || '',
    duree: programme?.duree || 0,
    horaires: programme?.horaires || '',
    delaisMiseEnPlace: programme?.delaisMiseEnPlace || '',
    niveau: programme?.niveau || 'DEBUTANT',
    modalites: programme?.modalites || 'PRESENTIEL',
    prix: programme?.prix || 0,
    modalitesReglement: programme?.modalitesReglement || '',
    statut: programme?.statut || 'BROUILLON',
    formateurs: programme?.formateurs || [],
    competences: programme?.competences || [],
    ressources: programme?.ressources || [],
    modalitesEvaluation: programme?.modalitesEvaluation || '',
    sanctionFormation: programme?.sanctionFormation || '',
    niveauCertification: programme?.niveauCertification || '',
    accessibiliteHandicap: programme?.accessibiliteHandicap || '',
    cessationAbandon: programme?.cessationAbandon || '',
    // Informations formateur par défaut
    formateurNom: 'Aurélien LAVAYSSIERE',
    formateurEmail: 'aurelien@gestionmax.fr',
    formateurTelephone: '06.46.02.24.68',
    formateurRole: 'Consultant formateur en informatique de gestion',
    formateurBiographie:
      "Aurélien LAVAYSSIERE est un consultant formateur en informatique de gestion, spécialisé dans la formation des adultes. Doté d'une solide expérience dans le domaine de la formation, Aurélien possède une expertise approfondie en matière de technologies web et de gestion d'entreprise.",
  })

  const [newCompetence, setNewCompetence] = useState('')
  const [newRessource, setNewRessource] = useState('')

  const niveaux = [
    { value: 'DEBUTANT', label: 'Débutant' },
    { value: 'INTERMEDIAIRE', label: 'Intermédiaire' },
    { value: 'AVANCE', label: 'Avancé' },
    { value: 'EXPERT', label: 'Expert' },
  ]

  const modalites = [
    { value: 'PRESENTIEL', label: 'Présentiel' },
    { value: 'DISTANCIEL', label: 'Distanciel' },
    { value: 'HYBRIDE', label: 'Hybride' },
  ]

  const statuts = [
    { value: 'BROUILLON', label: 'Brouillon' },
    { value: 'PUBLIE', label: 'Publié' },
    { value: 'ARCHIVE', label: 'Archivé' },
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddCompetence = () => {
    if (newCompetence.trim() && !formData.competences.includes(newCompetence.trim())) {
      setFormData(prev => ({
        ...prev,
        competences: [...prev.competences, newCompetence.trim()],
      }))
      setNewCompetence('')
    }
  }

  const handleRemoveCompetence = (competence: string) => {
    setFormData(prev => ({
      ...prev,
      competences: prev.competences.filter(c => {
        const compText =
          typeof c === 'object' && (c as any)?.competence ? (c as any).competence : String(c)
        return compText !== competence
      }),
    }))
  }

  const handleAddRessource = () => {
    if (newRessource.trim() && !formData.ressources.includes(newRessource.trim())) {
      setFormData(prev => ({
        ...prev,
        ressources: [...prev.ressources, newRessource.trim()],
      }))
      setNewRessource('')
    }
  }

  const handleRemoveRessource = (ressource: string) => {
    setFormData(prev => ({
      ...prev,
      ressources: prev.ressources.filter(r => r !== ressource),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.codeFormation.trim()) {
      toast.error('Le code formation est obligatoire')
      return
    }

    if (!formData.titre.trim()) {
      toast.error('Le titre est obligatoire')
      return
    }

    if (formData.duree <= 0) {
      toast.error('La durée doit être supérieure à 0')
      return
    }

    if (formData.prix < 0) {
      toast.error('Le prix ne peut pas être négatif')
      return
    }

    onSave(formData)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {programme ? 'Modifier le programme de formation' : 'Nouveau programme de formation'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informations générales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Informations générales
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codeFormation">Code formation *</Label>
                  <Input
                    id="codeFormation"
                    value={formData.codeFormation}
                    onChange={e => handleInputChange('codeFormation', e.target.value)}
                    placeholder="Ex: A001-WP-DD"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statut">Statut</Label>
                  <Select
                    value={formData.statut}
                    onValueChange={value => handleInputChange('statut', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuts.map(statut => (
                        <SelectItem key={statut.value} value={statut.value}>
                          {statut.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titre">Titre de la formation *</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={e => handleInputChange('titre', e.target.value)}
                  placeholder="Ex: Création de site WordPress"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                  placeholder="Description détaillée de la formation..."
                  rows={4}
                />
              </div>
            </div>

            <Separator />

            {/* Objectifs et prérequis */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Objectifs et prérequis
              </h3>

              <div className="space-y-2">
                <Label htmlFor="objectifs">Objectifs pédagogiques</Label>
                <Textarea
                  id="objectifs"
                  value={formData.objectifs}
                  onChange={e => handleInputChange('objectifs', e.target.value)}
                  placeholder="Décrivez les objectifs pédagogiques de la formation..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prerequis">Prérequis</Label>
                <Textarea
                  id="prerequis"
                  value={formData.prerequis}
                  onChange={e => handleInputChange('prerequis', e.target.value)}
                  placeholder="Listez les prérequis nécessaires..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publicConcerne">Public concerné</Label>
                <Textarea
                  id="publicConcerne"
                  value={formData.publicConcerne}
                  onChange={e => handleInputChange('publicConcerne', e.target.value)}
                  placeholder="Décrivez le public cible..."
                  rows={2}
                />
              </div>
            </div>

            <Separator />

            {/* Caractéristiques de la formation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Caractéristiques
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duree" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Durée (heures) *
                  </Label>
                  <Input
                    id="duree"
                    type="number"
                    min="1"
                    value={formData.duree}
                    onChange={e => handleInputChange('duree', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niveau">Niveau</Label>
                  <Select
                    value={formData.niveau}
                    onValueChange={value => handleInputChange('niveau', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {niveaux.map(niveau => (
                        <SelectItem key={niveau.value} value={niveau.value}>
                          {niveau.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modalites">Modalités</Label>
                  <Select
                    value={formData.modalites}
                    onValueChange={value => handleInputChange('modalites', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {modalites.map(modalite => (
                        <SelectItem key={modalite.value} value={modalite.value}>
                          {modalite.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horaires">Horaires</Label>
                  <Input
                    id="horaires"
                    value={formData.horaires}
                    onChange={e => handleInputChange('horaires', e.target.value)}
                    placeholder="Ex: 9h à 13h et de 14h à 17h"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delaisMiseEnPlace">Délais de mise en place</Label>
                  <Input
                    id="delaisMiseEnPlace"
                    value={formData.delaisMiseEnPlace}
                    onChange={e => handleInputChange('delaisMiseEnPlace', e.target.value)}
                    placeholder="Ex: À réception de l'accord de prise en charge"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prix" className="flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Prix (€)
                </Label>
                <Input
                  id="prix"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.prix}
                  onChange={e => handleInputChange('prix', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modalitesReglement">Modalités de règlement</Label>
                <Textarea
                  id="modalitesReglement"
                  value={formData.modalitesReglement}
                  onChange={e => handleInputChange('modalitesReglement', e.target.value)}
                  placeholder="Décrivez les modalités de règlement..."
                  rows={2}
                />
              </div>
            </div>

            <Separator />

            {/* Contact formateur */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact formateur
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formateur_nom">Nom du formateur *</Label>
                  <Input
                    id="formateur_nom"
                    value={formData.formateurNom}
                    onChange={e => handleInputChange('formateurNom', e.target.value)}
                    placeholder="Ex: Aurélien LAVAYSSIERE"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="formateur_role">Rôle/Fonction</Label>
                  <Input
                    id="formateur_role"
                    value={formData.formateurRole}
                    onChange={e => handleInputChange('formateurRole', e.target.value)}
                    placeholder="Ex: Consultant formateur"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formateur_email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email *
                  </Label>
                  <Input
                    id="formateur_email"
                    type="email"
                    value={formData.formateurEmail}
                    onChange={e => handleInputChange('formateurEmail', e.target.value)}
                    placeholder="aurelien@gestionmax.fr"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="formateur_telephone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </Label>
                  <Input
                    id="formateur_telephone"
                    value={formData.formateurTelephone}
                    onChange={e => handleInputChange('formateurTelephone', e.target.value)}
                    placeholder="06.46.02.24.68"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="formateur_biographie">Biographie</Label>
                <Textarea
                  id="formateur_biographie"
                  value={formData.formateurBiographie}
                  onChange={e => handleInputChange('formateurBiographie', e.target.value)}
                  placeholder="Biographie du formateur..."
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Compétences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Compétences développées
              </h3>

              <div className="flex gap-2">
                <Input
                  value={newCompetence}
                  onChange={e => setNewCompetence(e.target.value)}
                  placeholder="Ajouter une compétence..."
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddCompetence())}
                />
                <Button type="button" onClick={handleAddCompetence} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.competences.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.competences.map((comp: any, index) => {
                    const competenceText =
                      typeof comp === 'object' && comp?.competence ? comp.competence : String(comp)
                    return (
                      <Badge
                        key={`${competenceText}-${index}`}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {competenceText}
                        <button
                          type="button"
                          onClick={() => handleRemoveCompetence(competenceText)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>

            <Separator />

            {/* Ressources et matériel */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Ressources et matériel
              </h3>

              <div className="flex gap-2">
                <Input
                  value={newRessource}
                  onChange={e => setNewRessource(e.target.value)}
                  placeholder="Ajouter une ressource..."
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddRessource())}
                />
                <Button type="button" onClick={handleAddRessource} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.ressources.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.ressources.map(ressource => (
                    <Badge key={ressource} variant="secondary" className="flex items-center gap-1">
                      {ressource}
                      <button
                        type="button"
                        onClick={() => handleRemoveRessource(ressource)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Évaluation et certification */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Évaluation et certification
              </h3>

              <div className="space-y-2">
                <Label htmlFor="modalitesEvaluation">Modalités d'évaluation</Label>
                <Textarea
                  id="modalitesEvaluation"
                  value={formData.modalitesEvaluation}
                  onChange={e => handleInputChange('modalitesEvaluation', e.target.value)}
                  placeholder="Décrivez les modalités d'évaluation..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sanctionFormation">Sanction de la formation</Label>
                  <Input
                    id="sanctionFormation"
                    value={formData.sanctionFormation}
                    onChange={e => handleInputChange('sanctionFormation', e.target.value)}
                    placeholder="Ex: Certificat de réalisation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niveauCertification">Niveau/Certification</Label>
                  <Input
                    id="niveauCertification"
                    value={formData.niveauCertification}
                    onChange={e => handleInputChange('niveauCertification', e.target.value)}
                    placeholder="Ex: Aucune"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Accessibilité et conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Accessibilité et conditions
              </h3>

              <div className="space-y-2">
                <Label htmlFor="accessibiliteHandicap">Accessibilité handicap</Label>
                <Textarea
                  id="accessibiliteHandicap"
                  value={formData.accessibiliteHandicap}
                  onChange={e => handleInputChange('accessibiliteHandicap', e.target.value)}
                  placeholder="Décrivez les adaptations proposées..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cessationAbandon">Cessation anticipée/Abandon</Label>
                <Textarea
                  id="cessationAbandon"
                  value={formData.cessationAbandon}
                  onChange={e => handleInputChange('cessationAbandon', e.target.value)}
                  placeholder="Décrivez les conditions d'abandon..."
                  rows={2}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Enregistrement...' : programme ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
