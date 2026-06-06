"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function MapComponent({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}) {
  const [lat, setLat] = useState(14.5995);
  const [lng, setLng] = useState(120.9842);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <div className="h-[300px] rounded-lg overflow-hidden border">
      <iframe
        title="map"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`}
        style={{ border: 0 }}
      />
      <div className="p-2 bg-muted flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm text-muted-foreground">
          {marker
            ? `Selected: ${marker.lat.toFixed(5)}, ${marker.lng.toFixed(5)}`
            : "Click on the map to select location"}
        </span>
      </div>
    </div>
  );
}

const MapComponentSafe = dynamic(() => Promise.resolve(MapComponent), { ssr: false });

export function MapPicker() {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const address = selectedLocation
    ? `${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`
    : "";

  return (
    <div className="space-y-3">
      <MapComponentSafe
        onLocationSelect={(lat, lng) => {
          setSelectedLocation({ lat, lng });
        }}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="Latitude"
          value={selectedLocation?.lat.toFixed(6) ?? ""}
          readOnly
        />
        <Input
          placeholder="Longitude"
          value={selectedLocation?.lng.toFixed(6) ?? ""}
          readOnly
        />
      </div>
      <Input
        placeholder="Location name or description"
        value={address}
        onChange={(e) => {}}
        name="location"
      />
      <input type="hidden" name="latitude" value={selectedLocation?.lat ?? 0} />
      <input type="hidden" name="longitude" value={selectedLocation?.lng ?? 0} />
    </div>
  );
}
