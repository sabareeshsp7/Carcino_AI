"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix default marker icons
// The _getIconUrl property is not necessary to delete
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface AddressMapProps {
  selectedPosition: { lat: number; lng: number } | null
  onPositionChange: (position: { lat: number; lng: number }) => void
}

// Default position (Mumbai, India)
const defaultPosition = { lat: 19.076, lng: 72.8777 }

function MapEvents({ onPositionChange }: { onPositionChange: (position: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng
      onPositionChange({ lat, lng })
    },
  })
  return null
}

export default function AddressMap({ selectedPosition, onPositionChange }: AddressMapProps) {
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number }>(defaultPosition)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fix: Add better error handling for geolocation
    if (typeof window !== "undefined" && navigator.geolocation) {
      const timeoutId = setTimeout(() => {
        console.log("Geolocation timeout, using default position")
        setCurrentPosition(defaultPosition)
        setIsLoading(false)
      }, 5000) // 5 second timeout

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId)
          const { latitude, longitude } = position.coords
          setCurrentPosition({ lat: latitude, lng: longitude })
          setIsLoading(false)
          console.log("Location obtained successfully")
        },
        (error) => {
          clearTimeout(timeoutId)
          // Fix: Better error handling with specific error messages
          let errorMessage = "Unknown error"
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "User denied the request for Geolocation"
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable"
              break
            case error.TIMEOUT:
              errorMessage = "The request to get user location timed out"
              break
          }
          console.log("Geolocation error:", errorMessage, "Using default position")
          setCurrentPosition(defaultPosition)
          setIsLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000, // 10 minutes
        }
      )

      return () => clearTimeout(timeoutId)
    } else {
      console.log("Geolocation not supported, using default position")
      setCurrentPosition(defaultPosition)
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  const mapCenter = selectedPosition || currentPosition

  return (
    <MapContainer
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={13}
      className="h-full w-full"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onPositionChange={onPositionChange} />
      {selectedPosition && (
        <Marker position={[selectedPosition.lat, selectedPosition.lng]} />
      )}
    </MapContainer>
  )
}

