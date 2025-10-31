import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { cookies } from 'next/headers'

// GET /api/auth/me - Récupérer l'utilisateur connecté via Payload
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const cookieStore = await cookies()

    // Récupérer le token JWT du cookie Payload
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier le token et récupérer l'utilisateur
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Session invalide' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user['name'],
        role: user['role'],
        status: user['status'],
      },
    })
  } catch (error: any) {
    console.error('Erreur GET /api/auth/me:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
