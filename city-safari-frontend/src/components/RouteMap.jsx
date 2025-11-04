import { useEffect, useState } from 'react';
import { Navigation, MapPin, Clock, DollarSign, Car, Bike, Bus } from 'lucide-react';

// Replaces the previous interactive map with a simple Google Maps route launcher
const RouteMap = ({ fromCity: initialFromCity, destinationCity: initialDestinationCity }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selectedMode, setSelectedMode] = useState('car'); // 'car' | 'bike' | 'bus'

  useEffect(() => {
    if (initialFromCity) setFrom(initialFromCity);
    if (initialDestinationCity) setTo(initialDestinationCity);
  }, [initialFromCity, initialDestinationCity]);

  const handlePlanRoute = () => {
    if (!from || !to) {
      window.alert('Please enter both locations');
      return;
    }

    const travelMode = selectedMode === 'car' ? 'driving' : selectedMode === 'bike' ? 'bicycling' : 'transit';
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&travelmode=${travelMode}`;
    window.open(mapsUrl, '_blank');
  };

  const modes = [
    { id: 'car', icon: Car, label: 'Driving'},
    { id: 'bike', icon: Bike, label: 'Cycling'},
    { id: 'bus', icon: Bus, label: 'Transit' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Navigation className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Route for Destination</h2>
      </div>

      {/* Location Inputs */}
      <div className="mb-4 space-y-3">
        <div>
          <label htmlFor="from" className="block text-gray-700 font-semibold mb-2">From</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              id="from"
              placeholder="Current location"
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="to" className="block text-gray-700 font-semibold mb-2">To</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-blue-600" />
            <input
              id="to"
              placeholder="Destination"
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Travel Modes */}
      <div className="space-y-2 mb-4">
        <label className="block text-gray-700 font-semibold">Travel Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {modes.map((mode) => (
            <button
              type="button"
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`p-3 rounded-lg border-2 transition ${
                selectedMode === mode.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <mode.icon className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs font-medium">{mode.label}</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {mode.time}
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                <DollarSign className="w-3 h-3" />
                {mode.cost}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handlePlanRoute}
        className="w-full py-3 bg-gradient-to-r from-sky-400 to-blue-600 text-white rounded-lg font-semibold hover:from-sky-500 hover:to-blue-700 transition"
      >
        Show Route
      </button>
    </div>
  );
};

export default RouteMap;
