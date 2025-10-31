import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const mongoUri = process.env['MONGODB_URI']
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined')
    }

    const client = new MongoClient(mongoUri)
    await client.connect()

    const db = client.db()
    const collection = db.collection('programmes')

    const resolvedParams = await params
    const id = new ObjectId(resolvedParams.id)
    const programme = await collection.findOne({ _id: id })

    await client.close()

    if (!programme) {
      return NextResponse.json({ success: false, error: 'Programme non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: programme,
    })
  } catch (error) {
    console.error('Erreur API programmes/[id]:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du programme' },
      { status: 500 }
    )
  }
}

export async function PUT(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await _request.json()

    const mongoUri = process.env['MONGODB_URI']
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined')
    }

    const client = new MongoClient(mongoUri)
    await client.connect()

    const db = client.db()
    const collection = db.collection('programmes')

    const resolvedParams = await params
    const id = new ObjectId(resolvedParams.id)

    // Vérifier si le programme existe
    const existingProgramme = await collection.findOne({ _id: id })
    if (!existingProgramme) {
      await client.close()
      return NextResponse.json({ success: false, error: 'Programme non trouvé' }, { status: 404 })
    }

    // Vérifier si le code formation est unique (sauf pour le programme actuel)
    if (body['codeFormation'] && body['codeFormation'] !== existingProgramme['codeFormation']) {
      const duplicateProgramme = await collection.findOne({
        codeFormation: body['codeFormation'],
        _id: { $ne: id },
      })

      if (duplicateProgramme) {
        await client.close()
        return NextResponse.json(
          { success: false, error: 'Un programme avec ce code formation existe déjà' },
          { status: 400 }
        )
      }
    }

    // Mettre à jour le programme
    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await collection.updateOne({ _id: id }, { $set: updateData })

    await client.close()

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Programme non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: { id: resolvedParams.id, ...updateData },
    })
  } catch (error) {
    console.error('Erreur lors de la modification du programme:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la modification du programme' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const mongoUri = process.env['MONGODB_URI']
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined')
    }

    const client = new MongoClient(mongoUri)
    await client.connect()

    const db = client.db()
    const collection = db.collection('programmes')

    const resolvedParams = await params
    const id = new ObjectId(resolvedParams.id)

    const result = await collection.deleteOne({ _id: id })

    await client.close()

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Programme non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Programme supprimé avec succès',
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du programme:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du programme' },
      { status: 500 }
    )
  }
}
