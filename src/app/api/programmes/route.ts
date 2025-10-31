import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

export async function GET() {
  try {
    const mongoUri = process.env['MONGODB_URI']
    if (!mongoUri) {
      return NextResponse.json(
        { success: false, error: 'MongoDB URI not configured' },
        { status: 500 }
      )
    }

    const client = new MongoClient(mongoUri)
    await client.connect()

    const db = client.db()
    const collection = db.collection('programmes')

    const programmes = await collection.find({}).toArray()

    await client.close()

    return NextResponse.json({
      success: true,
      data: programmes,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des programmes:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des programmes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const mongoUri = process.env['MONGODB_URI']
    if (!mongoUri) {
      return NextResponse.json(
        { success: false, error: 'MongoDB URI not configured' },
        { status: 500 }
      )
    }

    const client = new MongoClient(mongoUri)
    await client.connect()

    const db = client.db()
    const collection = db.collection('programmes')

    // Vérifier si le code formation existe déjà
    const existingProgramme = await collection.findOne({
      codeFormation: body.codeFormation,
    })

    if (existingProgramme) {
      await client.close()
      return NextResponse.json(
        { success: false, error: 'Un programme avec ce code formation existe déjà' },
        { status: 400 }
      )
    }

    // Créer le nouveau programme avec les champs par défaut
    const newProgramme = {
      ...body,
      // Valeurs par défaut pour les champs optionnels
      objectifs: body.objectifs || `Objectifs pédagogiques pour ${body.titre}`,
      prerequis:
        body.prerequis ||
        'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur.',
      publicConcerne:
        body.publicConcerne || 'Artisans, commerçants, professions libérales et entrepreneurs.',
      horaires: body.horaires || '9h à 13h et de 14h à 17h',
      delaisMiseEnPlace: body.delaisMiseEnPlace || "À réception de l'accord de prise en charge",
      modalitesReglement: body.modalitesReglement || 'Chèque ou virement à réception de facture',
      ressources: body.ressources || [
        'Salle de formation équipée',
        'Support de cours',
        'Matériel informatique',
      ],
      modalitesEvaluation:
        body.modalitesEvaluation || 'Évaluation des connaissances théoriques et travaux pratiques',
      sanctionFormation: body.sanctionFormation || 'Certificat de réalisation de formation',
      niveauCertification: body.niveauCertification || 'Aucune',
      accessibiliteHandicap:
        body.accessibiliteHandicap ||
        "Entretien téléphonique pour évaluer les besoins spécifiques au regard d'une situation de handicap, mise en œuvre des adaptations pédagogiques, organisationnelles et matérielles nécessaires.",
      cessationAbandon:
        body.cessationAbandon ||
        "En cas de renonciation avant le début de la formation, aucune facturation. En cas de renonciation en cours de formation, la facturation se fera au prorata de l'assiduité.",
      // Informations formateur par défaut
      formateurNom: body.formateurNom || 'Aurélien LAVAYSSIERE',
      formateurEmail: body.formateurEmail || 'aurelien@gestionmax.fr',
      formateurTelephone: body.formateurTelephone || '06.46.02.24.68',
      formateurRole: body.formateurRole || 'Consultant formateur en informatique de gestion',
      formateurBiographie:
        body.formateurBiographie ||
        "Aurélien LAVAYSSIERE est un consultant formateur en informatique de gestion, spécialisé dans la formation des adultes. Doté d'une solide expérience dans le domaine de la formation, Aurélien possède une expertise approfondie en matière de technologies web et de gestion d'entreprise.",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(newProgramme)

    await client.close()

    return NextResponse.json(
      {
        success: true,
        data: {
          id: result.insertedId,
          ...newProgramme,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de la création du programme:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création du programme' },
      { status: 500 }
    )
  }
}
