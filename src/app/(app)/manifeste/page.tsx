import type { Metadata } from 'next'
import { PublicLayout } from '@/components/layouts/public/PublicLayout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, Target, Users, Zap, MessageCircle, Award, BookOpen, ArrowRight } from 'lucide-react'
import { RecentArticles } from '@/components/blog/RecentArticles'

export const metadata: Metadata = {
  title: 'Manifeste Éditorial - La Relation Client Moderne',
  description:
    'Le manifeste de GestionMax : élever la culture de la relation client dans le commerce indépendant. Le digital au service du lien, pas à sa place.',
  openGraph: {
    title: 'Manifeste Éditorial - La Relation Client Moderne | GestionMax',
    description:
      'Découvrez notre vision de la relation client moderne pour les indépendants et le commerce de proximité.',
    type: 'article',
  },
}

export default function ManifestePage() {
  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-[#1f3b8e]/5 to-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-[#1f3b8e] mb-6">
              Manifeste Éditorial
            </h1>
            <p className="text-2xl text-gray-700 font-light">
              La Relation Client Moderne
            </p>
            <p className="text-lg text-gray-600 mt-4">
              par <span className="font-semibold">Aurélien Lavayssière</span>
            </p>
          </div>

          {/* Pourquoi ce blog existe */}
          <section className="mb-16">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-[#7eb33f]/10 p-3 rounded-lg">
                <MessageCircle className="h-8 w-8 text-[#7eb33f]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                💡 Pourquoi ce blog existe
              </h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Parce que la relation client change.
                <br />
                Parce que les habitudes d'achat changent.
                <br />
                Mais aussi — et surtout — parce que le client, lui, n'a pas changé dans ses
                attentes profondes :
              </p>
              <p className="text-xl font-semibold text-[#1f3b8e] italic ml-8 my-6">
                il veut être reconnu, respecté, écouté.
                <br />
                Il veut de la simplicité, de la clarté, de la confiance.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Je crois profondément que les indépendants, les artisans et les commerces de
                proximité peuvent offrir un niveau d'expérience client aussi bon — voire meilleur
                — que les grandes marques. Mais pour ça, ils ont besoin d'une méthode, d'une
                posture et d'une culture de service qui soient à la hauteur de leurs valeurs.
              </p>
            </div>

            <div className="mt-8 bg-[#1f3b8e]/5 rounded-lg p-6 border-l-4 border-[#7eb33f]">
              <p className="text-lg font-semibold text-gray-900 mb-3">
                Ce blog est né pour ça :
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-[#7eb33f] text-xl">👉</span>
                  Sensibiliser les entrepreneurs du commerce de proximité
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-[#7eb33f] text-xl">👉</span>
                  Accompagner leur montée en compétence relationnelle
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-[#7eb33f] text-xl">👉</span>
                  Traduire le digital en un langage humain, concret et utile
                </li>
              </ul>
            </div>
          </section>

          {/* Ma conviction */}
          <section className="mb-16">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-[#1f3b8e]/10 p-3 rounded-lg">
                <Heart className="h-8 w-8 text-[#1f3b8e]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">🤝 Ma conviction</h2>
            </div>
            <blockquote className="bg-gradient-to-r from-[#1f3b8e] to-[#7eb33f] text-white p-8 rounded-lg text-center my-8 shadow-lg">
              <p className="text-2xl font-bold mb-2">
                "Le client veut choisir l'indépendant,
              </p>
              <p className="text-2xl font-bold">mais il ne veut pas subir sa manière de travailler."</p>
            </blockquote>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Autrement dit : le digital n'est pas un gadget.
                <br />
                C'est un levier de crédibilité, un marqueur de professionnalisme, et un outil
                d'équité concurrentielle entre les petits acteurs et les grandes structures.
              </p>
            </div>
          </section>

          {/* Ce que je défends */}
          <section className="mb-16">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-[#7eb33f]/10 p-3 rounded-lg">
                <Award className="h-8 w-8 text-[#7eb33f]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">🧱 Ce que je défends ici</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border-2 border-[#1f3b8e]/10 hover:border-[#1f3b8e]/30 transition">
                <p className="text-gray-700 leading-relaxed">
                  Je défends une <strong>relation client incarnée</strong>, où chaque contact, même
                  à distance, garde un visage et une intention.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border-2 border-[#1f3b8e]/10 hover:border-[#1f3b8e]/30 transition">
                <p className="text-gray-700 leading-relaxed">
                  Je défends la <strong>professionnalisation des indépendants</strong>, non pas
                  pour les uniformiser, mais pour leur donner la même force que les grandes
                  enseignes.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border-2 border-[#1f3b8e]/10 hover:border-[#1f3b8e]/30 transition">
                <p className="text-gray-700 leading-relaxed">
                  Je défends un <strong>usage intelligent du digital</strong> : pas de gadgets, pas
                  d'usines à gaz, juste des outils qui fluidifient la relation et libèrent du temps.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border-2 border-[#1f3b8e]/10 hover:border-[#1f3b8e]/30 transition">
                <p className="text-gray-700 leading-relaxed">
                  Je défends le <strong>droit à l'exigence</strong> pour les petites structures :
                  rigueur, qualité, réactivité — sans perdre la chaleur humaine.
                </p>
              </div>
            </div>
          </section>

          {/* Ce dont je parle */}
          <section className="mb-16">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-[#1f3b8e]/10 p-3 rounded-lg">
                <Users className="h-8 w-8 text-[#1f3b8e]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">🌐 Ce dont je parle ici</h2>
            </div>
            <div className="prose prose-lg max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed">
                Ici, tu ne trouveras pas de tutos WordPress, de réglages de plugins ou de vidéos
                gadgets. Ce n'est pas un blog technique. C'est un espace de réflexion, d'expérience
                et de pédagogie sur la transformation de la relation client dans un monde connecté.
              </p>
            </div>
            <div className="bg-[#7eb33f]/5 rounded-lg p-6">
              <p className="font-semibold text-gray-900 mb-4">On y parle :</p>
              <ul className="grid md:grid-cols-2 gap-3">
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="w-2 h-2 bg-[#7eb33f] rounded-full"></span>
                  de l'expérience client
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="w-2 h-2 bg-[#7eb33f] rounded-full"></span>
                  de fidélisation
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="w-2 h-2 bg-[#7eb33f] rounded-full"></span>
                  de communication responsable
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="w-2 h-2 bg-[#7eb33f] rounded-full"></span>
                  de management de la relation
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="w-2 h-2 bg-[#7eb33f] rounded-full"></span>
                  et de culture d'entreprise orientée client
                </li>
              </ul>
              <p className="text-gray-600 italic mt-4">
                Le tout, vu du terrain, pensé pour les indépendants, et raconté avec humanité.
              </p>
            </div>
          </section>

          {/* Ma mission */}
          <section className="mb-16">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-[#7eb33f]/10 p-3 rounded-lg">
                <Target className="h-8 w-8 text-[#7eb33f]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">🎯 Ma mission</h2>
            </div>
            <div className="bg-gradient-to-br from-[#1f3b8e]/10 to-[#7eb33f]/10 rounded-lg p-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-lg text-gray-700">
                  <Zap className="h-6 w-6 text-[#7eb33f] flex-shrink-0 mt-1" />
                  Élever la culture de la relation client dans le commerce indépendant.
                </li>
                <li className="flex items-start gap-3 text-lg text-gray-700">
                  <Zap className="h-6 w-6 text-[#7eb33f] flex-shrink-0 mt-1" />
                  Donner aux artisans, commerçants et formateurs les outils, les méthodes et les
                  attitudes qui inspirent confiance.
                </li>
                <li className="flex items-start gap-3 text-lg text-gray-700">
                  <Zap className="h-6 w-6 text-[#7eb33f] flex-shrink-0 mt-1" />
                  Faire du digital un prolongement du lien humain, pas son remplaçant.
                </li>
              </ul>
            </div>
          </section>

          {/* La promesse */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">🔗 La promesse</h2>
            <div className="bg-white p-8 rounded-lg border-l-4 border-[#7eb33f] shadow-md">
              <p className="text-xl text-gray-700 leading-relaxed">
                Chaque article, chaque formation, chaque réflexion suit une seule ligne :
              </p>
              <p className="text-2xl font-semibold text-[#1f3b8e] mt-4 italic">
                Aider les indépendants à offrir une expérience client aussi fluide, exigeante et
                sincère que celle des grandes marques — mais avec leur personnalité.
              </p>
            </div>
          </section>

          {/* En résumé */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">🗣️ En résumé</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-4">Ce blog, c'est :</p>
              <ul className="space-y-2 text-lg text-gray-700">
                <li>un lieu d'apprentissage,</li>
                <li>un lieu de recul,</li>
                <li>un lieu de sensibilisation.</li>
              </ul>
              <p className="text-lg text-gray-700 leading-relaxed mt-6">
                C'est un espace pour tous ceux qui veulent moderniser leur façon d'accueillir,
                d'accompagner et de fidéliser leurs clients, sans jamais perdre le sens du contact,
                du respect et du service.
              </p>
            </div>
          </section>

          {/* Signature */}
          <section className="border-t-2 border-gray-200 pt-12 pb-16">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1f3b8e] mb-2">✍️ Aurélien Lavayssière</p>
              <p className="text-lg text-gray-600 mb-4">
                Entrepreneur, formateur et accompagnant des entreprises du commerce de proximité
              </p>
              <blockquote className="text-2xl font-light text-[#7eb33f] italic mt-6">
                "Le digital au service du lien, pas à sa place."
              </blockquote>
            </div>
          </section>
        </div>

        {/* Articles récents - Section pleine largeur */}
        <div className="bg-[#1f3b8e]/5 py-20 border-t-2 border-[#1f3b8e]/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-[#7eb33f]/10 p-3 rounded-lg">
                  <BookOpen className="h-8 w-8 text-[#7eb33f]" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">
                  📚 Dans la continuité du manifeste
                </h2>
              </div>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Découvrez nos derniers articles qui explorent concrètement ces principes de relation
                client moderne
              </p>
            </div>

            {/* Composant articles récents */}
            <RecentArticles limit={4} showCategories={true} />

            {/* CTA vers le blog */}
            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#1f3b8e] text-[#1f3b8e] hover:bg-[#1f3b8e] hover:text-white font-semibold group"
                asChild
              >
                <Link href="/blog" className="flex items-center gap-2">
                  <span>Lire tous les articles</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center bg-gradient-to-r from-[#1f3b8e] to-[#7eb33f] rounded-lg p-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Prêt à transformer votre relation client ?
            </h3>
            <p className="text-xl text-white/90 mb-8">
              Découvrez nos formations et accompagnements personnalisés
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#1f3b8e] hover:bg-gray-100 font-semibold"
                asChild
              >
                <Link href="/catalogue">Voir nos formations</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/contact">Prendre contact</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
