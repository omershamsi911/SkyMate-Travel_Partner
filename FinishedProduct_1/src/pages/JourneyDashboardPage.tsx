import React, { useEffect, useState } from 'react';
import { Plane, MapPin, Calendar, Clock, Users, Star, Thermometer, Wind, Droplets } from 'lucide-react';

// Types
interface Flight {
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureAirport: string;
  arrivalAirport: string;
  flightDate: string;
  departureTime: string;
  arrivalTime: string;
}

interface FlightBooking {
  flight: Flight;
  status: string;
}

interface Hotel {
  name: string;
  address: string;
  city: string;
}

interface HotelBooking {
  hotel: Hotel;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  status: string;
}

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  openingTime: string;
  closingTime: string;
  address: string;
}

interface Place {
  id: number;
  name: string;
  type: string;
  openingTime: string;
  closingTime: string;
  description: string;
}

interface Weather {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  icon: string;
}

// Mock data - replace with your actual API calls
const mockFlight: FlightBooking = {
  flight: {
    airline: "Emirates",
    flightNumber: "EK524",
    departure: "Dubai",
    arrival: "London",
    departureAirport: "DXB",
    arrivalAirport: "LHR",
    flightDate: "2025-07-15",
    departureTime: "14:30",
    arrivalTime: "19:45"
  },
  status: "Confirmed"
};

const mockHotelBooking: HotelBooking = {
  hotel: {
    name: "The Ritz London",
    address: "150 Piccadilly, St. James's, London W1J 9BR",
    city: "London"
  },
  checkIn: "2025-07-15",
  checkOut: "2025-07-18",
  guests: 2,
  rooms: 1,
  status: "Confirmed"
};

const mockRestaurants: Restaurant[] = [
  { id: 1, name: "Dishoom", cuisine: "Indian", rating: 4.8, openingTime: "12:00", closingTime: "23:00", address: "12 Upper St Martin's Ln, London" },
  { id: 2, name: "Sketch", cuisine: "Modern European", rating: 4.6, openingTime: "18:00", closingTime: "01:00", address: "9 Conduit St, Mayfair, London" },
  { id: 3, name: "Duck & Waffle", cuisine: "British", rating: 4.5, openingTime: "24/7", closingTime: "24/7", address: "110 Bishopsgate, London" },
  { id: 4, name: "Hoppers", cuisine: "Sri Lankan", rating: 4.7, openingTime: "17:30", closingTime: "22:30", address: "49 Frith St, Soho, London" }
];

const mockPlaces: Place[] = [
  { id: 1, name: "Tower of London", type: "Historic Site", openingTime: "09:00", closingTime: "17:30", description: "Historic castle and UNESCO World Heritage Site" },
  { id: 2, name: "British Museum", type: "Museum", openingTime: "10:00", closingTime: "17:00", description: "World-famous museum with artifacts from around the globe" },
  { id: 3, name: "London Eye", type: "Attraction", openingTime: "10:00", closingTime: "20:30", description: "Giant observation wheel on the South Bank" },
  { id: 4, name: "Hyde Park", type: "Park", openingTime: "05:00", closingTime: "24:00", description: "Large royal park perfect for walking and relaxation" }
];

const mockWeather: Weather = {
  temp: 22,
  condition: "Partly Cloudy",
  humidity: 65,
  wind: 12,
  icon: "⛅"
};

