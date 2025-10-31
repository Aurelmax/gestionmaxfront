'use client'

import { PublicLayout } from '@/components/layouts/public/PublicLayout'
import { PublicRendezVousForm } from '@/components/forms/PublicRendezVousForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, CheckCircle } from 'lucide-react'

export default function RendezVousPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* En-tête */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Demande de rendez-vous</h1>
              <p className="text-xl text-gray-600">
                Planifiez un rendez-vous pour discuter de vos besoins en formation
              </p>
            </div>

            {/* Formulaire */}
            <PublicRendezVousForm
              programmeId="1"
              programmeTitre="Formation WordPress Débutant"
              onSuccess={() => {
                console.log('Rendez-vous créé avec succès !')
              }}
            />

            {/* Informations complémentaires */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Disponibilités
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Nous sommes disponibles du lundi au vendredi, de 9h à 18h.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Confirmation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Vous recevrez une confirmation par email dans les 24h.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Flexibilité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Rendez-vous en présentiel, visio ou par téléphone.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
