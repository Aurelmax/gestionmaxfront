import { ContactMessage } from '@/types/forms'

/**
 * Logique métier pour la gestion des contacts
 * Sépare la logique métier de l'interface utilisateur
 */
export class ContactBusinessLogic {
  /**
   * Filtre les messages selon différents critères
   */
  static filterMessages(
    messages: ContactMessage[],
    filters: {
      searchTerm?: string
      statut?: string
      type?: string
      priorite?: string
      dateFrom?: Date
      dateTo?: Date
    }
  ): ContactMessage[] {
    return messages.filter(message => {
      // Recherche textuelle
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const matchesSearch =
          message.nom.toLowerCase().includes(searchLower) ||
          message.email.toLowerCase().includes(searchLower) ||
          message.sujet.toLowerCase().includes(searchLower) ||
          message.message.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      // Filtre par statut
      if (filters.statut && filters.statut !== 'all' && message.statut !== filters.statut) {
        return false
      }

      // Filtre par type
      if (filters.type && filters.type !== 'all' && message.type !== filters.type) {
        return false
      }

      // Filtre par priorité
      if (filters.priorite && filters.priorite !== 'all' && message.priorite !== filters.priorite) {
        return false
      }

      // Filtre par date
      if (filters.dateFrom && message.dateReception < filters.dateFrom) {
        return false
      }

      if (filters.dateTo && message.dateReception > filters.dateTo) {
        return false
      }

      return true
    })
  }

  /**
   * Trie les messages selon différents critères
   */
  static sortMessages(
    messages: ContactMessage[],
    sortBy: 'date' | 'priorite' | 'statut' | 'nom',
    direction: 'asc' | 'desc' = 'desc'
  ): ContactMessage[] {
    return [...messages].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'date':
          comparison = a.dateReception.getTime() - b.dateReception.getTime()
          break
        case 'priorite':
          const prioriteOrder = { urgente: 4, haute: 3, normale: 2, basse: 1 }
          comparison = prioriteOrder[a.priorite] - prioriteOrder[b.priorite]
          break
        case 'statut':
          const statutOrder = { nouveau: 1, en_cours: 2, traite: 3, ferme: 4 }
          comparison = statutOrder[a.statut] - statutOrder[b.statut]
          break
        case 'nom':
          comparison = a.nom.localeCompare(b.nom)
          break
      }

