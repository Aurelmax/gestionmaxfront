import {
  MOCK_USERS,
  MOCK_PROGRAMMES,
  MOCK_APPRENANTS,
  MOCK_RENDEZ_VOUS,
  MOCK_STATS,
} from '@/data/mock-data'
import type { Programme, Apprenant, RendezVous, User } from '@/types/common'

// Simule un délai réseau
const delay = (ms: number = 500): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export class MockService {
  // Programmes
  static async getProgrammes(): Promise<Programme[]> {
    await delay()
    return MOCK_PROGRAMMES
  }

  static async getProgramme(id: string): Promise<Programme | null> {
    await delay()
    return MOCK_PROGRAMMES.find(p => p.id === id) || null
  }

  // Apprenants
  static async getApprenants(): Promise<Apprenant[]> {
    await delay()
    return MOCK_APPRENANTS
  }

  static async getApprenant(id: string): Promise<Apprenant | null> {
    await delay()
    return MOCK_APPRENANTS.find(a => a.id === id) || null
  }

  // Rendez-vous
  static async getRendezVous(): Promise<RendezVous[]> {
    await delay()
    return MOCK_RENDEZ_VOUS
  }

  // Stats
  static async getStats(): Promise<typeof MOCK_STATS> {
    await delay()
    return MOCK_STATS
  }

  // Users
  static async getUsers(): Promise<User[]> {
    await delay()
    return MOCK_USERS
  }

  static async getCurrentUser(): Promise<User> {
    await delay()
    return MOCK_USERS[0]! // Admin par défaut
  }

  static async createUser(userData: any): Promise<User> {
    await delay()
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: userData.email,
      nom: userData.nom || userData.name || '',
      prenom: userData.prenom || userData.firstName || '',
      role: userData.role || 'BENEFICIAIRE',
      avatar: userData.avatar,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    MOCK_USERS.push(newUser)
    return newUser
  }

  static async updateUser(userId: string, userData: any): Promise<User> {
    await delay()
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId)
    if (userIndex === -1) {
      throw new Error('Utilisateur non trouvé')
    }

    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex]!,
      ...userData,
      updatedAt: new Date(),
    }

    return MOCK_USERS[userIndex]!
  }

  static async deleteUser(userId: string): Promise<void> {
    await delay()
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId)
    if (userIndex === -1) {
      throw new Error('Utilisateur non trouvé')
    }
    MOCK_USERS.splice(userIndex, 1)
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    await delay()
    return MOCK_USERS.find(u => u.email === email) || null
  }

  static async changePassword(userId: string, _passwordData: any): Promise<void> {
    await delay()
    const user = MOCK_USERS.find(u => u.id === userId)
    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }
    // En mode mock, on simule juste le succès
    console.log(`Mot de passe changé pour ${user.email}`)
  }
}
