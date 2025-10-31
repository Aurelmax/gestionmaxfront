import { NextResponse } from 'next/server'
import { ApiRouteService } from '@/lib/api-route-service'

export async function GET() {
  try {
    const apprenants = await ApiRouteService.getApprenants()

    return NextResponse.json({
      success: true,
      data: apprenants,
    })
  } catch (error) {
    console.error('Erreur API apprenants:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des apprenants' },
      { status: 500 }
    )
  }
}
