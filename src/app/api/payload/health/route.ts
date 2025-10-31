import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Vérifier si Payload est configuré
    const payloadConfig = process.env['PAYLOAD_SECRET']
    const mongoUri = process.env['MONGODB_URI']

    if (!payloadConfig || !mongoUri) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Configuration Payload manquante',
          details: {
            hasPayloadSecret: !!payloadConfig,
            hasMongoUri: !!mongoUri,
          },
        },
        { status: 500 }
      )
    }

    // Simuler une vérification de santé
    return NextResponse.json({
      status: 'ok',
      message: 'Payload CMS est configuré',
      timestamp: new Date().toISOString(),
      config: {
        hasPayloadSecret: true,
        hasMongoUri: true,
        collections: ['users', 'formations', 'apprenants', 'media'],
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Erreur lors de la vérification de Payload',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
