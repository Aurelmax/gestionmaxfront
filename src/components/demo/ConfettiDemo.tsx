/**
 * Composant de démonstration pour tester les différents effets de confettis
 *
 * Usage: Ajoutez ce composant à n'importe quelle page pour tester les confettis
 *
 * @example
 * ```tsx
 * import { ConfettiDemo } from '@/components/demo/ConfettiDemo'
 *
 * export default function Page() {
 *   return <ConfettiDemo />
 * }
 * ```
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useConfetti } from '@/hooks/useConfetti'
import { Sparkles, PartyPopper, Flame, CloudRain, Star, Heart, Trash2 } from 'lucide-react'

export function ConfettiDemo() {
  const {
    triggerConfetti,
    triggerLeftConfetti,
    triggerRightConfetti,
    triggerFireworks,
    triggerRain,
    triggerCelebration,
    triggerBrandedConfetti,
    clearConfetti,
  } = useConfetti()

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          🎉 Démonstration Confettis
        </CardTitle>
        <CardDescription>
          Testez tous les effets de confettis disponibles dans l'application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section: Confettis Basiques */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Confettis Basiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={() => triggerConfetti()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Confettis Standard
            </Button>

            <Button
              onClick={triggerLeftConfetti}
              variant="outline"
              className="flex items-center gap-2"
            >
              ← Gauche
            </Button>

            <Button
              onClick={triggerRightConfetti}
              variant="outline"
              className="flex items-center gap-2"
            >
              Droite →
            </Button>
          </div>
        </div>

        {/* Section: Effets Spéciaux */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Effets Spéciaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={triggerFireworks}
              variant="default"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Flame className="h-4 w-4" />
              Feux d'Artifice (3s)
            </Button>

            <Button
              onClick={triggerRain}
              variant="default"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <CloudRain className="h-4 w-4" />
              Pluie de Confettis (2s)
            </Button>

            <Button
              onClick={triggerCelebration}
              variant="default"
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <PartyPopper className="h-4 w-4" />
              Célébration Complète
            </Button>

            <Button
              onClick={triggerBrandedConfetti}
              variant="default"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Star className="h-4 w-4" />
              Confettis Branded
            </Button>
          </div>
        </div>

        {/* Section: Personnalisé */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Confettis Personnalisés</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={() =>
                triggerConfetti({
                  particleCount: 200,
                  spread: 120,
                  colors: ['#ff0000', '#00ff00', '#0000ff'],
                })
              }
              variant="outline"
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4 text-red-500" />
              Extra Colorés
            </Button>

            <Button
              onClick={() =>
                triggerConfetti({
                  particleCount: 50,
                  spread: 30,
                  origin: { x: 0.5, y: 0.3 },
                  scalar: 2,
                })
              }
              variant="outline"
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4 text-yellow-500" />
              Grandes Étoiles
            </Button>

            <Button
              onClick={() =>
                triggerConfetti({
                  particleCount: 100,
                  spread: 180,
                  gravity: 0.3,
                  drift: 1,
                })
              }
              variant="outline"
              className="flex items-center gap-2"
            >
              <CloudRain className="h-4 w-4 text-blue-500" />
              Flottants
            </Button>
          </div>
        </div>

        {/* Section: Contrôles */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-lg font-semibold">Contrôles</h3>
          <Button onClick={clearConfetti} variant="destructive" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Nettoyer les Confettis
          </Button>
        </div>

        {/* Section: Documentation */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <h4 className="font-semibold">💡 Utilisation dans les formulaires</h4>
          <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
            {`import { useConfetti } from '@/hooks/useConfetti'

const { triggerCelebration } = useConfetti()

const handleSubmit = async () => {
  const response = await submitForm()
  if (response.success) {
    triggerCelebration() // 🎉
    toast.success('Succès!')
  }
}`}
          </pre>
        </div>

        {/* Section: Recommandations */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">📋 Recommandations d'usage:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>
              <strong>Formulaire public</strong>: <code>triggerCelebration()</code> - Effet complet
              pour féliciter l'utilisateur
            </li>
            <li>
              <strong>Formulaire admin</strong>: <code>triggerBrandedConfetti()</code> - Plus subtil
              avec vos couleurs
            </li>
            <li>
              <strong>Succès important</strong>: <code>triggerFireworks()</code> - Pour les moments
              exceptionnels
            </li>
            <li>
              <strong>Action rapide</strong>: <code>triggerConfetti()</code> - Effet standard
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
