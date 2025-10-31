import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getPayloadClient()
    const resolvedParams = await params

    const formation = await payload.findByID({
      collection: 'formations_personnalisees',
      id: resolvedParams.id,
    })

    if (!formation) {
      return NextResponse.json(
        { success: false, error: 'Programme de formation non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: formation,
    })
  } catch (error) {
    console.error('Erreur API formation-programmes/[id]:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du programme de formation' },
      { status: 500 }
    )
  }
}

export async function PUT(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await _request.json()
    const payload = await getPayloadClient()
    const resolvedParams = await params

    // Vérifier si la formation existe
    const existingFormation = await payload.findByID({
      collection: 'formations_personnalisees',
      id: resolvedParams.id,
    })

    if (!existingFormation) {
      return NextResponse.json({ success: false, error: 'Formation non trouvée' }, { status: 404 })
    }

    // Vérifier si le code formation est unique (sauf pour la formation actuelle)
    if (body['codeFormation'] && body['codeFormation'] !== existingFormation['codeFormation']) {
      const duplicateFormations = await payload.find({
        collection: 'formations_personnalisees',
        where: {
          and: [
            {
              codeFormation: {
                equals: body['codeFormation'],
              },
            },
            {
              id: {
                not_equals: resolvedParams.id,
              },
            },
          ],
        },
      })

      if (duplicateFormations.docs.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Une formation avec ce code formation existe déjà' },
          { status: 400 }
        )
      }
    }

    // Mettre à jour la formation via Payload
    const updatedFormation = await payload.update({
      collection: 'formations_personnalisees',
      id: resolvedParams.id,
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: updatedFormation,
    })
  } catch (error) {
    console.error('Erreur lors de la modification de la formation:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la modification de la formation' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getPayloadClient()
    const resolvedParams = await params

    // Vérifier si la formation existe
    const existingFormation = await payload.findByID({
      collection: 'formations_personnalisees',
      id: resolvedParams.id,
    })

    if (!existingFormation) {
      return NextResponse.json({ success: false, error: 'Formation non trouvée' }, { status: 404 })
    }

    // Supprimer la formation via Payload
    await payload.delete({
      collection: 'formations_personnalisees',
      id: resolvedParams.id,
    })

    return NextResponse.json({
      success: true,
      message: 'Formation supprimée avec succès',
    })
  } catch (error) {
    console.error('Erreur lors de la suppression de la formation:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression de la formation' },
      { status: 500 }
    )
  }
}
