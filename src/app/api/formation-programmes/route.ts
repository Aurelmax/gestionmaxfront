import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'

export async function GET() {
  try {
    const payload = await getPayloadClient()

    const formations = await payload.find({
      collection: 'formations_personnalisees',
      limit: 100,
      sort: '-createdAt',
    })

    return NextResponse.json({
      success: true,
      data: formations.docs,
    })
  } catch (error) {
    console.error('Erreur API formation-programmes:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des programmes de formation' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = await getPayloadClient()

    // Vérifier si le code formation existe déjà
    const existingFormations = await payload.find({
      collection: 'formations_personnalisees',
      where: {
        codeFormation: {
          equals: body.codeFormation,
        },
      },
    })

    if (existingFormations.docs.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Une formation avec ce code formation existe déjà' },
        { status: 400 }
      )
    }

    // Créer la nouvelle formation via Payload
    const newFormation = await payload.create({
      collection: 'formations_personnalisees',
      data: body,
    })

    return NextResponse.json(
      {
        success: true,
        data: newFormation,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de la création de la formation:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la formation' },
      { status: 500 }
    )
  }
}
