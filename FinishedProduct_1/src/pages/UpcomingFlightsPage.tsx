import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Calendar, MapPin, Clock, User, Download, Share2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface UpcomingFlight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingReference: string;
  passengers: number;
}

const UpcomingFlightsPage: React.FC = () => {
  const { theme } = useTheme();
  const [upcomingFlights] = useState<UpcomingFlight[]>([
    {
      id: '1',
      airline: 'SkyMate Airlines',
      flightNumber: 'SM101',
      departure: 'New York (JFK)',
      arrival: 'London (LHR)',
      departureTime: '08:00',
      arrivalTime: '20:00',
      date: '2024-02-15',
      duration: '12h 00m',
      status: 'confirmed',
      bookingReference: 'SKY123456',
      passengers: 2
    },
    {
      id: '2',
      airline: 'Global Airways',
      flightNumber: 'GA205',
      departure: 'London (LHR)',
      arrival: 'Paris (CDG)',
      departureTime: '14:30',
      arrivalTime: '17:45',
      date: '2024-02-20',
      duration: '3h 15m',
      status: 'confirmed',
      bookingReference: 'GLO789012',
      passengers: 1
    },
    {
      id: '3',
      airline: 'Premium Airlines',
      flightNumber: 'PA301',
      departure: 'Paris (CDG)',
      arrival: 'Tokyo (NRT)',
      departureTime: '22:00',
      arrivalTime: '16:00',
      date: '2024-02-25',
      duration: '14h 00m',
      status: 'pending',
      bookingReference: 'PRE345678',
      passengers: 3
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400 bg-green-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleDownloadTicket = (flight: UpcomingFlight) => {
    // Handle ticket download
    console.log('Downloading ticket for:', flight.bookingReference);
  };

  const handleShareFlight = (flight: UpcomingFlight) => {
    // Handle sharing flight details
    console.log('Sharing flight:', flight.bookingReference);
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50 text-slate-800'
    }`}>
      {/* Header */}
      <section className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Upcoming Flights</h1>
            <p className="text-xl text-gray-300">
              Manage your upcoming travel plans
            </p>
          </motion.div>
        </div>
      </section>

      {/* Flights List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {upcomingFlights.map((flight, index) => (
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

              <div className="flex items-center justify-between text-sm text-gray-300">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{flight.passengers} passenger{flight.passengers > 1 ? 's' : ''}</span>
                  </span>
                  <span>Ref: {flight.bookingReference}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Departure:</span>
                  <span className="font-semibold">{flight.departureTime}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UpcomingFlightsPage; 