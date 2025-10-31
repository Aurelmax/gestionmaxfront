import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'

// GET /api/apprenants-payload/:id - Récupérer un apprenant par ID
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getPayloadClient()

    const apprenant = await payload.findByID({
      collection: 'apprenants',
      id,
      depth: 2, // Charger les relations
    })

    if (!apprenant) {
      return NextResponse.json({ success: false, error: 'Apprenant introuvable' }, { status: 404 })
    }

    // Transformer les données pour le format attendu
    const apprenantData = apprenant as any
    const transformedData = {
      id: apprenantData.id,
      nom: apprenantData.nom,
      prenom: apprenantData.prenom,
      email: apprenantData.email,
      telephone: apprenantData.telephone || '',
      dateNaissance: apprenantData.dateNaissance || '',
      numeroSecuriteSociale: apprenantData.numeroSecuriteSociale || '',
      numeroCotisantIndividuel: apprenantData.numeroCotisantIndividuel || '',
      statut: apprenantData.statut,
      dateInscription: apprenantData.createdAt,
      structureJuridique: apprenantData.structureJuridique
        ? {
            id: apprenantData.structureJuridique.id,
            nom: apprenantData.structureJuridique.nom,
            siret: apprenantData.structureJuridique.siret,
          }
        : undefined,
    }

    return NextResponse.json({
      success: true,
      data: transformedData,
    })
  } catch (error) {
    console.error('Erreur GET apprenant:', error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération de l'apprenant" },
      { status: 500 }
    )
  }
}

// PUT /api/apprenants-payload/:id - Mettre à jour un apprenant
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const payload = await getPayloadClient()

    // Récupérer l'apprenant existant pour obtenir l'ID de la structure
    const existingApprenant = await payload.findByID({
      collection: 'apprenants',
      id,
      depth: 0, // Ne pas charger les relations
    })

    if (!existingApprenant) {
      return NextResponse.json({ success: false, error: 'Apprenant introuvable' }, { status: 404 })
    }

    // 1️⃣ Si une structure juridique est fournie, la mettre à jour d'abord
    if (body.structureJuridique && body.structureJuridique.id) {
      const structureData: any = {
        nom: body.structureJuridique.nom,
        siret: body.structureJuridique.siret,
      }

      if (body.structureJuridique.codeApe) structureData.codeApe = body.structureJuridique.codeApe
      if (body.structureJuridique.adresse) structureData.adresse = body.structureJuridique.adresse
      if (body.structureJuridique.codePostal)
        structureData.codePostal = body.structureJuridique.codePostal
      if (body.structureJuridique.ville) structureData.ville = body.structureJuridique.ville
      if (body.structureJuridique.telephone)
        structureData.telephone = body.structureJuridique.telephone
      if (body.structureJuridique.email) structureData.email = body.structureJuridique.email

      await payload.update({
        collection: 'structures-juridiques',
        id: body.structureJuridique.id,
        data: structureData,
      })
    }

    // 2️⃣ Mettre à jour l'apprenant
    const updateData: any = {
      nom: body.nom,
      prenom: body.prenom,
      email: body.email,
      telephone: body.telephone || '',
      statut: body.statut,
    }

    // Ajouter les champs optionnels seulement s'ils sont fournis
    if (body.dateNaissance) updateData.dateNaissance = body.dateNaissance
    if (body.numeroSecuriteSociale) updateData.numeroSecuriteSociale = body.numeroSecuriteSociale
    if (body.numeroCotisantIndividuel)
      updateData.numeroCotisantIndividuel = body.numeroCotisantIndividuel
    if (body.notes) updateData.notes = body.notes

    const updatedApprenant = await payload.update({
      collection: 'apprenants',
      id,
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: updatedApprenant,
    })
  } catch (error: any) {
    console.error('Erreur PUT apprenant:', error)
    console.error('Error data:', error.data)
    console.error('Error cause:', error.cause)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour de l'apprenant",
        details: error.message,
        validationErrors: error.data || error.cause,
      },
      { status: 500 }
    )
  }
}

// DELETE /api/apprenants-payload/:id - Supprimer un apprenant
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayloadClient()

    await payload.delete({
      collection: 'apprenants',
      id,
    })

    return NextResponse.json({
      success: true,
      message: 'Apprenant supprimé avec succès',
    })
  } catch (error) {
    console.error('Erreur DELETE apprenant:', error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la suppression de l'apprenant" },
      { status: 500 }
    )
  }
}
