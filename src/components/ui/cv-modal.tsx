'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Award, CheckCircle, Mail, Phone, MapPin, Calendar, User, X } from 'lucide-react'

interface CVModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CVModal({ isOpen, onClose }: CVModalProps) {
  const [activeTab, setActiveTab] = useState('cv')

  const cvData = {
    personalInfo: {
      name: 'Aurélien LAVAYSSIERE',
      title: 'Formateur WordPress Certifié Qualiopi',
      email: 'aurelien@gestionmax.fr',
      phone: '06.46.02.24.68',
      location: 'Antibes, France',
      experience: "8+ années d'expérience",
    },
    certifications: [
      {
        name: 'Certification Qualiopi',
        number: 'QUA230C60046',
        date: '2023',
        status: 'Active',
      },
      {
        name: 'Référencement Datadock',
        number: 'Depuis 2020',
        date: '2020',
        status: 'Active',
      },
    ],
    skills: [
      'WordPress Development',
      'WooCommerce',
      'SEO & Référencement',
      'Formation Professionnelle',
      'Gestion de Projet',
      'HTML/CSS',
      'PHP/MySQL',
      'JavaScript',
    ],
    experience: [
      {
        period: '2020 - Présent',
        title: 'Formateur WordPress Indépendant',
        company: 'GestionMax',
        description:
          'Formation professionnelle WordPress, WooCommerce et SEO. Plus de 500 apprenants formés.',
        achievements: [
          'Certification Qualiopi obtenue',
          'Référencement Datadock',
          'Formations éligibles CPF',
        ],
      },
      {
        period: '2016 - 2020',
        title: 'Développeur Web Freelance',
        company: 'Freelance',
        description: 'Développement de sites web WordPress pour PME et startups.',
        achievements: [
          'Plus de 100 sites développés',
          'Spécialisation WooCommerce',
          'Expertise SEO',
        ],
      },
    ],
    education: [
      {
        degree: 'Formation Continue',
        institution: 'Divers organismes',
        year: '2015-2024',
        description: 'Formations continues en développement web, WordPress et pédagogie',
      },
    ],
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-[#1f3b8e]">CV du Formateur</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Navigation des onglets */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('cv')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'cv'
                ? 'border-b-2 border-[#1f3b8e] text-[#1f3b8e]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            CV Complet
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'certifications'
                ? 'border-b-2 border-[#1f3b8e] text-[#1f3b8e]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Certifications
          </button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'cv' && (
          <div className="space-y-6">
            {/* Informations personnelles */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-[#1f3b8e] rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1f3b8e] mb-2">
                      {cvData.personalInfo.name}
                    </h3>
                    <p className="text-lg text-gray-600 mb-4">{cvData.personalInfo.title}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#1f3b8e]" />
                        <span>{cvData.personalInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#1f3b8e]" />
                        <span>{cvData.personalInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#1f3b8e]" />
                        <span>{cvData.personalInfo.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#1f3b8e]" />
                        <span>{cvData.personalInfo.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compétences */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold text-[#1f3b8e] mb-4">Compétences</h4>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-[#7eb33f]/10 text-[#7eb33f] border-[#7eb33f]/20"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expérience */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold text-[#1f3b8e] mb-4">
                  Expérience Professionnelle
                </h4>
                <div className="space-y-6">
                  {cvData.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-[#1f3b8e] pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-[#1f3b8e] text-white">{exp.period}</Badge>
                      </div>
                      <h5 className="text-lg font-semibold text-gray-900">{exp.title}</h5>
                      <p className="text-[#1f3b8e] font-medium">{exp.company}</p>
                      <p className="text-gray-600 mt-2">{exp.description}</p>
                      <ul className="mt-3 space-y-1">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-[#7eb33f] mt-0.5 flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold text-[#1f3b8e] mb-4">
                  Certifications & Agréments
                </h4>
                <div className="space-y-4">
                  {cvData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#1f3b8e] rounded-full flex items-center justify-center">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{cert.name}</h5>
                          <p className="text-sm text-gray-600">N° {cert.number}</p>
                          <p className="text-xs text-gray-500">Obtenue en {cert.date}</p>
                        </div>
                      </div>
                      <Badge className="bg-[#7eb33f] text-white">{cert.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button className="bg-[#1f3b8e] hover:bg-[#7eb33f] text-white">
            <Download className="h-4 w-4 mr-2" />
            Télécharger le CV PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
