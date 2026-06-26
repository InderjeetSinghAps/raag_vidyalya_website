"use client"

import { useCallback } from "react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { MapPin, ExternalLink } from "lucide-react"

const containerStyle = {
  width: "100%",
}

interface StaticMapProps {
  lat: number
  lng: number
  height?: number
  zoom?: number
}

const defaultCenter = {
  lat: 31.2325,
  lng: 76.5025,
}

export function StaticMap({
  lat,
  lng,
  height = 280,
  zoom = 15,
}: StaticMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
  })

  const center = useCallback(
    () => ({ lat: lat || defaultCenter.lat, lng: lng || defaultCenter.lng }),
    [lat, lng],
  )

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`

  if (!apiKey || loadError) {
    return (
      <div className="space-y-3">
        <div
          className="flex items-center justify-center rounded-2xl border border-border/50 bg-card/80"
          style={{ height }}
        >
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary/80"
          >
            <MapPin className="size-4" />
            View on Google Maps
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div
        className="flex w-full animate-pulse items-center justify-center rounded-2xl bg-card/80"
        style={{ height }}
      >
        <div className="text-sm text-muted-foreground">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50">
      <div style={{ height }}>
        <GoogleMap
          mapContainerStyle={{ ...containerStyle, height: "100%" }}
          center={center()}
          zoom={zoom}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          <Marker position={{ lat, lng }} />
        </GoogleMap>
      </div>
    </div>
  )
}
