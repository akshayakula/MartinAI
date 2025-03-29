import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Customize Leaflet map to match our theme
const MapTheme = () => {
  React.useEffect(() => {
    const mapElement = document.querySelector('.leaflet-container');
    if (mapElement) {
      mapElement.style.background = '#1A1F29';
      
      // Add custom styles to the map container
      const style = document.createElement('style');
      style.textContent = `
        .leaflet-tile-pane {
          filter: brightness(0.7) grayscale(30%) hue-rotate(180deg);
        }
        .leaflet-control-attribution {
          background: rgba(13, 17, 23, 0.7) !important;
          color: #8A8A9B !important;
        }
        .leaflet-control-zoom {
          border-color: #3C3C4E !important;
          background: rgba(13, 17, 23, 0.8) !important;
        }
        .leaflet-control-zoom a {
          color: #E6E6E6 !important;
          border-color: #3C3C4E !important;
        }
        .leaflet-popup-content-wrapper {
          background: #1A1F29 !important;
          color: #E6E6E6 !important;
          border: 1px solid #3C3C4E !important;
          border-radius: 4px !important;
        }
        .leaflet-popup-tip {
          background: #1A1F29 !important;
          border: 1px solid #3C3C4E !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  
  return null;
};

// Custom marker icon
const createMarkerIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; border: 2px solid #3C3C4E; box-shadow: 0 0 6px ${color}"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
};

export const CommandMap = ({ vessels = [], geofences = [], center = [0, 0], zoom = 3 }) => {
  return (
    <div className="bg-background-light rounded-md border border-border p-2 h-[500px] relative">
      <MapTheme />
      
      <div className="absolute top-3 left-3 z-50 bg-background bg-opacity-75 border border-border px-3 py-2 rounded text-xs text-text-secondary">
        <div className="text-text-muted uppercase tracking-wider text-[10px] mb-1">MARITIME COMMAND</div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-debugger-blue mr-1"></div>
            <span>Vessels: {vessels.length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-debugger-green mr-1"></div>
            <span>Geofences: {geofences.length}</span>
          </div>
        </div>
      </div>
      
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        className="rounded-sm z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {vessels.map((vessel, index) => (
          <Marker 
            key={`vessel-${index}`}
            position={[vessel.lat, vessel.lon]}
            icon={createMarkerIcon(vessel.alert ? '#FF5D8F' : '#6FCBFF')}
          >
            <Popup>
              <div>
                <h3 className="font-medium">{vessel.name || 'Unknown vessel'}</h3>
                <div className="text-xs mt-1">MMSI: {vessel.mmsi}</div>
                <div className="text-xs">Speed: {vessel.speed} knots</div>
                {vessel.destination && (
                  <div className="text-xs">Destination: {vessel.destination}</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="absolute bottom-3 right-3 z-50 bg-background bg-opacity-75 border border-border rounded px-2 py-1 text-[10px] text-text-muted">
        LAT: {center[0].toFixed(4)} LON: {center[1].toFixed(4)}
      </div>
    </div>
  );
}; 