'use client'

import { PublicLayout } from '@/components/layouts/public/PublicLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, FileText, Shield, Award, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function InformationsLegalesPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Informations légales</h1>
            <p className="text-lg text-gray-600">
              GestionMax Formation - Prestataire de formation professionnelle
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#1f3b8e] flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                Identification de l'entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-[#1f3b8e] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Raison sociale</p>
                      <p className="text-gray-600">GestionMax</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-[#1f3b8e] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Statut juridique</p>
                      <p className="text-gray-600">Entreprise individuelle</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[#1f3b8e] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">SIRET</p>
                      <p className="text-gray-600 font-mono">483 797 213 00061</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-[#1f3b8e] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">N° déclaration d'activité</p>
                      <p className="text-gray-600 font-mono">93 06 107 8906</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Award className="h-4 w-4 mr-1" />
                      Certifié Qualiopi
                    </Badge>
                    <div>
                      <p className="font-semibold text-gray-900">Certification Qualiopi</p>
                      <p className="text-gray-600 font-mono">QUA230C60046</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-1" />
                  <div>
                    <p className="text-sm text-amber-800">
                      <strong>Important :</strong> Cet enregistrement ne vaut pas agrément de l'État
                      (Article L.6352-12 du Code du travail)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#1f3b8e] flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Coordonnées de contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Adresse</h3>
                  <p className="text-gray-600">
                    300 chemin de la suquette
                    <br />
                    06600 Antibes
                    <br />
                    France
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
                  <p className="text-gray-600">
                    <strong>Téléphone :</strong> 06 46 02 24 68
                    <br />
                    <strong>Email :</strong> aurelien@gestionmax.fr
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#1f3b8e] flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Mentions légales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-600">
              <p>
                <strong>Directeur de publication :</strong> Aurélien LAVAYSSIERE
                <br />
                <strong>Hébergement :</strong> Vercel Inc.
                <br />
                <strong>Conception :</strong> GestionMax Formation
              </p>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Propriété intellectuelle</h4>
                <p>
                  L'ensemble de ce site relève de la législation française et internationale sur le
                  droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction
                  sont réservés, y compris pour les documents téléchargeables et les représentations
                  iconographiques et photographiques.
                </p>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Protection des données personnelles
                </h4>
                <p>
                  Les informations collectées font l'objet d'un traitement informatique destiné à la
                  gestion des formations. Conformément à la loi &quot;informatique et
                  libertés&quot;, vous bénéficiez d'un droit d'accès et de rectification aux
                  informations qui vous concernent.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  )
}
