'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { Star, Calendar } from 'lucide-react'
import { PublicRendezVousModal } from '@/components/forms/PublicRendezVousModal'

interface FormationCardProps {
  programme: {
    id: string | number
    codeFormation?: string
    titre: string
    description: string
    duree: number
    niveau: string
    prix: number
    modalites: string
    competences: string[]
    rating?: number
    students?: number
  }
  showDetails?: boolean
}

export function FormationCard({ programme, showDetails = true }: FormationCardProps) {
  return (
    <Card className="hover:shadow-xl transition flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <div className="flex justify-between items-start mb-2">
          <Badge className="bg-[#1f3b8e] text-white">{programme.modalites}</Badge>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-gray-300 text-gray-600">
              {programme.niveau}
            </Badge>
            {programme.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{programme.rating}</span>
              </div>
            )}
          </div>
        </div>
        <CardTitle className="text-xl">{programme.titre}</CardTitle>
        {programme.codeFormation && (
          <div className="text-sm text-[#1f3b8e] font-medium">Code: {programme.codeFormation}</div>
        )}
      </CardHeader>

      <CardContent className="flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-sm text-muted-foreground mb-4">{programme.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {programme.competences.slice(0, 4).map((comp: string, index: number) => {
              const colors = [
                'bg-blue-100 text-blue-800 border-blue-200',
                'bg-green-100 text-green-800 border-green-200',
                'bg-purple-100 text-purple-800 border-purple-200',
                'bg-orange-100 text-orange-800 border-orange-200',
                'bg-pink-100 text-pink-800 border-pink-200',
                'bg-cyan-100 text-cyan-800 border-cyan-200',
                'bg-yellow-100 text-yellow-800 border-yellow-200',
                'bg-indigo-100 text-indigo-800 border-indigo-200',
              ]
              const colorClass = colors[index % colors.length]

              return (
                <Badge
                  key={`${comp}-${index}`}
                  variant="outline"
                  className={`text-xs border ${colorClass}`}
                >
                  {comp}
                </Badge>
              )
            })}
          </div>
        </div>

        <div className="pt-4 border-t space-y-2 mt-auto">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Durée</span>
            <span className="font-semibold">{programme.duree}h</span>
          </div>
          {programme.students && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Apprenants</span>
              <span className="font-semibold">{programme.students}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tarif</span>
            <span className="font-semibold text-[#1f3b8e]">{formatCurrency(programme.prix)}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-4 mt-4">
          <PublicRendezVousModal
            programmeId={programme.id.toString()}
            programmeTitre={programme.titre}
            trigger={
              <Button className="flex-1 bg-[#1f3b8e] hover:bg-[#7eb33f] text-white">
                <Calendar className="h-4 w-4 mr-2" />
                RDV de Positionnement
              </Button>
            }
          />
          {showDetails && (
            <Button
              variant="outline"
              className="border-[#1f3b8e] text-[#1f3b8e] hover:bg-[#7eb33f] hover:text-white"
              asChild
            >
              <Link href={`/catalogue/${programme.id}`}>Détails</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
