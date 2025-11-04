import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const CityAutocomplete = ({ value, onChange, placeholder, label }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef(null);
  const wrapperRef = useRef(null);

  // OpenWeather API key from environment variable
  const OPENWEATHER_API_KEY = 'a098dd84820b25e918d1960b379378bc';

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch city suggestions from OpenWeather API
  const fetchCitySuggestions = async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          query
        )}&limit=5&appid=${OPENWEATHER_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      
      // Format the data to include city, state, and country
      const formattedSuggestions = data.map((item) => ({
        name: item.name,
        state: item.state || '',
        country: item.country,
        fullName: `${item.name}${item.state ? ', ' + item.state : ''}, ${item.country}`,
        lat: item.lat,
        lon: item.lon,
      }));

      setSuggestions(formattedSuggestions);
      setShowSuggestions(formattedSuggestions.length > 0);
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce the search
  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      fetchCitySuggestions(value);
    }, 300); // 300ms debounce delay

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  // Handle input change
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
          autoComplete="off"
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.name}-${suggestion.lat}-${suggestion.lon}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
            >
              <MapPin size={18} className="text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-gray-900 font-medium">{suggestion.name}</div>
                <div className="text-sm text-gray-500">
                  {suggestion.state && `${suggestion.state}, `}
                  {suggestion.country}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && suggestions.length === 0 && value.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="text-gray-500 text-center">No cities found</div>
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete;
