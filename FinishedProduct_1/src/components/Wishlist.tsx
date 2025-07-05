import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Plane, 
  Calendar, 
  MapPin, 
  X, 
  Star,
  Search,
  Trash2,
  Share2,
  Plus,
  DollarSign
} from 'lucide-react';
import { getUserWishlist, removeFromWishlist } from '../services/flightApi';
import type { Flight } from '../services/flightApi';

interface WishlistProps {
  onClose: () => void;
}

const Wishlist: React.FC<WishlistProps> = ({ onClose }) => {
  const [wishlist, setWishlist] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      // Mock userId - in real app, get from auth context
      const userId = 'user123';
      const flights = await getUserWishlist(userId);
      setWishlist(flights);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (flightId: string) => {
    try {
      // Mock userId - in real app, get from auth context
      const userId = 'user123';
      await removeFromWishlist(userId, flightId);
      setWishlist(wishlist.filter(flight => flight.id !== flightId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const filteredWishlist = wishlist.filter(flight => 
    searchTerm === '' || 
    flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.arrival.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getTotalValue = () => {
    return wishlist.reduce((total, flight) => total + flight.price, 0);
  };

  const getAveragePrice = () => {
    return wishlist.length > 0 ? Math.round(getTotalValue() / wishlist.length) : 0;
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
            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-lg font-semibold">Loading your wishlist...</span>
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
        <div className="bg-gradient-to-r from-pink-500 to-red-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">My Wishlist</h1>
                <p className="text-pink-100">Your dream destinations</p>
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
          {wishlist.length === 0 ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Wishlist is Empty</h3>
              <p className="text-gray-600 mb-6">
                Start adding flights to your wishlist to save them for later.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-gradient-to-r from-pink-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Explore Flights
              </motion.button>
            </motion.div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-600">{wishlist.length}</div>
                      <div className="text-sm text-pink-600">Saved Flights</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 border border-red-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">${getTotalValue().toLocaleString()}</div>
                      <div className="text-sm text-red-600">Total Value</div>
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
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">${getAveragePrice()}</div>
                      <div className="text-sm text-purple-600">Average Price</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search your wishlist..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Flight List */}
              <div className="space-y-4">
                {filteredWishlist.map((flight) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
                          <Plane className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {flight.airline} - {flight.flightNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {flight.duration} • {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-pink-600">${flight.price}</div>
                        <div className="text-sm text-gray-500">per person</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Departure</div>
                        <div className="font-semibold text-gray-800">{formatTime(flight.departureTime)}</div>
                        <div className="text-sm text-gray-600">{flight.departureAirport}</div>
                        <div className="text-sm text-gray-500">{flight.departure}</div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="flex-1 border-t-2 border-dashed border-gray-300 relative">
                          <Plane className="w-5 h-5 text-gray-400 absolute -top-2.5 left-1/2 transform -translate-x-1/2 rotate-90" />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Arrival</div>
                        <div className="font-semibold text-gray-800">{formatTime(flight.arrivalTime)}</div>
                        <div className="text-sm text-gray-600">{flight.arrivalAirport}</div>
                        <div className="text-sm text-gray-500">{flight.arrival}</div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(new Date().toISOString())}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{flight.aircraft}</span>
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedFlight(flight)}
                          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Book Now</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveFromWishlist(flight.id)}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Flight Details Modal */}
        <AnimatePresence>
          {selectedFlight && (
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
                <div className="bg-gradient-to-r from-pink-500 to-red-600 p-6 text-white">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Flight Details</h2>
                    <button
                      onClick={() => setSelectedFlight(null)}
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
                          <div className="font-semibold">{selectedFlight.airline}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Flight Number:</span>
                          <div className="font-semibold">{selectedFlight.flightNumber}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">From:</span>
                          <div className="font-semibold">{selectedFlight.departure}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">To:</span>
                          <div className="font-semibold">{selectedFlight.arrival}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <div className="font-semibold">{formatDate(new Date().toISOString())}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <div className="font-semibold">{selectedFlight.duration}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <div className="font-semibold text-pink-600">${selectedFlight.price}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Aircraft:</span>
                          <div className="font-semibold">{selectedFlight.aircraft}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="flex-1 flex items-center justify-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Book This Flight</span>
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

export default Wishlist; 