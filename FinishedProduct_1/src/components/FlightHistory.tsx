import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, 
  // Calendar, 
  // Clock, 
  // MapPin, 
  X, 
  // Star,
  Download,
  Share2,
  Search,
  Award,
  Globe
} from 'lucide-react';
import { getFlightHistory } from '../services/flightApi';
import type { Booking } from '../services/flightApi';

interface FlightHistoryProps {
  onClose: () => void;
}

const FlightHistory: React.FC<FlightHistoryProps> = ({ onClose }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadFlightHistory();
  }, []);

  const loadFlightHistory = async () => {
    try {
      const history = await getFlightHistory();
      setBookings(history);
    } catch (error) {
      console.error('Failed to load flight history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = searchTerm === '' || 
      booking.flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.flight.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.flight.arrival.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const flightDate = new Date(dateString);
    const diffTime = now.getTime() - flightDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const getTotalMiles = () => {
    return bookings.reduce((total) => {
      // Mock calculation - in real app, you'd calculate actual distance
      return total + Math.floor(Math.random() * 2000) + 500;
    }, 0);
  };

  const getFavoriteDestination = () => {
    const destinations = bookings.map(b => b.flight.arrival);
    const counts = destinations.reduce((acc, dest) => {
      acc[dest] = (acc[dest] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'None';
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-lg font-semibold">Loading your flight history...</span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Plane className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Flight History</h1>
                <p className="text-blue-100">Your past travel adventures</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {bookings.length === 0 ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plane className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Flight History</h3>
              <p className="text-gray-600 mb-6">
                Start your journey and your flight history will appear here.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Book Your First Flight
              </motion.button>
            </motion.div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
                      <div className="text-sm text-blue-600">Total Flights</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{getTotalMiles()}</div>
                      <div className="text-sm text-green-600">Miles Flown</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{getFavoriteDestination()}</div>
                      <div className="text-sm text-purple-600">Top Destination</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search flights..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  {(['all', 'confirmed', 'cancelled'] as const).map((filterOption) => (
                    <button
                      key={filterOption}
                      onClick={() => setFilter(filterOption)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filter === filterOption
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flight List */}
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                          <Plane className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {booking.flight.airline} - {booking.flight.flightNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {booking.passengers.length} passenger{booking.passengers.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">${booking.totalPrice}</div>
                        <div className={`text-sm px-2 py-1 rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {booking.status}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Departure</div>
                        <div className="font-semibold text-gray-800">{formatTime(booking.flight.departureTime)}</div>
                        <div className="text-sm text-gray-600">{booking.flight.departureAirport}</div>
                        <div className="text-sm text-gray-500">{booking.flight.departure}</div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="flex-1 border-t-2 border-dashed border-gray-300 relative">
                          <Plane className="w-5 h-5 text-gray-400 absolute -top-2.5 left-1/2 transform -translate-x-1/2 rotate-90" />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Arrival</div>
                        <div className="font-semibold text-gray-800">{formatTime(booking.flight.arrivalTime)}</div>
                        <div className="text-sm text-gray-600">{booking.flight.arrivalAirport}</div>
                        <div className="text-sm text-gray-500">{booking.flight.arrival}</div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                      {/* <span className="text-gray-600">{formatDate(booking.flight.flightDate)}</span> */}
                      <span className="text-gray-600">{formatDate(booking.flight.flightDate ?? '')}</span>

                      {/* <span className="text-gray-600">{getTimeAgo(booking.flight.flightDate)}</span> */}
                      <span className="text-gray-600">{getTimeAgo(booking.flight.flightDate ?? '')}</span>

                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Booking Details Modal */}
        <AnimatePresence>
          {selectedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Flight Details</h2>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Flight Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Airline:</span>
                          <div className="font-semibold">{selectedBooking.flight.airline}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Flight Number:</span>
                          <div className="font-semibold">{selectedBooking.flight.flightNumber}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">From:</span>
                          <div className="font-semibold">{selectedBooking.flight.departure}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">To:</span>
                          <div className="font-semibold">{selectedBooking.flight.arrival}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Date:</span>
                          {/* <div className="font-semibold">{formatDate(selectedBooking.flight.flightDate)}</div> */}
                          <div className="font-semibold">{formatDate(selectedBooking.flight.flightDate ?? '')}</div>

                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <div className="font-semibold">{selectedBooking.flight.duration}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Passengers</h3>
                      <div className="space-y-2">
                        {selectedBooking.passengers.map((passenger, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                {passenger.firstName.charAt(0)}{passenger.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold">{passenger.firstName} {passenger.lastName}</div>
                              <div className="text-sm text-gray-500">Passport: {passenger.passportNumber}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Booking Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Booking ID:</span>
                          <div className="font-semibold">{selectedBooking.id}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Ticket Number:</span>
                          <div className="font-semibold">{selectedBooking.ticketNumber}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Price:</span>
                          <div className="font-semibold">${selectedBooking.totalPrice}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <div className={`font-semibold ${
                            selectedBooking.status === 'confirmed' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {selectedBooking.status}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Download Ticket</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default FlightHistory; 