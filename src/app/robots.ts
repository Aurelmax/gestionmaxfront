import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env['NEXT_PUBLIC_BASE_URL'] || 'https://gestionmax.fr'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/cms/',
          '/_next/',
          '/diagnostic/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
