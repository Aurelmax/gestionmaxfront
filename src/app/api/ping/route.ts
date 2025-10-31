import { NextResponse } from 'next/server'

/**
 * Endpoint de test ultra-simple
 * Ne dépend pas de Payload, MongoDB, ou quoi que ce soit
 * Permet de vérifier si Next.js fonctionne sur Railway
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'pong',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'unknown',
    platform: process.platform,
    nodeVersion: process.version,
  })
}
