import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-pulse-icon';

interface GeofenceEffectProps {
  coordinates: [number, number][];
  active?: boolean;
}

const GeofenceEffect: React.FC<GeofenceEffectProps> = ({ coordinates, active = true }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!active || !coordinates.length) return;
    
    // Create a scanning effect within the geofence
    const polygon = L.polygon(coordinates, {
      color: '#14b8a6',
      weight: 2,
      opacity: 0.7,
      fillColor: '#0ea5e9',
      fillOpacity: 0.1,
      dashArray: '5, 10',
      className: 'animate-pulse',
    }).addTo(map);
    
    // Add pulse markers at vertices
    const markers = coordinates.map(coord => {
      const pulseIcon = L.icon.pulse({
        iconSize: [12, 12],
        color: '#22d3ee',
        fillColor: '#22d3ee',
        heartbeat: 2,
      });
      
      return L.marker(coord as L.LatLngExpression, { icon: pulseIcon }).addTo(map);
    });
    
    // Add scan line effect
    const scanLine = document.createElement('div');
    scanLine.className = 'absolute h-full w-[2px] bg-highlight z-[1000] animate-scan';
    map.getContainer().appendChild(scanLine);
    
    return () => {
      polygon.remove();
      markers.forEach(marker => marker.remove());
      if (scanLine.parentNode) {
        scanLine.parentNode.removeChild(scanLine);
      }
    };
  }, [map, coordinates, active]);
  
  return null;
};

export default GeofenceEffect; 