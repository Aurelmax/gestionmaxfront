import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env['NEXT_PUBLIC_BASE_URL'] || 'https://gestionmax.fr'

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalogue`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/apropos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rendez-vous`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/reglement-interieur`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/informations-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Récupérer les formations dynamiques depuis l'API
  let formationPages: MetadataRoute.Sitemap = []

  try {
    const response = await fetch(`${baseUrl}/api/programmes`, {
      next: { revalidate: 3600 }, // Cache 1 heure
    })

    if (response.ok) {
      const result = await response.json()

      if (result.success && Array.isArray(result.data)) {
        formationPages = result.data.map((programme: { _id: string }) => ({
          url: `${baseUrl}/catalogue/${programme._id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }))
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des formations pour le sitemap:', error)
  }

  // Combiner toutes les pages
  return [...staticPages, ...formationPages]
}
