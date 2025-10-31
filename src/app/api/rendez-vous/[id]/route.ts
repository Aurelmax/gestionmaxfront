import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const mongoUri = process.env['MONGODB_URI']
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined')
    }

    const client = new MongoClient(mongoUri)
    await client.connect()

    const db = client.db()
    const collection = db.collection('rendez-vous')

    // Essayer de trouver par ObjectId d'abord
    let rdv = await collection.findOne({ _id: new ObjectId(id) })

    // Si pas trouvé, essayer par id string
    if (!rdv) {
      rdv = await collection.findOne({ id: id })
    }

    await client.close()

    if (!rdv) {
      return NextResponse.json({ success: false, error: 'Rendez-vous non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: rdv,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du RDV:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du rendez-vous' },
      { status: 500 }
    )
  }
}

export async function PUT(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await _request.json()

    const mongoUri = process.env['MONGODB_URI']
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined')
    }

    const client = new MongoClient(mongoUri)
    await client.connect()

    const db = client.db()
    const collection = db.collection('rendez-vous')

    // Normaliser la date si elle est fournie
    if (body.date) {
      // Si la date contient un timestamp, extraire juste la date
      if (body.date.includes('T')) {
        body.date = body.date.split('T')[0]
      }
    }

    // Mettre à jour avec updatedAt
    const updateData = {
      ...body,
      updatedAt: new Date().toISOString(),
    }

    // Essayer de mettre à jour par ObjectId d'abord
    let result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    // Si pas trouvé, essayer par id string
    if (!result) {
      result = await collection.findOneAndUpdate(
        { id: id },
        { $set: updateData },
        { returnDocument: 'after' }
      )
    }

    await client.close()

    if (!result) {
      return NextResponse.json({ success: false, error: 'Rendez-vous non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du RDV:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour du rendez-vous' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const mongoUri = process.env['MONGODB_URI']
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined')
    }

    const client = new MongoClient(mongoUri)
    await client.connect()

    const db = client.db()
    const collection = db.collection('rendez-vous')

    // Essayer de supprimer par ObjectId d'abord
    let result = await collection.deleteOne({ _id: new ObjectId(id) })

    // Si pas trouvé, essayer par id string
    if (result.deletedCount === 0) {
      result = await collection.deleteOne({ id: id })
    }

    await client.close()

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Rendez-vous non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Rendez-vous supprimé avec succès',
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du RDV:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du rendez-vous' },
      { status: 500 }
    )
  }
}
