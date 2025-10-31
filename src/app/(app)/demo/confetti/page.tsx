/**
 * Page de démonstration des confettis
 *
 * Accessible via: /demo/confetti
 *
 * Cette page permet de tester tous les effets de confettis disponibles
 * avant de les intégrer dans les formulaires de production.
 */

import { ConfettiDemo } from '@/components/demo/ConfettiDemo'

export const metadata = {
  title: 'Démo Confettis | GestionMax Formation',
  description: 'Démonstration des effets de confettis pour les formulaires',
}

export default function ConfettiDemoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <ConfettiDemo />
    </div>
  )
}
