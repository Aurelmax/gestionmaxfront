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

    // Générer le contenu HTML du PDF
    const htmlContent = generateProgrammeHTML(programme)

    // Pour l'instant, retourner le HTML (dans une vraie implémentation,
    // vous utiliseriez une librairie comme puppeteer ou jsPDF)
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${programme['titre'].replace(/[^a-zA-Z0-9]/g, '_')}.html"`,
      },
    })
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la génération du PDF' },
      { status: 500 }
    )
  }
}

function generateProgrammeHTML(programme: any): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${programme['titre']}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #1f3b8e;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1f3b8e;
            margin: 0;
            font-size: 24px;
        }
        .header .code {
            color: #666;
            font-size: 14px;
            margin-top: 5px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section h2 {
            color: #1f3b8e;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            font-size: 18px;
        }
        .section h3 {
            color: #333;
            font-size: 16px;
            margin-top: 15px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 15px 0;
        }
        .info-item {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
        }
        .info-item strong {
            color: #1f3b8e;
        }
        .competences {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 10px 0;
        }
        .competence {
            background: #e3f2fd;
            color: #1f3b8e;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
        }
        .contact-info {
            background: #f0f8ff;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #1f3b8e;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        @media print {
            body { margin: 0; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${programme['titre']}</h1>
        <div class="code">Code: ${programme.codeFormation}</div>
    </div>

    <div class="section">
        <h2>Informations générales</h2>
        <div class="info-grid">
            <div class="info-item">
                <strong>Durée:</strong> ${programme.duree} heures
            </div>
            <div class="info-item">
                <strong>Niveau:</strong> ${programme.niveau}
            </div>
            <div class="info-item">
                <strong>Modalités:</strong> ${programme.modalites}
            </div>
            <div class="info-item">
                <strong>Prix:</strong> ${programme.prix}€
            </div>
        </div>
        ${
          programme.horaires
            ? `
        <div class="info-item">
            <strong>Horaires:</strong> ${programme.horaires}
        </div>
        `
            : ''
        }
    </div>

    ${
      programme.description
        ? `
    <div class="section">
        <h2>Description</h2>
        <p>${programme.description.replace(/\n/g, '<br>')}</p>
    </div>
    `
        : ''
    }

    ${
      programme.objectifs
        ? `
    <div class="section">
        <h2>Objectifs pédagogiques</h2>
        <p>${programme.objectifs.replace(/\n/g, '<br>')}</p>
    </div>
    `
        : ''
    }

    ${
      programme.prerequis
        ? `
    <div class="section">
        <h2>Prérequis</h2>
        <p>${programme.prerequis.replace(/\n/g, '<br>')}</p>
    </div>
    `
        : ''
    }

    ${
      programme.publicConcerne
        ? `
    <div class="section">
        <h2>Public concerné</h2>
        <p>${programme.publicConcerne.replace(/\n/g, '<br>')}</p>
    </div>
    `
        : ''
    }

    ${
      programme.competences && programme.competences.length > 0
        ? `
    <div class="section">
        <h2>Compétences développées</h2>
        <div class="competences">
            ${programme.competences.map((comp: string) => `<span class="competence">${comp}</span>`).join('')}
        </div>
    </div>
    `
        : ''
    }

    ${
      programme.ressources && programme.ressources.length > 0
        ? `
    <div class="section">
        <h2>Ressources et matériel</h2>
        <ul>
            ${programme.ressources.map((ressource: string) => `<li>${ressource}</li>`).join('')}
        </ul>
    </div>
    `
        : ''
    }

    ${
      programme.modalitesEvaluation
        ? `
    <div class="section">
        <h2>Modalités d'évaluation</h2>
        <p>${programme.modalitesEvaluation.replace(/\n/g, '<br>')}</p>
    </div>
    `
        : ''
    }

    ${
      programme.sanctionFormation || programme.niveauCertification
        ? `
    <div class="section">
        <h2>Certification</h2>
        ${programme.sanctionFormation ? `<p><strong>Sanction:</strong> ${programme.sanctionFormation}</p>` : ''}
        ${programme.niveauCertification ? `<p><strong>Niveau:</strong> ${programme.niveauCertification}</p>` : ''}
    </div>
    `
        : ''
    }

    ${
      programme.formateurNom
        ? `
    <div class="section">
        <h2>Contact formateur</h2>
        <div class="contact-info">
            <h3>${programme.formateurNom}</h3>
            ${programme.formateurRole ? `<p><strong>Rôle:</strong> ${programme.formateurRole}</p>` : ''}
            ${programme.formateurEmail ? `<p><strong>Email:</strong> ${programme.formateurEmail}</p>` : ''}
            ${programme.formateurTelephone ? `<p><strong>Téléphone:</strong> ${programme.formateurTelephone}</p>` : ''}
            ${programme.formateurBiographie ? `<p><strong>Biographie:</strong> ${programme.formateurBiographie}</p>` : ''}
        </div>
    </div>
    `
        : ''
    }

    ${
      programme.accessibiliteHandicap
        ? `
    <div class="section">
        <h2>Accessibilité handicap</h2>
        <p>${programme.accessibiliteHandicap.replace(/\n/g, '<br>')}</p>
    </div>
    `
        : ''
    }

    ${
      programme.cessationAbandon
        ? `
    <div class="section">
        <h2>Conditions d'abandon</h2>
        <p>${programme.cessationAbandon.replace(/\n/g, '<br>')}</p>
    </div>
    `
        : ''
    }

    <div class="footer">
        <p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        <p>GestionMax Formation - Organisme de formation professionnelle certifié Qualiopi</p>
    </div>
</body>
</html>
  `
}
