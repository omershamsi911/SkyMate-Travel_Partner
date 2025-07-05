import React, { useState } from 'react';
import { CheckCircle, Download, Printer, Share2, MapPin, Calendar, Users, CreditCard, Star, Phone, Mail, Home } from 'lucide-react';

const HotelBookingConfirmationPage = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  
  React.useEffect(() => {
    setTimeout(() => setIsAnimating(false), 1000);
  }, []);

  // Mock booking data
  const booking = {
    id: `BK${Date.now()}`,
    hotel: {
      name: 'Burj Al Arab Jumeirah',
      address: 'Jumeirah St, Umm Suqeim, Dubai',
      city: 'Dubai',
      country: 'UAE',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop',
      checkIn: '2025-08-15',
      checkOut: '2025-08-18',
      rating: 4.9,
      amenities: ['Wifi', 'Spa', 'Pool', 'Restaurant', 'Gym', 'Parking']
    },
    guests: 2,
    rooms: 1,
    totalPrice: 3600,
    bookingDate: new Date().toISOString().split('T')[0],
    receiptNumber: `RC${Date.now()}`,
    status: 'confirmed',
    paymentStatus: 'paid',
    customerDetails: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+971-50-123-4567'
    }
  };

  const handleDownloadReceipt = () => {
    // Create a downloadable receipt
    const receiptContent = `
HOTEL BOOKING RECEIPT
=====================
Booking ID: ${booking.id}
Receipt #: ${booking.receiptNumber}

Hotel: ${booking.hotel.name}
Address: ${booking.hotel.address}, ${booking.hotel.city}, ${booking.hotel.country}

Check-in: ${booking.hotel.checkIn}
Check-out: ${booking.hotel.checkOut}
Guests: ${booking.guests}
Rooms: ${booking.rooms}

Total Price: $${booking.totalPrice}
Status: ${booking.status.toUpperCase()}
Payment: ${booking.paymentStatus.toUpperCase()}

Thank you for choosing our service!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hotel-receipt-${booking.receiptNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Hotel Booking Confirmation',
        text: `My hotel booking at ${booking.hotel.name} is confirmed! Booking ID: ${booking.id}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Hotel booking confirmed at ${booking.hotel.name}! Booking ID: ${booking.id}`);
      alert('Booking details copied to clipboard!');
    }
  };

  const calculateNights = () => {
    const checkIn = new Date(booking.hotel.checkIn);
    const checkOut = new Date(booking.hotel.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 ${isAnimating ? 'animate-bounce' : ''}`}>
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            🎉 Your luxury hotel experience awaits! We've sent a confirmation email with all the details.
          </p>
        </div>

        {/* Main Booking Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 shadow-2xl mb-8">
          {/* Hotel Image Header */}
          <div className="relative h-64 overflow-hidden">
            <img 
              src={booking.hotel.image} 
              alt={booking.hotel.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-3xl font-bold mb-2">{booking.hotel.name}</h2>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{booking.hotel.address}</span>
              </div>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="text-sm">{booking.hotel.rating} Rating</span>
              </div>
            </div>
            <div className="absolute top-6 right-6 bg-emerald-500 text-white px-4 py-2 rounded-full font-semibold">
              {booking.status.toUpperCase()}
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Booking Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Booking Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <span className="text-emerald-200">Booking ID:</span>
                      <span className="text-white font-mono font-semibold">{booking.id}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <span className="text-emerald-200">Receipt Number:</span>
                      <span className="text-white font-mono font-semibold">{booking.receiptNumber}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <span className="text-emerald-200">Booking Date:</span>
                      <span className="text-white font-semibold">{booking.bookingDate}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Stay Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <Calendar className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-sm text-emerald-200">Check-in</div>
                      <div className="text-white font-semibold">{booking.hotel.checkIn}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <Calendar className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-sm text-emerald-200">Check-out</div>
                      <div className="text-white font-semibold">{booking.hotel.checkOut}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-sm text-emerald-200">Guests</div>
                      <div className="text-white font-semibold">{booking.guests}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <Home className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-sm text-emerald-200">Rooms</div>
                      <div className="text-white font-semibold">{booking.rooms}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment & Contact */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Payment Summary</h3>
                  <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg p-6 border border-emerald-400/30">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-emerald-200">Duration:</span>
                      <span className="text-white font-semibold">{calculateNights()} nights</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-emerald-200">Rate per night:</span>
                      <span className="text-white font-semibold">${Math.round(booking.totalPrice / calculateNights())}</span>
                    </div>
                    <div className="border-t border-emerald-400/30 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">Total Amount:</span>
                        <span className="text-3xl font-bold text-emerald-400">${booking.totalPrice}</span>
                      </div>
                      <div className="flex items-center justify-center mt-3">
                        <CreditCard className="w-4 h-4 text-emerald-400 mr-2" />
                        <span className="text-emerald-200 text-sm">Payment {booking.paymentStatus.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center bg-white/5 rounded-lg p-3">
                      <Mail className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-white">{booking.customerDetails.email}</span>
                    </div>
                    <div className="flex items-center bg-white/5 rounded-lg p-3">
                      <Phone className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-white">{booking.customerDetails.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Hotel Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {booking.hotel.amenities.map(amenity => (
                      <div key={amenity} className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm">
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button 
            onClick={handleDownloadReceipt} 
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Download className="w-5 h-5" />
            <span>Download Receipt</span>
          </button>
          <button 
            onClick={handlePrint} 
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <Printer className="w-5 h-5" />
            <span>Print</span>
          </button>
          <button 
            onClick={handleShare} 
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>

        {/* Additional Information */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Important Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-emerald-100">
            <div>
              <h4 className="font-semibold text-white mb-2">Check-in Instructions:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Present a valid ID and this confirmation</li>
                <li>• Check-in starts at 3:00 PM</li>
                <li>• Late check-in available 24/7</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Cancellation Policy:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Free cancellation up to 24 hours before</li>
                <li>• 50% refund for same-day cancellations</li>
                <li>• Contact support for assistance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <button 
            onClick={() => window.location.href = '/'} 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            Continue Exploring
          </button>
          <p className="text-emerald-200 mt-4">
            Thank you for choosing us! Have a wonderful stay! ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingConfirmationPage;