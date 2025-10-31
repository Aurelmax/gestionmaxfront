'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

// Import dynamique pour éviter les erreurs SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
  ssr: false,
})

const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })

const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })

const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

interface InteractiveMapProps {
  className?: string
}

export function InteractiveMap({ className = '' }: InteractiveMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Configuration des icônes Leaflet de manière dynamique
    const configureLeafletIcons = async () => {
      const L = await import('leaflet')

      // Corriger les icônes Leaflet par défaut

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
    }

    configureLeafletIcons()
  }, [])

  // Coordonnées de l'adresse : 300 chemin de la suquette, 06600 Antibes
  const position: [number, number] = [43.5804, 7.1251] // [lat, lng] pour Leaflet

  if (!isClient) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f3b8e] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={position}
        zoom={15}
        className="h-full w-full rounded-lg"
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="text-center p-2">
              <h3 className="font-bold text-[#1f3b8e] mb-2">GestionMax Formation</h3>
              <p className="text-sm text-gray-700 mb-2">
                300 chemin de la suquette
                <br />
                06600 Antibes
              </p>
              <div className="flex gap-2 justify-center mt-3">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=43.5804,7.1251"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1f3b8e] text-white px-3 py-1 rounded text-xs hover:bg-[#7eb33f] transition-colors"
                >
                  Itinéraire
                </a>
                <a
                  href="tel:0646022468"
                  className="bg-[#7eb33f] text-white px-3 py-1 rounded text-xs hover:bg-[#1f3b8e] transition-colors"
                >
                  Appeler
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Overlay avec informations */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
        <h3 className="font-bold text-[#1f3b8e] mb-2">📍 Notre adresse</h3>
        <p className="text-sm text-gray-700 mb-2">
          300 chemin de la suquette
          <br />
          06600 Antibes
        </p>
        <div className="flex flex-col gap-1 text-xs text-gray-600">
          <p>🚗 Parking disponible</p>
          <p>🚌 Accessible en transport</p>
          <p>♿ Accessible PMR</p>
        </div>
      </div>
    </div>
  )
}
