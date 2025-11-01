'use client'

import Link from 'next/link'

export default function RootNotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1>404 - Page Not Found</h1>
      <p>La page que vous recherchez n'existe pas.</p>
      <Link href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        Retour à l'accueil
      </Link>
    </div>
  )
}
