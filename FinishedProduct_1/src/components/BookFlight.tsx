import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plane, Calendar, Users, MapPin, ChevronDown } from 'lucide-react';
import { searchFlights, searchAirports } from '../services/flightApi';
import type { Flight, Airport } from '../services/flightApi';
import { useNavigate } from 'react-router-dom';

const BookFlight: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
    tripType: 'one-way' as 'one-way' | 'round-trip'
  });
  
  const [fromSuggestions, setFromSuggestions] = useState<Airport[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Airport[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Search airports for suggestions
  const searchAirportSuggestions = async (query: string, setSuggestions: (airports: Airport[]) => void) => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }
    
    try {
      const results = await searchAirports(query);
      setSuggestions(results);
    } catch (error) {
      console.error('Error searching airports:', error);
      setSuggestions([]);
    }
  };

  // Debounced search for airport suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAirportSuggestions(searchParams.from, setFromSuggestions);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchParams.from]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAirportSuggestions(searchParams.to, setToSuggestions);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchParams.to]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const results = await searchFlights({
        from: searchParams.from,
        to: searchParams.to,
        date: searchParams.date
      });
      
      setFlights(results);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching flights:', error);
      alert('Error searching flights. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectAirport = (airport: Airport, field: 'from' | 'to') => {
    setSearchParams(prev => ({
      ...prev,
      [field]: `${airport.city} (${airport.iata_code})`
    }));
    
    if (field === 'from') {
      setShowFromSuggestions(false);
    } else {
      setShowToSuggestions(false);
    }
  };

  const handleBookFlight = (flight: Flight) => {
    // Navigate to booking page with flight details
    const params = new URLSearchParams({
      flightId: flight.id,
      passengers: searchParams.passengers.toString(),
      from: searchParams.from,
      to: searchParams.to,
      date: searchParams.date
    });
    navigate(`/booking?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Perfect Flight
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Search, compare, and book flights to destinations worldwide
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Trip Type Selection */}
            <div className="lg:col-span-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trip Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tripType"
                    value="one-way"
                    checked={searchParams.tripType === 'one-way'}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, tripType: e.target.value as 'one-way' | 'round-trip' }))}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">One Way</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tripType"
                    value="round-trip"
                    checked={searchParams.tripType === 'round-trip'}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, tripType: e.target.value as 'one-way' | 'round-trip' }))}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Round Trip</span>
                </label>
              </div>
            </div>

            {/* From */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="City or Airport"
                  value={searchParams.from}
                  onChange={(e) => {
                    setSearchParams(prev => ({ ...prev, from: e.target.value }));
                    setShowFromSuggestions(true);
                  }}
                  onFocus={() => setShowFromSuggestions(true)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
                {showFromSuggestions && fromSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {fromSuggestions.map((airport) => (
                      <div
                        key={airport.iata_code}
                        onClick={() => selectAirport(airport, 'from')}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {airport.city} ({airport.iata_code})
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {airport.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* To */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="City or Airport"
                  value={searchParams.to}
                  onChange={(e) => {
                    setSearchParams(prev => ({ ...prev, to: e.target.value }));
                    setShowToSuggestions(true);
                  }}
                  onFocus={() => setShowToSuggestions(true)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
                {showToSuggestions && toSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {toSuggestions.map((airport) => (
                      <div
                        key={airport.iata_code}
                        onClick={() => selectAirport(airport, 'to')}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {airport.city} ({airport.iata_code})
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {airport.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Departure Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={searchParams.date}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Passengers
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={searchParams.passengers}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search Flights
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Flight Results ({flights.length} found)
            </h2>
            
            {flights.length === 0 ? (
              <div className="text-center py-8">
                <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No flights found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Try adjusting your search criteria or dates
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {flights.map((flight) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {flight.airline} - {flight.flightNumber}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {flight.aircraft} • {flight.stops} {flight.stops === 1 ? 'stop' : 'stops'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              ${flight.price}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              per passenger
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {flight.departureTime}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {flight.departure} ({flight.departureAirport})
                                </p>
                              </div>
                              
                              <div className="flex-1 flex items-center">
                                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                                <Plane className="w-4 h-4 text-blue-500 mx-2 transform rotate-90" />
                                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {flight.arrivalTime}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {flight.arrival} ({flight.arrivalAirport})
                                </p>
                              </div>
                            </div>
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                              Duration: {flight.duration}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 lg:mt-0 lg:ml-6">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleBookFlight(flight)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                        >
                          Book Now
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookFlight; 