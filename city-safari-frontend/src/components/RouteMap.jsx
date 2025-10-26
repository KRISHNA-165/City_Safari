import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Map, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map bounds when route changes
function MapBounds({ bounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && bounds.length === 2) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  
  return null;
}

const RouteMap = ({ fromCity: initialFromCity, destinationCity: initialDestinationCity }) => {
  const [fromCity, setFromCity] = useState(initialFromCity || '');
  const [toCity, setToCity] = useState(initialDestinationCity || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center
  const [mapBounds, setMapBounds] = useState(null);

  const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjEwMjVmYmFjN2NmMDQ0ZmU4YzM3ZWMwYzczYTdkYTExIiwiaCI6Im11cm11cjY0In0=';

  // Geocode city name to coordinates
  const geocodeCity = async (cityName) => {
    try {
      // Use ORS geocode endpoint with API key as query param to avoid CORS preflight
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(cityName)}&size=1`,
        { headers: { 'Accept': 'application/json' } }
      );
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Geocoding failed: invalid or missing API key');
        }
        if (response.status === 429) {
          throw new Error('Geocoding failed: rate limit exceeded, please try again later');
        }
        throw new Error(`Geocoding failed (HTTP ${response.status})`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const coords = data.features[0].geometry.coordinates;
        return {
          lng: coords[0],
          lat: coords[1],
          name: data.features[0].properties.label
        };
      } else {
        throw new Error(`City "${cityName}" not found`);
      }
    } catch (err) {
      // Typical browser error on CORS/network issues is TypeError: Failed to fetch
      if (err?.message?.includes('Failed to fetch')) {
        throw new Error(`Failed to find ${cityName}: network/CORS error. Check your internet connection and API key.`);
      }
      throw new Error(`Failed to find ${cityName}: ${err.message}`);
    }
  };

  // Get route between two coordinates
  const getRoute = async (startCoords, endCoords) => {
    try {
      const response = await fetch(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        {
          method: 'POST',
          headers: {
            'Authorization': ORS_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            coordinates: [
              [startCoords.lng, startCoords.lat],
              [endCoords.lng, endCoords.lat]
            ],
            format: 'geojson',
            units: 'km'
          })
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Route calculation failed: invalid or missing API key');
        }
        if (response.status === 429) {
          throw new Error('Route calculation failed: rate limit exceeded, please try again later');
        }
        throw new Error(`Route calculation failed (HTTP ${response.status})`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error(`Failed to calculate route: ${err.message}`);
    }
  };

  const handleShowRoute = async () => {
    if (!fromCity.trim() || !toCity.trim()) {
      setError('Please enter both cities');
      return;
    }

    setLoading(true);
    setError(null);
    setRouteData(null);

    try {
      // Geocode both cities
      const startCoords = await geocodeCity(fromCity);
      const endCoords = await geocodeCity(toCity);

      // Get route
      const routeResponse = await getRoute(startCoords, endCoords);

      if (routeResponse.features && routeResponse.features.length > 0) {
        const feature = routeResponse.features[0];
        const coordinates = feature.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        const properties = feature.properties;

        setRouteData({
          coordinates,
          distance: (properties.segments[0].distance / 1000).toFixed(2), // Convert to km
          duration: (properties.segments[0].duration / 3600).toFixed(2), // Convert to hours
          startCity: startCoords.name,
          endCity: endCoords.name,
          startCoords: [startCoords.lat, startCoords.lng],
          endCoords: [endCoords.lat, endCoords.lng]
        });

        // Set map bounds to show the entire route
        setMapBounds([
          [startCoords.lat, startCoords.lng],
          [endCoords.lat, endCoords.lng]
        ]);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Auto-load route if both cities are provided via props
  useEffect(() => {
    if (initialFromCity && initialDestinationCity && !routeData) {
      handleShowRoute();
    }
  }, [initialFromCity, initialDestinationCity]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Map className="text-purple-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Route Map</h2>
      </div>

      {/* Input Section */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter your city"
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex items-center justify-center text-purple-600">
            <Navigation size={24} />
          </div>
          <input
            type="text"
            placeholder="Enter destination city"
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleShowRoute}
          disabled={loading}
          className="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-purple-300"
        >
          {loading ? 'Loading Route...' : 'Show Route'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Route Info */}
      {routeData && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">From:</span>
              <span className="ml-2 text-gray-600">{routeData.startCity}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">To:</span>
              <span className="ml-2 text-gray-600">{routeData.endCity}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Distance:</span>
              <span className="ml-2 text-gray-600">{routeData.distance} km</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Duration:</span>
              <span className="ml-2 text-gray-600">{routeData.duration} hours</span>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={mapCenter}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {routeData && (
            <>
              {/* Start Marker */}
              <Marker position={routeData.startCoords}>
                <Popup>
                  <strong>Start:</strong> {routeData.startCity}
                </Popup>
              </Marker>

              {/* End Marker */}
              <Marker position={routeData.endCoords}>
                <Popup>
                  <strong>Destination:</strong> {routeData.endCity}
                </Popup>
              </Marker>

              {/* Route Line */}
              <Polyline
                positions={routeData.coordinates}
                color="blue"
                weight={4}
                opacity={0.7}
              />

              {/* Auto-fit bounds */}
              <MapBounds bounds={mapBounds} />
            </>
          )}
        </MapContainer>
      </div>

      {/* Instructions */}
      {!routeData && !loading && (
        <div className="mt-4 text-center text-gray-500 text-sm">
          Enter both cities and click "Show Route" to see the driving route on the map
        </div>
      )}
    </div>
  );
};

export default RouteMap;
