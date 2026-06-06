"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapInteraction({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapPicker() {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [address, setAddress] = useState("");

  return (
    <div className="space-y-3">
      <div className="h-[300px] rounded-lg overflow-hidden border relative" style={{ zIndex: 0 }}>
        <MapContainer 
          center={[37.7749, -122.4194]} 
          zoom={13} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {selectedLocation && (
            <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
          )}
          <MapInteraction onSelect={(lat, lng) => setSelectedLocation({ lat, lng })} />
        </MapContainer>
      </div>

      <div className="p-2 bg-muted flex items-center gap-2 rounded-md border">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <span className="text-sm text-muted-foreground truncate">
          {selectedLocation
            ? `Selected: ${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`
            : "Click anywhere on the map to drop a pin"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Input 
          placeholder="Latitude" 
          value={selectedLocation?.lat.toFixed(6) ?? ""} 
          readOnly 
          className="bg-muted/50"
        />
        <Input 
          placeholder="Longitude" 
          value={selectedLocation?.lng.toFixed(6) ?? ""} 
          readOnly 
          className="bg-muted/50"
        />
      </div>
      
      <Input
        placeholder="Location description (e.g. 'Main Library 2nd Floor')"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        name="location"
        required
      />
      
      {/* Hidden inputs to send lat/lng to the backend form submission */}
      <input type="hidden" name="latitude" value={selectedLocation?.lat ?? ""} />
      <input type="hidden" name="longitude" value={selectedLocation?.lng ?? ""} />
    </div>
  );
}
