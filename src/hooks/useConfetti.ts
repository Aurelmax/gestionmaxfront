/**
 * Hook React pour afficher des confettis
 *
 * Utilise canvas-confetti pour créer des animations de confettis
 * lors de la soumission réussie de formulaires.
 *
 * @example
 * ```tsx
 * const { triggerConfetti, triggerFireworks } = useConfetti()
 *
 * const handleSubmit = async () => {
 *   await submitForm()
 *   triggerConfetti() // Confettis basiques
 * }
 * ```
 */

import { useCallback } from 'react'
import confetti from 'canvas-confetti'

export type ConfettiOptions = {
  particleCount?: number
  spread?: number
  origin?: { x: number; y: number }
  colors?: string[]
  gravity?: number
  scalar?: number
  drift?: number
}

export function useConfetti() {
  /**
   * Déclenche une explosion de confettis basique
   */
  const triggerConfetti = useCallback((options?: ConfettiOptions) => {
    const defaults: ConfettiOptions = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6, x: 0.5 },
    }

    confetti({
      ...defaults,
      ...options,
    })
  }, [])

  /**
   * Déclenche des confettis depuis le côté gauche
   */
  const triggerLeftConfetti = useCallback(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
    })
  }, [])

  /**
   * Déclenche des confettis depuis le côté droit
   */
  const triggerRightConfetti = useCallback(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
    })
  }, [])

  /**
   * Déclenche un effet de feux d'artifice
   */
  const triggerFireworks = useCallback(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Confettis depuis la gauche
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })

      // Confettis depuis la droite
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }, [])

  /**
   * Déclenche un effet de pluie de confettis
   */
  const triggerRain = useCallback(() => {
    const duration = 2000
    const animationEnd = Date.now() + duration

    const interval: NodeJS.Timeout = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      confetti({
        particleCount: 3,
        startVelocity: 0,
        ticks: 200,
        origin: {
          x: Math.random(),
          y: 0,
        },
        colors: ['#00b894', '#0984e3', '#6c5ce7', '#fdcb6e', '#e17055'],
        shapes: ['circle'],
        gravity: 0.6,
        scalar: 1.2,
        drift: 0.5,
      })
    }, 100)
  }, [])

  /**
   * Déclenche un effet de célébration complète (gauche + droite)
   */
  const triggerCelebration = useCallback(() => {
    // Première vague
    triggerLeftConfetti()
    triggerRightConfetti()

    // Deuxième vague après 300ms
    setTimeout(() => {
      triggerLeftConfetti()
      triggerRightConfetti()
    }, 300)

    // Troisième vague après 600ms
    setTimeout(() => {
      triggerConfetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.5, x: 0.5 },
      })
    }, 600)
  }, [triggerLeftConfetti, triggerRightConfetti, triggerConfetti])

  /**
   * Déclenche des confettis avec les couleurs de l'entreprise
   */
  const triggerBrandedConfetti = useCallback(() => {
    const colors = ['#00b894', '#0984e3', '#6c5ce7'] // Couleurs de votre marque

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6, x: 0.5 },
      colors,
    })
  }, [])

  /**
   * Nettoie tous les confettis de l'écran
   */
  const clearConfetti = useCallback(() => {
    confetti.reset()
  }, [])

  return {
    triggerConfetti,
    triggerLeftConfetti,
    triggerRightConfetti,
    triggerFireworks,
    triggerRain,
    triggerCelebration,
    triggerBrandedConfetti,
    clearConfetti,
  }
}
