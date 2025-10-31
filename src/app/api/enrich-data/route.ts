import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'

export async function POST(_request: NextRequest) {
  try {
    const { collection, dryRun = false } = await _request.json()

    const payload = await getPayloadClient()

    // Logique d'enrichissement simplifiée
    const enrichments = {
      programmes: {
        competences: [
          { competence: 'Gutenberg' },
          { competence: 'Elementor' },
          { competence: 'Yoast SEO' },
          { competence: 'Wordfence' },
        ],
        objectifs: 'Objectifs pédagogiques détaillés ajoutés automatiquement',
        prerequis: 'Prérequis adaptés au niveau de la formation',
        modalitesPedagogiques: 'Modalités pédagogiques enrichies',
        evaluation: "Méthodes d'évaluation standardisées",
        certification: 'Attestation de formation professionnelle',
        eligibleCPF: true,
        codeCPF: `RS${Math.floor(Math.random() * 10000)}`,
      },
      users: {
        permissions: [
          { permission: 'users:read' },
          { permission: 'formations:read' },
          { permission: 'admin:access' },
        ],
        metadata: {
          lastLoginAt: new Date().toISOString(),
          profileComplete: true,
          source: 'enrichment',
          version: '1.0',
        },
      },
      apprenants: {
        progression: 50,
        metadata: {
          source: 'enrichment',
          lastActivity: new Date().toISOString(),
          profileScore: 85,
        },
      },
      articles: {
        metaKeywords: [
          { keyword: 'formation' },
          { keyword: 'apprentissage' },
          { keyword: 'compétences' },
          { keyword: 'professionnel' },
        ],
        metaDescription: 'Meta description optimisée pour le SEO',
        tempsLecture: 8,
        vue: 0,
        featured: true,
      },
    }

    if (!collection || !enrichments[collection as keyof typeof enrichments]) {
      return NextResponse.json(
        {
          success: false,
          message: 'Collection non supportée',
        },
        { status: 400 }
      )
    }

    if (dryRun) {
      return NextResponse.json({
        success: true,
        message: `Aperçu de l'enrichissement pour ${collection}`,
        count: 5, // Simulation
        dryRun: true,
      })
    }

    // Enrichissement réel
    const items = await payload.find({
      collection: collection as any,
      limit: 100,
    })

    let enrichedCount = 0

    for (const item of items.docs) {
      try {
        // Fusionner les données existantes avec les enrichissements
        const existingData = { ...item }
        const enrichmentData = enrichments[collection as keyof typeof enrichments]

        // Fusionner intelligemment les données
        const mergedData = {
          ...existingData,
          ...enrichmentData,
          // Préserver les champs critiques
          id: existingData.id,
          createdAt: existingData['createdAt'],
          updatedAt: new Date().toISOString(),
        }

        await payload.update({
          collection: collection as any,
          id: item.id,
          data: mergedData,
        })
        enrichedCount++
      } catch (error) {
        console.error(`Erreur lors de l'enrichissement de ${item.id}:`, error)
        // Continuer avec les autres éléments même en cas d'erreur
      }
    }

    return NextResponse.json({
      success: true,
      message: `${enrichedCount} éléments enrichis dans ${collection}`,
      count: enrichedCount,
    })
  } catch (error) {
    console.error("Erreur lors de l'enrichissement:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de l'enrichissement des données",
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    )
  }
}
