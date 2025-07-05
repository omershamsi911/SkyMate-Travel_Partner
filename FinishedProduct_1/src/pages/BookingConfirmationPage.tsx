import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { CheckCircle, Download, Printer, Share2, Plane, Calendar, Users } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import supabase from '../config/supabase';


const BookingConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchBooking = async () => {
    try {
      const bookingId = searchParams.get('bookingId');
      if (!bookingId) return;

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          flight:flight_id (
            flight_number,
            departure_datetime,
            arrival_datetime,
            airline:airline_id (
              name
            ),
            dep_airport:departure_airport_id (
              city,
              iata_code
            ),
            arr_airport:arrival_airport_id (
              city,
              iata_code
            )
          )
        `)
        .eq('id', bookingId)
        .single();

      if (error) {
        throw error;
      }

      const bookingData = data;

      setBooking({
        ...bookingData,
        flight: {
          airline: bookingData.flight.airline.name,
          flightNumber: bookingData.flight.flight_number,
          departure: bookingData.flight.dep_airport.city,
          arrival: bookingData.flight.arr_airport.city,
          departureAirport: bookingData.flight.dep_airport.iata_code,
          arrivalAirport: bookingData.flight.arr_airport.iata_code,
          departureTime: format(new Date(bookingData.flight.departure_datetime), 'HH:mm'),
          arrivalTime: format(new Date(bookingData.flight.arrival_datetime), 'HH:mm'),
          flightDate: format(new Date(bookingData.flight.departure_datetime), 'yyyy-MM-dd')
        }
      });
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [searchParams]);


  useEffect(() => {
    if (location.state?.booking) {
      setBooking(location.state.booking);
      setLoading(false);
    } else {
      // Existing fetch logic
      const bookingId = searchParams.get('bookingId');
      if (bookingId) {
        fetchBooking();
      } else {
        setLoading(false);
      }
    }
  }, [location.state, searchParams]);

  if (loading) {
    return <div>Loading booking details...</div>;
  }

  if (!booking) {
    return <div>No booking found.</div>;
  }

  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    console.log('Downloading ticket...');
    alert('Ticket download started!');
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const handleShareBooking = () => {
    // In a real app, this would share booking details
    console.log('Sharing booking...');
    alert('Booking shared!');
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50 text-slate-800'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-400">Your flight has been successfully booked</p>
        </motion.div>

        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Booking Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Plane className="w-5 h-5 mr-2" />
                Flight Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Booking ID:</span>
                  <span className="font-semibold">{booking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ticket Number:</span>
                  <span className="font-semibold">{booking.ticketNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Airline:</span>
                  <span className="font-semibold">{booking.flight.airline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Flight Number:</span>
                  <span className="font-semibold">{booking.flight.flightNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="font-semibold text-green-400">{booking.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment:</span>
                  <span className="font-semibold text-green-400">{booking.paymentStatus}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Travel Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">From:</span>
                  <span className="font-semibold">{booking.flight.departure} ({booking.flight.departureAirport})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">To:</span>
                  <span className="font-semibold">{booking.flight.arrival} ({booking.flight.arrivalAirport})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="font-semibold">{booking.flight.flightDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="font-semibold">{booking.flight.departureTime} - {booking.flight.arrivalTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-semibold">{booking.flight.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Price:</span>
                  <span className="font-semibold text-green-400">${booking.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Passenger Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2" />
            Passenger Information
          </h2>
          
          <div className="space-y-4">
            {booking.passengers.map((passenger: any, index: number) => (
              <div key={index} className="border border-white/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Passenger {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="font-semibold">{passenger.firstName} {passenger.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Passport:</span>
                    <span className="font-semibold">{passenger.passportNumber}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <button
            onClick={handleDownloadTicket}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Download className="w-5 h-5" />
            <span>Download Ticket</span>
          </button>
          
          <button
            onClick={handlePrintTicket}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Printer className="w-5 h-5" />
            <span>Print Ticket</span>
          </button>
          
          <button
            onClick={handleShareBooking}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Share2 className="w-5 h-5" />
            <span>Share Booking</span>
          </button>
        </motion.div>

        {/* Book Hotel CTA */}
        <div className="my-8 text-center">
          <button
            onClick={() => navigate(`/book-hotel?city=${booking.flight.arrival}`)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Book Hotel in {booking.flight.arrival}
          </button>
        </div>

        {/* Ticket Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <h2 className="text-2xl font-bold mb-6">Electronic Ticket</h2>
          
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">{booking.flight.airline}</h3>
                <p className="text-gray-400">Flight {booking.flight.flightNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Ticket No.</p>
                <p className="font-bold">{booking.ticketNumber}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">From</p>
                <p className="font-bold text-lg">{booking.flight.departure}</p>
                <p className="text-sm text-gray-400">{booking.flight.departureAirport}</p>
                <p className="text-sm text-gray-400">{booking.flight.departureTime}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-px bg-gray-400 mx-auto mb-2"></div>
                <Plane className="w-6 h-6 mx-auto mb-2" />
                <div className="w-16 h-px bg-gray-400 mx-auto"></div>
                <p className="text-sm text-gray-400 mt-2">{booking.flight.duration}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">To</p>
                <p className="font-bold text-lg">{booking.flight.arrival}</p>
                <p className="text-sm text-gray-400">{booking.flight.arrivalAirport}</p>
                <p className="text-sm text-gray-400">{booking.flight.arrivalTime}</p>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Date</p>
                  <p className="font-semibold">{booking.flight.flightDate}</p>
                </div>
                <div>
                  <p className="text-gray-400">Passenger</p>
                  <p className="font-semibold">{booking.passengers[0].firstName} {booking.passengers[0].lastName}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all mr-4"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('/upcoming-flights')}
            className="bg-gradient-to-r from-green-500 to-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            View My Bookings
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage; 