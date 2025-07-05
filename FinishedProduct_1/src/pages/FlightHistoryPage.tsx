import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Calendar, MapPin, Clock, Star, Download, Share2, Filter } from 'lucide-react';
import Navigation from '../components/Navigation';
// import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';

interface FlightHistory {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  duration: string;
  status: 'completed' | 'cancelled';
  bookingReference: string;
  passengers: number;
  rating?: number;
  review?: string;
}

const FlightHistoryPage: React.FC = () => {
  const { theme } = useTheme();
  const [flightHistory] = useState<FlightHistory[]>([
    {
      id: '1',
      airline: 'SkyMate Airlines',
      flightNumber: 'SM101',
      departure: 'New York (JFK)',
      arrival: 'London (LHR)',
      departureTime: '08:00',
      arrivalTime: '20:00',
      date: '2024-01-15',
      duration: '12h 00m',
      status: 'completed',
      bookingReference: 'SKY123456',
      passengers: 2,
      rating: 5,
      review: 'Excellent service and comfortable flight!'
    },
    {
      id: '2',
      airline: 'Global Airways',
      flightNumber: 'GA205',
      departure: 'London (LHR)',
      arrival: 'Paris (CDG)',
      departureTime: '14:30',
      arrivalTime: '17:45',
      date: '2024-01-10',
      duration: '3h 15m',
      status: 'completed',
      bookingReference: 'GLO789012',
      passengers: 1,
      rating: 4
    },
    {
      id: '3',
      airline: 'Premium Airlines',
      flightNumber: 'PA301',
      departure: 'Paris (CDG)',
      arrival: 'Tokyo (NRT)',
      departureTime: '22:00',
      arrivalTime: '16:00',
      date: '2024-01-05',
      duration: '14h 00m',
      status: 'cancelled',
      bookingReference: 'PRE345678',
      passengers: 3
    }
  ]);

  const [filters, setFilters] = useState({
    status: 'all',
    airline: 'all',
    dateRange: 'all'
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  const handleDownloadTicket = (flight: FlightHistory) => {
    console.log('Downloading ticket for:', flight.bookingReference);
  };

  const handleShareFlight = (flight: FlightHistory) => {
    console.log('Sharing flight:', flight.bookingReference);
  };

  const handleWriteReview = (flight: FlightHistory) => {
    console.log('Writing review for:', flight.bookingReference);
  };

  const filteredFlights = flightHistory.filter(flight => {
    if (filters.status !== 'all' && flight.status !== filters.status) return false;
    if (filters.airline !== 'all' && flight.airline !== filters.airline) return false;
    return true;
  });

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50'} text-white`}>
      <Navigation setSidebarOpen={setSidebarOpen} />
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* Main Content */}
      <div className="pt-16">
        {/* Header */}
        <section className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">Flight History</h1>
              <p className="text-xl text-gray-300">
                View your past travel experiences
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center space-x-4 mb-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold">Filters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Airline
                </label>
                <select
                  value={filters.airline}
                  onChange={(e) => setFilters({...filters, airline: e.target.value})}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Airlines</option>
                  <option value="SkyMate Airlines">SkyMate Airlines</option>
                  <option value="Global Airways">Global Airways</option>
                  <option value="Premium Airlines">Premium Airlines</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="last30">Last 30 Days</option>
                  <option value="last90">Last 90 Days</option>
                  <option value="lastYear">Last Year</option>
                </select>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Flight History List */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-6">
            {filteredFlights.map((flight, index) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{flight.airline}</h3>
                      <p className="text-gray-300">Flight {flight.flightNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(flight.status)}`}>
                      {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                    </span>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownloadTicket(flight)}
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        title="Download Ticket"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShareFlight(flight)}
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        title="Share Flight"
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-sm text-gray-300">From</div>
                      <div className="font-semibold">{flight.departure}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-sm text-gray-300">To</div>
                      <div className="font-semibold">{flight.arrival}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-sm text-gray-300">Date</div>
                      <div className="font-semibold">{new Date(flight.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <div>
                      <div className="text-sm text-gray-300">Duration</div>
                      <div className="font-semibold">{flight.duration}</div>
                    </div>
                  </div>
                </div>

                {flight.rating && (
                  <div className="mb-4 p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-300">Your Rating:</span>
                      <div className="flex">
                        {renderStars(flight.rating)}
                      </div>
                    </div>
                    {flight.review && (
                      <p className="text-gray-300 text-sm italic">"{flight.review}"</p>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-300">
                    Booking Reference: <span className="text-blue-400">{flight.bookingReference}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!flight.rating && flight.status === 'completed' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleWriteReview(flight)}
                        className="bg-gradient-to-r from-yellow-500 to-orange-600 px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        Write Review
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredFlights.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No flight history found</h3>
              <p className="text-gray-300 mb-6">
                You don't have any past flights in your history.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Book a Flight
              </motion.button>
            </motion.div>
          )}
        </section>
      </div>
      
      {/* <Footer /> */}
    </div>
  );
};

export default FlightHistoryPage; 