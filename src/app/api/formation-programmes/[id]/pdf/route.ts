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
    const collection = db.collection('formations_personnalisees')

    const resolvedParams = await params
    const id = new ObjectId(resolvedParams.id)
    const formation = await collection.findOne({ _id: id })

    await client.close()

    if (!formation) {
      return NextResponse.json({ success: false, error: 'Formation non trouvée' }, { status: 404 })
    }

    // Générer le contenu HTML du PDF
    const htmlContent = generateFormationHTML(formation)

    // Pour l'instant, retourner le HTML (dans une vraie implémentation,
    // vous utiliseriez une librairie comme puppeteer ou jsPDF)
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${formation['title'].replace(/[^a-zA-Z0-9]/g, '_')}.html"`,
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

function generateFormationHTML(formation: any): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formation['title']}</title>
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
        .programme-detail {
            background: #f0f8ff;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .jour {
            font-weight: bold;
            color: #1f3b8e;
            margin-bottom: 10px;
        }
        .module {
            margin-left: 20px;
            margin-bottom: 10px;
        }
        .module-title {
            font-weight: bold;
            color: #333;
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
        <h1>${formation['title']}</h1>
        <div class="code">Code: ${formation.codeFormation}</div>
    </div>

    <div class="section">
        <h2>Informations générales</h2>
        <div class="info-grid">
            <div class="info-item">
                <strong>Statut:</strong> ${formation.statut}
            </div>
            <div class="info-item">
                <strong>Durée:</strong> ${formation.modalitesAcces?.duree || 'Non spécifiée'}
            </div>
            <div class="info-item">
                <strong>Tarif:</strong> ${formation.modalitesAcces?.tarif || 'Non spécifié'}€
            </div>
            <div class="info-item">
                <strong>Horaires:</strong> ${formation.modalitesAcces?.horaires || 'Non spécifiés'}
            </div>
        </div>
    </div>

    ${
      formation.objectifs
        ? `
    <div class="section">
        <h2>Objectifs pédagogiques</h2>
        <div class="programme-detail">
            ${formatRichText(formation.objectifs)}
        </div>
    </div>
    `
        : ''
    }

    ${
      formation.programmeDetail && formation.programmeDetail.length > 0
        ? `
    <div class="section">
        <h2>Programme détaillé</h2>
        ${formation.programmeDetail
          .map(
            (jour: any) => `
        <div class="programme-detail">
            <div class="jour">${jour.jour} - ${jour.duree}</div>
            ${
              jour.modules
                ? jour.modules
                    .map(
                      (module: any) => `
            <div class="module">
                <div class="module-title">${module.titre}${module.duree ? ` (${module.duree})` : ''}</div>
                ${module.description ? `<p>${module.description}</p>` : ''}
                ${module.contenu ? formatRichText(module.contenu) : ''}
            </div>
            `
                    )
                    .join('')
                : ''
            }
        </div>
        `
          )
          .join('')}
    </div>
    `
        : ''
    }

    ${
      formation.modalitesAcces?.prerequis
        ? `
    <div class="section">
        <h2>Prérequis</h2>
        <p>${formation.modalitesAcces.prerequis}</p>
    </div>
    `
        : ''
    }

    ${
      formation.modalitesAcces?.publicConcerne
        ? `
    <div class="section">
        <h2>Public concerné</h2>
        <p>${formation.modalitesAcces.publicConcerne}</p>
    </div>
    `
        : ''
    }

    ${
      formation.modalitesPedagogiques
        ? `
    <div class="section">
        <h2>Modalités pédagogiques</h2>
        <div class="programme-detail">
            ${formatRichText(formation.modalitesPedagogiques)}
        </div>
    </div>
    `
        : ''
    }

    ${
      formation.ressourcesDispo && formation.ressourcesDispo.length > 0
        ? `
    <div class="section">
        <h2>Ressources disponibles</h2>
        <ul>
            ${formation.ressourcesDispo
              .map(
                (ressource: any) => `
            <li><strong>${ressource.ressource}:</strong> ${ressource.description || ''}</li>
            `
              )
              .join('')}
        </ul>
    </div>
    `
        : ''
    }

    ${
      formation.modalitesEvaluation
        ? `
    <div class="section">
        <h2>Modalités d'évaluation</h2>
        ${
          formation.modalitesEvaluation.typesEvaluation &&
          formation.modalitesEvaluation.typesEvaluation.length > 0
            ? `
        <h3>Types d'évaluation</h3>
        <ul>
            ${formation.modalitesEvaluation.typesEvaluation
              .map(
                (evaluation: any) => `
            <li><strong>${evaluation.type}:</strong> ${evaluation.description || ''}</li>
            `
              )
              .join('')}
        </ul>
        `
            : ''
        }
        ${
          formation.modalitesEvaluation.plateformeEvaluation
            ? `
        <p><strong>Plateforme d'évaluation:</strong> ${formation.modalitesEvaluation.plateformeEvaluation}</p>
        `
            : ''
        }
        ${
          formation.modalitesEvaluation.grilleAnalyse
            ? `
        <p><strong>Grille d'analyse:</strong> ${formation.modalitesEvaluation.grilleAnalyse}</p>
        `
            : ''
        }
    </div>
    `
        : ''
    }

    ${
      formation.sanction_formation || formation.niveau_certification
        ? `
    <div class="section">
        <h2>Certification</h2>
        ${formation.sanction_formation ? `<p><strong>Sanction:</strong> ${formation.sanction_formation}</p>` : ''}
        ${formation.niveau_certification ? `<p><strong>Niveau:</strong> ${formation.niveau_certification}</p>` : ''}
    </div>
    `
        : ''
    }

    ${
      formation.contactFormateur
        ? `
    <div class="section">
        <h2>Contact formateur</h2>
        <div class="contact-info">
            <h3>${formation.contactFormateur.nom}</h3>
            ${formation.contactFormateur.role ? `<p><strong>Rôle:</strong> ${formation.contactFormateur.role}</p>` : ''}
            ${formation.contactFormateur.email ? `<p><strong>Email:</strong> ${formation.contactFormateur.email}</p>` : ''}
            ${formation.contactFormateur.telephone ? `<p><strong>Téléphone:</strong> ${formation.contactFormateur.telephone}</p>` : ''}
            ${formation.contactFormateur.biographie ? `<p><strong>Biographie:</strong> ${formation.contactFormateur.biographie}</p>` : ''}
        </div>
    </div>
    `
        : ''
    }

    ${
      formation.accessibilite_handicap
        ? `
    <div class="section">
        <h2>Accessibilité handicap</h2>
        ${
          formation.accessibilite_handicap.referent_handicap
            ? `
        <p><strong>Référent handicap:</strong> ${formation.accessibilite_handicap.referent_handicap}</p>
        `
            : ''
        }
        ${
          formation.accessibilite_handicap.contact_referent
            ? `
        <p><strong>Contact référent:</strong> ${formation.accessibilite_handicap.contact_referent}</p>
        `
            : ''
        }
        ${
          formation.accessibilite_handicap.adaptations_proposees
            ? `
        <p><strong>Adaptations proposées:</strong> ${formation.accessibilite_handicap.adaptations_proposees}</p>
        `
            : ''
        }
    </div>
    `
        : ''
    }

    ${
      formation.cessation_abandon
        ? `
    <div class="section">
        <h2>Conditions d'abandon</h2>
        ${
          formation.cessation_abandon.conditions_renonciation
            ? `
        <p><strong>Conditions de renonciation:</strong> ${formation.cessation_abandon.conditions_renonciation}</p>
        `
            : ''
        }
        ${
          formation.cessation_abandon.facturation_abandon
            ? `
        <p><strong>Facturation en cas d'abandon:</strong> ${formation.cessation_abandon.facturation_abandon}</p>
        `
            : ''
        }
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

function formatRichText(richText: any): string {
  if (!richText || !richText.root || !richText.root.children) {
    return ''
  }

  return richText.root.children
    .map((child: any) => {
      if (child.type === 'p') {
        return `<p>${child.children.map((textChild: any) => textChild.text || '').join('')}</p>`
      }
      return ''
    })
    .join('')
}
