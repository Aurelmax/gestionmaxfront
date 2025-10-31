import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'

// GET /api/server-users - Récupérer tous les utilisateurs via Payload Local API
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()

    // Vérifier l'authentification
    const { user: currentUser } = await payload.auth({ headers: request.headers })

    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer les paramètres de query
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '1000')
    const page = parseInt(searchParams.get('page') || '1')

    // Récupérer les utilisateurs via Payload Local API
    const result = await payload.find({
      collection: 'users',
      limit,
      page,
    })

    return NextResponse.json({
      success: true,
      docs: result.docs,
      totalDocs: result.totalDocs,
      limit: result.limit,
      totalPages: result.totalPages,
      page: result.page,
      pagingCounter: result.pagingCounter,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
    })
  } catch (error: any) {
    console.error('Erreur GET /api/server-users:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/server-users - Créer un utilisateur via Payload Local API
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient()

    // Vérifier l'authentification
    const { user: currentUser } = await payload.auth({ headers: request.headers })

    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()

    // Créer l'utilisateur via Payload Local API
    const user = await payload.create({
      collection: 'users',
      data: body,
    })

    return NextResponse.json({
      success: true,
      doc: user,
    })
  } catch (error: any) {
    console.error('Erreur POST /api/server-users:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}
