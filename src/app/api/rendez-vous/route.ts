import { NextRequest, NextResponse } from 'next/server'
import { mongodbService } from '@/lib/mongodb-service'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API rendez-vous appelée')

    const { searchParams } = new URL(request.url)
    const filters = {
      statut: searchParams.get('statut') || undefined,
      type: searchParams.get('type') || undefined,
      lieu: searchParams.get('lieu') || undefined,
      programmeId: searchParams.get('programmeId') || undefined,
      dateDebut: searchParams.get('dateDebut') || undefined,
      dateFin: searchParams.get('dateFin') || undefined,
      search: searchParams.get('search') || undefined,
    }

    console.log('📋 Filtres:', filters)

    // Récupérer tous les rendez-vous depuis MongoDB
    const rendezVous = await mongodbService.getRendezVous()

    // Appliquer les filtres côté serveur
    let filtered = rendezVous

    if (filters.statut && filters.statut !== 'all') {
      filtered = filtered.filter(rdv => rdv.statut === filters.statut)
    }
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(rdv => rdv.type === filters.type)
    }
    if (filters.lieu && filters.lieu !== 'all') {
      filtered = filtered.filter(rdv => rdv.lieu === filters.lieu)
    }
    if (filters.programmeId) {
      filtered = filtered.filter(rdv => rdv.programmeId === filters.programmeId)
    }
    if (filters.dateDebut) {
      filtered = filtered.filter(rdv => rdv.date >= filters.dateDebut!)
    }
    if (filters.dateFin) {
      filtered = filtered.filter(rdv => rdv.date <= filters.dateFin!)
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        rdv =>
          rdv.client.nom.toLowerCase().includes(searchTerm) ||
          rdv.client.prenom.toLowerCase().includes(searchTerm) ||
          rdv.client.email.toLowerCase().includes(searchTerm) ||
          rdv.programmeTitre.toLowerCase().includes(searchTerm)
      )
    }

    // Calculer les statistiques
    const stats = {
      total: rendezVous.length,
      enAttente: rendezVous.filter(rdv => rdv.statut === 'enAttente').length,
      confirmes: rendezVous.filter(rdv => rdv.statut === 'confirme').length,
      annules: rendezVous.filter(rdv => rdv.statut === 'annule').length,
      termines: rendezVous.filter(rdv => rdv.statut === 'termine').length,
      reportes: rendezVous.filter(rdv => rdv.statut === 'reporte').length,
      aujourdhui: rendezVous.filter(rdv => rdv.date === new Date().toISOString().split('T')[0])
        .length,
      cetteSemaine: 0,
      ceMois: 0,
    }

    console.log('✅ Rendez-vous:', filtered.length)

    return NextResponse.json({
      success: true,
      data: {
        rendezVous: filtered,
        total: filtered.length,
        stats,
      },
    })
  } catch (error) {
    console.error('❌ Erreur API rendez-vous:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des rendez-vous',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API création rendez-vous appelée')

    const body = await request.json()
    console.log('📋 Données reçues:', body)

    // Normaliser la date si elle contient un timestamp
    if (body.date && body.date.includes('T')) {
      body.date = body.date.split('T')[0]
      console.log('📅 Date normalisée:', body.date)
    }

    // Créer le document pour MongoDB
    const rendezVousData = {
      programme: body.programmeId || '',
      programmeTitre: body.programmeTitre || 'Programme de formation',
      client: body.client,
      type: body.type,
      statut: body.statut || 'enAttente',
      date: body.date,
      heure: body.heure,
      duree: body.duree || 30,
      lieu: body.lieu,
      adresse: body.adresse,
      lienVisio: body.lienVisio,
      notes: body.notes,
      rappelEnvoye: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '1', // TODO: Utiliser l'ID de l'utilisateur connecté
    }

    const nouveauRendezVous = await mongodbService.createRendezVous(rendezVousData)

    console.log('✅ Rendez-vous créé:', nouveauRendezVous)

    return NextResponse.json({
      success: true,
      data: nouveauRendezVous,
    })
  } catch (error) {
    console.error('❌ Erreur création rendez-vous:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la création du rendez-vous',
      },
      { status: 500 }
    )
  }
}
