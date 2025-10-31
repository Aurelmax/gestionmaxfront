import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from '@/components/ui/Toaster'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'GestionMax Formation WordPress | Formateur Certifié Qualiopi Antibes',
    template: '%s | GestionMax Formation',
  },
  description:
    'Formations WordPress professionnelles à Antibes par formateur certifié Qualiopi. Éligibles CPF, OPCO et FAF. Plus de 500 apprenants formés, 95% de taux de réussite. Devis gratuit.',
  keywords: [
    'formation WordPress',
    'formation WordPress Antibes',
    'formateur WordPress certifié',
    'formation Qualiopi',
    'formation CPF WordPress',
    'formation OPCO WordPress',
    'cours WordPress professionnel',
    'apprendre WordPress Antibes',
  ],
  authors: [{ name: 'Aurélien LAVAYSSIERE - GestionMax' }],
  creator: 'GestionMax Formation',
  publisher: 'GestionMax Formation',
  metadataBase: new URL(process.env['NEXT_PUBLIC_BASE_URL'] || 'https://gestionmax.fr'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    title: 'GestionMax Formation WordPress | Formateur Certifié Qualiopi Antibes',
    description:
      'Formations WordPress professionnelles à Antibes par formateur certifié Qualiopi. Éligibles CPF, OPCO et FAF. Plus de 500 apprenants formés.',
    siteName: 'GestionMax Formation',
    images: [
      {
        url: '/formation-wordpress-antibes.webp',
        width: 1200,
        height: 630,
        alt: 'GestionMax Formation WordPress Antibes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GestionMax Formation WordPress | Formateur Certifié Qualiopi Antibes',
    description:
      'Formations WordPress professionnelles à Antibes. Certifié Qualiopi, éligibles CPF/OPCO. 500+ apprenants formés.',
    images: ['/formation-wordpress-antibes.webp'],
    creator: '@gestionmax',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'votre-code-google-search-console',
  },
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const plausibleDomain = process.env['NEXT_PUBLIC_PLAUSIBLE_DOMAIN'] || 'gestionmax.fr'

  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/pa-foXNNP06JJpbUKtH5aIuV.js"
          strategy="beforeInteractive"
        />
        <Script id="plausible-init" strategy="beforeInteractive">
          {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
        </Script>
        <Toaster />
        {children}
      </body>
    </html>
  )
}
