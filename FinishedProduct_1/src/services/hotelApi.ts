// Fake Hotel, Resort, Restaurant, and Places API
// import type { Flight } from './flightApi';

export interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  image: string;
  pricePerNight: number;
  rating: number;
  reviews: number;
  amenities: string[];
  description: string;
  availableRooms: number;
  checkIn: string;
  checkOut: string;
}

export interface HotelBookingRequest {
  hotelId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  contactInfo: ContactInfo;
}

export interface HotelBooking {
  id: string;
  hotel: Hotel;
  guests: number;
  rooms: number;
  checkIn: string;
  checkOut: string;
  contactInfo: ContactInfo;
  totalPrice: number;
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  receiptNumber: string;
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  image: string;
  cuisine: string;
  rating: number;
  reviews: number;
  priceLevel: number; // 1-5
  openingTime: string;
  closingTime: string;
  location: { lat: number; lng: number };
}

export interface Place {
  id: string;
  name: string;
  city: string;
  country: string;
  type: 'beach' | 'mall' | 'museum' | 'park' | 'landmark' | 'other';
  description: string;
  image: string;
  openingTime: string;
  closingTime: string;
  location: { lat: number; lng: number };
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

// --- Fake Data ---
const fakeHotels: Hotel[] = [
  // Dubai
  {
    id: 'h1',
    name: 'Burj Al Arab Jumeirah',
    city: 'Dubai',
    country: 'UAE',
    address: 'Jumeirah St, Umm Suqeim, Dubai',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500',
    pricePerNight: 1200,
    rating: 4.9,
    reviews: 2100,
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Beachfront', 'Butler Service'],
    description: 'Iconic sail-shaped luxury hotel with world-class amenities.',
    availableRooms: 8,
    checkIn: '15:00',
    checkOut: '12:00',
  },
  {
    id: 'h2',
    name: 'Atlantis The Palm',
    city: 'Dubai',
    country: 'UAE',
    address: 'Crescent Rd, The Palm Jumeirah, Dubai',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=500',
    pricePerNight: 900,
    rating: 4.8,
    reviews: 1800,
    amenities: ['Aquapark', 'Free Parking', 'Spa', 'Private Beach'],
    description: 'Famous resort with waterpark and marine attractions.',
    availableRooms: 15,
    checkIn: '15:00',
    checkOut: '12:00',
  },
  // New York
  {
    id: 'h3',
    name: 'The Plaza Hotel',
    city: 'New York',
    country: 'USA',
    address: 'Fifth Avenue at Central Park South, New York',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500',
    pricePerNight: 700,
    rating: 4.7,
    reviews: 1600,
    amenities: ['Free WiFi', 'Bar', 'Spa', 'Central Park View'],
    description: 'Historic luxury hotel at the corner of Central Park.',
    availableRooms: 12,
    checkIn: '15:00',
    checkOut: '12:00',
  },
  {
    id: 'h4',
    name: 'Four Seasons Hotel New York',
    city: 'New York',
    country: 'USA',
    address: '57 E 57th St, New York',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=500',
    pricePerNight: 850,
    rating: 4.8,
    reviews: 1400,
    amenities: ['Spa', 'Fitness Center', 'Pet Friendly'],
    description: 'Modern luxury hotel in Midtown Manhattan.',
    availableRooms: 10,
    checkIn: '15:00',
    checkOut: '12:00',
  },
  // Add more hotels for other cities as needed
];

const fakeRestaurants: Restaurant[] = [
  // Dubai
  {
    id: 'r1',
    name: 'Al Mahara',
    city: 'Dubai',
    country: 'UAE',
    address: 'Burj Al Arab, Jumeirah St, Dubai',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500',
    cuisine: 'Seafood',
    rating: 4.7,
    reviews: 900,
    priceLevel: 5,
    openingTime: '12:00',
    closingTime: '23:00',
    location: { lat: 25.1412, lng: 55.1853 },
  },
  // New York
  {
    id: 'r2',
    name: 'Le Bernardin',
    city: 'New York',
    country: 'USA',
    address: '155 W 51st St, New York',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
    cuisine: 'French',
    rating: 4.8,
    reviews: 1200,
    priceLevel: 5,
    openingTime: '11:30',
    closingTime: '22:30',
    location: { lat: 40.7616, lng: -73.9817 },
  },
  // Add more restaurants for other cities as needed
];

const fakePlaces: Place[] = [
  // Dubai
  {
    id: 'p1',
    name: 'Jumeirah Beach',
    city: 'Dubai',
    country: 'UAE',
    type: 'beach',
    description: 'Popular public beach with white sand and clear water.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500',
    openingTime: '06:00',
    closingTime: '22:00',
    location: { lat: 25.1412, lng: 55.1853 },
  },
  {
    id: 'p2',
    name: 'The Dubai Mall',
    city: 'Dubai',
    country: 'UAE',
    type: 'mall',
    description: 'World\'s largest shopping mall with 1200+ stores.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=500',
    openingTime: '10:00',
    closingTime: '00:00',
    location: { lat: 25.1985, lng: 55.2796 },
  },
  // New York
  {
    id: 'p3',
    name: 'Central Park',
    city: 'New York',
    country: 'USA',
    type: 'park',
    description: 'Iconic urban park in the heart of Manhattan.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500',
    openingTime: '06:00',
    closingTime: '01:00',
    location: { lat: 40.7851, lng: -73.9683 },
  },
  {
    id: 'p4',
    name: 'The Met Museum',
    city: 'New York',
    country: 'USA',
    type: 'museum',
    description: 'World-famous art museum with vast collections.',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=500',
    openingTime: '10:00',
    closingTime: '17:30',
    location: { lat: 40.7794, lng: -73.9632 },
  },
  // Add more places for other cities as needed
];

// --- API Functions ---
export const searchHotels = async (city: string): Promise<Hotel[]> => {
  await delay(500);
  return fakeHotels.filter(h => h.city.toLowerCase() === city.toLowerCase());
};

export const getHotelById = async (hotelId: string): Promise<Hotel | undefined> => {
  await delay(300);
  return fakeHotels.find(h => h.id === hotelId);
};

// --- Hotel Booking Persistence ---
const HOTEL_BOOKINGS_KEY = 'hotelBookings';

function loadHotelBookings(): HotelBooking[] {
  const data = localStorage.getItem(HOTEL_BOOKINGS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveHotelBookings(bookings: HotelBooking[]) {
  localStorage.setItem(HOTEL_BOOKINGS_KEY, JSON.stringify(bookings));
}

export const getUpcomingHotelBookings = async (): Promise<HotelBooking[]> => {
  await delay(500);
  const now = new Date();
  return loadHotelBookings().filter(b => new Date(b.checkIn) >= now && b.status === 'confirmed');
};

export const getHotelBookingHistory = async (): Promise<HotelBooking[]> => {
  await delay(500);
  const now = new Date();
  return loadHotelBookings().filter(b => new Date(b.checkOut) < now && b.status === 'confirmed');
};

export const getAllHotelBookings = async (): Promise<HotelBooking[]> => {
  await delay(500);
  return loadHotelBookings();
};

// Update bookHotel to persist booking
export const bookHotel = async (bookingRequest: HotelBookingRequest): Promise<HotelBooking> => {
  await delay(1500);
  const hotel = await getHotelById(bookingRequest.hotelId);
  if (!hotel) throw new Error('Hotel not found');
  if (hotel.availableRooms < bookingRequest.rooms) throw new Error('Not enough rooms available');
  const totalPrice = hotel.pricePerNight * bookingRequest.rooms * (new Date(bookingRequest.checkOut).getDate() - new Date(bookingRequest.checkIn).getDate());
  hotel.availableRooms -= bookingRequest.rooms;
  const booking: HotelBooking = {
    id: `HB${Date.now()}`,
    hotel,
    guests: bookingRequest.guests,
    rooms: bookingRequest.rooms,
    checkIn: bookingRequest.checkIn,
    checkOut: bookingRequest.checkOut,
    contactInfo: bookingRequest.contactInfo,
    totalPrice,
    bookingDate: new Date().toISOString(),
    status: 'confirmed',
    paymentStatus: 'paid',
    receiptNumber: `RC${Date.now()}`,
  };
  // Save to localStorage
  const bookings = loadHotelBookings();
  bookings.push(booking);
  saveHotelBookings(bookings);
  return booking;
};

export const getRestaurantsByCity = async (city: string): Promise<Restaurant[]> => {
  await delay(400);
  return fakeRestaurants.filter(r => r.city.toLowerCase() === city.toLowerCase());
};

export const getPlacesByCity = async (city: string): Promise<Place[]> => {
  await delay(400);
  return fakePlaces.filter(p => p.city.toLowerCase() === city.toLowerCase());
};

// Weather API (Open-Meteo, no key required)
export const getWeatherByCity = async (city: string): Promise<any> => {
  // Use Open-Meteo API (no key required)
  // For demo, just return mock data
  await delay(400);
  if (city.toLowerCase() === 'dubai') {
    return { temp: 38, condition: 'Sunny', icon: '☀️', humidity: 20, wind: 10 };
  }
  if (city.toLowerCase() === 'new york') {
    return { temp: 22, condition: 'Cloudy', icon: '☁️', humidity: 60, wind: 8 };
  }
  // Add more as needed
  return { temp: 25, condition: 'Clear', icon: '☀️', humidity: 50, wind: 5 };
};

// Utility
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); 