const JourneyDashboardPage: React.FC = () => {
  const [flight, setFlight] = useState<FlightBooking | null>(null);
  const [hotelBooking, setHotelBooking] = useState<HotelBooking | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setFlight(mockFlight);
      setHotelBooking(mockHotelBooking);
      setRestaurants(mockRestaurants);
      setPlaces(mockPlaces);
      setWeather(mockWeather);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-300 border-t-transparent mx-auto mb-4"></div>
            <Plane className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-white text-lg font-medium">Preparing your journey...</p>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Plane className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">No upcoming journey found</h2>
          <p className="text-blue-200">Book your next adventure with Skymate!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Journey Awaits
              </h1>
              <p className="text-blue-200 mt-2">Everything you need for your perfect trip</p>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-white">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <Calendar className="w-5 h-5" />
                <span>{flight.flight.flightDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Trip Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Flight Card */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-3xl p-8 border border-blue-300/20 hover:border-blue-300/40 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 rounded-full p-3">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Flight</h3>
              </div>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {flight.status}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{flight.flight.departureTime}</div>
                  <div className="text-blue-200 text-sm">{flight.flight.departureAirport}</div>
                  <div className="text-blue-300 font-medium">{flight.flight.departure}</div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="border-t-2 border-dashed border-blue-300/50 relative">
                    <Plane className="w-5 h-5 text-blue-300 absolute -top-2.5 left-1/2 transform -translate-x-1/2 rotate-90" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{flight.flight.arrivalTime}</div>
                  <div className="text-blue-200 text-sm">{flight.flight.arrivalAirport}</div>
                  <div className="text-blue-300 font-medium">{flight.flight.arrival}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-blue-300/20">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Airline:</span>
                  <span className="text-white font-medium">{flight.flight.airline}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-blue-200">Flight:</span>
                  <span className="text-white font-medium">{flight.flight.flightNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Card */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 border border-purple-300/20 hover:border-purple-300/40 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500 rounded-full p-3">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Hotel</h3>
              </div>
              {hotelBooking && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {hotelBooking.status}
                </span>
              )}
            </div>
            
            {hotelBooking ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">{hotelBooking.hotel.name}</h4>
                  <p className="text-purple-200 text-sm">{hotelBooking.hotel.address}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-purple-200 text-sm">Check-in</div>
                    <div className="text-white font-medium">{hotelBooking.checkIn}</div>
                  </div>
                  <div>
                    <div className="text-purple-200 text-sm">Check-out</div>
                    <div className="text-white font-medium">{hotelBooking.checkOut}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-300" />
                    <span className="text-white font-medium">
                      {hotelBooking.guests}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-purple-300" />
                    <span className="text-white font-medium">{hotelBooking.rooms}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-purple-200">
                <p>No hotel booking found</p>
                <button className="mt-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                  Book Hotel
                </button>
              </div>
            )}
          </div>

          {/* Weather Card */}
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-3xl p-8 border border-orange-300/20 hover:border-orange-300/40 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 rounded-full p-3">
                  <Thermometer className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Weather</h3>
              </div>
            </div>
            
            {weather ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold text-white">{weather.temp}°C</div>
                    <div className="text-orange-200">{weather.condition}</div>
                  </div>
                  <div className="text-6xl">{weather.icon}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-orange-300/20">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-orange-300" />
                    <div>
                      <div className="text-orange-200 text-sm">Humidity</div>
                      <div className="text-white font-medium">{weather.humidity}%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="w-4 h-4 text-orange-300" />
                    <div>
                      <div className="text-orange-200 text-sm">Wind</div>
                      <div className="text-white font-medium">{weather.wind} km/h</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-orange-200">
                <p>Weather data unavailable</p>
              </div>
            )}
          </div>
        </div>

        {/* Restaurants & Places */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Restaurants */}
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-3xl p-8 border border-green-300/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-500 rounded-full p-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Recommended Restaurants</h3>
            </div>
            
            <div className="space-y-4">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white mb-1">{restaurant.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-200 font-medium">{restaurant.rating}</span>
                    </div>
                  </div>
                  <p className="text-green-200">{restaurant.cuisine}</p>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-300" />
                      <span>{restaurant.openingTime} - {restaurant.closingTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-300" />
                      <span>{restaurant.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Places */}
          <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 backdrop-blur-sm rounded-3xl p-8 border border-indigo-300/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-indigo-500 rounded-full p-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Places to Visit</h3>
            </div>
            
            <div className="space-y-4">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white mb-1">{place.name}</h3>
                    <span className="bg-indigo-500 text-white px-2 py-1 rounded-full text-xs">
                      {place.type}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{place.description}</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-indigo-300" />
                    <span>{place.openingTime} - {place.closingTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyDashboardPage;