import { getPayload as getPayloadInstance } from 'payload'
import config from '@/payload.config'

/**
 * getPayloadClient - Utilitaire pour obtenir une instance Payload CMS
 * avec gestion de cache et reconnexion propre
 *
 * Cette fonction force Payload à se reconnecter proprement à MongoDB
 * en cas de déconnexion ou d'erreur d'authentification.
 */

let cachedPayload: any = null
let isConnecting = false

export async function getPayloadClient() {
  // Si déjà connecté et pas d'erreur, retourner l'instance en cache
  if (cachedPayload && !isConnecting) {
    try {
      // Vérifier si la connexion est toujours active
      const db = cachedPayload.db
      if (db && db.connection && db.connection.readyState === 1) {
        return cachedPayload
      }
    } catch (error) {
      console.warn('⚠️ Connexion Payload existante invalide, reconnexion...')
      cachedPayload = null
    }
  }

  // Éviter les connexions multiples simultanées
  if (isConnecting) {
    // Attendre que la connexion en cours se termine
    let attempts = 0
    while (isConnecting && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }
    if (cachedPayload) {
      return cachedPayload
    }
  }

  try {
    isConnecting = true
    console.log('🔄 Initialisation de Payload CMS...')
    console.log('🔍 MongoDB URI présente:', process.env['MONGODB_URI'] ? '✅ Oui' : '❌ Non')
    console.log('🔍 MongoDB URI length:', process.env['MONGODB_URI']?.length || 0)

    // Obtenir une nouvelle instance Payload
    const payload = await getPayloadInstance({ config })

    // Vérifier que la connexion MongoDB est active
    if (payload.db && payload.db.connection) {
      const connectionState = payload.db.connection.readyState
      const statusMap: Record<number, string> = {
        0: 'Déconnecté',
        1: 'Connecté ✅',
        2: 'Connexion en cours...',
        3: 'Déconnexion en cours...',
      }
      console.log('📊 État de connexion MongoDB:', statusMap[connectionState] || `État ${connectionState}`)

      if (connectionState !== 1) {
        console.warn('⚠️ MongoDB pas complètement connecté')
      }
    }

    cachedPayload = payload
    console.log('✅ Payload CMS initialisé avec succès')

    return payload
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de Payload:', error)
    cachedPayload = null
    throw error
  } finally {
    isConnecting = false
  }
}

/**
 * Réinitialiser le cache Payload (utile pour les tests ou en cas de problème)
 */
export function resetPayloadCache() {
  console.log('🔄 Réinitialisation du cache Payload')
  cachedPayload = null
}

/**
 * Vérifier l'état de la connexion Payload
 */
export function checkPayloadConnection(): {
  cached: boolean
  connected: boolean
  state: number | null
} {
  if (!cachedPayload) {
    return { cached: false, connected: false, state: null }
  }

  const state = cachedPayload.db?.connection?.readyState || null
  return {
    cached: true,
    connected: state === 1,
    state,
  }
}