      return direction === 'asc' ? comparison : -comparison
    })
  }

  /**
   * Calcule les statistiques des messages
   */
  static calculateMessageStats(messages: ContactMessage[]) {
    const total = messages.length
    const byStatut = messages.reduce(
      (acc, message) => {
        acc[message.statut] = (acc[message.statut] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const byType = messages.reduce(
      (acc, message) => {
        acc[message.type] = (acc[message.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const byPriorite = messages.reduce(
      (acc, message) => {
        acc[message.priorite] = (acc[message.priorite] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const nonTraites = messages.filter(
      m => m.statut === 'nouveau' || m.statut === 'en_cours'
    ).length
    const enRetard = messages.filter(m => {
      const daysSinceReception = Math.floor(
        (Date.now() - m.dateReception.getTime()) / (1000 * 60 * 60 * 24)
      )
      return (m.statut === 'nouveau' || m.statut === 'en_cours') && daysSinceReception > 3
    }).length

    return {
      total,
      byStatut,
      byType,
      byPriorite,
      nonTraites,
      enRetard,
      tauxReponse: total > 0 ? Math.round(((total - nonTraites) / total) * 100) : 0,
    }
  }

  /**
   * Détermine la priorité d'un message basée sur son contenu
   */
  static determinePriority(message: Partial<ContactMessage>): ContactMessage['priorite'] {
    const urgentKeywords = ['urgent', 'urgence', 'immédiat', 'asap', 'rapidement']
    const highKeywords = ['important', 'problème', 'erreur', 'bug', 'dysfonctionnement']

    const content = `${message.sujet} ${message.message}`.toLowerCase()

    if (urgentKeywords.some(keyword => content.includes(keyword))) {
      return 'urgente'
    }

    if (highKeywords.some(keyword => content.includes(keyword))) {
      return 'haute'
    }

    if (message.type === 'reclamation') {
      return 'haute'
    }

    return 'normale'
  }

  /**
   * Génère une réponse automatique basée sur le type de message
   */
  static generateAutoResponse(message: ContactMessage): string {
    const responses = {
      question: `Bonjour ${message.nom},\n\nMerci pour votre question concernant "${message.sujet}".\n\nNotre équipe va examiner votre demande et vous répondre dans les plus brefs délais.\n\nCordialement,\nL'équipe GestionMax`,

      formation: `Bonjour ${message.nom},\n\nMerci pour votre intérêt pour nos formations.\n\nNous avons bien reçu votre demande concernant "${message.sujet}" et nous vous contacterons prochainement pour discuter de vos besoins.\n\nCordialement,\nL'équipe Formation GestionMax`,

      devis: `Bonjour ${message.nom},\n\nMerci pour votre demande de devis.\n\nNous avons bien pris en compte votre demande et nous vous enverrons un devis personnalisé sous 24-48h.\n\nCordialement,\nL'équipe Commerciale GestionMax`,

      reclamation: `Bonjour ${message.nom},\n\nNous avons bien reçu votre réclamation concernant "${message.sujet}".\n\nNous nous excusons pour la gêne occasionnée et nous allons traiter votre demande en priorité.\n\nUn responsable vous contactera dans les plus brefs délais.\n\nCordialement,\nL'équipe Service Client GestionMax`,
    }

    return responses[message.type] || responses.question
  }

  /**
   * Vérifie si un message nécessite une réponse urgente
   */
  static isUrgent(message: ContactMessage): boolean {
    const daysSinceReception = Math.floor(
      (Date.now() - message.dateReception.getTime()) / (1000 * 60 * 60 * 24)
    )

    return (
      message.priorite === 'urgente' ||
      (message.priorite === 'haute' && daysSinceReception > 1) ||
      (message.statut === 'nouveau' && daysSinceReception > 3)
    )
  }

  /**
   * Calcule le temps de réponse moyen
   */
  static calculateAverageResponseTime(messages: ContactMessage[]): number {
    const messagesWithResponse = messages.filter(m => m.dateReponse)

    if (messagesWithResponse.length === 0) return 0

    const totalResponseTime = messagesWithResponse.reduce((total, message) => {
      const responseTime = message.dateReponse!.getTime() - message.dateReception.getTime()
      return total + responseTime
    }, 0)

    return Math.round(totalResponseTime / messagesWithResponse.length / (1000 * 60 * 60)) // en heures
  }

  /**
   * Exporte les messages en format CSV
   */
  static exportMessagesToCSV(messages: ContactMessage[]): string {
    const headers = [
      'ID',
      'Nom',
      'Email',
      'Téléphone',
      'Type',
      'Sujet',
      'Message',
      'Statut',
      'Priorité',
      'Date de réception',
      'Date de réponse',
      'Réponse',
    ]

    const rows = messages.map(message => [
      message.id,
      message.nom,
      message.email,
      message.telephone || '',
      message.type,
      message.sujet,
      message.message.replace(/\n/g, ' '),
      message.statut,
      message.priorite,
      message.dateReception.toISOString(),
      message.dateReponse?.toISOString() || '',
      message.reponse?.replace(/\n/g, ' ') || '',
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    return csvContent
  }

  /**
   * Marque un message comme traité
   */
  static markAsProcessed(message: ContactMessage, response?: string): ContactMessage {
    return {
      ...message,
      statut: 'traite',
      dateReponse: new Date(),
      reponse: response || message.reponse,
    }
  }

  /**
   * Archive un message
   */
  static archiveMessage(message: ContactMessage): ContactMessage {
    return {
      ...message,
      statut: 'ferme',
    }
  }
}
