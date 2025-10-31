'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock,
  Users,
  Award,
  Star,
  Target,
  Zap,
  Shield,
  TrendingUp,
  MessageCircle,
  HelpCircle,
} from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  tags: string[]
  featured?: boolean
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Quels sont les prérequis pour suivre vos formations WordPress ?',
    answer:
      "Nos formations sont adaptées à tous les niveaux ! Pour les formations débutantes (WordPress, Canva, ChatGPT), aucun prérequis n'est nécessaire. Pour les formations intermédiaires (SEO, Facebook Ads), nous recommandons d'avoir des bases en marketing digital. Un entretien de positionnement gratuit permet d'évaluer votre niveau et d'adapter le parcours.",
    category: 'Prérequis',
    icon: Target,
    tags: ['WordPress', 'Débutant', 'Positionnement'],
    featured: true,
  },
  {
    id: '2',
    question: 'Comment se déroulent les formations ? Sont-elles en présentiel ou à distance ?',
    answer:
      "Toutes nos formations se déroulent en présentiel à Nice, dans nos locaux équipés. Nous privilégions l'interaction directe avec le formateur pour un apprentissage optimal. Chaque formation dure entre 14h et 28h selon le programme, réparties sur 2 à 4 jours consécutifs.",
    category: 'Modalités',
    icon: BookOpen,
    tags: ['Présentiel', 'Nice', 'Interactif'],
  },
  {
    id: '3',
    question: 'Vos formations sont-elles éligibles au CPF et aux financements professionnels ?',
    answer:
      'Oui ! Toutes nos formations sont éligibles au CPF (Compte Personnel de Formation) et peuvent être financées par les OPCO. Nous sommes certifiés Qualiopi, garantissant la qualité de nos formations. Nous vous accompagnons dans les démarches administratives.',
    category: 'Financement',
    icon: Award,
    tags: ['CPF', 'Qualiopi', 'OPCO', 'Financement'],
    featured: true,
  },
  {
    id: '4',
    question: 'Quels outils et technologies apprenez-vous dans vos formations ?',
    answer:
      "Nos formations couvrent l'écosystème WordPress complet : WordPress, WooCommerce, Elementor, Yoast SEO, SEOPress, Matomo, Brevo, Canva, Facebook Ads, LinkedIn Ads, ChatGPT, Make, et bien d'autres. Chaque formation inclut des outils professionnels utilisés en entreprise.",
    category: 'Technologies',
    icon: Zap,
    tags: ['WordPress', 'WooCommerce', 'SEO', 'Marketing', 'IA'],
  },
  {
    id: '5',
    question: 'Proposez-vous un accompagnement personnalisé après la formation ?',
    answer:
      "Absolument ! Chaque formation inclut 30 jours de support post-formation par email. Nous proposons également des sessions de suivi personnalisées pour vous accompagner dans la mise en pratique de vos nouvelles compétences. Un groupe d'entraide est également disponible.",
    category: 'Suivi',
    icon: MessageCircle,
    tags: ['Support', 'Accompagnement', 'Suivi', 'Entraide'],
  },
  {
    id: '6',
    question: 'Quelle est la différence entre vos formations WordPress débutant et intermédiaire ?',
    answer:
      "Les formations débutantes (14h) couvrent les bases : création de site, gestion de contenu, plugins essentiels. Les formations intermédiaires (21-28h) approfondissent des sujets spécialisés comme le SEO avancé, les publicités Facebook/LinkedIn, ou l'automatisation marketing. Un entretien de positionnement détermine le parcours adapté.",
    category: 'Niveaux',
    icon: TrendingUp,
    tags: ['Débutant', 'Intermédiaire', 'Progression'],
  },
  {
    id: '7',
    question: "Comment se passe l'entretien de positionnement gratuit ?",
    answer:
      "L'entretien de positionnement (1h) est un moment privilégié pour évaluer vos besoins, objectifs et niveau actuel. Il se déroule en visioconférence ou en présentiel. Nous analysons vos projets, vos contraintes et définissons ensemble le parcours de formation le plus adapté à votre situation.",
    category: 'Positionnement',
    icon: HelpCircle,
    tags: ['Gratuit', 'Personnalisé', 'Objectifs'],
    featured: true,
  },
  {
    id: '8',
    question: 'Proposez-vous des formations sur mesure pour les entreprises ?',
    answer:
      'Oui ! Nous adaptons nos formations aux besoins spécifiques de votre entreprise. Que ce soit pour former vos équipes internes ou pour des projets particuliers, nous créons des programmes sur mesure. Contactez-nous pour discuter de vos besoins spécifiques.',
    category: 'Entreprise',
    icon: Users,
    tags: ['Entreprise', 'Sur mesure', 'Équipes', 'Projets'],
  },
  {
    id: '9',
    question: "Quels sont les délais d'inscription et comment réserver ma place ?",
    answer:
      "Les inscriptions sont ouvertes toute l'année. Nous recommandons de s'inscrire au moins 2 semaines avant la date de formation. Le processus est simple : entretien de positionnement → devis personnalisé → inscription. Les places sont limitées à 8 personnes maximum par session.",
    category: 'Inscription',
    icon: Clock,
    tags: ['Inscription', 'Délais', 'Places limitées'],
  },
  {
    id: '10',
    question: 'Quelle est votre politique de satisfaction et de remboursement ?',
    answer:
      "Nous garantissons votre satisfaction ! Si vous n'êtes pas entièrement satisfait de votre formation, nous proposons une session de rattrapage gratuite ou un remboursement partiel. Notre taux de satisfaction de 95% témoigne de la qualité de nos formations.",
    category: 'Garantie',
    icon: Shield,
    tags: ['Satisfaction', 'Garantie', 'Remboursement', '95%'],
  },
]

