import { NextResponse } from 'next/server'
import { ApiRouteService } from '@/lib/api-route-service'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const apprenant = await ApiRouteService.getApprenant(id)

    if (!apprenant) {
      return NextResponse.json({ success: false, error: 'Apprenant non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: apprenant,
    })
  } catch (error) {
    console.error('Erreur API apprenant:', error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération de l'apprenant" },
      { status: 500 }
    )
  }
}
