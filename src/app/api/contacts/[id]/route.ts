import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'

/**
 * GET /api/contacts/[id]
 * Récupère un contact spécifique par son ID
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getPayloadClient()

    const contact = await payload.findByID({
      collection: 'contacts',
      id,
    })

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contact non trouvé',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: contact,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération du contact',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/contacts/[id]
 * Met à jour un contact existant
 */
export async function PUT(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getPayloadClient()
    const body = await _request.json()

    // Vérifier si le contact existe
    const existingContact = await payload.findByID({
      collection: 'contacts',
      id,
    })

    if (!existingContact) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contact non trouvé',
        },
        { status: 404 }
      )
    }

    // Valider l'email si fourni
    if (body.email) {
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
    }

    // Mettre à jour le contact
    const updatedContact = await payload.update({
      collection: 'contacts',
      id,
      data: {
        ...body,
        // Ajouter la date de réponse si le statut passe à "traite" et qu'une réponse est fournie
        ...(body.statut === 'traite' && body.reponse && !existingContact['dateReponse']
          ? { dateReponse: new Date().toISOString() }
          : {}),
      },
    })

    // TODO: Si une réponse est ajoutée, envoyer un email au client

    return NextResponse.json({
      success: true,
      data: updatedContact,
      message: 'Contact mis à jour avec succès',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la mise à jour du contact',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/contacts/[id]
 * Supprime un contact
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayloadClient()

    // Vérifier si le contact existe
    const existingContact = await payload.findByID({
      collection: 'contacts',
      id,
    })

    if (!existingContact) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contact non trouvé',
        },
        { status: 404 }
      )
    }

    // Supprimer le contact
    await payload.delete({
      collection: 'contacts',
      id,
    })

    return NextResponse.json({
      success: true,
      message: 'Contact supprimé avec succès',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la suppression du contact',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