const categories = [
  { id: 'all', label: 'Toutes les questions', icon: HelpCircle },
  { id: 'Prérequis', label: 'Prérequis', icon: Target },
  { id: 'Modalités', label: 'Modalités', icon: BookOpen },
  { id: 'Financement', label: 'Financement', icon: Award },
  { id: 'Technologies', label: 'Technologies', icon: Zap },
  { id: 'Suivi', label: 'Suivi', icon: MessageCircle },
  { id: 'Niveaux', label: 'Niveaux', icon: TrendingUp },
  { id: 'Positionnement', label: 'Positionnement', icon: HelpCircle },
  { id: 'Entreprise', label: 'Entreprise', icon: Users },
  { id: 'Inscription', label: 'Inscription', icon: Clock },
  { id: 'Garantie', label: 'Garantie', icon: Shield },
]

export function ModernFAQ() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredFAQs = faqData.filter(faq => faq.featured)

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1f3b8e] text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MessageCircle className="h-4 w-4" />
            Questions fréquentes
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Tout ce que vous devez savoir</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur nos formations WordPress
            professionnelles
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher dans les questions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f3b8e] focus:border-transparent"
              />
              <MessageCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-[#1f3b8e] text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-[#1f3b8e] hover:text-[#1f3b8e]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Featured FAQs */}
        {selectedCategory === 'all' && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Questions les plus posées
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredFAQs.map(faq => {
                const Icon = faq.icon
                return (
                  <Card
                    key={faq.id}
                    className="border-l-4 border-l-[#1f3b8e] hover:shadow-lg transition-shadow"
                  >
                    <button onClick={() => toggleFaq(faq.id)} className="w-full p-6 text-left">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="bg-[#1f3b8e]/10 p-2 rounded-lg">
                            <Icon className="h-5 w-5 text-[#1f3b8e]" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {faq.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-6 pb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* All FAQs */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory === 'all'
              ? 'Toutes les questions'
              : `Questions - ${selectedCategory}`}
          </h3>
          <div className="space-y-4">
            {filteredFAQs.map(faq => {
              const Icon = faq.icon
              return (
                <Card key={faq.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-[#1f3b8e]/10 p-2 rounded-lg flex-shrink-0">
                        <Icon className="h-5 w-5 text-[#1f3b8e]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{faq.question}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                          {faq.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Populaire
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6">
                      <div className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg p-4 border-l-4 border-l-[#1f3b8e]">
                        <p className="text-gray-700 leading-relaxed mb-3">{faq.answer}</p>
                        <div className="flex flex-wrap gap-1">
                          {faq.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* No results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune question trouvée</h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou contactez-nous directement.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="bg-[#1f3b8e] hover:bg-[#7eb33f] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-[#1f3b8e] to-[#7eb33f] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h3>
            <p className="text-lg mb-6 opacity-90">
              Notre équipe est là pour vous accompagner. Contactez-nous pour une réponse
              personnalisée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#1f3b8e] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Nous contacter
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#1f3b8e] transition-colors">
                Entretien de positionnement gratuit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
