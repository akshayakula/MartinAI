import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Marker, Popup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import { geofenceAPI, vesselAPI } from '../utils/api';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom vessel icon
const vesselIcon = new L.Icon({
  iconUrl: '/vessel-icon.png', // Add this icon to your public folder
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10],
});

const GeofenceMap = () => {
  const [geofences, setGeofences] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [activeGeofence, setActiveGeofence] = useState(null);
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // Default to San Francisco
  const [mapZoom, setMapZoom] = useState(10);
  const featureGroupRef = useRef(null);

  // Load geofences on component mount
  useEffect(() => {
    loadGeofences();
  }, []);

  // Load vessels when active geofence changes
  useEffect(() => {
    if (activeGeofence) {
      loadVesselsInGeofence(activeGeofence);
    }
  }, [activeGeofence]);

  // Load all geofences from API
  const loadGeofences = async () => {
    try {
      const response = await geofenceAPI.getAll();
      setGeofences(response.data);
      
      // If geofences exist, set the active one and center map
      if (response.data.length > 0) {
        setActiveGeofence(response.data[0]);
        centerMapOnGeofence(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading geofences:', error);
    }
  };

  // Load vessels within the bounding box of a geofence
  const loadVesselsInGeofence = async (geofence) => {
    try {
      const bbox = calculateBoundingBox(geofence.geoJson);
      const response = await vesselAPI.getInBbox(bbox);
      setVessels(response.data);
    } catch (error) {
      console.error('Error loading vessels:', error);
    }
  };

  // Calculate bounding box from geofence polygon
  const calculateBoundingBox = (geoJson) => {
    const coordinates = geoJson.coordinates[0]; // Assuming the first polygon
    
    let minLat = 90;
    let maxLat = -90;
    let minLon = 180;
    let maxLon = -180;
    
    for (const coord of coordinates) {
      const lon = coord[0];
      const lat = coord[1];
      
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
    }
    
    return `${minLat},${minLon},${maxLat},${maxLon}`;
  };

  // Center map on geofence
  const centerMapOnGeofence = (geofence) => {
    if (!geofence || !geofence.geoJson) return;
    
    const bbox = calculateBoundingBox(geofence.geoJson);
    const [minLat, minLon, maxLat, maxLon] = bbox.split(',').map(parseFloat);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;
    
    setMapCenter([centerLat, centerLon]);
  };

  // Handle creation of new geofence
  const handleGeofenceCreated = async (e) => {
    try {
      const layer = e.layer;
      const geoJson = layer.toGeoJSON();
      
      const name = prompt('Enter a name for this geofence:');
      if (!name) {
        featureGroupRef.current.clearLayers();
        return;
      }
      
      const newGeofence = {
        name,
        geoJson: geoJson.geometry,
        active: true,
      };
      
      const response = await geofenceAPI.create(newGeofence);
      setGeofences([...geofences, response.data]);
      setActiveGeofence(response.data);
      featureGroupRef.current.clearLayers();
    } catch (error) {
      console.error('Error creating geofence:', error);
    }
  };

  // Handle editing of existing geofence
  const handleGeofenceEdited = async (e) => {
    try {
      const layers = e.layers;
      layers.eachLayer(async (layer) => {
        const geoJson = layer.toGeoJSON();
        
        if (activeGeofence) {
          const updatedGeofence = {
            ...activeGeofence,
            geoJson: geoJson.geometry,
          };
          
          const response = await geofenceAPI.update(activeGeofence._id, updatedGeofence);
          setGeofences(geofences.map(g => g._id === activeGeofence._id ? response.data : g));
          setActiveGeofence(response.data);
        }
      });
    } catch (error) {
      console.error('Error editing geofence:', error);
    }
  };

  // Handle deletion of geofence
  const handleGeofenceDeleted = async (e) => {
    try {
      const layers = e.layers;
      layers.eachLayer(async (layer) => {
        if (activeGeofence) {
          await geofenceAPI.delete(activeGeofence._id);
          setGeofences(geofences.filter(g => g._id !== activeGeofence._id));
          
          if (geofences.length > 1) {
            const nextGeofence = geofences.find(g => g._id !== activeGeofence._id);
            setActiveGeofence(nextGeofence);
          } else {
            setActiveGeofence(null);
          }
        }
      });
    } catch (error) {
      console.error('Error deleting geofence:', error);
    }
  };

  return (
    <div className="h-[600px] w-full">
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Drawing and editing tools */}
        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={handleGeofenceCreated}
            onEdited={handleGeofenceEdited}
            onDeleted={handleGeofenceDeleted}
            draw={{
              rectangle: false,
              circle: false,
              circlemarker: false,
              marker: false,
            }}
          />
        </FeatureGroup>
        
        {/* Display vessels */}
        {vessels.map(vessel => (
          <Marker
            key={vessel.mmsi}
            position={[vessel.lat, vessel.lon]}
            icon={vesselIcon}
            rotationAngle={vessel.course || 0}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{vessel.name || 'Unknown Vessel'}</h3>
                <p>MMSI: {vessel.mmsi}</p>
                <p>Speed: {vessel.speed} knots</p>
                <p>Course: {vessel.course}°</p>
                {vessel.destination && <p>Destination: {vessel.destination}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Geofence selector */}
      <div className="mt-4">
        <label className="block mb-2">Select Geofence:</label>
        <select
          className="w-full p-2 border rounded"
          value={activeGeofence?._id || ''}
          onChange={(e) => {
            const selected = geofences.find(g => g._id === e.target.value);
            setActiveGeofence(selected);
            centerMapOnGeofence(selected);
          }}
        >
          <option value="">-- Select a geofence --</option>
          {geofences.map(geofence => (
            <option key={geofence._id} value={geofence._id}>
              {geofence.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default GeofenceMap; 