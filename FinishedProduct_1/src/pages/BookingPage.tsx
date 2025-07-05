import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, MapPin, Plane, Tag, ArrowRight } from 'lucide-react';
import supabase from '../config/supabase';

// TypeScript interfaces
interface Airport {
  id: string;
  iata_code: string;
  name: string;
  city: string;
  country: string;
}

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

const FlightBookingComponent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const flightId = searchParams.get('flightId');
  const passengersParam = searchParams.get('passengers') || '1';
  const fromParam = searchParams.get('from') || '';
  const toParam = searchParams.get('to') || '';
  const dateParam = searchParams.get('date') || '';

  const [searchForm, setSearchForm] = useState({
    from: fromParam,
    to: toParam,
    departureDate: dateParam,
    passengers: parseInt(passengersParam)
  });
  
  const [allAirports, setAllAirports] = useState<Airport[]>([]);
  const [filteredFromAirports, setFilteredFromAirports] = useState<Airport[]>([]);
  const [filteredToAirports, setFilteredToAirports] = useState<Airport[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!flightId); // Auto search if flightId exists

  // Fetch all airports on component mount
  useEffect(() => {
    const fetchAirports = async () => {
      const { data, error } = await supabase
        .from('airports')
        .select('id, iata_code, name, city, country');
      
      if (error) {
        console.error('Error fetching airports:', error);
      } else {
        setAllAirports(data);
        
        // If we have a flight ID, fetch the flight details
        if (flightId) {
          fetchFlightDetails(flightId);
        }
      }
    };

    fetchAirports();
  }, [flightId]);

  // Fetch flight details when flightId is present
  const fetchFlightDetails = async (id: string) => {
    setIsSearching(true);
    
    try {
      // Use the detailed_flight_listings view to get consistent data
      const { data, error } = await supabase
        .from('detailed_flight_listings')
        .select('*')
        .eq('flight_id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setSearchResults([data]);
        
        // Pre-populate form with flight details
        setSearchForm(prev => ({
          ...prev,
          from: data.origin_code,
          to: data.destination_code,
          departureDate: data.departure_time.split('T')[0]
        }));
      }
    } catch (error) {
      console.error('Error fetching flight details:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Filter airports based on search input
  const filterAirports = (query: string, exclude = '') => {
    if (!query) return [];
    return allAirports.filter(airport => 
      airport.iata_code !== exclude &&
      (airport.city.toLowerCase().includes(query.toLowerCase()) ||
       airport.iata_code.toLowerCase().includes(query.toLowerCase()) ||
       airport.name.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 5);
  };

  const handleFromChange = (value: string) => {
    setSearchForm(prev => ({ ...prev, from: value }));
    setFilteredFromAirports(filterAirports(value, searchForm.to));
    setShowFromDropdown(true);
  };

  const handleToChange = (value: string) => {
    setSearchForm(prev => ({ ...prev, to: value }));
    setFilteredToAirports(filterAirports(value, searchForm.from));
    setShowToDropdown(true);
  };

  const selectAirport = (airport: any, field: string) => {
    setSearchForm(prev => ({ ...prev, [field]: airport.iata_code }));
    if (field === 'from') {
      setShowFromDropdown(false);
    } else {
      setShowToDropdown(false);
    }
  };

  const formatDuration = (departure: string, arrival: string) => {
    const dept = new Date(departure);
    const arr = new Date(arrival);
    const diff = arr.getTime() - dept.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const searchFlights = async () => {
    if (!searchForm.from || !searchForm.to || !searchForm.departureDate) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // Convert departure date to start and end of day in UTC
      const departureDate = new Date(searchForm.departureDate);
      const startOfDay = new Date(departureDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      
      const endOfDay = new Date(departureDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      
      // Use the detailed_flight_listings view for consistent data
      const { data: flights, error } = await supabase
        .from('detailed_flight_listings')
        .select('*')
        .or(
          `origin_city.ilike.%${searchForm.from}%,origin_code.ilike.%${searchForm.from}%`
        )
        .or(
          `destination_city.ilike.%${searchForm.to}%,destination_code.ilike.%${searchForm.to}%`
        )
        .gte('departure_time', startOfDay.toISOString())
        .lte('departure_time', endOfDay.toISOString());
      
      if (error) {
        console.error('Error fetching flights:', error);
        setSearchResults([]);
      } else {
        setSearchResults(flights || []);
      }
    } catch (err) {
      console.error('Error searching flights:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const bookFlight = (flight: any) => {
    // Calculate final price with deal
    // const hasDeal = flight.final_price_per_ticket < flight.base_price;
    // const discountPercentage = hasDeal
    //   ? Math.round(((flight.base_price - flight.final_price_per_ticket) / flight.base_price) * 100)
    //   : 0;
    // const hasDeal = flight.final_price_per_ticket < flight.base_price;

      
    const finalPrice = flight.final_price_per_ticket * searchForm.passengers;
    
    // Navigate to booking confirmation page with state
    navigate('/booking-confirmation', {
      state: {
        booking: {
          id: `B${Math.floor(Math.random() * 1000000)}`, // mock booking ID
          ticketNumber: `TK${Math.floor(Math.random() * 1000000000)}`,
          status: 'Confirmed',
          paymentStatus: 'Paid',
          totalPrice: finalPrice,
          passengers: Array(searchForm.passengers).fill(0).map((_, i) => ({
            firstName: `Passenger ${i+1}`,
            lastName: 'Doe',
            passportNumber: `A123456${i}`
          })),
          flight: {
            airline: flight.airline_name,
            flightNumber: flight.flight_number,
            departure: flight.origin_city,
            arrival: flight.destination_city,
            departureAirport: flight.origin_code,
            arrivalAirport: flight.destination_code,
            departureTime: formatTime(flight.departure_time),
            arrivalTime: formatTime(flight.arrival_time),
            flightDate: flight.departure_time.split('T')[0],
            duration: formatDuration(flight.departure_time, flight.arrival_time)
          }
        }
      }
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Form */}
        {!flightId && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
            <h1 className="text-4xl font-bold text-center mb-8">Search Flights</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* From */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Departure City"
                    value={searchForm.from}
                    onChange={(e) => handleFromChange(e.target.value)}
                    onFocus={() => setShowFromDropdown(true)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
                  />
                  {showFromDropdown && filteredFromAirports.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-md rounded-lg border border-white/30 max-h-60 overflow-y-auto">
                      {filteredFromAirports.map((airport) => (
                        <div
                          key={airport.id}
                          className="px-4 py-3 hover:bg-blue-500/20 cursor-pointer text-gray-800"
                          onClick={() => selectAirport(airport, 'from')}
                        >
                          <div className="font-semibold">{airport.iata_code}</div>
                          <div className="text-sm text-gray-600">{airport.city}, {airport.country}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* To */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Destination City"
                    value={searchForm.to}
                    onChange={(e) => handleToChange(e.target.value)}
                    onFocus={() => setShowToDropdown(true)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
                  />
                  {showToDropdown && filteredToAirports.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-md rounded-lg border border-white/30 max-h-60 overflow-y-auto">
                      {filteredToAirports.map((airport) => (
                        <div
                          key={airport.id}
                          className="px-4 py-3 hover:bg-blue-500/20 cursor-pointer text-gray-800"
                          onClick={() => selectAirport(airport, 'to')}
                        >
                          <div className="font-semibold">{airport.iata_code}</div>
                          <div className="text-sm text-gray-600">{airport.city}, {airport.country}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Departure Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Departure Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={searchForm.departureDate}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, departureDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>

              {/* Passengers */}
              <div>
                <label className="block text-sm font-medium mb-2">Passengers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    value={searchForm.passengers}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num} className="text-gray-800">
                        {num} Passenger{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={searchFlights}
                disabled={!searchForm.from || !searchForm.to || !searchForm.departureDate || isSearching}
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Search Flights</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              {flightId 
                ? "Your Selected Flight"
                : searchResults.length > 0 
                  ? `Found ${searchResults.length} flight${searchResults.length > 1 ? 's' : ''}`
                  : 'No flights found for your search criteria'
              }
            </h2>

            {searchResults.map((flight) => {
              const hasDeal = flight.final_price_per_ticket < flight.base_price;
              const discountPercentage = hasDeal
                ? Math.round(((flight.base_price - flight.final_price_per_ticket) / flight.base_price) * 100)
                : 0;
              const totalPrice = flight.final_price_per_ticket * searchForm.passengers;

              return (
                <div key={flight.flight_id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-blue-400/50 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    
                    {/* Flight Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-lg font-bold">{flight.airline_name}</div>
                          <div className="text-sm text-gray-300">{flight.flight_number}</div>
                          <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                            Direct
                          </div>
                        </div>
                        
                        {hasDeal && (
                          <div className="flex items-center space-x-2">
                            <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                              <Tag className="h-3 w-3" />
                              <span>{discountPercentage}% OFF</span>
                            </div>
                            {flight.deal_description && (
                              <div className="text-xs text-gray-300">
                                {flight.deal_description}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{flight.origin_code}</div>
                          <div className="text-sm text-gray-300">
                            {formatTime(flight.departure_time)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {flight.origin_city}, {flight.origin_country}
                          </div>
                        </div>
                        
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center">
                            <Plane className="h-6 w-6 mx-auto text-blue-400 mb-1" />
                            <div className="text-sm text-gray-300">
                              {formatDuration(flight.departure_time, flight.arrival_time)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold">{flight.destination_code}</div>
                          <div className="text-sm text-gray-300">
                            {formatTime(flight.arrival_time)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {flight.destination_city}, {flight.destination_country}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Booking */}
                    <div className="lg:w-64 text-center lg:text-right space-y-2">
                      <div className="space-y-1">
                        {hasDeal && (
                          <div className="text-sm text-gray-400 line-through">
                            ${(flight.base_price * searchForm.passengers).toFixed(2)}
                          </div>
                        )}
                        <div className="text-3xl font-bold text-green-400">
                          ${totalPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-300">
                          {searchForm.passengers} passenger{searchForm.passengers > 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => bookFlight(flight)}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                      >
                        <span>{flightId ? "Confirm Booking" : "Book Now"}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightBookingComponent;