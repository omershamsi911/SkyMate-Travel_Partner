import { useState, useEffect } from 'react';
import { MapPin, Star, Heart, Eye, Wifi, Car, Coffee, Dumbbell } from 'lucide-react';

// TypeScript interfaces
interface Hotel {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  image: string;
  checkIn: string;
  checkOut: string;
  amenities: string[];
  featured: boolean;
}

// interface Restaurant {
//   id: string;
//   name: string;
//   cuisine: string;
//   rating: number;
//   image: string;
// }

interface Place {
  id: string;
  name: string;
  type: string;
  openingTime: string;
  closingTime: string;
  description: string;
  location: { lat: number; lng: number };
  image: string;
}

interface Weather {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  icon: string;
}

const CITIES = [
  'Dubai', 'New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Singapore', 'Bangkok', 'Toronto', 'Los Angeles',
  'Istanbul', 'Rome', 'Barcelona', 'Hong Kong', 'San Francisco', 'Cape Town', 'Rio de Janeiro', 'Moscow', 'Berlin', 'Mumbai'
];

// Mock data
const mockHotels = [
  {
    id: '1',
    name: 'Burj Al Arab Jumeirah',
    address: 'Jumeirah St, Umm Suqeim',
    rating: 4.9,
    reviews: 2847,
    pricePerNight: 850,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop',
    checkIn: '3:00 PM',
    checkOut: '12:00 PM',
    amenities: ['Wifi', 'Parking', 'Restaurant', 'Gym'],
    featured: true
  },
  {
    id: '2',
    name: 'Atlantis The Palm',
    address: 'Crescent Rd, The Palm Jumeirah',
    rating: 4.7,
    reviews: 1923,
    pricePerNight: 650,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
    amenities: ['Wifi', 'Pool', 'Restaurant', 'Spa'],
    featured: false
  },
  {
    id: '3',
    name: 'Jumeirah Beach Hotel',
    address: 'Jumeirah Beach Road',
    rating: 4.6,
    reviews: 1456,
    pricePerNight: 420,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    checkIn: '2:00 PM',
    checkOut: '12:00 PM',
    amenities: ['Wifi', 'Beach', 'Restaurant', 'Kids Club'],
    featured: false
  }
];

const mockWeather = {
  temp: 28,
  condition: 'Sunny',
  humidity: 65,
  wind: 12,
  icon: '☀️'
};

// const mockRestaurants = [
//   {
//     id: '1',
//     name: 'Nobu Dubai',
//     cuisine: 'Japanese',
//     rating: 4.8,
//     image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop'
//   },
//   {
//     id: '2',
//     name: 'La Petite Maison',
//     cuisine: 'French',
//     rating: 4.7,
//     image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
//   }
// ];

const mockPlaces = [
  {
    id: '1',
    name: 'Burj Khalifa',
    type: 'Landmark',
    openingTime: '8:30 AM',
    closingTime: '11:00 PM',
    description: 'World\'s tallest building with stunning views',
    location: { lat: 25.1972, lng: 55.2744 },
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Dubai Mall',
    type: 'Shopping',
    openingTime: '10:00 AM',
    closingTime: '12:00 AM',
    description: 'Largest shopping mall in the world',
    location: { lat: 25.1975, lng: 55.2796 },
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
  }
];

