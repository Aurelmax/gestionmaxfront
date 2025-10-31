'use client'

import { useState } from 'react'
import { PublicLayout } from '@/components/layouts/public/PublicLayout'

export const dynamic = 'force-dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Mail, Phone, MapPin, Clock, FileText, Scale, Shield, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { InteractiveMap } from '@/components/ui/InteractiveMap'
import { toast } from 'sonner'
import { useConfetti } from '@/hooks/useConfetti'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    type: '',
    sujet: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { triggerCelebration } = useConfetti()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation
      if (
        !formData.nom ||
        !formData.email ||
        !formData.type ||
        !formData.sujet ||
        !formData.message
      ) {
        toast.error('Veuillez remplir tous les champs obligatoires')
        setIsSubmitting(false)
        return
      }

      // Envoi à l'API
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi du message")
      }

      // Succès
      setIsSuccess(true)
      // 🎉 Déclencher les confettis!
      triggerCelebration()
      toast.success('Message envoyé avec succès !')

      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        type: '',
        sujet: '',
        message: '',
      })
    } catch (error) {
      console.error('Erreur:', error)
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'envoi du message")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 overflow-hidden">
        <Image
          src="/formation-wordpress-antibes.webp"
          alt="Contactez GestionMax - Devis formation WordPress Antibes - Formateur certifié Qualiopi"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Contactez-nous</h1>
          <p className="text-xl text-gray-100 max-w-4xl mx-auto">
            Une question ? Une réclamation ? Nous sommes là pour vous aider.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Column - Contact Details */}
                <div className="p-8 bg-gray-50">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos coordonnées</h2>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Mail className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Email</p>
                        <p className="text-gray-600">aurelien@gestionmax.fr</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Téléphone</p>
                        <p className="text-gray-600">06 46 02 24 68</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Adresse</p>
                        <p className="text-gray-600">
                          300 chemin de la suquette,
                          <br />
                          06600 Antibes, France
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Clock className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Heures d'ouverture</p>
                        <div className="text-gray-600 space-y-1">
                          <p>Lundi - Vendredi : 9h00 - 18h00</p>
                          <p>Samedi : 9h00 - 12h00</p>
                          <p>Dimanche : Fermé</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Contact Form */}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Envoyez-nous un message</h2>
                  <p className="text-gray-600 mb-6">
                    Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                  </p>

                  {isSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800 font-medium">
                        Message envoyé avec succès ! Nous vous répondrons dans les plus brefs
                        délais.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom" className="text-gray-700">
                        Nom complet *
                      </Label>
                      <Input
                        id="nom"
                        placeholder="Votre nom complet"
                        required
                        className="border-gray-300"
                        value={formData.nom}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        required
                        className="border-gray-300"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telephone" className="text-gray-700">
                        Téléphone
                      </Label>
                      <Input
                        id="telephone"
                        type="tel"
                        placeholder="06 46 02 24 68"
                        className="border-gray-300"
                        value={formData.telephone}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-gray-700">
                        Type de demande *
                      </Label>
                      <Select
                        value={formData.type}
                        onValueChange={handleSelectChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="question">Question générale</SelectItem>
                          <SelectItem value="reclamation">Réclamation</SelectItem>
                          <SelectItem value="formation">Demande de formation</SelectItem>
                          <SelectItem value="devis">Demande de devis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sujet" className="text-gray-700">
                        Sujet *
                      </Label>
                      <Input
                        id="sujet"
                        placeholder="Sujet de votre message"
                        required
                        className="border-gray-300"
                        value={formData.sujet}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Décrivez votre demande en détail..."
                        rows={4}
                        required
                        className="border-gray-300"
                        value={formData.message}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        'Envoyer le message'
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Nous situer à Antibes</h2>
            <p className="text-lg text-gray-600">
              GestionMax Formation - Formations WordPress Professionnelles à Antibes
            </p>
          </div>

          <Card className="overflow-hidden">
            <InteractiveMap className="h-96" />
          </Card>
        </div>
      </section>

      {/* Legal and Compliance Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mentions légales et conformité Qualiopi
            </h2>
            <p className="text-lg text-gray-600">
              Informations obligatoires et conditions de nos formations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contrat de formation */}
            <Card className="p-6 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-brand-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Contrat de formation</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Un contrat de formation professionnelle est établi pour chaque formation. Il
                  précise les objectifs, modalités, programme, délais, conditions financières et
                  droit de rétractation. L'accès se fait dès réception de l'accord de prise en
                  charge. Un entretien préalable personnalise votre parcours.
                </p>
              </CardContent>
            </Card>

            {/* Procédure de réclamation */}
            <Card className="p-6 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Scale className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Procédure de réclamation</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  En cas de mécontentement, utilisez le formulaire de contact en sélectionnant
                  &quot;Réclamation&quot;. Nous nous engageons à traiter votre demande sous 10 jours
                  ouvrés maximum avec un suivi personnalisé. Contact direct :{' '}
                  <strong>reclamation@gestionmax-formation.fr</strong>
                </p>
              </CardContent>
            </Card>

            {/* Protection des données */}
            <Card className="p-6 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Protection des données</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Vos données personnelles sont traitées conformément au RGPD. Elles servent à des
                  fins pédagogiques, administratives ou réglementaires. Vous disposez d'un droit
                  d'accès, rectification et suppression. Contact DPO :{' '}
                  <strong>dpo@gestionmax-formation.fr</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
