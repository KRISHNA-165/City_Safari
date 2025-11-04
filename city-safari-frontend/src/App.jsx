import { useState, useEffect, useRef } from 'react';
import { User, ArrowLeft, Bus, MapPin, Utensils, Calendar, CloudSun, LogOut, UserCircle, Clock, Trash2, Plane, Hotel } from 'lucide-react';
import RouteMap from './components/RouteMap';
import CityAutocomplete from './components/CityAutocomplete';

// Navbar Compo nent - Updated with authentication
const Navbar = ({ setView, user, onLogout }) => {
  return (
    <nav className="flex justify-between items-center p-6 text-white">
      <div className="text-2xl font-bold cursor-pointer" onClick={() => setView('Home')}>
        City Safari
      </div>
      <div className="flex gap-8 items-center">
        <button onClick={() => setView('Home')} className="hover:underline">
          Home
        </button>
        <button className="hover:underline">About Us</button>
        <button className="hover:underline">Services</button>
      </div>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <button
              onClick={() => setView('Profile')}
              className="flex items-center gap-2 px-6 py-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition"
            >
              <UserCircle size={20} />
              {user.fullName}
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              <LogOut size={20} />
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setView('SignUp')}
              className="flex items-center gap-2 px-6 py-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition"
            >
              <User size={20} />
              Sign Up
            </button>
            <button
              onClick={() => setView('Login')}
              className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

// HomePage Component
const HomePage = ({ setView, setDestinationCity, setFromCity, user }) => {
  const [fromCityInput, setFromCityInput] = useState('');
  const [toCity, setToCity] = useState('');

  const handleGetReport = () => {
    if (toCity.trim()) {
      // Save to search history
      const historyItem = {
        city: toCity,
        timestamp: new Date().toISOString(),
      };

      // Get existing history from localStorage
      const existingHistory = localStorage.getItem(`searchHistory_${user.userId}`);
      let history = existingHistory ? JSON.parse(existingHistory) : [];

      // Add new search to the beginning (most recent first)
      // Remove duplicate if exists
      history = history.filter(item => item.city.toLowerCase() !== toCity.toLowerCase());
      history.unshift(historyItem);

      // Keep only last 20 searches
      history = history.slice(0, 20);

      // Save back to localStorage
      localStorage.setItem(`searchHistory_${user.userId}`, JSON.stringify(history));

      setFromCity(fromCityInput); // Set the fromCity in parent state
      setDestinationCity(toCity);
      setView('Report');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-white py-20 px-4">
        <h1 className="text-6xl font-bold mb-4">City Safari</h1>
        <p className="text-2xl mb-12">Discover amazing places around the world</p>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
          <div className="space-y-6">
            <CityAutocomplete
              value={fromCityInput}
              onChange={setFromCityInput}
              placeholder="Enter your city"
              label="From"
            />
            <CityAutocomplete
              value={toCity}
              onChange={setToCity}
              placeholder="Enter destination city"
              label="To"
            />
            <button
              onClick={handleGetReport}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Travel Report
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-sky-50 py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-8">Why Choose City Safari?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Comprehensive Travel Reports</h3>
                  <p className="text-gray-600">Get detailed information about your destination in seconds</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">AI-Powered Insights</h3>
                  <p className="text-gray-600">Leverage cutting-edge AI to discover hidden gems</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Real-Time Updates</h3>
                  <p className="text-gray-600">Stay informed with the latest travel information</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">What We Offer</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Transportation guides and local transit information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Must-visit attractions with ratings and reviews</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Local food recommendations and restaurant guides</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Weather forecasts and best times to visit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Events and activities happening during your stay</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Essential travel tips from local experts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">Our Services</h2>
          <p className="text-center text-gray-600 mb-12">Everything you need for the perfect trip</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Service Card 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <Bus className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Transportation</h3>
              <p className="text-gray-600 text-sm mb-4">Complete guide to getting around</p>
              <button className="text-blue-600 font-semibold text-sm hover:underline">Learn More →</button>
            </div>

            {/* Service Card 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Attractions</h3>
              <p className="text-gray-600 text-sm mb-4">Discover must-visit places</p>
              <button className="text-blue-600 font-semibold text-sm hover:underline">Learn More →</button>
            </div>

            {/* Service Card 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <Utensils className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Local Food</h3>
              <p className="text-gray-600 text-sm mb-4">Best restaurants and cuisine</p>
              <button className="text-blue-600 font-semibold text-sm hover:underline">Learn More →</button>
            </div>

            {/* Service Card 4 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Events</h3>
              <p className="text-gray-600 text-sm mb-4">Upcoming activities and festivals</p>
              <button className="text-blue-600 font-semibold text-sm hover:underline">Learn More →</button>
            </div>

            {/* Service Card 5 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <CloudSun className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Weather</h3>
              <p className="text-gray-600 text-sm mb-4">Current and forecast information</p>
              <button className="text-blue-600 font-semibold text-sm hover:underline">Learn More →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// LoginPage Component
const LoginPage = ({ setView, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage
        const userData = {
          userId: data.userId,
          email: data.email,
          fullName: data.fullName,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Call the success callback
        onLoginSuccess(userData);
        setView('Home'); // Navigate to home page
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please make sure the backend is running.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
  <h2 className="text-3xl font-bold text-blue-900 mb-2">Welcome to City Safari</h2>
        <p className="text-gray-600 mb-6">Login to continue your journey</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <button onClick={() => setView('SignUp')} className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

// SignUpPage Component
const SignUpPage = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Registration successful! Please login.');
        setView('Login'); // Navigate to login page
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please make sure the backend is running.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
  <h2 className="text-3xl font-bold text-blue-900 mb-2">Create your account</h2>
        <p className="text-gray-600 mb-6">Join City Safari today</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min 6 characters)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <button onClick={() => setView('Login')} className="text-blue-600 font-semibold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

// DestinationReportPage Component
const DestinationReportPage = ({ setView, destinationCity, fromCity, user }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for sticky tab scroll targets
  const overviewRef = useRef(null);
  const mapRef = useRef(null);
  const transportRef = useRef(null);
  const placesRef = useRef(null);
  const foodRef = useRef(null);
  const hotelsRef = useRef(null);
  const tipsRef = useRef(null);
  const weatherRef = useRef(null);
  const eventsRef = useRef(null);

  const scrollToRef = (ref) => {
    if (!ref?.current) return;
    const y = ref.current.getBoundingClientRect().top + window.scrollY - 90; // account for sticky tabs
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  useEffect(() => {
    if (destinationCity) {
      setLoading(true);
      setError(null);
      
      // Build URL with fromCity parameter if provided
      let url = 'http://localhost:8080/api/report?city=' + encodeURIComponent(destinationCity);
      if (fromCity && fromCity.trim()) {
        url += '&fromCity=' + encodeURIComponent(fromCity);
      }
      // Attach userId if available so backend can associate search history
      if (user && user.userId) {
        url += '&userId=' + encodeURIComponent(user.userId);
      }
      
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch report');
          }
          return response.json();
        })
        .then(data => {
          setReport(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [destinationCity, fromCity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="bg-white/90 rounded-xl shadow-lg px-8 py-6 flex items-center gap-4">
          <div className="h-5 w-5 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <div className="text-gray-800 text-lg font-semibold">Loading your travel report...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => setView('Home')}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Bar */}
      <div className="bg-blue-700 text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setView('Home')}
            className="flex items-center gap-2 hover:underline"
          >
            <ArrowLeft size={20} />
            Back to Search
          </button>
          <h1 className="text-2xl font-bold">
            Destination Report: {report?.city || destinationCity}
          </h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Summary strip */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-sm">
          <div className="flex items-center gap-2 p-3 rounded-md bg-sky-50">
            <MapPin className="text-blue-600" size={18} />
            <div>
              <p className="text-gray-500">Destination</p>
              <p className="font-semibold text-gray-800">{report?.city || destinationCity}</p>
            </div>
          </div>
          {fromCity && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-blue-50">
              <Bus className="text-blue-600" size={18} />
              <div>
                <p className="text-gray-500">From</p>
                <p className="font-semibold text-gray-800">{fromCity}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 p-3 rounded-md bg-green-50">
            <Plane className="text-green-600" size={18} />
            <div>
              <p className="text-gray-500">Transport</p>
              <p className="font-semibold text-gray-800">{report?.transport?.length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-md bg-yellow-50">
            <MapPin className="text-yellow-600" size={18} />
            <div>
              <p className="text-gray-500">Places</p>
              <p className="font-semibold text-gray-800">{report?.mustVisitPlaces?.length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-md bg-pink-50">
            <Utensils className="text-pink-600" size={18} />
            <div>
              <p className="text-gray-500">Food</p>
              <p className="font-semibold text-gray-800">{report?.localFood?.length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-md bg-sky-50">
            <CloudSun className="text-sky-600" size={18} />
            <div>
              <p className="text-gray-500">Now</p>
              <p className="font-semibold text-gray-800">{report?.weather?.current?.temperature || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky tabs */}
      <div className="bg-white/80 backdrop-blur sticky top-0 z-30 border-b">
        <div className="max-w-7xl mx-auto px-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 text-sm">
            <button onClick={() => scrollToRef(overviewRef)} className="px-3 py-1.5 rounded-full border text-gray-700 hover:bg-gray-50 whitespace-nowrap">Overview</button>
            {fromCity && <button onClick={() => scrollToRef(mapRef)} className="px-3 py-1.5 rounded-full border text-gray-700 hover:bg-gray-50 whitespace-nowrap">Map</button>}
            <button onClick={() => scrollToRef(transportRef)} className="px-3 py-1.5 rounded-full border text-gray-700 hover:bg-gray-50 whitespace-nowrap">Transport</button>
            <button onClick={() => scrollToRef(placesRef)} className="px-3 py-1.5 rounded-full border text-gray-700 hover:bg-gray-50 whitespace-nowrap">Places</button>
            <button onClick={() => scrollToRef(foodRef)} className="px-3 py-1.5 rounded-full border text-gray-700 hover:bg-gray-50 whitespace-nowrap">Food</button>
            <button onClick={() => scrollToRef(hotelsRef)} className="px-3 py-1.5 rounded-full border text-gray-700 hover:bg-gray-50 whitespace-nowrap">Hotels</button>
            <button onClick={() => scrollToRef(tipsRef)} className="px-3 py-1.5 rounded-full border text-gray-700 hover:bg-gray-50 whitespace-nowrap">Tips</button>
            <button onClick={() => scrollToRef(weatherRef)} className="px-3 py-1.5 rounded-full border text-gray-700 hover:bg-gray-50 whitespace-nowrap">Weather</button>
            <button onClick={() => scrollToRef(eventsRef)} className="px-3 py-1.5 rounded-full border text-gray-700 hover:bg-gray-50 whitespace-nowrap">Events</button>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div ref={overviewRef} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Map Card - Show at the top */}
          {fromCity && fromCity.trim() && (
            <div ref={mapRef}>
              <RouteMap 
                fromCity={fromCity} 
                destinationCity={destinationCity}
              />
            </div>
          )}

          {/* Transport Card - Only show if fromCity was provided and transport data exists */}
          {fromCity && fromCity.trim() && report?.transport && report.transport.length > 0 && (
            <div ref={transportRef} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Plane className="text-blue-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-800">
                  Travel Options: {fromCity} → {destinationCity}
                </h2>
              </div>
              <div className="space-y-4">
                {report.transport.map((option, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-800">
                        {option.mode}
                        {option.recommendation && (
                          <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                            {option.recommendation}
                          </span>
                        )}
                      </h3>
                      <span className="text-sm font-semibold text-blue-700">{option.price}</span>
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Operator:</strong> {option.operator}</p>
                    <p className="text-gray-700 mb-2"><strong>Route:</strong> {option.route}</p>
                    <p className="text-gray-600 mb-2 italic">{option.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mt-3">
                      <div>
                        <strong>Duration:</strong> {option.duration}
                      </div>
                      <div>
                        <strong>Distance:</strong> {option.distance}
                      </div>
                      <div>
                        <strong>Availability:</strong> {option.availability}
                      </div>
                    </div>
                    {/* Booking links based on transport mode */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {option.mode?.toLowerCase().includes('flight') && (
                        <>
                          <a
                            className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            href={`https://www.makemytrip.com/flights/`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Book Flight (MakeMyTrip)
                          </a>
                          <a
                            className="inline-block px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-900"
                            href={`https://www.google.com/search?q=${encodeURIComponent(`${fromCity} to ${destinationCity} flight tickets`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Search Flights
                          </a>
                        </>
                      )}
                      {option.mode?.toLowerCase().includes('train') && (
                        <>
                          <a
                            className="inline-block px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            href="https://www.irctc.co.in/nget/train-search"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Book Train (IRCTC)
                          </a>
                          <a
                            className="inline-block px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-900"
                            href={`https://www.google.com/search?q=${encodeURIComponent(`${fromCity} to ${destinationCity} train tickets`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Search Trains
                          </a>
                        </>
                      )}
                      {option.mode?.toLowerCase().includes('bus') && (
                        <>
                          <a
                            className="inline-block px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            href="https://www.redbus.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Book Bus (redBus)
                          </a>
                          <a
                            className="inline-block px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-900"
                            href={`https://www.google.com/search?q=${encodeURIComponent(`${fromCity} to ${destinationCity} bus tickets`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Search Buses
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Getting Around Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bus className="text-blue-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">Getting Around</h2>
            </div>
            <div className="space-y-4">
              {report?.gettingAround?.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-bold text-lg text-gray-800">{item.mode}: {item.name}</h3>
                  <p className="text-gray-600"><strong>Route:</strong> {item.route}</p>
                  <p className="text-gray-600"><strong>Status:</strong> {item.status}</p>
                  <p className="text-gray-600"><strong>Schedule:</strong> {item.schedule}</p>
                  <p className="text-gray-600"><strong>Price:</strong> {item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Must-Visit Places Card */}
          <div ref={placesRef} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="text-blue-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">Must-Visit Places</h2>
            </div>
            <div className="space-y-6">
              {report?.mustVisitPlaces?.map((place, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  {place.imageUrl && (
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl text-gray-800">{place.name}</h3>
                      <div className="flex items-center gap-2">
                        <a
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          href={`https://www.google.com/search?q=${encodeURIComponent(`${place.name} ${report?.city || destinationCity} tickets`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Buy
                        </a>
                        <span className="bg-yellow-400 text-gray-800 px-2 py-1 rounded font-bold text-sm">
                          ⭐ {place.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{place.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span><strong>Best Time:</strong> {place.bestTime}</span>
                      <span><strong>Entry:</strong> {place.entry}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Food Card */}
          <div ref={foodRef} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Utensils className="text-blue-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">Local Food & Restaurants</h2>
            </div>

            {/* Luxury Restaurants Section */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-yellow-500">✨</span> Luxury Dining
              </h3>
              <div className="space-y-4">
                {report?.localFood?.filter(food => food.category === 'Luxury').map((food, index) => (
                  <div key={index} className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50 rounded-r-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-gray-800">{food.restaurantName}</h4>
                      <div className="flex items-center gap-2">
                        <a
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          href={`https://www.google.com/search?q=${encodeURIComponent(`${food.restaurantName} reservation`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Buy
                        </a>
                        <span className="bg-yellow-400 text-gray-800 px-2 py-1 rounded font-bold text-sm">
                          ⭐ {food.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{food.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span><strong>Price:</strong> <span className="text-orange-600 font-semibold">{food.priceRange}</span></span>
                      <span><strong>Hours:</strong> {food.hours}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Friendly Restaurants Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-green-500">💰</span> Budget Friendly
              </h3>
              <div className="space-y-4">
                {report?.localFood?.filter(food => food.category === 'Budget Friendly').map((food, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 rounded-r-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-gray-800">{food.restaurantName}</h4>
                      <span className="bg-yellow-400 text-gray-800 px-2 py-1 rounded font-bold text-sm">
                        ⭐ {food.rating}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{food.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span><strong>Price:</strong> <span className="text-green-600 font-semibold">{food.priceRange}</span></span>
                      <span><strong>Hours:</strong> {food.hours}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hotel Stay Card */}
          <div ref={hotelsRef} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Hotel className="text-blue-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">Hotel Stay</h2>
            </div>

            {/* Luxury Hotels Section */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-yellow-500">✨</span> Luxury Hotels
              </h3>
              <div className="space-y-4">
                {report?.hotelStays?.filter(hotel => hotel.category === 'Luxury').map((hotel, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden border-yellow-200 bg-yellow-50">
                    {hotel.imageUrl && (
                      <img
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-gray-800">{hotel.name}</h4>
                        <div className="flex items-center gap-2">
                          <a
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            href={`https://www.booking.com/search.html?ss=${encodeURIComponent(`${hotel.name} ${report?.city || destinationCity}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Book
                          </a>
                          <a
                            className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-900"
                            href={`https://www.google.com/search?q=${encodeURIComponent(`${hotel.name} ${report?.city || destinationCity} booking`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Search
                          </a>
                          <span className="bg-yellow-400 text-gray-800 px-2 py-1 rounded font-bold text-sm">
                            ⭐ {hotel.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{hotel.description}</p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Location:</strong> {hotel.location}</p>
                        <p><strong>Price Range:</strong> <span className="text-green-600 font-semibold">{hotel.priceRange}</span></p>
                        <p><strong>Amenities:</strong> {hotel.amenities}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Friendly Hotels Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-green-500">💰</span> Budget Friendly
              </h3>
              <div className="space-y-4">
                {report?.hotelStays?.filter(hotel => hotel.category === 'Budget Friendly').map((hotel, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden border-green-200 bg-green-50">
                    {hotel.imageUrl && (
                      <img
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-gray-800">{hotel.name}</h4>
                        <div className="flex items-center gap-2">
                          <a
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            href={`https://www.booking.com/search.html?ss=${encodeURIComponent(`${hotel.name} ${report?.city || destinationCity}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Book
                          </a>
                          <a
                            className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-900"
                            href={`https://www.google.com/search?q=${encodeURIComponent(`${hotel.name} ${report?.city || destinationCity} booking`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Search
                          </a>
                          <span className="bg-yellow-400 text-gray-800 px-2 py-1 rounded font-bold text-sm">
                            ⭐ {hotel.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{hotel.description}</p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Location:</strong> {hotel.location}</p>
                        <p><strong>Price Range:</strong> <span className="text-green-600 font-semibold">{hotel.priceRange}</span></p>
                        <p><strong>Amenities:</strong> {hotel.amenities}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Weather Card */}
          <div ref={weatherRef} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CloudSun className="text-blue-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">Weather</h2>
            </div>
            {report?.weather?.current && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Current</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-blue-700 mb-2">
                    {report.weather.current.temperature}
                  </p>
                  <p className="text-gray-700"><strong>Condition:</strong> {report.weather.current.condition}</p>
                  <p className="text-gray-600 text-sm">Feels like: {report.weather.current.feelsLike}</p>
                  <p className="text-gray-600 text-sm">Humidity: {report.weather.current.humidity}</p>
                  <p className="text-gray-600 text-sm">Wind: {report.weather.current.wind}</p>
                </div>
              </div>
            )}
            {report?.weather?.forecast && report.weather.forecast.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-2">Forecast</h3>
                <div className="space-y-2">
                  {report.weather.forecast.map((day, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p className="font-semibold text-gray-800">{day.day}</p>
                      <p className="text-sm text-gray-600">{day.condition}</p>
                      <p className="text-sm text-gray-600">{day.temperature}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Events Card */}
          <div ref={eventsRef} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-blue-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">Events & Activities</h2>
            </div>
            <div className="space-y-4">
              {report?.events?.map((event, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                  <h3 className="font-bold text-gray-800">{event.name}</h3>
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded mb-1">
                    {event.category}
                  </span>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Date:</strong> {event.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Tips Card */}
          <div ref={tipsRef} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Travel Tips</h2>
            <ul className="space-y-3">
              {report?.travelTips?.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span className="text-gray-700">{item.tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// HistoryPage Component
const HistoryPage = ({ setView, setDestinationCity, user }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load search history from backend
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/history?userId=${encodeURIComponent(user.userId)}`);
        if (!res.ok) throw new Error('Failed to fetch history');
        const data = await res.json();
        // Map backend response to expected format
        const mapped = data.map(item => ({
          id: item.id,
          city: item.city,
          timestamp: item.searchDate
        }));
        setHistory(mapped);
      } catch (err) {
        console.error('Error loading history from server:', err);
        setHistory([]);
      }
    };

    fetchHistory();
  }, [user.userId]);

  const handleViewReport = (city) => {
    setDestinationCity(city);
    setView('Report');
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all search history?')) {
      // Call backend to clear history
      fetch(`http://localhost:8080/api/history?userId=${encodeURIComponent(user.userId)}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setHistory([]);
          } else {
            alert('Failed to clear history: ' + (data.message || 'unknown'));
          }
        })
        .catch(err => {
          console.error('Error clearing history:', err);
          alert('Failed to clear history');
        });
    }
  };

  const handleDeleteItem = (index) => {
    const item = history[index];
    if (!item || !item.id) return;
    // Delete from backend
    fetch(`http://localhost:8080/api/history/${item.id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const newHistory = history.filter((_, i) => i !== index);
          setHistory(newHistory);
        } else {
          alert('Failed to delete item: ' + (data.message || 'unknown'));
        }
      })
      .catch(err => {
        console.error('Error deleting history item:', err);
        alert('Failed to delete item');
      });
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('Home')}
              className="flex items-center gap-2 text-white hover:text-blue-200"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-4xl font-bold text-white flex items-center gap-3">
                <Clock size={36} />
                Travel History
              </h2>
              <p className="text-blue-200 mt-2">Your recent destination searches</p>
            </div>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <Trash2 size={20} />
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Clock size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Search History</h3>
            <p className="text-gray-600 mb-6">Start exploring destinations to build your travel history!</p>
            <button
              onClick={() => setView('Home')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Explore Destinations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition group">
                <div className="bg-gradient-to-r from-sky-400 to-blue-600 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{item.city}</h3>
                  <p className="text-blue-100 text-sm flex items-center gap-2">
                    <Clock size={16} />
                    {new Date(item.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin size={16} />
                    <span className="text-sm">Destination Report</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewReport(item.city)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="px-3 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ProfilePage Component
const ProfilePage = ({ user, setView }) => {
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    // Get search history count
    const savedHistory = localStorage.getItem(`searchHistory_${user.userId}`);
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setHistoryCount(history.length);
      } catch (error) {
        setHistoryCount(0);
      }
    }
  }, [user.userId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-blue-900">My Profile</h2>
          <button
            onClick={() => setView('Home')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-6 pb-6 border-b">
            <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center">
              <UserCircle size={60} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{user.fullName}</h3>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                Active Member
              </span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-sky-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">User ID</h4>
              <p className="text-gray-900">{user.userId}</p>
            </div>
            <div className="bg-sky-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Email</h4>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div className="bg-sky-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Full Name</h4>
              <p className="text-gray-900">{user.fullName}</p>
            </div>
            <div className="bg-sky-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Member Since</h4>
              <p className="text-gray-900">
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-gradient-to-r from-sky-400 to-blue-600 rounded-lg p-6 text-white">
            <h4 className="font-semibold mb-4 text-lg">Account Statistics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{historyCount}</p>
                <p className="text-sm text-blue-100">Cities Explored</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-blue-100">Saved Destinations</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-blue-100">Reviews Written</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => setView('Home')}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Explore Destinations
            </button>
            <button
              onClick={() => setView('History')}
              className="flex-1 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [view, setView] = useState('Login'); // Start with Login page
  const [destinationCity, setDestinationCity] = useState('');
  const [fromCity, setFromCity] = useState(''); // Add fromCity state
  const [user, setUser] = useState(null); // Track logged-in user

  // Check if user is already logged in when app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setView('Home'); // If logged in, go to home page
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Handle successful login
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setView('Login');
  };

  // If not logged in, show only login/signup pages
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-sky-400 to-blue-600">
        {view === 'Login' && <LoginPage setView={setView} onLoginSuccess={handleLoginSuccess} />}
        {view === 'SignUp' && <SignUpPage setView={setView} />}
      </div>
    );
  }

  // If logged in, show full app
  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-400 to-blue-600">
      <Navbar setView={setView} user={user} onLogout={handleLogout} />
      
      {view === 'Home' && <HomePage setView={setView} setDestinationCity={setDestinationCity} setFromCity={setFromCity} user={user} />}
      {view === 'History' && <HistoryPage setView={setView} setDestinationCity={setDestinationCity} user={user} />}
      {view === 'Profile' && <ProfilePage user={user} setView={setView} />}
  {view === 'Report' && <DestinationReportPage setView={setView} destinationCity={destinationCity} fromCity={fromCity} user={user} />}
    </div>
  );
}

export default App;
