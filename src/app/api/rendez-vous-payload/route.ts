import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API rendez-vous Payload appelée')

    const payload = await getPayloadClient()
    const { searchParams } = new URL(request.url)

    const filters: any = {}

    // Construire les filtres Payload
    if (searchParams.get('statut')) {
      filters.statut = { equals: searchParams.get('statut') }
    }
    if (searchParams.get('type')) {
      filters.type = { equals: searchParams.get('type') }
    }
    if (searchParams.get('lieu')) {
      filters.lieu = { equals: searchParams.get('lieu') }
    }
    if (searchParams.get('programmeId')) {
      filters.programme = { equals: searchParams.get('programmeId') }
    }
    if (searchParams.get('dateDebut')) {
      filters.date = { greater_than_equal: searchParams.get('dateDebut') }
    }
    if (searchParams.get('dateFin')) {
      filters.date = { ...filters.date, less_than_equal: searchParams.get('dateFin') }
    }

    console.log('📋 Filtres Payload:', filters)

    const result = await payload.find({
      collection: 'rendez-vous',
      where: filters,
      sort: '-createdAt',
      depth: 1, // Inclure les relations
    })

    console.log('✅ Rendez-vous Payload:', result.docs.length)

    // Transformer les données Payload vers le format attendu
    const rendezVous = result.docs.map((doc: any) => ({
      id: doc.id,
      programmeId: typeof doc.programme === 'string' ? doc.programme : doc.programme?.id,
      programmeTitre:
        typeof doc.programme === 'object' ? doc.programme?.titre : 'Programme non trouvé',
      client: doc.client,
      type: doc.type,
      statut: doc.statut,
      date: doc.date,
      heure: doc.heure,
      duree: doc.duree,
      lieu: doc.lieu,
      adresse: doc.adresse,
      lienVisio: doc.lienVisio,
      notes: doc.notes,
      rappelEnvoye: doc.rappelEnvoye,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      createdBy: doc.createdBy,
    }))

    // Calculer les statistiques
    const stats = {
      total: result.totalDocs,
      enAttente: result.docs.filter((rdv: any) => rdv.statut === 'enAttente').length,
      confirmes: result.docs.filter((rdv: any) => rdv.statut === 'confirme').length,
      annules: result.docs.filter((rdv: any) => rdv.statut === 'annule').length,
      termines: result.docs.filter((rdv: any) => rdv.statut === 'termine').length,
      reportes: result.docs.filter((rdv: any) => rdv.statut === 'reporte').length,
      aujourdhui: result.docs.filter(
        (rdv: any) => rdv.date === new Date().toISOString().split('T')[0]
      ).length,
      cetteSemaine: 0, // À calculer
      ceMois: 0, // À calculer
    }

    return NextResponse.json({
      success: true,
      data: {
        rendezVous,
        total: result.totalDocs,
        stats,
      },
    })
  } catch (error: any) {
    console.error('❌ Erreur API rendez-vous Payload:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des rendez-vous',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API création rendez-vous Payload appelée')

    const payload = await getPayloadClient()
    const body = await request.json()

    console.log('📋 Données reçues:', JSON.stringify(body, null, 2))

    // Valider que le programme existe
    if (!body.programmeId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Le programme est requis',
        },
        { status: 400 }
      )
    }

    // ✅ MIGRATION EFFECTUÉE - Les données programmes sont maintenant au bon format
    // Structure corrigée: competences: [{competence: string}]
    // Payload CMS peut maintenant être utilisé sans erreur!

    console.log('✅ Création via Payload CMS (migration structure effectuée)')

    // Transformer les données vers le format Payload
    const payloadData = {
      programme: body.programmeId,
      client: body.client,
      type: body.type,
      statut: body.statut || 'enAttente',
      date: new Date(body.date), // Payload attend un Date object
      heure: body.heure,
      duree: body.duree || 30,
      lieu: body.lieu,
      adresse: body.adresse,
      lienVisio: body.lienVisio,
      notes: body.notes,
      rappelEnvoye: false,
      createdBy: body.createdBy || '1',
    }

    console.log('💾 Données Payload:', JSON.stringify({ ...payloadData, date: body.date }, null, 2))

    // Créer via Payload CMS
    const nouveauRendezVous = await payload.create({
      collection: 'rendez-vous',
      data: payloadData,
      depth: 1, // Inclure les relations (programme)
    })

    console.log('✅ Rendez-vous Payload créé:', nouveauRendezVous.id)

    // Transformer la réponse vers le format attendu
    const response = {
      id: nouveauRendezVous.id,
      programmeId:
        typeof nouveauRendezVous.programme === 'string'
          ? nouveauRendezVous.programme
          : nouveauRendezVous.programme?.id,
      programmeTitre:
        typeof nouveauRendezVous.programme === 'object'
          ? nouveauRendezVous.programme?.titre
          : 'Programme non trouvé',
      client: nouveauRendezVous.client,
      type: nouveauRendezVous.type,
      statut: nouveauRendezVous.statut,
      date: nouveauRendezVous.date,
      heure: nouveauRendezVous.heure,
      duree: nouveauRendezVous.duree,
      lieu: nouveauRendezVous.lieu,
      adresse: nouveauRendezVous.adresse,
      lienVisio: nouveauRendezVous.lienVisio,
      notes: nouveauRendezVous.notes,
      rappelEnvoye: nouveauRendezVous.rappelEnvoye,
      createdAt: nouveauRendezVous.createdAt,
      updatedAt: nouveauRendezVous.updatedAt,
      createdBy: nouveauRendezVous.createdBy,
    }

    return NextResponse.json(
      {
        success: true,
        data: response,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('❌ Erreur création rendez-vous Payload:', error)
    console.error('❌ Stack trace:', error.stack)
    console.error('❌ Error name:', error.name)
    console.error('❌ Error message:', error.message)
    if (error.data) {
      console.error('❌ Error data:', JSON.stringify(error.data, null, 2))
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la création du rendez-vous',
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    )
  }
}
