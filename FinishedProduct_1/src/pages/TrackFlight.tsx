import  { useState, useEffect } from 'react';
import { 
  Plane, Search, MapPin, Clock, Navigation, 
  Gauge, Mountain, AlertCircle, CheckCircle, 
  PlayCircle, RefreshCw
} from 'lucide-react';

// TypeScript interfaces
interface FlightData {
  flight_number: string;
  airline: string;
  aircraft: string;
  status: string;
  departure: {
    airport: string;
    scheduled: string;
    actual: string;
    terminal: string;
    gate: string;
  };
  arrival: {
    airport: string;
    scheduled: string;
    actual: string;
    terminal: string;
    gate: string;
  };
  speed: number;
  altitude: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface SearchResult {
  flight_number: string;
  airline: string;
  departure_airport: string;
  arrival_airport: string;
  status: string;
}

// Mock API functions (replace with your actual API)
const trackFlightByNumber = async (flightNum: string, airlineCode: string): Promise<FlightData | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock data - replace with your actual API call
  return {
    flight_number: `${airlineCode}${flightNum}`,
    airline: "Emirates Airlines",
    aircraft: "Boeing 777-300ER",
    status: "En Route",
    departure: {
      airport: "Dubai International Airport (DXB)",
      scheduled: "2025-06-28T14:30:00Z",
      actual: "2025-06-28T14:45:00Z",
      terminal: "3",
      gate: "B12"
    },
    arrival: {
      airport: "London Heathrow Airport (LHR)",
      scheduled: "2025-06-28T19:15:00Z",
      actual: "2025-06-28T19:30:00Z",
      terminal: "2",
      gate: "A15"
    },
    speed: 885,
    altitude: 41000,
    coordinates: {
      latitude: 45.123,
      longitude: 12.456
    }
  };
};

const searchFlights = async (): Promise<SearchResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    {
      flight_number: "EK524",
      airline: "Emirates",
      departure_airport: "DXB",
      arrival_airport: "LHR",
      status: "En Route"
    },
    {
      flight_number: "EK525",
      airline: "Emirates", 
      departure_airport: "LHR",
      arrival_airport: "DXB",
      status: "Scheduled"
    }
  ];
};

