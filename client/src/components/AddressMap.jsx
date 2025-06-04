import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapViewUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const AddressMap = ({ coordinates, address, onMapClick }) => {
  const defaultCenter = [28.6139, 77.2090]; // Default to New Delhi
  const defaultZoom = 12;
  const mapRef = useRef();

  // Normalize coordinates to [lat, lng] array for Leaflet
  let position = defaultCenter;
  let latDisplay = 'N/A';
  let lngDisplay = 'N/A';

  if (coordinates) {
    if (Array.isArray(coordinates)) {
      // GeoJSON: [lng, lat]
      position = [coordinates[1], coordinates[0]];
      latDisplay = typeof coordinates[1] === 'number' ? coordinates[1].toFixed(6) : 'N/A';
      lngDisplay = typeof coordinates[0] === 'number' ? coordinates[0].toFixed(6) : 'N/A';
    } else if (typeof coordinates === 'object' && coordinates.lat !== undefined && coordinates.lng !== undefined) {
      position = [coordinates.lat, coordinates.lng];
      latDisplay = typeof coordinates.lat === 'number' ? coordinates.lat.toFixed(6) : 'N/A';
      lngDisplay = typeof coordinates.lng === 'number' ? coordinates.lng.toFixed(6) : 'N/A';
    }
  }

  const handleMapClick = (e) => {
    if (onMapClick) {
      onMapClick({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    }
  };

  return (
    <MapContainer
      center={position}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
      ref={mapRef}
      onClick={handleMapClick}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapViewUpdater center={position} zoom={defaultZoom} />

      {(coordinates && latDisplay !== 'N/A' && lngDisplay !== 'N/A') && (
        <Marker position={position}>
          <Popup>
            <div className="font-medium">{address}</div>
            <div className="text-sm text-gray-600">
              Lat: {latDisplay}, Lng: {lngDisplay}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default AddressMap;