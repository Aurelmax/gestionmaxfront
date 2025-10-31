'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  Reply,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { contactAPIService, type Contact } from '@/lib/contact-api-service'
import { toast } from 'sonner'

type ContactStatut = 'nouveau' | 'enCours' | 'traite' | 'ferme'
type ContactPriorite = 'basse' | 'normale' | 'haute' | 'urgente'
type ContactType = 'question' | 'reclamation' | 'formation' | 'devis'

const typeLabels: Record<ContactType, string> = {
  question: 'Question générale',
  reclamation: 'Réclamation',
  formation: 'Demande de formation',
  devis: 'Demande de devis',
}

const statutLabels: Record<ContactStatut, string> = {
  nouveau: 'Nouveau',
  enCours: 'En cours',
  traite: 'Traité',
  ferme: 'Fermé',
}

const prioriteLabels: Record<ContactPriorite, string> = {
  basse: 'Basse',
  normale: 'Normale',
  haute: 'Haute',
  urgente: 'Urgente',
}

export default function ContactManagementNew() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [reponseText, setReponseText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filtreStatut, setFiltreStatut] = useState<ContactStatut | 'tous'>('tous')
  const [filtrePriorite, setFiltrePriorite] = useState<ContactPriorite | 'toutes'>('toutes')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Charger les contacts
  useEffect(() => {
    loadContacts()
  }, [])

  // Filtrer les contacts
  useEffect(() => {
    filterContacts()
  }, [contacts, searchTerm, filtreStatut, filtrePriorite])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const response = await contactAPIService.getContacts({ limit: 100 })
      setContacts(response.data)
    } catch {
      toast.error('Erreur lors du chargement des contacts')
    } finally {
      setLoading(false)
    }
  }

  const filterContacts = () => {
    let result = contacts

    if (searchTerm) {
      result = result.filter(
        c =>
          c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.sujet.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filtreStatut !== 'tous') {
      result = result.filter(c => c.statut === filtreStatut)
    }

    if (filtrePriorite !== 'toutes') {
      result = result.filter(c => c.priorite === filtrePriorite)
    }

    setFilteredContacts(result)
  }

  const handleStatutChange = async (contactId: string, newStatut: ContactStatut) => {
    try {
      await contactAPIService.changeStatut(contactId, newStatut)
      await loadContacts()
      toast.success('Statut mis à jour')
    } catch {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handlePrioriteChange = async (contactId: string, newPriorite: ContactPriorite) => {
    try {
      await contactAPIService.changePriorite(contactId, newPriorite)
      await loadContacts()
      toast.success('Priorité mise à jour')
    } catch {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handleSendReponse = async () => {
    if (!selectedContact || !reponseText.trim()) return

    try {
      setSubmitting(true)
      await contactAPIService.repondreContact(selectedContact.id, reponseText)
      await loadContacts()
      setSelectedContact(null)
      setReponseText('')
      toast.success('Réponse envoyée avec succès')
    } catch {
      toast.error('Erreur lors de l envoi de la réponse')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return

    try {
      await contactAPIService.deleteContact(contactId)
      await loadContacts()
      if (selectedContact?.id === contactId) {
        setSelectedContact(null)
      }
      toast.success('Contact supprimé')
    } catch {
      toast.error('Erreur lors de la suppression')
    }
  }

  const getStatutIcon = (statut: ContactStatut) => {
    switch (statut) {
      case 'nouveau':
        return <AlertCircle className="h-4 w-4" />
      case 'enCours':
        return <Clock className="h-4 w-4" />
      case 'traite':
        return <CheckCircle className="h-4 w-4" />
      case 'ferme':
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getPrioriteColor = (priorite: ContactPriorite) => {
    switch (priorite) {
      case 'basse':
        return 'bg-blue-100 text-blue-800'
      case 'normale':
        return 'bg-gray-100 text-gray-800'
      case 'haute':
        return 'bg-orange-100 text-orange-800'
      case 'urgente':
        return 'bg-red-100 text-red-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.statut === 'nouveau').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.statut === 'enCours').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traités</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.statut === 'traite').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nom, email, sujet..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={filtreStatut} onValueChange={v => setFiltreStatut(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value="nouveau">Nouveau</SelectItem>
                  <SelectItem value="enCours">En cours</SelectItem>
                  <SelectItem value="traite">Traité</SelectItem>
                  <SelectItem value="ferme">Fermé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priorité</label>
              <Select value={filtrePriorite} onValueChange={v => setFiltrePriorite(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Toutes les priorités</SelectItem>
                  <SelectItem value="basse">Basse</SelectItem>
                  <SelectItem value="normale">Normale</SelectItem>
                  <SelectItem value="haute">Haute</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des contacts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Colonne gauche : Liste */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Messages ({filteredContacts.length})</h2>

          {filteredContacts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Aucun contact trouvé
              </CardContent>
            </Card>
          ) : (
            filteredContacts.map(contact => (
              <Card
                key={contact.id}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedContact?.id === contact.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{contact.nom}</span>
                          <Badge variant="outline">{typeLabels[contact.type]}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                          {contact.telephone && (
                            <>
                              <Phone className="ml-2 h-3 w-3" />
                              {contact.telephone}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getPrioriteColor(contact.priorite)}>
                          {prioriteLabels[contact.priorite]}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {getStatutIcon(contact.statut)}
                          {statutLabels[contact.statut]}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{contact.sujet}</p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{contact.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Colonne droite : Détails */}
        <div className="space-y-4">
          {selectedContact ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>Détails du contact</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteContact(selectedContact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Informations */}
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Nom :</span>
                    <p>{selectedContact.nom}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Email :</span>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedContact.email}
                    </p>
                  </div>
                  {selectedContact.telephone && (
                    <div>
                      <span className="text-sm font-medium">Téléphone :</span>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedContact.telephone}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium">Type :</span>
                    <p>{typeLabels[selectedContact.type]}</p>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Message :</span>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="whitespace-pre-wrap text-sm">{selectedContact.message}</p>
                  </div>
                </div>

                {/* Statut et Priorité */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Statut</label>
                    <Select
                      value={selectedContact.statut}
                      onValueChange={v => handleStatutChange(selectedContact.id, v as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nouveau">Nouveau</SelectItem>
                        <SelectItem value="enCours">En cours</SelectItem>
                        <SelectItem value="traite">Traité</SelectItem>
                        <SelectItem value="ferme">Fermé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priorité</label>
                    <Select
                      value={selectedContact.priorite}
                      onValueChange={v => handlePrioriteChange(selectedContact.id, v as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basse">Basse</SelectItem>
                        <SelectItem value="normale">Normale</SelectItem>
                        <SelectItem value="haute">Haute</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Réponse existante */}
                {selectedContact.reponse && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Réponse envoyée :</span>
                    <div className="rounded-lg border bg-green-50 p-4">
                      <p className="whitespace-pre-wrap text-sm">{selectedContact.reponse}</p>
                      {selectedContact.dateReponse && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Envoyée le{' '}
                          {new Date(selectedContact.dateReponse).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Zone de réponse */}
                {!selectedContact.reponse && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Répondre au contact</label>
                    <Textarea
                      placeholder="Votre réponse..."
                      value={reponseText}
                      onChange={e => setReponseText(e.target.value)}
                      rows={6}
                    />
                    <Button
                      onClick={handleSendReponse}
                      disabled={!reponseText.trim() || submitting}
                      className="w-full"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Reply className="mr-2 h-4 w-4" />
                          Envoyer la réponse
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex h-96 items-center justify-center text-muted-foreground">
                Sélectionnez un contact pour voir les détails
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
