import { NextResponse } from 'next/server'
import { ApiRouteService } from '@/lib/api-route-service'

export async function GET() {
  try {
    const tags = await ApiRouteService.getTags()

    return NextResponse.json({
      success: true,
      data: tags,
    })
  } catch (error) {
    console.error('Erreur API tags:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des tags' },
      { status: 500 }
    )
  }
}
