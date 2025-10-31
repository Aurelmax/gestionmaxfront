import { NextRequest, NextResponse } from 'next/server'
import { Where } from 'payload'
import { getPayloadClient } from '@/lib/getPayloadClient'

/**
 * GET /api/contacts
 * Liste tous les contacts
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()

    // Récupérer les paramètres de requête
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const statut = searchParams.get('statut')
    const type = searchParams.get('type')
    const priorite = searchParams.get('priorite')
    const search = searchParams.get('search')

    // Construire la requête avec filtres
    const where: Where = {}

    if (statut) {
      where['statut'] = { equals: statut }
    }

    if (type) {
      where['type'] = { equals: type }
    }

    if (priorite) {
      where['priorite'] = { equals: priorite }
    }

    if (search) {
      where['or'] = [
        { nom: { contains: search } },
        { email: { contains: search } },
        { sujet: { contains: search } },
      ]
    }

    // Récupérer les contacts depuis Payload
    const result = await payload.find({
      collection: 'contacts',
      where,
      page,
      limit,
      sort: '-createdAt',
    })

    return NextResponse.json({
      success: true,
      data: result.docs,
      pagination: {
        page: result.page,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des contacts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/contacts
 * Crée un nouveau contact
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const body = await request.json()

    // Validation basique
    if (!body.nom || !body.email || !body['type'] || !body.sujet || !body.message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Champs requis manquants',
          required: ['nom', 'email', 'type', 'sujet', 'message'],
        },
        { status: 400 }
      )
    }

    // Valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Format d'email invalide",
        },
        { status: 400 }
      )
    }

    // Créer le contact avec statut par défaut
    const contact = await payload.create({
      collection: 'contacts',
      data: {
        nom: body.nom,
        email: body.email,
        telephone: body.telephone || '',
        type: body['type'],
        sujet: body.sujet,
        message: body.message,
        statut: body['statut'] || 'nouveau',
        priorite: body['priorite'] || 'normale',
      },
    })

    // TODO: Envoyer un email de notification à l'admin
    // TODO: Envoyer un email de confirmation au client

    return NextResponse.json(
      {
        success: true,
        data: contact,
        message: 'Contact créé avec succès',
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la création du contact',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
