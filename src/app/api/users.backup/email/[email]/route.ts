import { NextResponse } from 'next/server'
import { ApiRouteService } from '@/lib/api-route-service'

export async function GET(_request: Request, { params }: { params: Promise<{ email: string }> }) {
  try {
    const { email } = await params
    const user = await ApiRouteService.getUserByEmail(decodeURIComponent(email))

    if (!user) {
      return NextResponse.json({ success: false, error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Erreur API utilisateur:', error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération de l'utilisateur" },
      { status: 500 }
    )
  }
}
