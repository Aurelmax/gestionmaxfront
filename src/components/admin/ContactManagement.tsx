'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import type { Contacts } from '@/types/payload-generated'

// Types dérivés de la collection Contacts
type ContactType = Contacts['type']
type ContactStatut = Contacts['statut']
type ContactPriorite = Contacts['priorite']

// Interface locale pour les données mock (avec Date au lieu de string)
interface ContactMessage extends Omit<Contacts, 'dateReception' | 'dateReponse'> {
  dateReception: Date
  dateReponse?: Date
}

const mockMessages: ContactMessage[] = [
  {
    id: '1',
    nom: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    telephone: '06 12 34 56 78',
    type: 'formation',
    sujet: "Demande d'information sur la formation WordPress",
    message:
      'Bonjour, je souhaiterais obtenir des informations sur vos formations WordPress. Quels sont les prérequis et les dates disponibles ?',
    statut: 'nouveau',
    dateReception: new Date('2024-10-10'),
    priorite: 'normale',
    createdAt: '2024-10-10T10:00:00Z',
    updatedAt: '2024-10-10T10:00:00Z',
    reponse: undefined,
  },
  {
    id: '2',
    nom: 'Marie Martin',
    email: 'marie.martin@email.com',
    telephone: undefined,
    type: 'reclamation',
    sujet: 'Problème avec la formation',
    message:
      "J'ai suivi votre formation WordPress mais j'ai rencontré des difficultés avec l'accès aux ressources en ligne.",
    statut: 'enCours',
    dateReception: new Date('2024-10-09'),
    priorite: 'haute',
    createdAt: '2024-10-09T14:30:00Z',
    updatedAt: '2024-10-09T14:30:00Z',
    reponse: undefined,
  },
  {
    id: '3',
    nom: 'Pierre Durand',
    email: 'pierre.durand@email.com',
    telephone: '06 98 76 54 32',
    type: 'devis',
    sujet: 'Demande de devis pour formation personnalisée',
    message:
      'Nous souhaiterions organiser une formation WordPress personnalisée pour notre équipe de 8 personnes.',
    statut: 'traite',
    dateReception: new Date('2024-10-08'),
    dateReponse: new Date('2024-10-09'),
    reponse: 'Merci pour votre demande. Je vous envoie un devis personnalisé sous 24h.',
    priorite: 'normale',
    createdAt: '2024-10-08T09:15:00Z',
    updatedAt: '2024-10-09T16:45:00Z',
  },
]

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

const statutColors: Record<ContactStatut, string> = {
  nouveau: 'bg-blue-100 text-blue-800',
  enCours: 'bg-yellow-100 text-yellow-800',
  traite: 'bg-green-100 text-green-800',
  ferme: 'bg-gray-100 text-gray-800',
}

const prioriteColors: Record<ContactPriorite, string> = {
  basse: 'bg-gray-100 text-gray-800',
  normale: 'bg-blue-100 text-blue-800',
  haute: 'bg-orange-100 text-orange-800',
  urgente: 'bg-red-100 text-red-800',
}

export function ContactManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatut, setFilterStatut] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [reponse, setReponse] = useState('')

  const filteredMessages = messages.filter(message => {
    const matchesSearch =
      message.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sujet.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatut = filterStatut === 'all' || message.statut === filterStatut
    const matchesType = filterType === 'all' || message.type === filterType

    return matchesSearch && matchesStatut && matchesType
  })

  const handleStatutChange = (messageId: string, newStatut: ContactStatut) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              statut: newStatut,
              dateReponse: newStatut === 'traite' ? new Date() : msg.dateReponse,
            }
          : msg
      )
    )
  }

  const handleRepondre = (messageId: string) => {
    if (reponse.trim()) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? {
                ...msg,
                statut: 'traite' as const,
                reponse: reponse,
                dateReponse: new Date(),
              }
            : msg
        )
      )
      setReponse('')
      setSelectedMessage(null)
    }
  }

  const handleSupprimer = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null)
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des contacts</h1>
          <p className="text-gray-600 mt-2">
            Gérez les messages reçus via le formulaire de contact
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredMessages.length} message{filteredMessages.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatut} onValueChange={setFilterStatut}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="nouveau">Nouveau</SelectItem>
                <SelectItem value="enCours">En cours</SelectItem>
                <SelectItem value="traite">Traité</SelectItem>
                <SelectItem value="ferme">Fermé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="question">Question générale</SelectItem>
                <SelectItem value="reclamation">Réclamation</SelectItem>
                <SelectItem value="formation">Demande de formation</SelectItem>
                <SelectItem value="devis">Demande de devis</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtres avancés
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des messages */}
        <div className="lg:col-span-1 space-y-4">
          {filteredMessages.map(message => (
            <Card
              key={message.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedMessage(message)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{message.nom}</h3>
                    <p className="text-sm text-gray-600 truncate">{message.email}</p>
                  </div>
                  <div className="flex items-center gap-1">{getStatutIcon(message.statut)}</div>
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{message.sujet}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${statutColors[message.statut]}`}>
                      {statutLabels[message.statut]}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${prioriteColors[message.priorite]}`}
                    >
                      {message.priorite}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    {message.dateReception.toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Détail du message sélectionné */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedMessage.nom}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedMessage.email}</span>
                    </div>
                    {selectedMessage.telephone && (
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{selectedMessage.telephone}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statutColors[selectedMessage.statut]}>
                      {statutLabels[selectedMessage.statut]}
                    </Badge>
                    <Badge variant="outline" className={prioriteColors[selectedMessage.priorite]}>
                      {selectedMessage.priorite}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Type de demande</h4>
                  <Badge variant="outline">{typeLabels[selectedMessage.type]}</Badge>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sujet</h4>
                  <p className="text-gray-700">{selectedMessage.sujet}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Message</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Reçu le {selectedMessage.dateReception.toLocaleString('fr-FR')}</span>
                </div>

                {selectedMessage.reponse && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Réponse envoyée</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.reponse}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Répondu le {selectedMessage.dateReponse?.toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t">
                  <Select
                    value={selectedMessage.statut}
                    onValueChange={value =>
                      handleStatutChange(selectedMessage.id, value as ContactStatut)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nouveau">Nouveau</SelectItem>
                      <SelectItem value="enCours">En cours</SelectItem>
                      <SelectItem value="traite">Traité</SelectItem>
                      <SelectItem value="ferme">Fermé</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSupprimer(selectedMessage.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>

                {/* Zone de réponse */}
                {selectedMessage.statut !== 'traite' && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 mb-2">Répondre au message</h4>
                    <Textarea
                      placeholder="Tapez votre réponse..."
                      value={reponse}
                      onChange={e => setReponse(e.target.value)}
                      rows={4}
                      className="mb-3"
                    />
                    <Button
                      onClick={() => handleRepondre(selectedMessage.id)}
                      disabled={!reponse.trim()}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Envoyer la réponse
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sélectionnez un message
                </h3>
                <p className="text-gray-600">
                  Choisissez un message dans la liste pour voir les détails et y répondre.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