const TrackFlight = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (autoRefresh && flightData) {
      interval = setInterval(() => {
        handleTrackFlight(flightData.flight_number, false);
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, flightData]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return setSearchResults([]);
    setIsSearching(true);
    try {
      const results = await searchFlights();
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTrackFlight = async (flightNumber: string, showLoading = true) => {
    if (!flightNumber || flightNumber.length < 3) {
      setError('Please enter a valid flight number (e.g., EK524)');
      return;
    }

    if (showLoading) setLoading(true);
    setError(null);

    try {
      const airlineCode = flightNumber.slice(0, 2);
      const flightNum = flightNumber.slice(2);

      const data = await trackFlightByNumber(flightNum, airlineCode);
      if (data) {
        setFlightData(data);
        setSearchResults([]);
        setSearchQuery(flightNumber);
      } else {
        setFlightData(null);
        setError('Flight not found. Please verify the flight number and try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to fetch flight data. Please check your connection and try again.');
      setFlightData(null);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'text-sky-400 bg-sky-400/10 border-sky-400/30';
      case 'boarding': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'departed':
      case 'en route': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'landed': return 'text-violet-400 bg-violet-400/10 border-violet-400/30';
      case 'delayed': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'boarding': return <PlayCircle className="w-4 h-4" />;
      case 'departed':
      case 'en route': return <Plane className="w-4 h-4" />;
      case 'landed': return <CheckCircle className="w-4 h-4" />;
      case 'delayed':
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '--:--';
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return '--:--';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '--';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '--';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-indigo-500/5 blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 text-transparent bg-clip-text">
              FlightScope
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Track flights in real-time with live updates, detailed information, and interactive monitoring
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-1">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter flight number (e.g., EK524, AA1234)"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTrackFlight(searchQuery.trim());
                    }}
                    className="w-full bg-transparent text-white rounded-xl px-12 py-4 placeholder-slate-400 focus:outline-none text-lg"
                  />
                  {isSearching && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleTrackFlight(searchQuery.trim())}
                  disabled={loading || !searchQuery.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                >
                  Track Flight
                </button>
              </div>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="mt-4 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTrackFlight(result.flight_number)}
                  className="w-full px-6 py-4 text-left hover:bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-white text-lg">{result.flight_number}</div>
                      <div className="text-slate-300">{result.airline}</div>
                      <div className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3" />
                        {result.departure_airport} → {result.arrival_airport}
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-sm font-medium ${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)}
                      {result.status}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="relative mx-auto w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
            <div className="text-xl font-semibold text-white mb-2">Tracking Your Flight</div>
            <div className="text-slate-400">Fetching real-time data...</div>
          </div>
        )}

        {/* Flight Data Display */}
        {flightData && !loading && (
          <div className="space-y-8">
            {/* Flight Header Card */}
            <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                    <Plane className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{flightData.flight_number}</h2>
                    <p className="text-blue-200 text-lg font-medium">{flightData.airline}</p>
                    <p className="text-slate-400">{flightData.aircraft}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-semibold text-lg ${getStatusColor(flightData.status)}`}>
                    {getStatusIcon(flightData.status)}
                    <span>{flightData.status}</span>
                  </div>
                  
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`p-3 rounded-xl border transition-all ${
                      autoRefresh 
                        ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                        : 'bg-slate-700/50 border-slate-600/50 text-slate-400 hover:text-white'
                    }`}
                    title={autoRefresh ? 'Auto-refresh enabled' : 'Enable auto-refresh'}
                  >
                    <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Route Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Departure */}
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/20 rounded-xl">
                    <PlayCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Departure</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-blue-200 text-lg font-semibold">{flightData.departure.airport}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Scheduled</p>
                      <p className="text-white font-semibold">{formatTime(flightData.departure.scheduled)}</p>
                      <p className="text-slate-300 text-sm">{formatDate(flightData.departure.scheduled)}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Actual</p>
                      <p className="text-white font-semibold">{formatTime(flightData.departure.actual)}</p>
                      <p className="text-slate-300 text-sm">{formatDate(flightData.departure.actual)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-xs uppercase tracking-wider">Terminal</span>
                      <span className="font-semibold">{flightData.departure.terminal || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-xs uppercase tracking-wider">Gate</span>
                      <span className="font-semibold">{flightData.departure.gate || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrival */}
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <MapPin className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Arrival</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-purple-200 text-lg font-semibold">{flightData.arrival.airport}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Scheduled</p>
                      <p className="text-white font-semibold">{formatTime(flightData.arrival.scheduled)}</p>
                      <p className="text-slate-300 text-sm">{formatDate(flightData.arrival.scheduled)}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Estimated</p>
                      <p className="text-white font-semibold">{formatTime(flightData.arrival.actual)}</p>
                      <p className="text-slate-300 text-sm">{formatDate(flightData.arrival.actual)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-xs uppercase tracking-wider">Terminal</span>
                      <span className="font-semibold">{flightData.arrival.terminal || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-xs uppercase tracking-wider">Gate</span>
                      <span className="font-semibold">{flightData.arrival.gate || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <Gauge className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{flightData.speed}</div>
                <div className="text-slate-400 text-sm uppercase tracking-wider">km/h Speed</div>
              </div>
              
              <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                  <Mountain className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{flightData.altitude.toLocaleString()}</div>
                <div className="text-slate-400 text-sm uppercase tracking-wider">ft Altitude</div>
              </div>
              
              <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <div className="text-lg font-bold text-white mb-1">
                  {flightData.coordinates.latitude.toFixed(2)}°, {flightData.coordinates.longitude.toFixed(2)}°
                </div>
                <div className="text-slate-400 text-sm uppercase tracking-wider">Position</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackFlight;