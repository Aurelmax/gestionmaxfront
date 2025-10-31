import { NextRequest, NextResponse } from 'next/server'
import { ApiRouteService } from '@/lib/api-route-service'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Récupérer l'article par son slug
    const article = await ApiRouteService.getArticleBySlug(slug)

    if (!article) {
      return NextResponse.json({ success: false, error: 'Article non trouvé' }, { status: 404 })
    }

    // Vérifier que l'article est publié (sécurité)
    if (article.statut !== 'publie') {
      return NextResponse.json({ success: false, error: 'Article non disponible' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: article,
    })
  } catch (error) {
    console.error('Erreur API article:', error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération de l'article" },
      { status: 500 }
    )
  }
}
