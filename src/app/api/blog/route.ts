import { NextRequest, NextResponse } from 'next/server'
import { ApiRouteService } from '@/lib/api-route-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Récupérer les paramètres de filtrage
    const filters = {
      statut: searchParams.get('statut') || 'publie', // Par défaut, seulement les articles publiés
      categorie: searchParams.get('categorie') || undefined,
      tag: searchParams.get('tag') || undefined,
      recherche: searchParams.get('recherche') || undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      limit: parseInt(searchParams.get('limit') || '10'),
      offset: parseInt(searchParams.get('offset') || '0'),
    }

    // Récupérer les articles
    const articles = await ApiRouteService.getArticles(filters)

    // Appliquer la pagination
    const paginatedArticles = articles.slice(filters.offset, filters.offset + filters.limit)

    // Récupérer les statistiques
    const stats = await ApiRouteService.getArticleStats()

    return NextResponse.json({
      success: true,
      data: {
        articles: paginatedArticles,
        total: articles.length,
        stats: {
          total: stats.total,
          publies: stats.publies,
        },
      },
    })
  } catch (error) {
    console.error('Erreur API blog:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des articles' },
      { status: 500 }
    )
  }
}
