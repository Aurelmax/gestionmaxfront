import { NextResponse } from 'next/server'
import { ApiRouteService } from '@/lib/api-route-service'

export async function GET() {
  try {
    const users = await ApiRouteService.getUsers()

    return NextResponse.json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error('Erreur API utilisateurs:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    )
  }
}