const BookHotelPage = () => {
  const [city, setCity] = useState('');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [contactInfo, setContactInfo] = useState({
    email: '', phone: '', address: '', city: '', country: '', postalCode: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({ 
    cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' 
  });
  const [places, setPlaces] = useState<Place[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [favorites, setFavorites] = useState(new Set<string>());

  useEffect(() => {
    if (city) {
      setLoading(true);
      // Simulate API calls
      setTimeout(() => {
        setHotels(mockHotels);
        setPlaces(mockPlaces);
        setWeather(mockWeather);
        setLoading(false);
      }, 1500);
    }
  }, [city]);

  const handleBook = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowBookingForm(true);
  };

  const toggleFavorite = (hotelId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(hotelId)) {
      newFavorites.delete(hotelId);
    } else {
      newFavorites.add(hotelId);
    }
    setFavorites(newFavorites);
  };

  const handleContactChange = (field: string, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    setTimeout(() => {
      setBookingSuccess(true);
      setBookingId(`BK${Date.now()}`);
      setShowBookingForm(false);
      setLoading(false);
    }, 2000);
  };

  const getAmenityIcon = (amenity: string) => {
    switch(amenity) {
      case 'Wifi': return <Wifi className="w-4 h-4" />;
      case 'Parking': case 'Car': return <Car className="w-4 h-4" />;
      case 'Restaurant': return <Coffee className="w-4 h-4" />;
      case 'Gym': return <Dumbbell className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin mx-auto mt-2 ml-2" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
          </div>
          <p className="text-white text-lg font-medium">Finding amazing hotels for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
            Discover Your Perfect
            <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Hotel Experience
            </span>
          </h1>
          <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
            Luxury accommodations, stunning views, and unforgettable memories await you
          </p>
          
          {/* Search Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-auto border border-white/20">
            <div className="flex flex-col space-y-4">
              <label className="text-white font-semibold text-lg">Choose Your Destination</label>
              <select
                className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                value={city}
                onChange={e => setCity(e.target.value)}
              >
                <option value="" className="text-gray-800">-- Choose a city --</option>
                {CITIES.map(c => <option key={c} value={c} className="text-gray-800">{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Weather Section */}
        {city && weather && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center space-x-8 text-white">
                <div className="text-center">
                  <div className="text-4xl mb-2">{weather.icon}</div>
                  <div className="text-2xl font-bold">{weather.temp}°C</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{weather.condition}</div>
                  <div className="text-sm opacity-80">Perfect for exploring!</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Humidity: {weather.humidity}%</div>
                  <div>Wind: {weather.wind} km/h</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hotels Section */}
        {city && hotels.length > 0 && !showBookingForm && !bookingSuccess && (
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">
              Luxury Hotels in <span className="text-purple-400">{city}</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {hotels.map(hotel => (
                <div key={hotel.id} className={`group relative bg-white/5 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105 ${hotel.featured ? 'ring-2 ring-purple-400' : ''}`}>
                  {hotel.featured && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}
                  <button 
                    onClick={() => toggleFavorite(hotel.id)}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
                  >
                    <Heart className={`w-5 h-5 ${favorites.has(hotel.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>
                  <div className="relative overflow-hidden">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name} 
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{hotel.name}</h3>
                    <div className="flex items-center text-purple-200 mb-3">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{hotel.address}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white ml-1 font-semibold">{hotel.rating}</span>
                        <span className="text-purple-200 ml-1 text-sm">({hotel.reviews} reviews)</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">${hotel.pricePerNight}</div>
                        <div className="text-sm text-purple-200">per night</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.map(amenity => (
                        <div key={amenity} className="flex items-center bg-white/10 rounded-full px-3 py-1">
                          {getAmenityIcon(amenity)}
                          <span className="text-xs text-white ml-1">{amenity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-purple-200 mb-4">
                      Check-in: {hotel.checkIn} | Check-out: {hotel.checkOut}
                    </div>
                    <button 
                      onClick={() => handleBook(hotel)} 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Form */}
        {showBookingForm && selectedHotel && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Book {selectedHotel.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white mb-2">Check-in Date</label>
                  <input 
                    type="date" 
                    value={checkIn} 
                    onChange={e => setCheckIn(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Check-out Date</label>
                  <input 
                    type="date" 
                    value={checkOut} 
                    onChange={e => setCheckOut(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Guests</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={guests} 
                    onChange={e => setGuests(Number(e.target.value))} 
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Rooms</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={rooms} 
                    onChange={e => setRooms(Number(e.target.value))} 
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(contactInfo).map(([field, value]) => (
                  <div key={field}>
                    <label className="block text-white mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input 
                      type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                      value={value} 
                      onChange={e => handleContactChange(field, e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-white mb-4">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="md:col-span-2">
                  <label className="block text-white mb-2">Card Number</label>
                  <input 
                    type="text" 
                    value={paymentInfo.cardNumber} 
                    onChange={e => handlePaymentChange('cardNumber', e.target.value)} 
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Card Holder</label>
                  <input 
                    type="text" 
                    value={paymentInfo.cardHolder} 
                    onChange={e => handlePaymentChange('cardHolder', e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Expiry Date</label>
                  <input 
                    type="text" 
                    value={paymentInfo.expiryDate} 
                    onChange={e => handlePaymentChange('expiryDate', e.target.value)} 
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={handleConfirmBooking} 
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  Confirm Booking
                </button>
                <button 
                  onClick={() => setShowBookingForm(false)} 
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-4 rounded-xl border border-white/30 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {bookingSuccess && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-lg w-full text-center border border-white/20">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h2>
              <p className="text-purple-200 mb-6">Your hotel booking has been confirmed. Booking ID: {bookingId}</p>
              <button 
                onClick={() => setBookingSuccess(false)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        )}

        {/* Places to Visit */}
        {city && places.length > 0 && (
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">
              Must-Visit Places in <span className="text-purple-400">{city}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {places.map(place => (
                <div key={place.id} className="group bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="relative overflow-hidden">
                    <img 
                      src={place.image} 
                      alt={place.name} 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{place.name}</h3>
                    <div className="text-purple-400 text-sm font-semibold mb-2">{place.type}</div>
                    <p className="text-purple-200 text-sm mb-3">{place.description}</p>
                    <div className="text-sm text-purple-300">
                      Open: {place.openingTime} - {place.closingTime}
                    </div>
                    <div className="flex items-center mt-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white ml-1 text-sm">{Math.round(4 + Math.random())}.{Math.floor(Math.random() * 9)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookHotelPage;