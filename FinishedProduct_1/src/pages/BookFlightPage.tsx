// component.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Filter, Plane, AlertCircle, Heart, Clock, Users } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import supabase from '../config/supabase';

// Define type based on the Supabase view
interface Flight {
  flight_id: string;
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  base_price: number;
  available_seats: number;
  airline_name: string;
  airline_logo: string;
  origin_code: string;
  origin_city: string;
  origin_country: string;
  destination_code: string;
  destination_city: string;
  destination_country: string;
  duration: string;
  deal_id?: string | null;
  deal_code?: string | null;
  deal_description?: string | null;
  final_price_per_ticket: number;
}

const BookFlightPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [searchFrom, setSearchFrom] = useState(searchParams.get('from') || '');
  const [searchTo, setSearchTo] = useState(searchParams.get('to') || '');
  const [departDate, setDepartDate] = useState(searchParams.get('depart') || '');
  const [passengers, setPassengers] = useState(searchParams.get('passengers') || '1');
  // const [flights, setFlights] = useState<Flight[]>([]);
  const [_flights, setFlights] = useState<Flight[]>([]);

  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search flights when component mounts or search params change
  useEffect(() => {
    if (searchFrom || searchTo || departDate) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build Supabase query
      let query = supabase
        .from('detailed_flight_listings')
        .select('*')
        .order('final_price_per_ticket', { ascending: true });

      // Add search filters
      if (searchFrom) {
        query = query.or(
          `origin_city.ilike.%${searchFrom}%,origin_code.ilike.%${searchFrom}%`
        );
      }
      
      if (searchTo) {
        query = query.or(
          `destination_city.ilike.%${searchTo}%,destination_code.ilike.%${searchTo}%`
        );
      }
      
      if (departDate) {
        const startDate = new Date(departDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(departDate);
        endDate.setHours(23, 59, 59, 999);
        
        query = query
          .gte('departure_time', startDate.toISOString())
          .lte('departure_time', endDate.toISOString());
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (data) {
        setFlights(data);
        setFilteredFlights(data);
      } else {
        setFlights([]);
        setFilteredFlights([]);
      }
    } catch (err: any) {
      console.error('Error searching flights:', err);
      setError(err.message || 'Failed to search flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = (flight: Flight) => {
    // Navigate to booking page with flight details
    const params = new URLSearchParams({
      flightId: flight.flight_id,
      passengers: passengers,
      from: searchFrom,
      to: searchTo,
      date: departDate
    });
    navigate(`/booking?${params.toString()}`);
  };

  const handleAddToWishlist = (flight: Flight) => {
    // Add to wishlist functionality
    console.log('Added to wishlist:', flight.flight_id);
  };

  // Helper function to format duration
  const formatDuration = (duration: string) => {
    // Duration comes as Postgres interval format (HH:MM:SS)
    const [hours, minutes] = duration.split(':');
    return `${parseInt(hours)}h ${parseInt(minutes)}m`;
  };

  // Helper function to format date
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50 text-slate-800'
    }`}>
      {/* Search Section */}
      <section className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
          >
            <h1 className="text-3xl font-bold text-center mb-8">Search Flights</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    placeholder="Departure City"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    placeholder="Destination City"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Departure Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Passengers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search Flights'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center"
            >
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <span>{error}</span>
            </motion.div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Searching for flights...</p>
            </div>
          )}

          {!loading && !error && filteredFlights.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {filteredFlights.length} flights found
                </h2>
                <div className="flex items-center space-x-4">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </div>
              </div>

              <div className="space-y-4">
                {filteredFlights.map((flight) => {
                  const hasDeal = flight.final_price_per_ticket < flight.base_price;
                  const discountPercentage = hasDeal
                    ? Math.round(((flight.base_price - flight.final_price_per_ticket) / flight.base_price) * 100)
                    : 0;
                  
                  return (
                    <motion.div
                      key={flight.flight_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              {flight.airline_logo ? (
                                <img 
                                  src={flight.airline_logo} 
                                  alt={flight.airline_name}
                                  className="w-10 h-10 object-contain"
                                />
                              ) : (
                                <div className="text-2xl">✈️</div>
                              )}
                              <div>
                                <h3 className="font-semibold text-lg">{flight.airline_name}</h3>
                                <p className="text-sm text-gray-400">{flight.flight_number}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              {hasDeal && (
                                <div>
                                  <div className="flex justify-end">
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                      SAVE {discountPercentage}%
                                    </span>
                                  </div>
                                  <p className="line-through text-gray-400 text-sm">
                                    ${flight.base_price.toFixed(2)}
                                  </p>
                                </div>
                              )}
                              <p className="text-2xl font-bold text-green-400">
                                ${flight.final_price_per_ticket.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-400">per passenger</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-400">Departure</p>
                              <p className="font-semibold">{formatTime(flight.departure_time)}</p>
                              <p className="text-sm">
                                {flight.origin_city} ({flight.origin_code})
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-400">Duration</p>
                              <p className="font-semibold">{formatDuration(flight.duration)}</p>
                              <p className="text-sm">Direct</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Arrival</p>
                              <p className="font-semibold">{formatTime(flight.arrival_time)}</p>
                              <p className="text-sm">
                                {flight.destination_city} ({flight.destination_code})
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatDuration(flight.duration)}
                              </span>
                              <span className="flex items-center">
                                <Plane className="w-4 h-4 mr-1" />
                                {flight.airline_name}
                              </span>
                            </div>
                            {flight.deal_description && (
                              <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                                {flight.deal_description}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-3 mt-4 lg:mt-0 lg:ml-6">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleBookFlight(flight)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                          >
                            Book Now
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddToWishlist(flight)}
                            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg border border-white/30 hover:bg-white/10 transition-all"
                          >
                            <Heart className="w-4 h-4" />
                            <span>Wishlist</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}

          {!loading && !error && filteredFlights.length === 0 && (
            <div className="text-center py-12">
              <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No flights found</h3>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BookFlightPage;